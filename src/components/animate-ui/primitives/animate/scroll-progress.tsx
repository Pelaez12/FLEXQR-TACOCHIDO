'use client';

import * as React from 'react';
import { motion, useScroll, useSpring, type SpringOptions } from 'motion/react';

export type ScrollProgressDirection = 'horizontal' | 'vertical';

interface ScrollProgressContextValue {
  global: boolean;
  direction: ScrollProgressDirection;
  progress: any;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const ScrollProgressContext = React.createContext<ScrollProgressContextValue | null>(null);

export interface ScrollProgressProviderProps {
  global?: boolean;
  direction?: ScrollProgressDirection;
  /** Scroll axis to measure, independent of the bar's visual direction. */
  scrollAxis?: 'x' | 'y';
  springOptions?: SpringOptions;
  children: React.ReactNode;
}

export function ScrollProgressProvider({
  global = true,
  direction = 'horizontal',
  scrollAxis = direction === 'horizontal' ? 'x' : 'y',
  springOptions = { stiffness: 280, damping: 30, restDelta: 0.001 },
  children,
}: ScrollProgressProviderProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress, scrollXProgress } = useScroll(
    global
      ? {}
      : {
          container: containerRef,
        }
  );

  const rawProgress = scrollAxis === 'x' ? scrollXProgress : scrollYProgress;
  const progress = useSpring(rawProgress, springOptions);

  return (
    <ScrollProgressContext.Provider
      value={{
        global,
        direction,
        progress,
        containerRef,
      }}
    >
      {children}
    </ScrollProgressContext.Provider>
  );
}

export function useScrollProgress() {
  const context = React.useContext(ScrollProgressContext);
  if (!context) {
    throw new Error('useScrollProgress must be used within a ScrollProgressProvider');
  }
  return context;
}

export interface ScrollProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function ScrollProgress({ className = '', style, ...props }: ScrollProgressProps) {
  const { direction, progress, global } = useScrollProgress();

  const scaleStyle =
    direction === 'horizontal'
      ? { scaleX: progress, transformOrigin: '0% 50%' }
      : { scaleY: progress, transformOrigin: '50% 0%' };

  return (
    <motion.div
      data-global={global}
      data-direction={direction}
      className={`h-1.5 w-full bg-[#D92323] ${className}`.trim()}
      style={{
        ...scaleStyle,
        ...style,
      }}
      {...(props as any)}
    />
  );
}

export interface ScrollProgressContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ScrollProgressContainer = React.forwardRef<HTMLDivElement, ScrollProgressContainerProps>(
  ({ className = '', children, ...props }, ref) => {
    const { containerRef, direction } = useScrollProgress();

    return (
      <div
        ref={containerRef}
        data-direction={direction}
        className={`relative overflow-auto ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollProgressContainer.displayName = 'ScrollProgressContainer';
