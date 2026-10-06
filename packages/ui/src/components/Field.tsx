import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cx } from "../cx";

type FieldProps = { id: string; label: string; help?: ReactNode; error?: ReactNode; className?: string };

function Wrap({ id, label, help, error, className, children }: FieldProps & { children: ReactNode }) {
  return (
    <div className={cx("field", className)}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? <span className="error" id={`${id}-error`} role="alert">{error}</span> : help ? <span className="help" id={`${id}-help`}>{help}</span> : null}
    </div>
  );
}

const aria = (id: string, help?: ReactNode, error?: ReactNode) => ({
  "aria-invalid": error ? true : undefined,
  "aria-describedby": error ? `${id}-error` : help ? `${id}-help` : undefined,
});

/** §7 Input: 48px, `--bg-band` fill, strong border; focus ring; error border + message; disabled 50%. */
export function Input({ id, label, help, error, className, ...rest }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrap id={id} label={label} help={help} error={error} className={className}>
      <input id={id} className={cx("input", error ? "is-error" : null)} {...aria(id, help, error)} {...rest} />
    </Wrap>
  );
}

export function Textarea({ id, label, help, error, className, ...rest }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrap id={id} label={label} help={help} error={error} className={className}>
      <textarea id={id} className={cx("textarea", error ? "is-error" : null)} {...aria(id, help, error)} {...rest} />
    </Wrap>
  );
}

export function Select({ id, label, help, error, className, children, ...rest }: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrap id={id} label={label} help={help} error={error} className={className}>
      <select id={id} className={cx("select", error ? "is-error" : null)} {...aria(id, help, error)} {...rest}>{children}</select>
    </Wrap>
  );
}

export function Checkbox({ id, label, ...rest }: { id: string; label: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="check" htmlFor={id}>
      <input id={id} type="checkbox" {...rest} />
      <span>{label}</span>
    </label>
  );
}
