import * as React from "react";

export interface CrumbItem {
  label: React.ReactNode;
  href?: string;
}

/** KRDS location breadcrumb (leads with a home icon). */
export interface BreadcrumbProps {
  items: CrumbItem[];
  style?: React.CSSProperties;
}

/**
 * KRDS Breadcrumb — location trail. items: [{ label, href? }].
 * Last item is current (non-link). Leads with a home icon.
 */
export function Breadcrumb({ items = [], style = {} }: BreadcrumbProps) {
  return (
    <nav aria-label="현재 위치" style={{ ...style }}>
      <ol style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "var(--krds-spacing-4)", listStyle: "none", margin: 0, padding: 0 }}>
        <li style={{ display: "inline-flex", alignItems: "center" }}>
          {/* source: home icon 16px */}
          <span className="material-symbols-rounded" style={{ fontSize: 16, color: "var(--krds-color-icon-subtle)", lineHeight: 0 }} aria-hidden="true">home</span>
        </li>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} style={{ display: "inline-flex", alignItems: "center", gap: "var(--krds-spacing-4)" }}>
              {/* source: separator is a 16px right arrow */}
              <span className="material-symbols-rounded" style={{ fontSize: 16, color: "var(--krds-color-gray-30)", lineHeight: 0 }} aria-hidden="true">chevron_right</span>
              {last ? (
                /* source: depth label 15px / 400 (current page is non-link, kept bold for emphasis) */
                <span aria-current="page" style={{ font: "var(--krds-font-weight-bold) var(--krds-font-size-15)/1.5 var(--krds-font-sans)", color: "var(--krds-color-text-default)" }}>{it.label}</span>
              ) : (
                /* source: depth links 15px / 400, underlined */
                <a href={it.href || "#"} style={{ font: "var(--krds-font-weight-regular) var(--krds-font-size-15)/1.5 var(--krds-font-sans)", color: "var(--krds-color-text-subtle)", textDecoration: "underline" }}>{it.label}</a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
