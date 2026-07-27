import { useState } from 'react';
import { getColorMode, toggleColorMode, type ColorMode } from '../../colorMode.js';

export interface ThemeToggleProps {
  className?: string;
}

/** A light/dark toggle. Reads and flips the suite `data-mode`, persisting the choice. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const [mode, setMode] = useState<ColorMode>(() => getColorMode());
  const classes = ['iv-theme-toggle', className].filter(Boolean).join(' ');
  return (
    <button
      type="button"
      className={classes}
      aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={mode === 'dark' ? 'Light mode' : 'Dark mode'}
      onClick={() => setMode(toggleColorMode())}
    >
      <span aria-hidden="true">{mode === 'dark' ? '☾' : '☀'}</span>
    </button>
  );
}
