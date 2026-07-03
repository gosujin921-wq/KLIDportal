import { useEffect, useId, useRef, useState } from "react";
import * as React from "react";

/** KRDS checkbox with optional indeterminate state. */
export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

/** KRDS Checkbox — square check with 4px focus halo. */
export function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  indeterminate = false,
  id,
  style = {},
  ...rest
}: CheckboxProps) {
  const reactId = useId();
  const fieldId = id || reactId;
  const [focus, setFocus] = useState(false);
  const on = checked || indeterminate;

  // Reflect indeterminate onto the native input (DOM-only property).
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      htmlFor={fieldId}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--krds-spacing-8)",
        cursor: disabled ? "not-allowed" : "pointer",
        color: disabled ? "var(--krds-color-text-disabled)" : "var(--krds-color-text-default)",
        font: "var(--krds-body-small)",
        ...style,
      }}
    >
      <input
        ref={inputRef}
        id={fieldId}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          flexShrink: 0,
          borderRadius: "var(--krds-radius-small)",
          border: `2px solid ${on && !disabled ? "var(--krds-color-primary-50)" : "var(--krds-color-border-strong)"}`,
          background: disabled ? "var(--krds-color-surface-disabled)" : on ? "var(--krds-color-primary-50)" : "var(--krds-color-gray-0)",
          color: "var(--krds-color-gray-0)",
          boxShadow: focus ? "var(--krds-box-shadow-outline)" : "none",
          transition: "background var(--krds-duration-fast), border-color var(--krds-duration-fast)",
        }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: 18, fontWeight: 700, lineHeight: 0, opacity: on ? 1 : 0 }}>
          {indeterminate ? "remove" : "check"}
        </span>
      </span>
      {label}
    </label>
  );
}
