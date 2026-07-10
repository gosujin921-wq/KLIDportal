import type * as React from "react";

/** KRDS tag / filter chip. Selectable and optionally removable. */
export interface TagProps {
  children: React.ReactNode;
  /** Selected (filled) state — for filter chips. */
  selected?: boolean;
  /** Show a trailing remove (x) button. */
  removable?: boolean;
  onRemove?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/** KRDS Tag — pill-shaped chip. Clickable when `onClick` is set. */
export function Tag({ children, selected = false, removable = false, onRemove, onClick, style = {} }: TagProps) {
  const clickable = !!onClick;

  return (
    <span
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        height: 32,
        padding: "0 var(--krds-spacing-12)",
        borderRadius: "var(--krds-radius-full)",
        border: `1px solid ${selected ? "var(--krds-color-primary-50)" : "var(--krds-color-border-default)"}`,
        background: selected ? "var(--krds-color-primary-5)" : "var(--krds-color-gray-0)",
        color: selected ? "var(--krds-color-primary-60)" : "var(--krds-color-text-default)",
        font: `var(--krds-font-weight-medium) var(--krds-font-size-15)/1 var(--krds-font-sans)`,
        whiteSpace: "nowrap",
        cursor: clickable ? "pointer" : "default",
        userSelect: "none",
        ...style,
      }}
    >
      {children}
      {removable && (
        <button
          type="button"
          aria-label="삭제"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(e);
          }}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", border: "none", background: "transparent", padding: 0, marginRight: -2, cursor: "pointer", color: "inherit" }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 16, lineHeight: 0 }} aria-hidden="true">close</span>
        </button>
      )}
    </span>
  );
}
