import type * as React from "react";

/** KRDS inline status banner (정보/주의/성공/오류). */
export interface AlertProps {
  tone?: "information" | "success" | "warning" | "danger";
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** When set, shows a close button. */
  onClose?: () => void;
  style?: React.CSSProperties;
}

type Tone = NonNullable<AlertProps["tone"]>;

interface ToneStyle {
  bg: string;
  border: string;
  fg: string;
  icon: string;
}

/**
 * KRDS Alert — inline status banner. Pairs a semantic icon + color + text;
 * left accent border, soft background. (정렬 수정본: 아이콘·제목 줄 중앙 정렬)
 */
export function Alert({ tone = "information", title, children, onClose, style = {} }: AlertProps) {
  const map: Record<Tone, ToneStyle> = {
    information: { bg: "var(--krds-color-information-5)", border: "var(--krds-color-information-50)", fg: "var(--krds-color-information-70)", icon: "info" },
    success:     { bg: "var(--krds-color-success-5)", border: "var(--krds-color-success-50)", fg: "var(--krds-color-success-70)", icon: "check_circle" },
    warning:     { bg: "var(--krds-color-warning-5)", border: "var(--krds-color-warning-40)", fg: "var(--krds-color-warning-50)", icon: "warning" },
    danger:      { bg: "var(--krds-color-danger-5)", border: "var(--krds-color-danger-50)", fg: "var(--krds-color-danger-60)", icon: "error" },
  };
  const m = map[tone] || map.information;
  const hasBody = !!children;

  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--krds-spacing-12)",
        padding: "var(--krds-spacing-16)",
        background: m.bg,
        border: "1px solid var(--krds-color-border-subtle)",
        borderLeft: `4px solid ${m.border}`,
        borderRadius: "var(--krds-radius-medium)",
        ...style,
      }}
    >
      <span
        className="material-symbols-rounded"
        style={{ fontSize: 24, color: m.fg, height: 24, display: "inline-flex", alignItems: "center", flexShrink: 0 }}
        aria-hidden="true"
      >
        {m.icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <p style={{ font: "var(--krds-title-medium)", lineHeight: "24px", color: "var(--krds-color-text-default)", margin: hasBody ? "0 0 4px" : 0 }}>
            {title}
          </p>
        )}
        {children && <div style={{ font: "var(--krds-body-small)", color: "var(--krds-color-text-subtle)" }}>{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", border: "none", background: "transparent", padding: 0, cursor: "pointer", color: "var(--krds-color-icon-subtle)", height: 24, flexShrink: 0 }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 22, lineHeight: 0 }} aria-hidden="true">close</span>
        </button>
      )}
    </div>
  );
}
