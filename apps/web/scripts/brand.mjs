// Generates the brand asset set from the two source bitmaps (public/brand/logo.png, dragon-src.png):
// dragon-440.webp + dragon-220.webp (≤120 kB each), icon-192/512, apple-touch-icon, favicon.ico (PNG-in-ICO).
import sharp from "sharp";
import { writeFileSync, statSync } from "node:fs";
const dir = new URL("../public/brand/", import.meta.url).pathname;
const kb = (f) => (statSync(dir + f).size / 1024).toFixed(1) + " kB";

const dragon = sharp(dir + "dragon-src.png");
const meta = await dragon.metadata();
console.log(`dragon source ${meta.width}×${meta.height}`);
for (const w of [440, 220]) {
  await sharp(dir + "dragon-src.png").resize({ width: Math.min(w, meta.width ?? w) }).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(`${dir}dragon-${w}.webp`);
  console.log(`dragon-${w}.webp ${kb(`dragon-${w}.webp`)}`);
}
for (const [name, size] of [["icon-192.png", 192], ["icon-512.png", 512], ["apple-touch-icon.png", 180]]) {
  await sharp(dir + "logo.png").resize(size, size).png({ compressionLevel: 9 }).toFile(dir + name);
  console.log(`${name} ${kb(name)}`);
}
// favicon.ico: ICO container holding 16, 32 and 48px PNGs.
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => sharp(dir + "logo.png").resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length; const entries = []; 
for (let i = 0; i < sizes.length; i++) { const e = Buffer.alloc(16); e.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 0); e.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(pngs[i].length, 8); e.writeUInt32LE(offset, 12); entries.push(e); offset += pngs[i].length; }
writeFileSync(dir + "favicon.ico", Buffer.concat([header, ...entries, ...pngs]));
console.log(`favicon.ico ${kb("favicon.ico")}`);
