import * as React from "react";

/** KRDS numbered pagination with first/prev/next/last controls. */
export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange?: (page: number) => void;
  /** Max numbered buttons shown at once. @default 5 */
  maxButtons?: number;
  style?: React.CSSProperties;
}

/**
 * KRDS Pagination — numbered page control with first/prev/next/last.
 * Current page is a filled gov-blue square.
 */
export function Pagination({ page = 1, totalPages = 1, onChange, maxButtons = 5, style = {} }: PaginationProps) {
  const go = (p: number) => { if (p >= 1 && p <= totalPages && p !== page && onChange) onChange(p); };

  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  const end = Math.min(totalPages, start + maxButtons - 1);
  start = Math.max(1, Math.min(start, end - maxButtons + 1));
  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);

  /* source: prev/next are labeled controls (chevron + "이전"/"다음" text 17px), not icon-only first/last */
  const edgeBtn = (icon: string, target: number, text: string, label: string, before: boolean, disabled: boolean) => (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={() => go(target)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "var(--krds-spacing-2)",
        height: 40, padding: before ? "0 8px 0 4px" : "0 4px 0 8px",
        borderRadius: "var(--krds-radius-small)",
        border: "none",
        background: "transparent",
        color: disabled ? "var(--krds-color-text-disabled)" : "var(--krds-color-text-subtle)",
        font: "var(--krds-font-weight-regular) var(--krds-font-size-17)/1.5 var(--krds-font-sans)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {before && <span className="material-symbols-rounded" style={{ fontSize: 20, lineHeight: 0 }} aria-hidden="true">{icon}</span>}
      {text}
      {!before && <span className="material-symbols-rounded" style={{ fontSize: 20, lineHeight: 0 }} aria-hidden="true">{icon}</span>}
    </button>
  );

  return (
    <nav aria-label="페이지" style={{ display: "flex", alignItems: "center", gap: "var(--krds-spacing-4)", ...style }}>
      {edgeBtn("chevron_left", page - 1, "이전", "이전 페이지", true, page === 1)}
      {pages.map((p) => {
        const active = p === page;
        return (
          <button
            key={p}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => go(p)}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              /* source: number cell 40px, radius 6, text 17px */
              width: 40, height: 40,
              borderRadius: "var(--krds-radius-small)",
              border: "none",
              background: active ? "var(--krds-color-primary-50)" : "transparent",
              color: active ? "var(--krds-color-gray-0)" : "var(--krds-color-text-subtle)",
              font: active ? "var(--krds-font-weight-bold) var(--krds-font-size-17)/1.5 var(--krds-font-sans)" : "var(--krds-font-weight-regular) var(--krds-font-size-17)/1.5 var(--krds-font-sans)",
              cursor: "pointer",
            }}
          >
            {p}
          </button>
        );
      })}
      {edgeBtn("chevron_right", page + 1, "다음", "다음 페이지", false, page === totalPages)}
    </nav>
  );
}
