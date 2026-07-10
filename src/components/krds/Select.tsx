import { useId, useState } from "react";
import * as React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

/** KRDS dropdown select, styled to match TextField. */
export interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Array of {value,label} or plain strings. */
  options?: (SelectOption | string)[];
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: "medium" | "large";
  id?: string;
  style?: React.CSSProperties;
}

/**
 * KRDS Select — native-backed dropdown styled to match TextField.
 * options: array of { value, label } or strings.
 */
export function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = "선택하세요",
  hint = "",
  error = "",
  required = false,
  disabled = false,
  size = "medium",
  id,
  style = {},
  ...rest
}: SelectProps) {
  const reactId = useId();
  const fieldId = id || reactId;
  const [focus, setFocus] = useState(false);
  const sizes = {
    medium: { h: "var(--krds-size-control-medium)" },
    large:  { h: "var(--krds-size-control-large)" },
  };
  const s = sizes[size] || sizes.medium;
  const norm: SelectOption[] = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));

  const borderColor = error
    ? "var(--krds-color-border-danger)"
    : focus
    ? "var(--krds-color-border-focus)"
    : "var(--krds-color-border-default)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--krds-spacing-8)", ...style }}>
      {label && (
        <label htmlFor={fieldId} style={{ font: "var(--krds-label-medium)", color: "var(--krds-color-text-default)" }}>
          {label}
          {required && <span style={{ color: "var(--krds-color-text-danger)", marginLeft: 2 }} aria-hidden="true"> *</span>}
        </label>
      )}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          height: s.h,
          background: disabled ? "var(--krds-color-surface-disabled)" : "var(--krds-color-gray-0)",
          border: `${error ? "var(--krds-border-width-2)" : "var(--krds-border-width-1)"} solid ${borderColor}`,
          borderRadius: "var(--krds-radius-medium)",
          boxShadow: focus && !error ? "var(--krds-box-shadow-outline)" : "none",
          transition: "border-color var(--krds-duration-fast) var(--krds-easing-standard)",
        }}
      >
        <select
          id={fieldId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={!!error}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            width: "100%",
            height: "100%",
            padding: "0 var(--krds-spacing-40) 0 var(--krds-spacing-16)",
            border: "none",
            outline: "none",
            background: "transparent",
            font: "var(--krds-font-weight-regular) var(--krds-font-size-17)/1.5 var(--krds-font-sans)",
            color: value ? "var(--krds-color-text-default)" : "var(--krds-color-text-subtle)",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          {...rest}
        >
          <option value="" disabled>{placeholder}</option>
          {norm.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span
          className="material-symbols-rounded"
          aria-hidden="true"
          style={{ position: "absolute", right: "var(--krds-spacing-12)", fontSize: 24, color: "var(--krds-color-icon-subtle)", pointerEvents: "none", lineHeight: 0 }}
        >
          expand_more
        </span>
      </div>
      {error ? (
        <p style={{ display: "flex", alignItems: "center", gap: 4, font: "var(--krds-detail-medium)", color: "var(--krds-color-text-danger)", margin: 0 }}>
          <span className="material-symbols-rounded" style={{ fontSize: 16, lineHeight: 0 }} aria-hidden="true">error</span>
          {error}
        </p>
      ) : hint ? (
        <p style={{ font: "var(--krds-detail-medium)", color: "var(--krds-color-text-subtle)", margin: 0 }}>{hint}</p>
      ) : null}
    </div>
  );
}
