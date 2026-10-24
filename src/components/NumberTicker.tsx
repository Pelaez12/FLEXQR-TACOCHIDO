import React, { useEffect, useState } from 'react';
import { useMotionValue, useSpring, useReducedMotion } from 'motion/react';

interface NumberTickerProps {
  value: number;
  prefix?: string;
  className?: string;
  id?: string;
}

/**
 * NumberTicker: Contador con animación suave usando resortes de Framer Motion.
 * Inspirado en los patrones de conteo numérico de React Bits y Motion.
 * Mantiene alineación tabular y respeta prefers-reduced-motion.
 */
export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  prefix = 'S/ ',
  className = '',
  id,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, {
    stiffness: 170,
    damping: 24,
    mass: 0.8,
  });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }

    const unsubscribe = springValue.on('change', (latest: number) => {
      // Evitar que oscile a números negativos por inercia del resorte
      setDisplayValue(Math.max(0, latest));
    });

    return () => unsubscribe();
  }, [springValue, value, shouldReduceMotion]);

  return (
    <span
      id={id}
      className={className}
      style={{
        fontVariantNumeric: 'tabular-nums',
        fontFeatureSettings: '"tnum" 1',
        display: 'inline-block',
      }}
    >
      {prefix}{displayValue.toFixed(2)}
    </span>
  );
};
