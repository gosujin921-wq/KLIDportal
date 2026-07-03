import { useId, useState } from "react";
import type * as React from "react";

/** KRDS toggle switch. */
export interface SwitchProps {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

/** KRDS Switch — on/off toggle with sliding thumb. role="switch". */
export function Switch({ label, checked = false, onChange, disabled = false, id, style = {} }: SwitchProps) {
  const reactId = useId();
  const fieldId = id || reactId;
  const [focus, setFocus] = useState(false);

  const trackBg = disabled
    ? "var(--krds-color-surface-disabled)"
    : checked
      ? "var(--krds-color-primary-50)"
      : "var(--krds-color-gray-30)";

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
        id={fieldId}
        type="checkbox"
        role="switch"
        checked={checked}
        aria-checked={checked}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "relative",
          flexShrink: 0,
          width: 48,
          height: 28,
          borderRadius: "var(--krds-radius-full)",
          background: trackBg,
          boxShadow: focus ? "var(--krds-box-shadow-outline)" : "none",
          transition: "background var(--krds-duration-fast)",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 23 : 3,
            width: 22,
            height: 22,
            borderRadius: "var(--krds-radius-full)",
            background: "var(--krds-color-gray-0)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            transition: "left var(--krds-duration-fast)",
          }}
        />
      </span>
      {label}
    </label>
  );
}
