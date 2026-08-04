import { useCallback, useState } from 'react';

/**
 * Collapse state for a side panel, persisted in localStorage under `persistKey`
 * ("1" collapsed / "0" expanded). Generalizes Diwa's `dw.*.folded` booleans so
 * any app can give a panel a remembered fold state. SSR/no-Storage safe.
 */
export function usePanelState(
  persistKey: string,
  defaultCollapsed = false,
): [boolean, () => void] {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return defaultCollapsed;
    const stored = window.localStorage.getItem(persistKey);
    return stored === null ? defaultCollapsed : stored === '1';
  });

  const toggle = useCallback(() => {
    setCollapsed((v) => {
      const next = !v;
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(persistKey, next ? '1' : '0');
      }
      return next;
    });
  }, [persistKey]);

  return [collapsed, toggle];
}
