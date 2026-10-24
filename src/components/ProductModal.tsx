import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { MenuItem } from '../types';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { PlusIcon, MinusIcon, XIcon } from 'lucide-react';

interface ProductModalProps {
  product: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    product: MenuItem,
    quantity: number,
    selectedModifiers: Record<string, any>,
    instructions: string,
    sourceEl?: HTMLElement | null
  ) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const shouldReduceMotion = useReducedMotion();
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, any>>({});
  const [instructions, setInstructions] = useState('');
  const [modifierError, setModifierError] = useState('');

  useEffect(() => {
    if (!product) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.modal-close-btn')?.focus());
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab') return;
      const sheet = document.querySelector<HTMLElement>('.modal-sheet');
      const controls = sheet?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]');
      if (!controls?.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [product, onClose]);

  // Inicializar modificadores con defaults cuando se abre un producto
  useEffect(() => {
    if (!product) return;
    setQuantity(1);
    setInstructions('');
    setModifierError('');

    const initialMods: Record<string, any> = {};
    if (product.modifierGroups) {
      product.modifierGroups.forEach(group => {
        const opts = (group as any).options || group.modifiers || [];
        if (group.required && opts.length > 0) {
          const defaultOpt = opts.find((o: any) => o.isDefault) || opts[0];
          const selection = {
            id: defaultOpt.id,
            name: defaultOpt.name,
            price: defaultOpt.price || 0,
            groupName: group.name,
          };
          initialMods[group.id] = (group.max ?? group.maxSelect) === 1 ? selection : [selection];
        } else {
          initialMods[group.id] = [];
        }
      });
    }
    setSelectedModifiers(initialMods);
  }, [product]);

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    let total = product.price;
    Object.values(selectedModifiers).forEach(val => {
      if (Array.isArray(val)) {
        val.forEach((opt: any) => {
          total += opt.price || 0;
        });
      } else if (val && val.price) {
        total += val.price;
      }
    });
    return total;
  }, [product, selectedModifiers]);

  const handleSingleSelect = (group: any, opt: any) => {
    setSelectedModifiers(prev => ({
      ...prev,
      [group.id]: {
        id: opt.id,
        name: opt.name,
        price: opt.price || 0,
        groupName: group.name,
      },
    }));
  };

  const handleMultiSelect = (group: any, opt: any) => {
    setSelectedModifiers(prev => {
      const currentList: any[] = Array.isArray(prev[group.id]) ? [...prev[group.id]] : [];
      const exists = currentList.find(o => o.id === opt.id);
      if (exists) {
        return {
          ...prev,
          [group.id]: currentList.filter(o => o.id !== opt.id),
        };
      }
      const max = group.max || group.maxSelect || 99;
      if (currentList.length >= max) return prev;
      return {
        ...prev,
        [group.id]: [
          ...currentList,
          { id: opt.id, name: opt.name, price: opt.price || 0, groupName: group.name },
        ],
      };
    });
  };

  const handleConfirm = (e: React.MouseEvent) => {
    if (!product || product.pricePending) return;
    const invalid = product.modifierGroups?.find(group => {
      const selected = selectedModifiers[group.id];
      const count = Array.isArray(selected) ? selected.length : selected ? 1 : 0;
      return count < Math.max(group.required ? 1 : 0, group.min ?? group.minSelect ?? 0) || count > (group.max ?? group.maxSelect ?? 99);
    });
    if (invalid) { setModifierError(`Revisa «${invalid.name}» y selecciona las opciones requeridas.`); return; }
    onAddToCart(product, quantity, selectedModifiers, instructions, e.currentTarget as HTMLElement);
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="product-modal-backdrop"
          className="modal-overlay active"
          id="product-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={e => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key={`modal-card-${product.id}`}
            className="product-modal-card modal-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            initial={{
              opacity: 0,
              y: shouldReduceMotion ? 0 : 35,
              scale: shouldReduceMotion ? 1 : 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: shouldReduceMotion ? 0 : 25,
              scale: shouldReduceMotion ? 1 : 0.95,
            }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 32,
            }}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Cerrar ventana de personalización"
            >
              <XIcon className="w-5 h-5" />
            </button>
            {/* Header del Modal con la imagen morphing */}
            <div className="modal-product-header modal-sheet-header">
              <motion.img
                layoutId={`product-image-${product.id}`}
                src={product.imageUrl || '/taco-chido-logo-red.png'}
                style={{ objectFit: 'contain', objectPosition: 'center' }}
                onError={event => { if (!event.currentTarget.src.endsWith('/taco-chido-logo-red.png')) event.currentTarget.src = '/taco-chido-logo-red.png'; }}
                alt={product.name}
                className="modal-product-img modal-sheet-img"
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 32,
                }}
              />
            </div>

            {/* Cuerpo del Modal con título, precio tabular y modificadores */}
            <div className="modal-product-body modal-sheet-body">
              <div className="modal-product-title-row">
                <h2 className="modal-product-title modal-sheet-title" id="product-modal-title">{product.name}</h2>
                <span className="modal-product-price modal-sheet-price">
                  S/ {unitPrice.toFixed(2)}
                </span>
              </div>
              <p className="modal-product-desc modal-sheet-desc">{product.description}</p>

              {/* Grupos de Modificadores */}
              {product.modifierGroups &&
                product.modifierGroups.map(group => {
                  const opts = (group as any).options || group.modifiers || [];
                  const isSingle =
                    (group.max === 1 || (group as any).maxSelect === 1) && group.required;

                  return (
                    <div key={group.id} className="modifier-group modifier-group-block">
                      <div className="modifier-group-header">
                        <h4 className="modifier-group-title modifier-group-name">{group.name}</h4>
                        <span className="modifier-group-badge">
                          {group.required ? 'Obligatorio' : 'Opcional'}
                        </span>
                      </div>

                      <div className="modifier-options-list">
                        {opts.map((opt: any) => {
                          const isSelected = isSingle
                            ? selectedModifiers[group.id]?.id === opt.id
                            : Array.isArray(selectedModifiers[group.id]) && selectedModifiers[group.id].some((o: any) => o.id === opt.id);

                          return (
                            <label
                              key={opt.id}
                              className={`modifier-option-card ${isSelected ? 'selected' : ''}`}
                            >
                              <span className="modifier-option-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                  type={isSingle ? 'radio' : 'checkbox'}
                                  name={`mod-group-${group.id}`}
                                  checked={isSelected}
                                  onChange={() => { setModifierError(''); if (isSingle) handleSingleSelect(group, opt); else handleMultiSelect(group, opt); }}
                                  className="modifier-input"
                                />
                                <span>{opt.name}</span>
                              </span>
                              <span className="modifier-option-price" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                {opt.price > 0 ? `+ S/ ${opt.price.toFixed(2)}` : 'Gratis'}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

              {/* Indicaciones para cocina */}
              <div className="modal-special-notes">
                <label htmlFor="modal-kitchen-notes">Indicaciones para cocina (opcional):</label>
                <textarea
                  id="modal-kitchen-notes"
                  className="modal-notes-textarea"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface-hover)',
                    color: 'var(--color-text-main)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    resize: 'none',
                  }}
                  placeholder="Ej. Papas bien crocantes, sin tártara, ají extra..."
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            {/* Footer con controles Animate UI */}
            <div className="modal-product-footer modal-sheet-footer">
              {modifierError && <p role="alert" className="field-error">{modifierError}</p>}
              <div className="cart-stepper">
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Disminuir cantidad"
                >
                  <MinusIcon className="w-3.5 h-3.5" />
                </Button>
                <span className="stepper-value" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {quantity}
                </span>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={() => setQuantity(q => Math.min(99, q + 1))}
                  disabled={quantity >= 99}
                  aria-label="Aumentar cantidad"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                </Button>
              </div>

              <Button
                variant="default"
                size="lg"
                className="btn-confirm-add"
                onClick={handleConfirm}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PlusIcon className="w-4 h-4" />
                  <span>Agregar al pedido</span>
                </div>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                  S/ {(unitPrice * quantity).toFixed(2)}
                </span>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
