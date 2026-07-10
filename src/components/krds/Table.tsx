import * as React from "react";

export interface TableColumn {
  key: string;
  header: React.ReactNode;
  align?: "left" | "center" | "right";
  /** CSS width, e.g. "120px" or "20%". */
  width?: string;
}

/** KRDS bordered data table. Rows are objects keyed by column.key. */
export interface TableProps {
  columns: TableColumn[];
  rows: Record<string, React.ReactNode>[];
  caption?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * KRDS Table — bordered data table. columns: [{ key, header, align?, width? }].
 * The header band uses a light gray fill; rows separated by hairlines.
 */
export function Table({ columns = [], rows = [], caption, style = {} }: TableProps) {
  return (
    <div style={{ border: "1px solid var(--krds-color-border-default)", borderRadius: "var(--krds-radius-medium)", overflow: "hidden", ...style }}>
      <table style={{ width: "100%", borderCollapse: "collapse", font: "var(--krds-body-small)" }}>
        {caption && <caption style={{ textAlign: "left", padding: "var(--krds-spacing-12) var(--krds-spacing-16)", font: "var(--krds-title-medium)", color: "var(--krds-color-text-default)" }}>{caption}</caption>}
        <thead>
          <tr style={{ background: "var(--krds-color-surface-subtle)" }}>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                style={{
                  textAlign: c.align || "left",
                  /* source: header cell padding 8px 16px, title 15px / 700, line-height 22.5px */
                  padding: "var(--krds-spacing-8) var(--krds-spacing-16)",
                  font: "var(--krds-font-weight-bold) var(--krds-font-size-15)/1.5 var(--krds-font-sans)",
                  color: "var(--krds-color-text-strong)",
                  borderBottom: "1px solid var(--krds-color-border-default)",
                  width: c.width,
                  whiteSpace: "nowrap",
                }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: "var(--krds-color-gray-0)" }}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{
                    textAlign: c.align || "left",
                    /* source: body cell padding 12px 16px, body 17px / 400, line-height 25.5px */
                    padding: "var(--krds-spacing-12) var(--krds-spacing-16)",
                    font: "var(--krds-font-weight-regular) var(--krds-font-size-17)/1.5 var(--krds-font-sans)",
                    color: "var(--krds-color-text-subtle)",
                    borderBottom: ri === rows.length - 1 ? "none" : "1px solid var(--krds-color-border-subtle)",
                    verticalAlign: "middle",
                  }}
                >
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
