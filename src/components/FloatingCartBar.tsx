import React from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { PiShoppingBagOpenFill } from 'react-icons/pi';
import { NumberTicker } from './NumberTicker';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

interface FloatingCartBarProps {
  onOpenCartDrawer: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ onOpenCartDrawer }) => {
  const { summary } = useCart();

  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
    {summary.totalCount > 0 && <motion.aside className="cart-bar-sticky visible cart-motion" id="cart-bar-sticky" aria-label="Resumen flotante del pedido"
      initial={{ opacity: 0, y: reduced ? 0 : 24 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduced ? 0 : 24 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
      <div className="cart-bar-inner">
        <div className="cart-bar-info">
          <span className="cart-bar-count" id="cart-bar-count">
            {summary.totalCount} {summary.totalCount === 1 ? 'producto' : 'productos'}
          </span>
          <NumberTicker
            id="cart-bar-total"
            className="cart-bar-total"
            value={summary.total}
            prefix="S/ "
          />
        </div>

        <Button
          variant="default"
          size="default"
          className="cart-bar-btn"
          id="cart-bar-view-btn"
          onClick={onOpenCartDrawer}
        >
          <span>Ver mi pedido</span>
          <PiShoppingBagOpenFill className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </motion.aside>}
    </AnimatePresence>
  );
};
