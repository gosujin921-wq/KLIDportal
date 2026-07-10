import { useState } from "react";
import * as React from "react";

/** KRDS bordered surface card (low elevation). */
export interface CardProps {
  children: React.ReactNode;
  padding?: "none" | "small" | "medium" | "large";
  /** Adds hover border/shadow + pointer; use for clickable cards. */
  interactive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/**
 * KRDS Card — bordered white surface. Low elevation: 1px border by
 * default, optional subtle shadow. Hoverable when interactive.
 */
export function Card({ children, padding = "large", interactive = false, onClick, style = {} }: CardProps) {
  const pads: Record<NonNullable<CardProps["padding"]>, string> = {
    none: "0",
    small: "var(--krds-spacing-16)",
    medium: "var(--krds-spacing-20)",
    large: "var(--krds-spacing-24)",
  };
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: pads[padding] ?? pads.large,
        background: "var(--krds-color-surface-default)",
        border: `1px solid ${interactive && hover ? "var(--krds-color-border-strong)" : "var(--krds-color-border-default)"}`,
        borderRadius: "var(--krds-radius-large)",
        boxShadow: interactive && hover ? "var(--krds-shadow-medium)" : "none",
        cursor: interactive ? "pointer" : "default",
        transition: "box-shadow var(--krds-duration-base) var(--krds-easing-standard), border-color var(--krds-duration-base)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  /** Optional Material Symbols ligature shown in a tinted square. */
  icon?: string | null;
}

/** Optional header row for a Card. */
export function CardHeader({ title, description, action, icon = null }: CardHeaderProps) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--krds-spacing-12)", marginBottom: "var(--krds-spacing-16)" }}>
      {icon && (
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "var(--krds-radius-medium)", background: "var(--krds-color-primary-5)", color: "var(--krds-color-primary-50)", flexShrink: 0 }}>
          <span className="material-symbols-rounded" style={{ fontSize: 24, lineHeight: 0 }} aria-hidden="true">{icon}</span>
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* source: title 21px / 700 (no 21px token; closest is heading-xsmall 19px bumped via explicit weight+size) */}
        <h3 style={{ font: "var(--krds-font-weight-bold) var(--krds-font-size-19)/1.5 var(--krds-font-sans)", color: "var(--krds-color-text-default)", margin: 0 }}>{title}</h3>
        {/* source: description 17px / 400, 3-line clamp */}
        {description && (
          <p
            style={{
              font: "var(--krds-body-medium)",
              color: "var(--krds-color-text-subtle)",
              margin: "4px 0 0",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}
