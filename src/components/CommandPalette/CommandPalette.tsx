import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

/** The minimum shape a palette can search over. Extend it with your own fields. */
export interface PaletteItem {
  id: string;
  title: string;
  /** Right-aligned secondary text in the default row renderer. */
  hint?: string;
  /** Extra strings the query matches against (ids, aliases, tags…). */
  keywords?: string[];
}

/**
 * Default ranking: lower is better, negative excludes. Exact id/keyword hits
 * beat id/keyword substrings, which beat title prefixes, which beat title
 * substrings — so typing "VERIFY-42" jumps straight to the item carrying it.
 */
export function rankPaletteItem(item: PaletteItem, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const ids = [item.id, ...(item.keywords ?? [])].map((s) => s.toLowerCase());
  if (ids.some((s) => s === q)) return 0;
  if (ids.some((s) => s.includes(q))) return 1;
  const title = item.title.toLowerCase();
  if (title.startsWith(q)) return 2;
  if (title.includes(q)) return 3;
  return -1;
}

export interface CommandPaletteProps<T extends PaletteItem = PaletteItem> {
  /** Whether the palette is rendered. When false, nothing is mounted. */
  open: boolean;
  /** Called when the user dismisses (Esc or scrim click). */
  onClose: () => void;
  items: readonly T[];
  /** Called with the chosen item; the palette closes itself first. */
  onSelect: (item: T) => void;
  placeholder?: string;
  /** Message shown when nothing matches. */
  emptyLabel?: ReactNode;
  maxResults?: number;
  /** Custom ranking (lower = better, negative = exclude). Defaults to `rankPaletteItem`. */
  rank?: (item: T, query: string) => number;
  /** Custom row content. Defaults to title + hint. */
  renderItem?: (item: T, active: boolean) => ReactNode;
  ariaLabel?: string;
}

export function CommandPalette<T extends PaletteItem = PaletteItem>({
  open,
  onClose,
  items,
  onSelect,
  placeholder = 'Jump to…',
  emptyLabel = 'No matches',
  maxResults = 8,
  rank = rankPaletteItem,
  renderItem,
  ariaLabel = 'Command palette',
}: CommandPaletteProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return items.slice(0, maxResults);
    return items
      .map((item) => ({ item, score: rank(item, q) }))
      .filter((r) => r.score >= 0)
      .sort((a, b) => a.score - b.score)
      .slice(0, maxResults)
      .map((r) => r.item);
  }, [items, query, maxResults, rank]);

  // Fresh open: clear the query, reset the cursor, focus after the portal mounts.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  // Keep the active row visible as the cursor moves.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView?.({ block: 'nearest' });
  }, [active, open, results.length]);

  if (!open) return null;

  const clamped = Math.min(active, Math.max(0, results.length - 1));

  const choose = (item: T | undefined) => {
    if (!item) return;
    onClose();
    onSelect(item);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (results.length) setActive((i) => (i + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (results.length) setActive((i) => (i - 1 + results.length) % results.length);
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        if (results.length) setActive(results.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        choose(results[clamped]);
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'Tab':
        // Focus-trapped: the input is the only focusable stop.
        e.preventDefault();
        break;
    }
  };

  const activeId = results[clamped] ? `${listId}-opt-${results[clamped].id}` : undefined;

  return createPortal(
    <div
      className="iv-cmdk-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="iv-cmdk" role="dialog" aria-modal="true" aria-label={ariaLabel}>
        <div className="iv-cmdk-search">
          <span className="iv-cmdk-search-glyph" aria-hidden="true">
            ⌕
          </span>
          <input
            ref={inputRef}
            className="iv-cmdk-input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label={ariaLabel}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          <span className="iv-cmdk-hintkey" aria-hidden="true">
            esc
          </span>
        </div>

        {results.length === 0 ? (
          <div className="iv-cmdk-empty">{emptyLabel}</div>
        ) : (
          <div className="iv-cmdk-list" role="listbox" id={listId} aria-label={ariaLabel} ref={listRef}>
            {results.map((item, i) => {
              const isActive = i === clamped;
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`${listId}-opt-${item.id}`}
                  role="option"
                  aria-selected={isActive}
                  data-active={isActive}
                  tabIndex={-1}
                  className={`iv-cmdk-item${isActive ? ' iv-cmdk-item--active' : ''}`}
                  onMouseMove={() => setActive(i)}
                  onClick={() => choose(item)}
                >
                  {renderItem ? (
                    renderItem(item, isActive)
                  ) : (
                    <>
                      <span className="iv-cmdk-item-title">{item.title}</span>
                      {item.hint && <span className="iv-cmdk-item-hint">{item.hint}</span>}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
