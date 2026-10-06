import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import "./auth.css";
import Backdrop from "@/components/Backdrop";
import { club, stats } from "@/lib/data";
/** Two-pane auth layout: brand panel (hidden under 900px) and the form on the page. */
export default function AuthShell({ children }: { children: ReactNode }) {
  return (<><Backdrop stars={false} />
    <div className="auth">
      <aside className="auth-panel" aria-hidden>
        <Link href="/" className="brand" tabIndex={-1}><Image src="/brand/logo.png" alt="" width={40} height={40} /><span><span className="eyebrow">AWS Student Builder Group</span><span className="word">Tempest</span></span></Link>
        <Image className="dragon" src="/brand/dragon.png" alt="" width={440} height={480} priority />
        <div className="tag">
          <h2>Members build here.</h2>
          <p>{club.mission}</p>
          <div className="facts"><span><b>{stats.members}</b>members</span><span><b>{stats.buildNights}</b>build nights</span><span><b>₱{stats.cost}</b>to join</span></div>
        </div>
      </aside>
      <main className="auth-main">
        <div className="auth-form">
          <Link href="/" className="brand-sm"><Image src="/brand/logo.png" alt="" width={32} height={32} /><span>Tempest</span></Link>
          {children}
        </div>
      </main>
    </div>
  </>);
}
