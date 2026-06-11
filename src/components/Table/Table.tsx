import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  compact?: boolean;
  static?: boolean;
}

export function Table({ compact, static: isStatic, className, ...props }: TableProps) {
  const classes = [
    'iv-table',
    compact ? 'iv-table--compact' : '',
    isStatic ? 'iv-table--static' : '',
    className,
  ].filter(Boolean).join(' ');

  return <table {...props} className={classes} />;
}

export function Thead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />;
}

export function Tbody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

export function Tr(props: HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props} />;
}

export function Th(props: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...props} />;
}

export function Td(props: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} />;
}
