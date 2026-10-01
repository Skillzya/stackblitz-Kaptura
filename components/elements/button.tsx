import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground hover:opacity-90 glow-primary",
      secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
      outline: 'border border-input bg-background hover:bg-secondary',
    };
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 transition-colors',
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
