import { useId, useState } from "react";
import type * as React from "react";

/** KRDS radio button — use within a shared `name` group. */
export interface RadioProps {
  label?: React.ReactNode;
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

/** KRDS Radio — single-select circle with 4px focus halo. */
export function Radio({
  label,
  name,
  value,
  checked = false,
  onChange,
  disabled = false,
  id,
  style = {},
  ...rest
}: RadioProps) {
  const reactId = useId();
  const fieldId = id || reactId;
  const [focus, setFocus] = useState(false);

  // 공식 KRDS(krds.go.kr) form-check 라디오 medium 기준 (1rem=10px 환산)
  const labelStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "flex-start", // KRDS: 원을 라벨 첫 줄에 맞춤(중앙정렬 아님)
    gap: "var(--krds-spacing-8)", // gap-3 = 0.8rem = 8px
    cursor: disabled ? "not-allowed" : "pointer",
    color: disabled ? "var(--krds-color-text-disabled)" : "var(--krds-color-text-default)",
    font: "var(--krds-font-weight-regular) var(--krds-font-size-17)/1.5 var(--krds-font-sans)", // label-medium 17px
    ...style,
  };

  const inputStyle: React.CSSProperties = {
    position: "absolute",
    opacity: 0,
    width: 0,
    height: 0,
  };

  const outerStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 20, // size-height-3 = 2rem = 20px
    height: 20,
    marginTop: 3, // button-margin-top = 0.3rem = 3px (라벨 첫 줄 정렬)
    flexShrink: 0,
    borderRadius: "var(--krds-radius-full)",
    border: `1px solid ${
      disabled
        ? "var(--krds-color-gray-40)"
        : checked
          ? "var(--krds-color-primary-50)"
          : "var(--krds-color-border-strong)"
    }`, // 공식 border 0.1rem = 1px
    background: disabled ? "var(--krds-color-surface-disabled)" : "var(--krds-color-gray-0)",
    boxShadow: focus ? "var(--krds-box-shadow-outline)" : "none",
    transition: "border-color var(--krds-duration-fast)",
  };

  const dotStyle: React.CSSProperties = {
    width: 10, // radio-check-size-medium = 1rem = 10px
    height: 10,
    borderRadius: "var(--krds-radius-full)",
    background: disabled ? "var(--krds-color-gray-40)" : "var(--krds-color-primary-50)",
    opacity: checked ? 1 : 0,
    transition: "opacity var(--krds-duration-fast)",
  };

  return (
    <label htmlFor={fieldId} style={labelStyle}>
      <input
        id={fieldId}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={inputStyle}
        {...rest}
      />
      <span aria-hidden="true" style={outerStyle}>
        <span style={dotStyle} />
      </span>
      {label}
    </label>
  );
}
