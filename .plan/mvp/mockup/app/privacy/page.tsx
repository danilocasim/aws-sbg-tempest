import Page from "@/components/Page";
export const metadata = { title: "Privacy notice" };
export default function Privacy() {
  return (<Page><article style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
    <span className="eyebrow">Privacy notice</span><h1>What we keep, and why</h1>
    <p>When you apply, we store your name, email, course, year level, and what you wrote. We use it to decide on your application and to contact you about it. Nothing else.</p>
    <p>If you are accepted, you get a profile you control. Your profile is public by its card link only. The member directory is visible to signed-in members. We never sell or share member data.</p>
    <p>Rejected applications are deleted after two academic years. You can ask us to delete anything we hold about you by emailing the Secretary.</p>
    <p className="faint" style={{ fontSize: "var(--fs-small)" }}>Last updated October 2026 · Signed off by the Directors</p>
  </article></Page>);
}
