'use client';

import * as React from 'react';
import { useAnimation, type TargetAndTransition, type Variants, type SVGMotionProps } from 'motion/react';

export type AnimationControls = ReturnType<typeof useAnimation>;

export interface IconContextValue {
  controls: AnimationControls;
  isHovered: boolean;
  animateOnHover?: boolean;
}

const AnimateIconContext = React.createContext<IconContextValue | null>(null);

export function useAnimateIconContext() {
  const context = React.useContext(AnimateIconContext);
  if (!context) {
    const controls = useAnimation();
    return {
      controls,
      isHovered: false,
      animateOnHover: false,
    };
  }
  return context;
}

export interface AnimateIconProps extends React.HTMLAttributes<HTMLDivElement> {
  animateOnHover?: boolean;
  children: React.ReactNode;
}

export function AnimateIcon({ animateOnHover = true, children, className = '', ...props }: AnimateIconProps) {
  const controls = useAnimation();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (animateOnHover) {
      controls.start('animate');
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (animateOnHover) {
      controls.start('initial');
    }
  };

  return (
    <AnimateIconContext.Provider value={{ controls, isHovered, animateOnHover }}>
      <div
        className={`inline-flex items-center justify-center ${className}`.trim()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    </AnimateIconContext.Provider>
  );
}

export interface IconProps<TAnimationKey extends string = string> extends Omit<SVGMotionProps<SVGSVGElement>, 'animate'> {
  size?: number | string;
  animateOnHover?: boolean;
  animation?: TAnimationKey;
}

export function getVariants<T extends Record<string, Variants>>(animations: T, selectedAnimation?: keyof T): Variants {
  const key = (selectedAnimation || 'default') as keyof T;
  return animations[key] || animations.default;
}

export function IconWrapper<P extends IconProps>({
  icon: Component,
  animateOnHover = true,
  size = 24,
  ...props
}: P & { icon: React.ComponentType<P> }) {
  const parentContext = React.useContext(AnimateIconContext);

  if (parentContext) {
    return <Component size={size} {...(props as unknown as P)} />;
  }

  return (
    <AnimateIcon animateOnHover={animateOnHover}>
      <Component size={size} {...(props as unknown as P)} />
    </AnimateIcon>
  );
}
