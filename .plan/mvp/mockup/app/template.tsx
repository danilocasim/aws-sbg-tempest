/** Re-mounts on every navigation, so the page content fades in (opacity only: a transform here would re-parent fixed elements). */
export default function Template({ children }: { children: React.ReactNode }) { return <div className="page-enter">{children}</div>; }
