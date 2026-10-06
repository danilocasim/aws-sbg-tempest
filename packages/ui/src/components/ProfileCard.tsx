import type { ReactNode } from "react";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { ButtonLink } from "./Button";
import { LinkButton, type LinkBrand } from "./LinkButton";
import { Download } from "../icons";

export type ProfileLink = { brand: LinkBrand; href: string; label: string };
export type ProfileCardProps = {
  name: string;
  headline?: string;
  bio?: string;
  photoSrc?: string | null;
  badges?: string[];
  links?: ProfileLink[];
  /** Served as text/vcard by the app (never a client-side blob). The only ember on the page. */
  vcardHref: string;
  footer?: ReactNode;
  actions?: ReactNode;
};

/** §7 Profile card: halo border, 128px avatar with halo ring, name, headline, position badge, vCard button, bio, link rows, club footer. */
export function ProfileCard({ name, headline, bio, photoSrc, badges = [], links = [], vcardHref, footer, actions }: ProfileCardProps) {
  return (
    <article className="profile-card" aria-label={`${name}'s profile`}>
      <div className="ring"><Avatar name={name} src={photoSrc} size="xl" /></div>
      <div>
        <h1>{name}</h1>
        {headline && <p className="headline">{headline}</p>}
      </div>
      {badges.length > 0 && (
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", justifyContent: "center" }}>
          {badges.map((b) => <Badge key={b}>{b}</Badge>)}
        </div>
      )}
      <div className="vcard-bar">
        <ButtonLink variant="primary" block href={vcardHref}><Download /> Save contact</ButtonLink>
      </div>
      {bio && <p className="bio">{bio}</p>}
      {links.length > 0 && (
        <div className="links">
          {links.map((l) => <LinkButton key={l.brand + l.href} brand={l.brand} href={l.href}>{l.label}</LinkButton>)}
        </div>
      )}
      {actions}
      {footer && <div className="profile-foot">{footer}</div>}
    </article>
  );
}
