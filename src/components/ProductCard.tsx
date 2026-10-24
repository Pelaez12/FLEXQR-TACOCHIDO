import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { MenuItem } from '../types';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { PlusIcon, CheckIcon } from 'lucide-react';

interface ProductCardProps {
  product: MenuItem;
  onOpenModal: (product: MenuItem) => void;
  onQuickAdd: (product: MenuItem, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal, onQuickAdd }) => {
  const shouldReduceMotion = useReducedMotion();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(addedTimer.current), []);
  const cardRef = useRef<HTMLDivElement>(null);

  // Micro-tilt 3D sutil en hover (rotación en perspectiva según cursor)
  // Solo se activa en dispositivos con cursor/hover fino
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 280, damping: 25 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Rotación contenida a ±3.5 grados para no deformar el contenido
  const rotateX = useTransform(springY, [-0.5, 0.5], ['3.5deg', '-3.5deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-3.5deg', '3.5deg']);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    if (window.matchMedia && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  }, [shouldReduceMotion, mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const hasRequiredModifiers = product.modifierGroups?.some(g => g.required);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasRequiredModifiers) {
      onOpenModal(product);
    } else {
      onQuickAdd(product, e);
      setAdded(true);
      clearTimeout(addedTimer.current);
      addedTimer.current = setTimeout(() => setAdded(false), 1100);
    }
  };

  return (
    <motion.article
      ref={cardRef}
      layout
      className="product-card"
      data-product-id={product.id}
      onClick={() => onOpenModal(product)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenModal(product);
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Reveal al hacer scroll (stagger fade + slide-up)
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-25px' }}
      transition={{
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        rotateX: shouldReduceMotion ? 0 : rotateX,
        rotateY: shouldReduceMotion ? 0 : rotateY,
        transformPerspective: 900,
      }}
    >
      <div className="product-image-wrap product-card-img-wrap">
        {/* Loading Skeleton / Shimmer mientras carga la imagen */}
        {!imageLoaded && (
          <div className="product-card-skeleton" aria-hidden="true">
            <div className="skeleton-shimmer" />
          </div>
        )}

        {/* Shared element transition con layoutId hacia el modal */}
        <motion.img
          layoutId={`product-image-${product.id}`}
          src={product.imageUrl}
          style={{ objectFit: product.imageFit, objectPosition: product.imagePosition }}
          alt={product.name}
          className={`product-img product-card-img ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={event => { if (!event.currentTarget.src.endsWith('/taco-chido-logo-red.png')) event.currentTarget.src = '/taco-chido-logo-red.png'; setImageLoaded(true); }}
          transition={{
            duration: 0.35,
            ease: [0.25, 1, 0.5, 1],
          }}
        />

        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}
      </div>

      <div className="product-info product-card-info">
        <h3 className="product-name product-card-title">{product.name}</h3>
        <p className="product-desc product-card-desc">{product.description}</p>

        <div className="product-footer product-card-footer">
          <div className="product-price-wrap">
            {product.pricePending ? <span className="price-pending">Precio por confirmar</span> : <span className="product-price">S/ {product.price.toFixed(2)}</span>}
            {product.promoPrice && (
              <span className="product-price-old">S/ {product.promoPrice.toFixed(2)}</span>
            )}
          </div>

          {!product.pricePending && <Button
            variant="default"
            size="sm"
            className="btn-add-product"
            onClick={handleAddClick}
            aria-label={`Agregar ${product.name} al pedido`}
          >
            {added ? <CheckIcon className="w-3.5 h-3.5" aria-hidden="true" /> : <PlusIcon className="w-3.5 h-3.5" aria-hidden="true" />}
            <span aria-live="polite">{added ? 'Agregado' : 'Agregar'}</span>
          </Button>}
        </div>
      </div>
    </motion.article>
  );
};
