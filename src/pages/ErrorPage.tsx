import { useEffect } from 'react';
import { Home, RotateCw } from 'lucide-react';

export default function ErrorPage({ code = 404 }: { code?: 400 | 404 | 500 }) {
  const title = code === 400 ? 'Este enlace de pedido no es válido' : code === 500 ? 'Error interno del sistema' : 'Página no encontrada';
  useEffect(() => { document.title = `${code} · Taco Chido`; }, [code]);
  return <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
    <header className="taco-error-header"><a href="/" aria-label="Taco Chido, volver a la carta"><img src="/taco-chido-logo-cream.png" width="128" height="73" alt="Taco Chido" /></a></header>
    <main className="error-page-wrapper flex-grow flex items-center justify-center p-6">
      <div className="error-clean-container text-center max-w-[480px]">
        <h1 className="error-giant-num taco-error-code font-black text-6xl md:text-8xl tracking-tight mb-2">{code}</h1>
        <h2 className="error-clean-title text-2xl font-bold mb-3">{title}</h2>
        <p className="error-clean-desc text-muted mb-8 leading-relaxed">{code === 400 ? 'Escanea nuevamente el QR de tu mesa o pide ayuda al equipo del local.' : code === 500 ? 'Intenta nuevamente en un momento. Tu mensaje solo se envía cuando lo confirmas en WhatsApp.' : 'La página o el código QR que estás buscando no parece estar disponible en la carta.'}</p>
        <div className="error-buttons-row flex flex-wrap items-center justify-center gap-4 mb-8"><a className="btn-error-solid" href="/"><Home size={18} aria-hidden="true" />Ir a la carta</a>{code === 500 && <button className="btn-error-outline" type="button" onClick={() => window.location.reload()}><RotateCw size={18} aria-hidden="true" />Reintentar</button>}</div>
        <a className="taco-error-contact" href="https://wa.me/51946247918" target="_blank" rel="noopener noreferrer">Contactar a Taco Chido</a>
        <div className="error-decorative-dots flex items-center justify-center gap-2" aria-hidden="true"><span /><span /><span /></div>
      </div>
    </main>
  </div>;
}
