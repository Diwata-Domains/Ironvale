export interface PanelFoldProps {
  side: 'left' | 'right';
  collapsed: boolean;
  onToggle: () => void;
  /** Accessible label for the toggle, e.g. "Collapse navigation". */
  label: string;
  /** Optional count/dot shown beside the chevron (the ◈ analogue). */
  badge?: number | string;
}

/**
 * A thin fold-handle pinned to a screen edge, extracted from Diwa's `.dw-fold`.
 * Presentational and controlled: it renders a button and reports clicks; the
 * consumer owns the panel body and its collapse state. The chevron points the
 * way the panel will move for the given side + state.
 */
export function PanelFold({ side, collapsed, onToggle, label, badge }: PanelFoldProps) {
  const hasBadge = badge !== undefined && badge !== null && badge !== '' && badge !== 0;
  const classes = [
    'iv-panel-fold',
    `iv-panel-fold--${side}`,
    hasBadge && 'iv-panel-fold--alert',
  ]
    .filter(Boolean)
    .join(' ');
  // Left panel: expanded points left ("‹" to tuck away), collapsed points right.
  // Right panel: mirrored.
  const chevron =
    side === 'left' ? (collapsed ? '›' : '‹') : collapsed ? '‹' : '›';
  return (
    <button
      type="button"
      className={classes}
      aria-label={hasBadge ? `${label} (${badge})` : label}
      aria-expanded={!collapsed}
      onClick={onToggle}
    >
      <span className="iv-panel-fold__chevron" aria-hidden="true">
        {chevron}
      </span>
      {hasBadge && <span className="iv-panel-fold__badge">{badge}</span>}
    </button>
  );
}
