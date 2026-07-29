import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getFontPreset, setFontPreset, type FontPreset } from '../../fontPreset.js';
import { getColorMode, setColorMode, type ColorMode } from '../../colorMode.js';
import {
  getThemePreset,
  presetNativeMode,
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
 * The appearance editor: the tokens-as-data axes in one popover — Theme
 * preset, Font, Text size, Accent, Light/Dark, Contrast, Density, and Motion.
 * Each control is an accessible radiogroup that writes through the persisted
 * ironvale setters.
 *
 * The menu is rendered through a portal to `document.body` and positioned
 * against the trigger's measured rect (below it, flipped above when there's no
 * room, and clamped to the viewport) so it can never be clipped by an overflow
 * ancestor or stack behind a neighbouring panel.
 *
 * Theme presets carry their native mode (Obsidian-style): picking a non-default
 * preset also applies the light/dark mode it was designed for, so the Mode
 * radios lock to the preset's native mode (with a hint) until Default is
 * re-selected.
 */
export function AppearancePanel({ className, align = 'right' }: AppearancePanelProps) {
  const [open, setOpen] = useState(false);
  const [font, setFont] = useState<FontPreset>(() => getFontPreset());
  const [scale, setScale] = useState<TextScale>(() => getTextScale());
  const [accent, setAccentState] = useState<Accent>(() => getAccent());
  const [mode, setMode] = useState<ColorMode>(() => getColorMode());
  const [preset, setPresetState] = useState<ThemePreset>(() => getThemePreset());
  const [contrast, setContrastState] = useState<Contrast>(() => getContrast());
  const [density, setDensityState] = useState<Density>(() => getDensity());
  const [motion, setMotionState] = useState<Motion>(() => getMotion());
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Close on outside click / Escape. With the menu portalled out of the trigger's
  // DOM subtree, "outside" means outside BOTH the trigger and the menu.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setOpen(false);
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

  // Position the portalled menu against the trigger's live rect. Runs before
  // paint (useLayoutEffect) so the menu never flashes at 0,0, and re-runs on
  // scroll/resize while open. Placement: below the trigger, flipped above when
  // there's more room there, then clamped so it stays fully on-screen.
  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const place = () => {
      const trigger = triggerRef.current;
      const menu = menuRef.current;
      if (!trigger || !menu) return;
      const r = trigger.getBoundingClientRect();
      const mw = menu.offsetWidth;
      const mh = menu.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const gap = 6;
      const margin = 8;

      // Vertical: prefer below; flip above only when below is too tight and
      // above has more room.
      let top = r.bottom + gap;
      const roomBelow = vh - r.bottom - gap - margin;
      const roomAbove = r.top - gap - margin;
      if (roomBelow < mh && roomAbove > roomBelow) top = r.top - gap - mh;
      top = Math.max(margin, Math.min(top, vh - mh - margin));

      // Horizontal: anchor to the trigger edge named by `align`, then clamp.
      let left = align === 'left' ? r.left : r.right - mw;
      left = Math.max(margin, Math.min(left, vw - mw - margin));

      setPos({ top, left });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, align]);

  const classes = ['iv-appearance', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <button
        ref={triggerRef}
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
      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="iv-appearance__menu"
            role="dialog"
            aria-label="Appearance"
            style={{
              top: pos ? `${pos.top}px` : 0,
              left: pos ? `${pos.left}px` : 0,
              visibility: pos ? 'visible' : 'hidden',
            }}
          >
          <div className="iv-appearance__group iv-appearance__group--wide">
            <span className="iv-appearance__label">Theme</span>
            <div
              className="iv-appearance__seg iv-appearance__seg--wrap"
              role="radiogroup"
              aria-label="Theme preset"
            >
              {THEME_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  role="radio"
                  aria-checked={preset === p.value}
                  title={p.nativeMode ? `${p.label} (${p.nativeMode})` : p.label}
                  className={`iv-appearance__opt${preset === p.value ? ' iv-appearance__opt--on' : ''}`}
                  onClick={() => {
                    setThemePreset(p.value);
                    setPresetState(p.value);
                    // the preset carries its native mode — mirror it in the Mode group
                    if (p.nativeMode) setMode(p.nativeMode);
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="iv-appearance__group iv-appearance__group--wide">
            <span className="iv-appearance__label">Font</span>
            <div className="iv-appearance__seg" role="radiogroup" aria-label="Font preset">
              {FONTS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  role="radio"
                  aria-checked={font === f.value}
                  className={`iv-appearance__opt iv-appearance__opt--font-${f.value}${font === f.value ? ' iv-appearance__opt--on' : ''}`}
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
            {(() => {
              // A non-default preset pins the mode to its native pairing; the
              // radios reflect it read-only until Default is re-selected.
              const lockedMode = presetNativeMode(preset);
              const shownMode = lockedMode ?? mode;
              return (
                <>
                  <div className="iv-appearance__seg" role="radiogroup" aria-label="Color mode">
                    {MODES.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        role="radio"
                        aria-checked={shownMode === m.value}
                        disabled={lockedMode !== null}
                        className={`iv-appearance__opt${shownMode === m.value ? ' iv-appearance__opt--on' : ''}`}
                        onClick={() => {
                          setColorMode(m.value);
                          setMode(m.value);
                        }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                  {lockedMode !== null && (
                    <span className="iv-appearance__hint">
                      set by theme — pick Default to change
                    </span>
                  )}
                </>
              );
            })()}
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
          </div>,
          document.body,
        )}
    </div>
  );
}
