import React, { useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MenuCategory } from '../types';
import { SearchIcon, XIcon } from 'lucide-react';

interface CategoriesNavProps {
  categories: MenuCategory[];
  activeCategoryId: string;
  onSelectCategory: (catId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const CategoriesNav: React.FC<CategoriesNavProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll horizontal suave para mantener centrada la pestaña activa en pantallas móviles
  useEffect(() => {
    if (!tabsContainerRef.current) return;
    const activeEl = tabsContainerRef.current.querySelector<HTMLElement>(
      `[data-cat-id="${activeCategoryId}"]`
    );
    if (activeEl) {
      const container = tabsContainerRef.current;
      const left = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
      container.scrollTo({ left, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
    }
  }, [activeCategoryId, shouldReduceMotion]);

  return (
    <>
      {/* Buscador de Platos */}
      <div className="search-container">
        <div className="search-input-wrap">
          <SearchIcon className="search-icon" size={16} aria-hidden="true" />
          <input
            type="text"
            id="product-search-input"
            aria-label="Buscar platos"
            className="search-input"
            placeholder="Buscar tacos, burritos, entradas..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button type="button" className="search-clear" aria-label="Limpiar búsqueda"
              onClick={() => {
                onSearchChange('');
                document.getElementById('product-search-input')?.focus();
              }}>
              <XIcon size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Navegación Sticky de Categorías con indicador animado deslizante */}
      <nav className="categories-nav-sticky" id="categories-nav">
        <div
          className="categories-scroll-wrap"
          id="categories-tabs-container"
          ref={tabsContainerRef}
        >
          {categories.map(cat => {
            const isActive = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                type="button"
                className={`category-pill-btn ${isActive ? 'active' : ''}`}
                data-cat-id={cat.id}
                aria-pressed={isActive}
                onClick={() => onSelectCategory(cat.id)}
              >
                {/* Indicador deslizante con layoutId de Framer Motion */}
                {isActive && (
                  <motion.span
                    layoutId="activeCategoryPill"
                    className="category-pill-active-bg"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            type: 'spring',
                            stiffness: 420,
                            damping: 32,
                          }
                    }
                  />
                )}
                <span className="category-pill-label">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
