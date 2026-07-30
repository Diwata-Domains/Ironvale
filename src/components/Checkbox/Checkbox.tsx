import {
  useEffect,
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  /** Controlled checked state. */
  checked?: boolean;
  /** Fires with the next checked value (and the raw event for full control). */
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /** Optional label rendered beside the box; the whole row is the click target. */
  label?: ReactNode;
  /** Visually shows the mixed/dash state and sets `input.indeterminate`. */
  indeterminate?: boolean;
}

/**
 * A themed checkbox built on a real `<input type="checkbox">` — the native
 * input carries state, focus, and semantics while a styled box renders the
 * visual (border when unchecked, accent fill + check glyph when checked, a dash
 * when indeterminate). The input is visually hidden but still focusable, so the
 * focus-visible ring is drawn on the box via a sibling selector.
 *
 * Controlled via `checked` / `onChange`. When a `label` is given, the component
 * renders as a `<label>` so clicking the text toggles the box.
 */
export function Checkbox({
  checked,
  onChange,
  label,
  indeterminate = false,
  disabled = false,
  className,
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // `indeterminate` is a DOM property, not an attribute — it can only be set
  // imperatively. Keep it in sync with the prop.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const classes = ['iv-checkbox', disabled && 'iv-checkbox--disabled', className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={classes}>
      <input
        {...props}
        ref={inputRef}
        type="checkbox"
        className="iv-checkbox__input"
        checked={checked}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : checked}
        onChange={(e) => onChange?.(e.target.checked, e)}
      />
      <span className="iv-checkbox__box" aria-hidden="true">
        <svg className="iv-checkbox__check" viewBox="0 0 16 16" fill="none">
          <path
            className="iv-checkbox__check-tick"
            d="M3.5 8.5L6.5 11.5L12.5 4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="iv-checkbox__check-dash"
            d="M4 8H12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {label != null && <span className="iv-checkbox__label">{label}</span>}
    </label>
  );
}
