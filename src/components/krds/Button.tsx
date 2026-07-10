import { useState } from "react";
import * as React from "react";

/**
 * KRDS government action button.
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  /** Maps to KRDS control heights 32/40/48/56/64px. @default "medium" */
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge";
  disabled?: boolean;
  /** Stretch to container width (used for form submit / mobile CTAs). */
  fullWidth?: boolean;
  /** Material Symbols Rounded ligature name, e.g. "search". */
  iconLeft?: string | null;
  iconRight?: string | null;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

/**
 * KRDS Button — primary government action button.
 * Variants: primary (gov blue), secondary (white + blue border),
 * tertiary (text/ghost), danger. Sizes xsmall…xlarge map to the
 * KRDS control-height scale (32/40/48/56/64px).
 */
export function Button({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  type = "button",
  onClick,
  style = {},
  ...rest
}: ButtonProps) {
  const sizes = {
    xsmall: { h: "var(--krds-size-control-xsmall)", px: "var(--krds-spacing-12)", fs: "var(--krds-font-size-15)", icon: 18 },
    small:  { h: "var(--krds-size-control-small)",  px: "var(--krds-spacing-16)", fs: "var(--krds-font-size-16)", icon: 18 },
    medium: { h: "var(--krds-size-control-medium)", px: "var(--krds-spacing-20)", fs: "var(--krds-font-size-17)", icon: 20 },
    large:  { h: "var(--krds-size-control-large)",  px: "var(--krds-spacing-24)", fs: "var(--krds-font-size-19)", icon: 22 },
    xlarge: { h: "var(--krds-size-control-xlarge)", px: "var(--krds-spacing-24)", fs: "var(--krds-font-size-19)", icon: 24 },
  };
  const s = sizes[size] || sizes.medium;

  const variants = {
    primary: {
      background: "var(--krds-color-primary-50)",
      color: "var(--krds-color-gray-0)",
      border: "1px solid var(--krds-color-primary-50)",
    },
    secondary: {
      background: "var(--krds-color-gray-0)",
      color: "var(--krds-color-primary-60)",
      border: "1px solid var(--krds-color-primary-50)",
    },
    tertiary: {
      background: "transparent",
      color: "var(--krds-color-gray-80)",
      border: "1px solid transparent",
    },
    danger: {
      background: "var(--krds-color-danger-50)",
      color: "var(--krds-color-gray-0)",
      border: "1px solid var(--krds-color-danger-50)",
    },
  };
  const v = variants[variant] || variants.primary;

  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState(false);

  let bg = v.background;
  let bd = v.border;
  if (!disabled) {
    if (variant === "primary") {
      if (active) { bg = "var(--krds-color-primary-70)"; bd = "1px solid var(--krds-color-primary-70)"; }
      else if (hover) { bg = "var(--krds-color-primary-60)"; bd = "1px solid var(--krds-color-primary-60)"; }
    } else if (variant === "secondary") {
      if (active) bg = "var(--krds-color-primary-10)";
      else if (hover) bg = "var(--krds-color-primary-5)";
    } else if (variant === "tertiary") {
      if (active) bg = "var(--krds-color-gray-10)";
      else if (hover) bg = "var(--krds-color-gray-5)";
    } else if (variant === "danger") {
      if (active) { bg = "var(--krds-color-danger-70)"; bd = "1px solid var(--krds-color-danger-70)"; }
      else if (hover) { bg = "var(--krds-color-danger-60)"; bd = "1px solid var(--krds-color-danger-60)"; }
    }
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--krds-spacing-8)",
        height: s.h,
        padding: `0 ${s.px}`,
        width: fullWidth ? "100%" : "auto",
        font: `var(--krds-font-weight-medium) ${s.fs}/1 var(--krds-font-sans)`,
        letterSpacing: "var(--krds-letter-spacing-normal)",
        color: disabled ? "var(--krds-color-text-disabled)" : v.color,
        background: disabled ? "var(--krds-color-surface-disabled)" : bg,
        border: disabled ? "1px solid var(--krds-color-border-subtle)" : bd,
        borderRadius: "var(--krds-radius-medium)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background var(--krds-duration-fast) var(--krds-easing-standard), border-color var(--krds-duration-fast) var(--krds-easing-standard)",
        boxShadow: focus && !disabled ? "var(--krds-box-shadow-outline)" : "none",
        outline: "none",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {iconLeft && (
        <span className="material-symbols-rounded" style={{ fontSize: s.icon, lineHeight: 0 }} aria-hidden="true">{iconLeft}</span>
      )}
      {children}
      {iconRight && (
        <span className="material-symbols-rounded" style={{ fontSize: s.icon, lineHeight: 0 }} aria-hidden="true">{iconRight}</span>
      )}
    </button>
  );
}
