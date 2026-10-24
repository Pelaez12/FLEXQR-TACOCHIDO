'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button as ButtonPrimitive, type ButtonProps as ButtonPrimitiveProps } from '../../primitives/buttons/button';

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[box-shadow,color,background-color,border-color,outline-color] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          'bg-[#D92323] text-white shadow-xs hover:bg-[#B91C1C] focus-visible:ring-[#D92323]',
        accent:
          'bg-[#F59E0B] text-[#1C1917] shadow-xs hover:bg-[#D97706] focus-visible:ring-[#F59E0B]',
        destructive:
          'bg-red-600 text-white shadow-xs hover:bg-red-700 focus-visible:ring-red-600',
        outline:
          'border border-stone-300 bg-transparent text-stone-900 shadow-xs hover:bg-stone-100 dark:border-stone-700 dark:text-stone-100 dark:hover:bg-stone-800',
        secondary:
          'bg-stone-200 text-stone-900 shadow-xs hover:bg-stone-300 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700',
        ghost:
          'hover:bg-stone-100 text-stone-900 dark:hover:bg-stone-800 dark:text-stone-100',
        link:
          'text-[#D92323] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4 text-base',
        icon: 'size-9 rounded-md p-0 flex items-center justify-center',
        'icon-sm': 'size-8 rounded-full p-0 flex items-center justify-center',
        'icon-lg': 'size-10 rounded-md p-0 flex items-center justify-center',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonProps = ButtonPrimitiveProps & VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant, size, hoverScale = 1.02, tapScale = 0.97, ...props }, ref) => {
    return (
      <ButtonPrimitive
        ref={ref}
        hoverScale={hoverScale}
        tapScale={tapScale}
        className={`${buttonVariants({ variant, size })} ${className}`.trim()}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
