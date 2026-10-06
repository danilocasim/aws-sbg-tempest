"use client";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { cx } from "../cx";
import { Check } from "../icons";

const Ctx = createContext<(message: string) => void>(() => {});

/** `const toast = useToast(); toast("Saved")` */
export const useToast = () => useContext(Ctx);

/** §7 Toast: glass panel bottom-center, 4 s, spring in, fade out, `aria-live`. Mount once near the root. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState("");
  const [on, setOn] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const toast = useCallback((m: string) => {
    setMsg(m);
    setOn(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOn(false), 4000);
  }, []);
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className={cx("toast glass", on && "is-on")} role="status" aria-live="polite">
        <Check strokeWidth={2.5} />
        <span>{msg}</span>
      </div>
    </Ctx.Provider>
  );
}
