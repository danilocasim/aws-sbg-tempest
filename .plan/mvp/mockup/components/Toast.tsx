"use client";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Check } from "./Icons";
const Ctx = createContext<(m: string) => void>(() => {});
export const useToast = () => useContext(Ctx);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState(""); const [on, setOn] = useState(false); const h = useRef<ReturnType<typeof setTimeout>>(undefined);
  const toast = useCallback((m: string) => { setMsg(m); setOn(true); clearTimeout(h.current); h.current = setTimeout(() => setOn(false), 4000); }, []);
  return <Ctx.Provider value={toast}>{children}<div className={`toast glass ${on ? "is-on" : ""}`} role="status" aria-live="polite"><Check strokeWidth={2.5} /><span>{msg}</span></div></Ctx.Provider>;
}
