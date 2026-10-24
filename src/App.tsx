import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Moon, Sun, ShoppingBag, X, Plus, Minus, SearchX, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { CategoriesNav } from './components/CategoriesNav';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { FloatingCartBar } from './components/FloatingCartBar';
import { Toast } from './components/Toast';
import { SplashScreen } from './components/SplashScreen';
import { CartProvider, useCart } from './context/CartContext';
import { MENU_CATEGORIES } from './data/menu-data';
import type { MenuItem } from './types';
import { readOrderRoute } from './lib/order-route';
import { ServiceArtwork } from './components/ServiceArtwork';
import { TableMap } from './components/TableMap';

const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');

function Menu({ welcomeReady }: { welcomeReady: boolean }) {
  const { items, summary, addItem, updateQuantity, clear } = useCart();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(MENU_CATEGORIES[0].id);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('taco_chido_carta_theme_v2') !== 'light'; } catch { return true; }
  });
  const dialog = useRef<HTMLDialogElement>(null);
  const pickupDialog = useRef<HTMLDialogElement>(null);
  const tablePicker = useRef<HTMLDialogElement>(null);
  const [route, setRoute] = useState(() => readOrderRoute(window.location.search));
  const [tablePickerVersion, setTablePickerVersion] = useState(0);
  const openTablePicker = () => {
    setTablePickerVersion(version => version + 1);
    tablePicker.current?.showModal();
  };
  const [service, setService] = useState<'mesa' | 'takeaway' | null>(route.table ? 'mesa' : null);
  const pickupPrompted = useRef(false);
  const focusHome = useRef(false);
  const goHome = () => {
    focusHome.current = true;
    dialog.current?.close();
    pickupDialog.current?.close();
    tablePicker.current?.close();
    setSelected(null);
    setToast(null);
    setQuery('');
    setActive(MENU_CATEGORIES[0].id);
    setService(null);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  useEffect(() => {
    document.documentElement.dataset.orderScreen = service ? 'menu' : 'home';
    if (!service && focusHome.current) {
      document.getElementById('order-entry-title')?.focus({ preventScroll: true });
      focusHome.current = false;
    }
    return () => { delete document.documentElement.dataset.orderScreen; };
  }, [service]);
  useEffect(() => {
    if (welcomeReady && route.takeaway && !pickupPrompted.current) {
      pickupPrompted.current = true;
      pickupDialog.current?.showModal();
    }
  }, [welcomeReady, route.takeaway]);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    try { localStorage.setItem('taco_chido_carta_theme_v2', dark ? 'dark' : 'light'); } catch { /* El tema funciona sin almacenamiento. */ }
  }, [dark]);
  const filtered = useMemo(() => MENU_CATEGORIES.map(category => ({ ...category,
    items: category.items.filter(item => normalize(`${item.name} ${item.description}`).includes(normalize(query.trim()))),
  })).filter(category => category.items.length), [query]);
  useEffect(() => {
    const scroll = () => {
      let current = filtered[0]?.id;
      document.querySelectorAll<HTMLElement>('.category-section').forEach(section => {
        if (section.getBoundingClientRect().top <= 160) current = section.id.replace('section-', '');
      });
      if (current) setActive(current);
    };
    scroll();
    window.addEventListener('scroll', scroll, { passive: true });
    return () => window.removeEventListener('scroll', scroll);
  }, [filtered]);
  const add = (product: MenuItem, quantity = 1, instructions = '') => {
    addItem(product, quantity, instructions);
    setToast(`Agregado: ${quantity}x ${product.name}`);
  };
  const serviceLabel = service === 'mesa' ? `Mesa ${route.table}` : 'Para llevar · Recojo en el local';
  const message = `¡Hola, Taco Chido! Quiero realizar este pedido.\n${service === 'mesa' ? `ATENCIÓN EN MESA: Mesa ${route.table}` : 'PEDIDO PARA LLEVAR: recogeré mi pedido en el local.'}\n\n${items.map(item => `${item.quantity}x ${item.product.name} · S/ ${(item.product.price * item.quantity).toFixed(2)}${item.instructions ? `\nNotas: ${item.instructions}` : ''}`).join('\n')}\n\nSubtotal de productos: S/ ${summary.total.toFixed(2)}\n${service === 'mesa' ? 'Por favor, confirmen mi pedido para esta mesa.' : 'Por favor, confirmen disponibilidad y cuándo puedo recoger mi pedido en el local.'}`;

  return <div className={`taco-menu${service ? '' : ' is-home'}${service && summary.totalCount > 0 ? ' has-cart' : ''}`}>
    <a className="menu-skip" href="#products-main-container">Ir a los productos</a>
    <header className="header-main" id="app-header"><div className="header-container">
      {service ? <button type="button" className="theme-toggle-btn" data-theme-icon={dark ? 'sun' : 'moon'} onClick={() => setDark(!dark)} aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>{dark ? <Sun size={26} strokeWidth={2.4} aria-hidden="true" /> : <Moon size={26} strokeWidth={2.2} aria-hidden="true" />}</button> : <span aria-hidden="true" />}
      <div className="brand-info-wrap"><a href={`${window.location.pathname}${window.location.search}`} onClick={event => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); goHome(); } }} className="taco-header-logo" id="header-taco-chido-brand" aria-label="Taco Chido, volver al inicio"><img src="/taco-chido-logo-cream.png" alt="Taco Chido" width="118" height="67" /></a>{service === 'mesa' ? <button type="button" className="header-restaurant-tag header-table-badge" onClick={openTablePicker} aria-label={`Elegir mesa, actual Mesa ${route.table}`}>Mesa {route.table} <span aria-hidden="true">⌄</span></button> : <span className="header-restaurant-tag">{service === 'takeaway' ? 'Para llevar' : 'Sin floro. Con sazón.'}</span>}</div>
      {service ? <button type="button" className="cart-header-btn" id="header-cart-btn" onClick={() => dialog.current?.showModal()} aria-label={`Ver carrito, ${summary.totalCount} productos, S/ ${summary.total.toFixed(2)}`}><span className="taco-cart-icon" key={summary.totalCount}><ShoppingBag size={25} aria-hidden="true" />{summary.totalCount > 0 && <span className="cart-badge-count">{summary.totalCount}</span>}</span><span className="taco-cart-caption"><span>Mi pedido</span><strong>S/ {summary.total.toFixed(2)}</strong></span></button> : <span aria-hidden="true" />}
    </div></header>
    {service ? <>
    <div className="taco-service-summary" role="status"><span><MapPin size={22} aria-hidden="true" /><strong>{serviceLabel}</strong></span>
      {service === 'mesa' ? <button type="button" onClick={() => pickupDialog.current?.showModal()}>Pedir para llevar</button>
        : route.table && <button type="button" onClick={() => setService('mesa')}>Volver a Mesa {route.table}</button>}
    </div>
    <section className="hero-section" id="hero-section"><div className="hero-image-wrap">
      <img src="/carta/burrito-de-pastor.png" alt="Burrito de Pastor de Taco Chido" className="hero-img" />
      <div className="hero-overlay"><span className="hero-tag">Taco Chido</span><h1 className="hero-title"><span>SIN FLORO.</span><span>CON SAZÓN.</span></h1><p className="hero-subtitle">Tacos, burritos y sabor de barrio.</p><a href="#categories-nav" className="btn-animate-ui hero-cta-btn">Ver la carta <span aria-hidden="true">↓</span></a></div>
    </div></section>
    <CategoriesNav categories={filtered} activeCategoryId={active} onSelectCategory={id => {
      setActive(id); document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }} searchQuery={query} onSearchChange={setQuery} />
    <main className="main-content" id="products-main-container">
      {filtered.length === 0 ? <div className="taco-no-results" role="status"><SearchX size={30} /><h2>No encontramos productos</h2><p>Prueba con otro nombre.</p><button type="button" onClick={() => setQuery('')}>Ver toda la carta</button></div>
        : filtered.map(category => <section className="category-section" id={`section-${category.id}`} key={category.id}>
          <div className="category-header"><h2 className="category-title">{category.name}</h2>{category.description && <p className="category-desc">{category.description}</p>}</div>
          <div className="products-grid">{category.items.map(product => <ProductCard key={product.id} product={product} onOpenModal={setSelected} onQuickAdd={item => add(item)} />)}</div>
        </section>)}
    </main>
    </> : <main className="order-flow service-step" id="products-main-container">
      <div className="flow-heading"><h1 id="order-entry-title" tabIndex={-1}>¿Cómo quieres pedir?</h1><p>Disfruta Taco Chido en el local o pide para recoger.</p></div>
      <div className="service-choices taco-service-choices">
        <button type="button" className="service-choice service-profile-mesa" aria-label="En tu mesa" onClick={openTablePicker}><span className="service-choice-icon"><ServiceArtwork service="mesa" /><span className="service-profile-enter" aria-hidden="true"><ArrowUpRight /></span></span><strong className="service-profile-name">{route.table ? `Mesa ${route.table}` : 'En tu mesa'}</strong><small className="service-profile-fee">Elegir mesa</small><span className="service-profile-description">Elige tu mesa para ver la carta. Con el QR o chip NFC de tu mesa, entrarás automáticamente.</span></button>
        <button className="service-choice service-profile-takeaway taco-takeaway-choice" type="button" onClick={() => pickupDialog.current?.showModal()}><span className="service-choice-icon"><ServiceArtwork service="takeaway" /><span className="service-profile-enter" aria-hidden="true"><ArrowUpRight /></span></span><strong className="service-profile-name">Para llevar</strong><small className="service-profile-fee">Recojo en el local</small><span className="service-profile-description">Haz tu pedido y recógelo en Taco Chido.</span></button>
      </div>
      <p className="flow-reassurance"><ShieldCheck size={18} aria-hidden="true" />Revisarás tu pedido antes de abrir WhatsApp.</p>
    </main>}
    <footer className="footer-main"><div className="footer-container"><strong>Taco Chido</strong><p>Sin floro. Con sazón.</p><p className="footer-copy">Diseños de menú y carta digital · <strong>FLEXCOREOS</strong></p><a className="taco-footer-contact" href="https://wa.me/51992272521?text=Hola%2C%20necesito%20dise%C3%B1os%20de%20men%C3%BA%20y%20carta%20digital." target="_blank" rel="noopener noreferrer">Contacto FLEXCOREOS: 992 272 521</a></div></footer>
    {service && <FloatingCartBar onOpenCartDrawer={() => dialog.current?.showModal()} />}
    <ProductModal product={selected} onClose={() => setSelected(null)} onAddToCart={(product, quantity, _modifiers, instructions) => { add(product, quantity, instructions); setSelected(null); }} />
    <Toast message={toast} onClear={() => setToast(null)} />
    <dialog className="taco-cart-dialog" ref={dialog} aria-labelledby="cart-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="taco-cart-head"><h2 id="cart-title">Mi pedido</h2><button type="button" aria-label="Cerrar carrito" onClick={() => dialog.current?.close()}><X size={22} /></button></div>
      {service && <p className="taco-cart-service"><MapPin size={18} aria-hidden="true" />{serviceLabel}</p>}
      {!items.length ? <p className="taco-cart-empty">Tu pedido está vacío. Agrega tus favoritos de la carta.</p> : <>
        <div className="taco-cart-items">{items.map(item => <article className="cart-item" key={item.key}>
          <img src={item.product.imageUrl || '/taco-chido-logo-red.png'} alt="" className="cart-item-thumb" onError={event => { if (!event.currentTarget.src.endsWith('/taco-chido-logo-red.png')) event.currentTarget.src = '/taco-chido-logo-red.png'; }} />
          <div className="cart-item-details"><h3 className="cart-item-title">{item.product.name}</h3>{item.instructions && <p className="cart-item-mods">{item.instructions}</p>}
            <div className="cart-item-actions"><strong className="cart-item-price">S/ {(item.product.price * item.quantity).toFixed(2)}</strong><div className="cart-stepper"><button type="button" aria-label={`Quitar una unidad de ${item.product.name}`} onClick={() => updateQuantity(item.key, item.quantity - 1)}><Minus size={16} /></button><span>{item.quantity}</span><button type="button" disabled={item.quantity >= 99} aria-label={`Agregar una unidad de ${item.product.name}`} onClick={() => updateQuantity(item.key, item.quantity + 1)}><Plus size={16} /></button></div></div>
          </div>
        </article>)}</div>
        <div className="taco-cart-checkout"><p><span>Subtotal de productos</span><strong>S/ {summary.total.toFixed(2)}</strong></p><small>{service === 'mesa' ? `Tu pedido se enviará con la identificación de Mesa ${route.table}.` : 'Te estaremos esperando en el local. Envía el mensaje para confirmar tu pedido.'}</small>{service ? <a className="taco-cart-send" href={`https://wa.me/51946247918?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Realizar tu pedido aquí</a> : <button className="taco-cart-send" type="button" disabled>Realizar tu pedido aquí</button>}<button type="button" className="taco-cart-clear" onClick={clear}>Vaciar pedido</button></div>
      </>}
    </dialog>
    <dialog className="taco-pickup-dialog" ref={pickupDialog} aria-labelledby="pickup-title" aria-describedby="pickup-description">
      <div className="taco-cart-head"><h2 id="pickup-title">Tu pedido es para llevar</h2><button type="button" aria-label="Cerrar aviso para llevar" onClick={() => pickupDialog.current?.close()}><X size={22} /></button></div>
      <div className="taco-pickup-content"><ShoppingBag size={46} aria-hidden="true" /><p id="pickup-description">Te estaremos esperando en el local con tu pedido.</p><p>Recogerás tu pedido en Taco Chido. Al terminar, envía el mensaje por WhatsApp para que el restaurante confirme disponibilidad y preparación.</p><button className="taco-cart-send" type="button" onClick={() => { setService('takeaway'); pickupDialog.current?.close(); }}>Entendido, ver carta para llevar</button></div>
    </dialog>
    <dialog className="taco-pickup-dialog taco-table-picker" ref={tablePicker} aria-labelledby="table-picker-title">
      <div className="taco-cart-head"><h2 id="table-picker-title">Elegir mesa</h2><button type="button" aria-label="Cerrar selector de mesa" onClick={() => tablePicker.current?.close()}><X size={22} /></button></div>
      <div className="taco-table-map-content"><TableMap key={tablePickerVersion} initialTable={route.table} onConfirm={tableNumber => {
        const url = new URL(window.location.href);
        url.searchParams.delete('para_llevar');
        url.searchParams.set('mesa', String(Number(tableNumber)).padStart(2, '0'));
        url.searchParams.delete('demo');
        url.hash = '';
        window.history.replaceState(null, '', url);
        setRoute(readOrderRoute(url.search));
        setService('mesa');
        setQuery('');
        tablePicker.current?.close();
      }} /></div>
    </dialog>
  </div>;
}
export default function App() {
  const [welcomeReady, setWelcomeReady] = useState(false);
  const finishWelcome = useCallback(() => setWelcomeReady(true), []);
  return <CartProvider><SplashScreen onComplete={finishWelcome} /><div id="app-content"><Menu welcomeReady={welcomeReady} /></div></CartProvider>;
}
