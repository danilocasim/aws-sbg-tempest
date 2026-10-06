export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");
export const initials = (name: string) => name.split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
