import type { AnchorHTMLAttributes, ReactNode } from "react";
import { External, Facebook, GitHub, Globe, LinkedIn } from "../icons";

export type LinkBrand = "linkedin" | "facebook" | "github" | "web";
const icons: Record<LinkBrand, typeof LinkedIn> = { linkedin: LinkedIn, facebook: Facebook, github: GitHub, web: Globe };

/** §7 Link button (social): full-width 56px row, icon left, label, external icon right; brand colour on hover. */
export function LinkButton({ brand, href, children, ...rest }: { brand: LinkBrand; href: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const Icon = icons[brand];
  return (
    <a className="link-row" data-brand={brand} href={href} rel="noopener" {...rest}>
      <Icon className="ic" />
      <span>{children}</span>
      <External className="ext" width={16} height={16} />
    </a>
  );
}
