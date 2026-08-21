import { format, formatDistanceToNow, isValid } from 'date-fns';

export function formatDate(date: string | Date | null | undefined, formatPattern = 'MMM dd, yyyy'): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return '—';
  return format(d, formatPattern);
}

export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return '—';
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatCurrency(amount: number | null | undefined, currency = 'USD'): string {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
