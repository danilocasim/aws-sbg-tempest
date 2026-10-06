import { CountUp } from "./CountUp";

/** §7 Stat: numeral over label. `animate` counts up on reveal; otherwise renders the value statically (SSR, admin). */
export function Stat({ value, label, prefix = "", suffix = "", animate = false }: { value: number; label: string; prefix?: string; suffix?: string; animate?: boolean }) {
  return (
    <div className="stat">
      <div className="num">{animate ? <CountUp to={value} prefix={prefix} suffix={suffix} /> : `${prefix}${value.toLocaleString()}${suffix}`}</div>
      <div className="label">{label}</div>
    </div>
  );
}
