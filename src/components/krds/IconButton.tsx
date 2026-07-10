import { useState } from "react";
import * as React from "react";

/** KRDS icon-only button for toolbars, headers and table rows. */
export interface IconButtonProps {
  /** Material Symbols Rounded ligature name, e.g. "close". */
  icon: string;
  /** Accessible label (becomes aria-label + title). Required. */
  label: string;
  variant?: "ghost" | "filled" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

/**
 * KRDS IconButton — square, icon-only control for toolbars, headers,
 * and table rows. Always provide an accessible label.
 */
export function IconButton({
  icon,
  label,
  variant = "ghost",
  size = "medium",
  disabled = false,
  onClick,
  style = {},
  ...rest
}: IconButtonProps) {
  const sizes = {
    small:  { box: "2rem",   icon: 20 },
    medium: { box: "2.5rem", icon: 24 },
    large:  { box: "3rem",   icon: 24 },
  };
  const s = sizes[size] || sizes.medium;

  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState(false);

  const variants = {
    ghost: { color: "var(--krds-color-icon-default)", base: "transparent", hover: "var(--krds-color-gray-5)", active: "var(--krds-color-gray-10)" },
    filled: { color: "var(--krds-color-gray-0)", base: "var(--krds-color-primary-50)", hover: "var(--krds-color-primary-60)", active: "var(--krds-color-primary-70)" },
    outline: { color: "var(--krds-color-icon-default)", base: "var(--krds-color-gray-0)", hover: "var(--krds-color-gray-5)", active: "var(--krds-color-gray-10)" },
  };
  const v = variants[variant] || variants.ghost;

  let bg = v.base;
  if (!disabled) { if (active) bg = v.active; else if (hover) bg = v.hover; }

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
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
        width: s.box,
        height: s.box,
        padding: 0,
        color: disabled ? "var(--krds-color-text-disabled)" : v.color,
        background: disabled ? "var(--krds-color-surface-disabled)" : bg,
        border: variant === "outline" ? "1px solid var(--krds-color-border-default)" : "1px solid transparent",
        borderRadius: "var(--krds-radius-medium)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background var(--krds-duration-fast) var(--krds-easing-standard)",
        boxShadow: focus && !disabled ? "var(--krds-box-shadow-outline)" : "none",
        outline: "none",
        ...style,
      }}
      {...rest}
    >
      <span className="material-symbols-rounded" style={{ fontSize: s.icon, lineHeight: 0 }} aria-hidden="true">{icon}</span>
    </button>
  );
}
