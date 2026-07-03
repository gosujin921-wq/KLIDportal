import type * as React from "react";

/** KRDS status badge — semantic tone + soft/solid fill. */
export interface BadgeProps {
  children: React.ReactNode;
  tone?: "neutral" | "primary" | "success" | "danger" | "warning" | "information";
  variant?: "soft" | "solid";
  /** Material Symbols ligature shown before the label. */
  icon?: string | null;
  style?: React.CSSProperties;
}

type Tone = NonNullable<BadgeProps["tone"]>;

// soft: 옅은 배경 + 동색 텍스트 / solid: 채운 배경 + 흰 텍스트(warning은 가독성 위해 어두운 텍스트)
const soft: Record<Tone, { bg: string; fg: string }> = {
  neutral:     { bg: "var(--krds-color-gray-10)", fg: "var(--krds-color-gray-80)" },
  primary:     { bg: "var(--krds-color-primary-5)", fg: "var(--krds-color-primary-60)" },
  success:     { bg: "var(--krds-color-success-5)", fg: "var(--krds-color-success-60)" },
  danger:      { bg: "var(--krds-color-danger-5)", fg: "var(--krds-color-danger-60)" },
  warning:     { bg: "var(--krds-color-warning-5)", fg: "var(--krds-color-warning-50)" },
  information: { bg: "var(--krds-color-information-5)", fg: "var(--krds-color-information-60)" },
};

const solid: Record<Tone, { bg: string; fg: string }> = {
  neutral:     { bg: "var(--krds-color-gray-60)", fg: "var(--krds-color-gray-0)" },
  primary:     { bg: "var(--krds-color-primary-50)", fg: "var(--krds-color-gray-0)" },
  success:     { bg: "var(--krds-color-success-50)", fg: "var(--krds-color-gray-0)" },
  danger:      { bg: "var(--krds-color-danger-50)", fg: "var(--krds-color-gray-0)" },
  warning:     { bg: "var(--krds-color-warning-40)", fg: "var(--krds-color-gray-90)" },
  information: { bg: "var(--krds-color-information-50)", fg: "var(--krds-color-gray-0)" },
};

/** KRDS Badge — short status label. */
export function Badge({ children, tone = "neutral", variant = "soft", icon = null, style = {} }: BadgeProps) {
  const c = (variant === "solid" ? solid : soft)[tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: icon ? 4 : 0,
        height: 24,
        padding: "0 var(--krds-spacing-8)",
        borderRadius: "var(--krds-radius-small)",
        background: c.bg,
        color: c.fg,
        font: "var(--krds-font-weight-medium) var(--krds-font-size-13)/1 var(--krds-font-sans)",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {icon && (
        <span className="material-symbols-rounded" style={{ fontSize: 16, lineHeight: 0 }} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
