import { useId, useState } from "react";
import * as React from "react";

/**
 * KRDS labeled text input with hint / error / required states.
 */
export interface TextFieldProps {
  label?: string;
  value?: string;
  /** 비제어 입력 초기값 (로컬 추가 — ApplyForm 등 화면에서 사용. MCP .d.ts엔 없음) */
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** Helper text shown below when there is no error. */
  hint?: string;
  /** Error message; when set, border goes 2px danger and hint is replaced. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  type?: string;
  size?: "medium" | "large";
  /** Material Symbols ligature for a leading icon. */
  iconLeft?: string | null;
  /** Trailing static text, e.g. a unit or "원". */
  suffix?: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
}

/**
 * KRDS TextField — labeled text input with optional hint, error,
 * required marker and leading/trailing icon. 2px border on error.
 */
export function TextField({
  label,
  value,
  onChange,
  placeholder = "",
  hint = "",
  error = "",
  required = false,
  disabled = false,
  readOnly = false,
  type = "text",
  size = "medium",
  iconLeft = null,
  suffix = null,
  id,
  style = {},
  ...rest
}: TextFieldProps) {
  const reactId = useId();
  const fieldId = id || reactId;
  const [focus, setFocus] = useState(false);
  const sizes = {
    medium: { h: "var(--krds-size-control-medium)", fs: "var(--krds-font-size-17)" },
    large:  { h: "var(--krds-size-control-large)",  fs: "var(--krds-font-size-17)" },
  };
  const s = sizes[size] || sizes.medium;

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
          display: "flex",
          alignItems: "center",
          gap: "var(--krds-spacing-8)",
          height: s.h,
          padding: "0 var(--krds-spacing-16)",
          background: disabled ? "var(--krds-color-surface-disabled)" : "var(--krds-color-gray-0)",
          border: `${error ? "var(--krds-border-width-2)" : "var(--krds-border-width-1)"} solid ${borderColor}`,
          borderRadius: "var(--krds-radius-medium)",
          boxShadow: focus && !error ? "var(--krds-box-shadow-outline)" : "none",
          transition: "border-color var(--krds-duration-fast) var(--krds-easing-standard)",
        }}
      >
        {iconLeft && (
          <span className="material-symbols-rounded" style={{ fontSize: 20, color: "var(--krds-color-icon-subtle)", lineHeight: 0 }} aria-hidden="true">{iconLeft}</span>
        )}
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-err` : hint ? `${fieldId}-hint` : undefined}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            font: `var(--krds-font-weight-regular) ${s.fs}/1.5 var(--krds-font-sans)`,
            color: "var(--krds-color-text-default)",
          }}
          {...rest}
        />
        {suffix && <span style={{ font: "var(--krds-body-small)", color: "var(--krds-color-text-subtle)" }}>{suffix}</span>}
      </div>
      {error ? (
        <p id={`${fieldId}-err`} style={{ display: "flex", alignItems: "center", gap: 4, font: "var(--krds-detail-medium)", color: "var(--krds-color-text-danger)", margin: 0 }}>
          <span className="material-symbols-rounded" style={{ fontSize: 16, lineHeight: 0 }} aria-hidden="true">error</span>
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} style={{ font: "var(--krds-detail-medium)", color: "var(--krds-color-text-subtle)", margin: 0 }}>{hint}</p>
      ) : null}
    </div>
  );
}
