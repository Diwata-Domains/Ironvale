import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { stepIndex, typeAheadIndex } from './selectNav.js';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

/** Keep the menu at least this far from every viewport edge. */
const VIEWPORT_MARGIN = 8;
/** Gap between the trigger and the menu along the vertical axis. */
const TRIGGER_GAP = 4;

interface MenuCoords {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: 'below' | 'above';
}

/**
 * Resolve the menu's viewport (fixed) coordinates from the trigger rect and the
 * measured menu height. Opens below by default, flips above when there is more
 * room there, then clamps every edge so the menu can never leave the viewport —
 * the same flip-and-clamp doctrine as {@link Tooltip}. Width matches the trigger
 * so the open menu reads as an extension of the field.
 */
function computeMenuPosition(triggerRect: DOMRect, menuHeight: number): MenuCoords {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const spaceBelow = vh - triggerRect.bottom - TRIGGER_GAP - VIEWPORT_MARGIN;
  const spaceAbove = triggerRect.top - TRIGGER_GAP - VIEWPORT_MARGIN;

  const placement: 'below' | 'above' =
    menuHeight <= spaceBelow || spaceBelow >= spaceAbove ? 'below' : 'above';

  const room = placement === 'below' ? spaceBelow : spaceAbove;
  const maxHeight = Math.max(0, Math.min(menuHeight, room));

  const top =
    placement === 'below'
      ? triggerRect.bottom + TRIGGER_GAP
      : triggerRect.top - TRIGGER_GAP - maxHeight;

  let left = triggerRect.left;
  const width = triggerRect.width;
  left = Math.max(VIEWPORT_MARGIN, Math.min(left, vw - width - VIEWPORT_MARGIN));

  return { top, left, width, maxHeight, placement };
}

/**
 * A themed dropdown that replaces the native `<select>` — so the open menu
 * follows the theme (a native select's list is drawn by the OS and can't be
 * styled). The menu renders in a portal on `document.body` and is positioned
 * with `position: fixed`, flipping and clamping against the viewport so an
 * overflow ancestor or a screen edge can never clip it.
 *
 * Fully keyboard accessible: open with Enter/Space/ArrowDown, move with
 * arrows/Home/End, jump by typing (type-ahead), choose with Enter, dismiss with
 * Escape, Tab, or an outside click. The active option is announced via
 * `aria-activedescendant` on the listbox.
 */
export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  disabled = false,
  className,
  id,
  'aria-label': ariaLabel,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [coords, setCoords] = useState<MenuCoords | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const typeaheadRef = useRef<{ buffer: string; timer: number | null }>({ buffer: '', timer: null });
  const listId = useId();
  const optionId = useId();

  const selected = options.find((o) => o.value === value);
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));

  useEffect(() => {
    if (open) setActive(selectedIndex);
  }, [open, selectedIndex]);

  // Position the menu once it is mounted, then keep it pinned while scrolling or
  // resizing. useLayoutEffect measures before paint so there is no flash.
  const reposition = useCallback(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu) return;
    const triggerRect = trigger.getBoundingClientRect();
    setCoords(computeMenuPosition(triggerRect, menu.scrollHeight));
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    reposition();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open, reposition]);

  // Keep the active option scrolled into view as the user navigates.
  useEffect(() => {
    if (!open || !coords) return;
    const menu = menuRef.current;
    const el = menu?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active, open, coords]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const choose = useCallback(
    (i: number) => {
      const opt = options[i];
      if (opt) {
        onChange(opt.value);
        setOpen(false);
        triggerRef.current?.focus();
      }
    },
    [onChange, options],
  );

  const runTypeAhead = useCallback(
    (key: string) => {
      const ta = typeaheadRef.current;
      if (ta.timer) window.clearTimeout(ta.timer);
      ta.buffer += key;
      const target = typeAheadIndex(options, ta.buffer, active);
      if (target >= 0) setActive(target);
      ta.timer = window.setTimeout(() => {
        ta.buffer = '';
        ta.timer = null;
      }, 500);
    },
    [active, options],
  );

  function onKeyDown(e: KeyboardEvent) {
    if (disabled) return;
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActive((a) => stepIndex(a, 1, options.length));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((a) => stepIndex(a, -1, options.length));
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(active);
        break;
      default:
        // Printable single character → type-ahead.
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          runTypeAhead(e.key);
        }
    }
  }

  const classes = ['iv-select', open && 'iv-select--open', disabled && 'iv-select--disabled', className]
    .filter(Boolean)
    .join(' ');

  const menuStyle: CSSProperties | undefined = coords
    ? {
        position: 'fixed',
        top: coords.top,
        left: coords.left,
        width: coords.width,
        maxHeight: coords.maxHeight || undefined,
      }
    : { position: 'fixed', top: -9999, left: -9999, visibility: 'hidden' };

  const activeId = open && options[active] ? `${optionId}-${active}` : undefined;

  return (
    <div ref={rootRef} className={classes}>
      <button
        ref={triggerRef}
        type="button"
        className="iv-select__trigger"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={activeId}
        aria-label={ariaLabel}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        <span className={`iv-select__value${selected ? '' : ' iv-select__value--placeholder'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="iv-select__chevron" aria-hidden="true" />
      </button>
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <ul
            ref={menuRef}
            className={`iv-select__menu${coords ? ` iv-select__menu--${coords.placement}` : ''}`}
            role="listbox"
            id={listId}
            tabIndex={-1}
            data-open={coords ? 'true' : undefined}
            style={menuStyle}
          >
            {options.map((opt, i) => {
              const optClasses = [
                'iv-select__option',
                i === active && 'iv-select__option--active',
                opt.value === value && 'iv-select__option--selected',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <li
                  key={opt.value}
                  id={`${optionId}-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={opt.value === value}
                  className={optClasses}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(i);
                  }}
                >
                  <span className="iv-select__option-label">{opt.label}</span>
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
}
