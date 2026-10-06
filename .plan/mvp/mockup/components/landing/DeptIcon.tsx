import { Calendar, Code, Handshake, Sparkle } from "@/components/Icons";
export default function DeptIcon({ icon }: { icon: string }) { const I = { code: Code, sparkle: Sparkle, calendar: Calendar, handshake: Handshake }[icon] ?? Code; return <I />; }
