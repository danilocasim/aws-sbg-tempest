// Default OG template (1200×630). Pages override `title`/`subtitle` by exporting their own opengraph-image that calls ogImage().
import { ogImage, ogSize } from "@/lib/og";

export const alt = "Tempest · AWS Student Builder Group";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ title: "Learn AWS by shipping it.", subtitle: "AWS Student Builder Group · PLMUN" });
}
