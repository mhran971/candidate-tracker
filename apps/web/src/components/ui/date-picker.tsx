import * as React from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string | Date;
  onChange?: (date: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, value, onChange, placeholder = 'Pick a date...', error, id, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    // Format value as YYYY-MM-DD for native date input
    const formattedValue = React.useMemo(() => {
      if (!value) return '';
      if (value instanceof Date) {
        return value.toISOString().split('T')[0] || '';
      }
      if (typeof value === 'string' && value.includes('T')) {
        return value.split('T')[0] || '';
      }
      return value;
    }, [value]);

    const handleWrapperClick = () => {
      const input = inputRef.current;
      if (input) {
        if (typeof input.showPicker === 'function') {
          try {
            input.showPicker();
          } catch {
            input.focus();
          }
        } else {
          input.focus();
        }
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.('');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    };

    return (
      <div className="w-full">
        <div
          onClick={handleWrapperClick}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:border-primary/60 cursor-pointer select-none',
            error && 'border-destructive focus-within:ring-destructive',
            className
          )}
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
            <input
              type="date"
              id={id}
              ref={(node) => {
                inputRef.current = node;
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
              }}
              value={formattedValue}
              onChange={(e) => onChange?.(e.target.value)}
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none cursor-pointer text-xs sm:text-sm font-medium [color-scheme:light_dark]"
              {...props}
            />
          </div>

          {formattedValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted ml-1 shrink-0"
              title="Clear date"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {error && <p className="text-xs text-destructive mt-1 font-medium">{error}</p>}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
