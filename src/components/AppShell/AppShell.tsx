import type { HTMLAttributes, ReactNode } from 'react';

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Navigation region — a side rail on desktop, a bottom bar on mobile. Pair with `AppNav`. */
  nav?: ReactNode;
  /** Optional header / titlebar region. On desktop it acts as a Tauri window drag region. */
  header?: ReactNode;
  /** Optional status bar pinned below the content (desktop) / above the nav (mobile). */
  statusBar?: ReactNode;
}

/**
 * Responsive application frame for the Diwata desktop/mobile (Tauri) apps. Lays out a nav region,
 * a main content area, and optional header/status regions, and reflows the nav from a left rail to
 * a bottom bar on small screens.
 */
export function AppShell({ nav, header, statusBar, className, children, ...props }: AppShellProps) {
  const classes = ['iv-app-shell', className].filter(Boolean).join(' ');

  return (
    <div {...props} className={classes}>
      {header && <header className="iv-app-shell__header">{header}</header>}
      {nav && <nav className="iv-app-shell__nav">{nav}</nav>}
      <main className="iv-app-shell__main">{children}</main>
      {statusBar && <div className="iv-app-shell__statusbar">{statusBar}</div>}
    </div>
  );
}
