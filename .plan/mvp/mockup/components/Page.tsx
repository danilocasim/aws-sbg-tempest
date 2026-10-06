import Backdrop from "./Backdrop";
import Nav from "./Nav";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import type { ReactNode } from "react";
export default function Page({ children, stars = false, footer = true }: { children: ReactNode; stars?: boolean; footer?: boolean }) {
  return (<><Backdrop stars={stars} /><Nav /><main className="container" style={{ padding: "clamp(2.5rem,5vw,4rem) var(--gutter)" }}>{children}</main>{footer && <Footer />}<BackToTop /></>);
}
