import { useEffect, useRef, useState } from 'react';
import { getFontPreset, setFontPreset, type FontPreset } from '../../fontPreset.js';
import { getColorMode, setColorMode, type ColorMode } from '../../colorMode.js';

export interface AppearancePanelProps {
  className?: string;
}

const FONTS: { value: FontPreset; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Mono' },
];

const MODES: { value: ColorMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

/** The appearance editor: a curated font preset × light/dark, in one popover. */
export function AppearancePanel({ className }: AppearancePanelProps) {
  const [open, setOpen] = useState(false);
  const [font, setFont] = useState<FontPreset>(() => getFontPreset());
  const [mode, setMode] = useState<ColorMode>(() => getColorMode());
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const classes = ['iv-appearance', className].filter(Boolean).join(' ');

  return (
    <div ref={rootRef} className={classes}>
      <button
        type="button"
        className="iv-appearance__trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Appearance"
        title="Appearance"
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true">Aa</span>
      </button>
      {open && (
        <div className="iv-appearance__menu" role="dialog" aria-label="Appearance">
          <div className="iv-appearance__group">
            <span className="iv-appearance__label">Font</span>
            <div className="iv-appearance__seg" role="radiogroup" aria-label="Font preset">
              {FONTS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  role="radio"
                  aria-checked={font === f.value}
                  className={`iv-appearance__opt${font === f.value ? ' iv-appearance__opt--on' : ''}`}
                  onClick={() => {
                    setFontPreset(f.value);
                    setFont(f.value);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="iv-appearance__group">
            <span className="iv-appearance__label">Mode</span>
            <div className="iv-appearance__seg" role="radiogroup" aria-label="Color mode">
              {MODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  role="radio"
                  aria-checked={mode === m.value}
                  className={`iv-appearance__opt${mode === m.value ? ' iv-appearance__opt--on' : ''}`}
                  onClick={() => {
                    setColorMode(m.value);
                    setMode(m.value);
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
