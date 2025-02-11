import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'rounded-md bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-900 px-4 py-2 text-sm text-zinc-50 ring-1 ring-zinc-900 transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-zinc-500/70',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'rounded-md px-4 py-2 text-base text-sm text-zinc-700 ring-2 ring-zinc-300 transition-all hover:scale-[1.02] hover:ring-1 active:scale-[0.98] active:ring-zinc-500',
        link: 'text-primary underline-offset-4 hover:underline',
        expandIcon:
          'rounded-md bg-gradient-to-br from-zinc-500 via-zinc-600 to-zinc-700 text-base text-zinc-50 ring-2 ring-zinc-600/80 transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-zinc-500/70 relative group border-none',
        ringHover:
          'bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2',
        shine:
          'text-primary-foreground animate-shine bg-gradient-to-r from-primary via-primary/75 to-primary bg-[length:400%_100%] ',
        gooeyRight:
          'text-primary-foreground relative bg-primary z-0 overflow-hidden transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r from-zinc-400 before:transition-transform before:duration-1000  hover:before:translate-x-[0%] hover:before:translate-y-[0%] ',
        gooeyLeft:
          'text-primary-foreground relative bg-primary z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-400 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ',
        linkHover1:
          'relative after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300',
        linkHover2:
          'relative after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300',
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-7 rounded-md px-3',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface IconProps {
  Icon: React.ElementType;
  iconPlacement: 'left' | 'right';
}

interface IconRefProps {
  Icon?: never;
  iconPlacement?: undefined;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export type ButtonIconProps = IconProps | IconRefProps;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps & ButtonIconProps>(
  ({ className, variant, size, asChild = false, Icon, iconPlacement, children, ...props }, ref) => {
    const buttonContent = (
      <>
        {Icon && iconPlacement === 'left' && (
          <div className="w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-100 group-hover:pr-2 group-hover:opacity-100">
            <Icon className="size-4" strokeWidth={2} />
          </div>
        )}
        {asChild ? children : <h1 className="font-normal">{children}</h1>}
        {Icon && iconPlacement === 'right' && (
          <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
            <Icon className="size-4" strokeWidth={2} />
          </div>
        )}
      </>
    );

    const classes = cn(buttonVariants({ variant, size, className }));

    if (asChild) {
      const Comp = React.Children.only(children) as React.ReactElement<{ className?: string }>;
      return React.cloneElement(Comp, {
        ...props,
        className: cn(Comp.props.className, classes),
      });
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {buttonContent}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
