'use client';

import * as React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

export type ButtonProps = HTMLMotionProps<'button'> & {
  hoverScale?: number;
  tapScale?: number;
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ hoverScale = 1.02, tapScale = 0.97, className, children, ...props }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.button
        ref={ref}
        className={className}
        whileHover={reduced || props.disabled ? undefined : { scale: hoverScale }}
        whileTap={reduced || props.disabled ? undefined : { scale: tapScale }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'ButtonPrimitive';
