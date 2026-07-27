import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

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

/**
 * A themed dropdown that replaces the native `<select>` — so the open menu follows
 * the theme (a native select's list is drawn by the OS and can't be styled). Keyboard
 * accessible: open with Enter/Space/ArrowDown, move with arrows/Home/End, choose with
 * Enter, dismiss with Escape or an outside click.
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
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));

  useEffect(() => {
    if (open) setActive(selectedIndex);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  function choose(i: number) {
    const opt = options[i];
    if (opt) {
      onChange(opt.value);
      setOpen(false);
    }
  }

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
      case 'ArrowDown':
        e.preventDefault();
        setActive((a) => Math.min(a + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
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
    }
  }

  const classes = ['iv-select', open && 'iv-select--open', disabled && 'iv-select--disabled', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={rootRef} className={classes}>
      <button
        type="button"
        className="iv-select__trigger"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        <span className={`iv-select__value${selected ? '' : ' iv-select__value--placeholder'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="iv-select__chevron" aria-hidden="true" />
      </button>
      {open && (
        <ul className="iv-select__menu" role="listbox" id={listId} tabIndex={-1}>
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
                role="option"
                aria-selected={opt.value === value}
                className={optClasses}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(i);
                }}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
