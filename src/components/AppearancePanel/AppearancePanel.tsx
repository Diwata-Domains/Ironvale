import { useEffect, useRef, useState } from 'react';
import { getFontPreset, setFontPreset, type FontPreset } from '../../fontPreset.js';
import { getColorMode, setColorMode, type ColorMode } from '../../colorMode.js';
import {
  getThemePreset,
  setThemePreset,
  THEME_PRESETS,
  type ThemePreset,
} from '../../themePreset.js';
import { getTextScale, setTextScale, TEXT_SCALES, type TextScale } from '../../textScale.js';
import { ACCENTS, getAccent, setAccent, type Accent } from '../../accent.js';
import { getContrast, setContrast, type Contrast } from '../../contrast.js';
import { getDensity, setDensity, type Density } from '../../density.js';
import { getMotion, setMotion, type Motion } from '../../reducedMotion.js';

export interface AppearancePanelProps {
  className?: string;
  /** Which edge the menu anchors to. 'right' (default) opens leftward — for a right-placed
   *  trigger; 'left' opens rightward — for a left-placed trigger (e.g. inside a Settings card). */
  align?: 'left' | 'right';
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

const CONTRASTS: { value: Contrast; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
];

const DENSITIES: { value: Density; label: string }[] = [
  { value: 'comfortable', label: 'Cozy' },
  { value: 'compact', label: 'Compact' },
];

const MOTIONS: { value: Motion; label: string }[] = [
  { value: 'system', label: 'Full' },
  { value: 'reduced', label: 'Reduced' },
];

/**
 * The appearance editor: the tokens-as-data axes in one popover — Theme preset,
 * Font, Text size, Accent, Light/Dark, Contrast, Density, and Motion. Each
 * control is an accessible radiogroup that writes through the persisted ironvale
 * setters.
 */
export function AppearancePanel({ className, align = 'right' }: AppearancePanelProps) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<ThemePreset>(() => getThemePreset());
  const [font, setFont] = useState<FontPreset>(() => getFontPreset());
  const [scale, setScale] = useState<TextScale>(() => getTextScale());
  const [accent, setAccentState] = useState<Accent>(() => getAccent());
  const [mode, setMode] = useState<ColorMode>(() => getColorMode());
  const [contrast, setContrastState] = useState<Contrast>(() => getContrast());
  const [density, setDensityState] = useState<Density>(() => getDensity());
  const [motion, setMotionState] = useState<Motion>(() => getMotion());
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
        <div
          className={`iv-appearance__menu${align === 'left' ? ' iv-appearance__menu--left' : ''}`}
          role="dialog"
          aria-label="Appearance"
        >
          <div className="iv-appearance__group iv-appearance__group--wide">
            <span className="iv-appearance__label">Theme</span>
            <div className="iv-appearance__seg iv-appearance__seg--wrap" role="radiogroup" aria-label="Theme preset">
              {THEME_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  role="radio"
                  aria-checked={preset === p.value}
                  className={`iv-appearance__opt${preset === p.value ? ' iv-appearance__opt--on' : ''}`}
                  onClick={() => {
                    setThemePreset(p.value);
                    setPreset(p.value);
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

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
            <span className="iv-appearance__label">Text size</span>
            <div className="iv-appearance__seg" role="radiogroup" aria-label="Text size">
              {TEXT_SCALES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  role="radio"
                  aria-checked={scale === s.value}
                  aria-label={s.value}
                  className={`iv-appearance__opt${scale === s.value ? ' iv-appearance__opt--on' : ''}`}
                  onClick={() => {
                    setTextScale(s.value);
                    setScale(s.value);
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="iv-appearance__group iv-appearance__group--wide">
            <span className="iv-appearance__label">Accent</span>
            <div className="iv-appearance__swatches" role="radiogroup" aria-label="Accent color">
              {ACCENTS.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  role="radio"
                  aria-checked={accent === a.value}
                  aria-label={a.label}
                  title={a.label}
                  className={`iv-appearance__swatch${accent === a.value ? ' iv-appearance__swatch--on' : ''}`}
                  style={{ ['--iv-swatch' as string]: a.token }}
                  onClick={() => {
                    setAccent(a.value);
                    setAccentState(a.value);
                  }}
                />
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

          <div className="iv-appearance__group">
            <span className="iv-appearance__label">Contrast</span>
            <div className="iv-appearance__seg" role="radiogroup" aria-label="Contrast">
              {CONTRASTS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  role="radio"
                  aria-checked={contrast === c.value}
                  className={`iv-appearance__opt${contrast === c.value ? ' iv-appearance__opt--on' : ''}`}
                  onClick={() => {
                    setContrast(c.value);
                    setContrastState(c.value);
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="iv-appearance__group">
            <span className="iv-appearance__label">Density</span>
            <div className="iv-appearance__seg" role="radiogroup" aria-label="Density">
              {DENSITIES.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  role="radio"
                  aria-checked={density === d.value}
                  className={`iv-appearance__opt${density === d.value ? ' iv-appearance__opt--on' : ''}`}
                  onClick={() => {
                    setDensity(d.value);
                    setDensityState(d.value);
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="iv-appearance__group">
            <span className="iv-appearance__label">Motion</span>
            <div className="iv-appearance__seg" role="radiogroup" aria-label="Motion">
              {MOTIONS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  role="radio"
                  aria-checked={motion === m.value}
                  className={`iv-appearance__opt${motion === m.value ? ' iv-appearance__opt--on' : ''}`}
                  onClick={() => {
                    setMotion(m.value);
                    setMotionState(m.value);
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
