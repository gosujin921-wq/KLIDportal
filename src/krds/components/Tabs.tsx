import * as React from "react";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  /** Optional Material Symbols ligature. */
  icon?: string;
}

/** KRDS underline tab bar. */
export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}

/**
 * KRDS Tabs — underline tab bar. items: [{ id, label, icon? }].
 * Selected tab gets a 2px primary underline + bold text.
 */
export function Tabs({ items = [], value, onChange, style = {} }: TabsProps) {
  return (
    <div role="tablist" style={{ display: "flex", gap: "var(--krds-spacing-4)", ...style }}>
      {items.map((it) => {
        const active = it.id === value;
        return (
          <button
            key={it.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange && onChange(it.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--krds-spacing-8)",
              height: 48,
              padding: "0 var(--krds-spacing-8)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              /* source: both states 19px / 700; active distinguished by thicker underline + brand color */
              font: "var(--krds-font-weight-bold) var(--krds-font-size-19)/1.5 var(--krds-font-sans)",
              color: active ? "var(--krds-color-primary-60)" : "var(--krds-color-text-subtle)",
              /* source: active underline 4px, default hairline 2px */
              boxShadow: active
                ? "inset 0 -4px 0 0 var(--krds-color-primary-50)"
                : "inset 0 -2px 0 0 var(--krds-color-border-default)",
              transition: "color var(--krds-duration-fast)",
            }}
          >
            {it.icon && <span className="material-symbols-rounded" style={{ fontSize: 20, lineHeight: 0 }} aria-hidden="true">{it.icon}</span>}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
