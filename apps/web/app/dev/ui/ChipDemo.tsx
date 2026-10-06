"use client";
import { useState } from "react";
import { Chip } from "@tempest/ui";
const depts = ["All", "Technical", "Marketing", "Events", "Partnerships"];
export function ChipDemo() {
  const [sel, setSel] = useState("All");
  return <div className="row" style={{ flexWrap: "wrap" }} role="group" aria-label="Filter by department">{depts.map((d) => <Chip key={d} selected={sel === d} onClick={() => setSel(d)}>{d}</Chip>)}</div>;
}
