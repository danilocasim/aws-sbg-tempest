/** Static backdrop: `--bg` canvas with the nebula glows and CSS star dots. No JS. The animated starfield canvas lands in C2.9. */
export function Backdrop() {
  return (
    <>
      <div className="backdrop" aria-hidden><div className="glow" /></div>
      <div className="dots" aria-hidden />
    </>
  );
}
