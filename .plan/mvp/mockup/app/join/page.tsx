import Page from "@/components/Page";
import "./join.css";
import JoinExperience from "./JoinExperience";
import { currentTerm, fmtDate, mockNow, windowState } from "@/lib/data";
export const metadata = { title: "Apply" };
export default function Join() {
  const ws = windowState();
  const daysLeft = Math.max(0, Math.ceil((ws.date.getTime() - mockNow.getTime()) / 864e5));
  return (<Page><JoinExperience state={ws.state} dateLabel={fmtDate(ws.date.toISOString(), { month: "long", day: "numeric" })} daysLeft={daysLeft} term={currentTerm.label} /></Page>);
}
