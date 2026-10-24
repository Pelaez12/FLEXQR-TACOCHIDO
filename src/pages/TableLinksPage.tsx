import { useState } from 'react';
import { makeOrderLink } from '../lib/order-route';

export default function TableLinksPage() {
  const [base, setBase] = useState(`${window.location.origin}/`);
  const [number, setNumber] = useState('1');
  const [mode, setMode] = useState<'mesa' | 'takeaway'>('mesa');
  const [copied, setCopied] = useState(false);
  let link = '', error = '';
  try { link = makeOrderLink(base, mode === 'mesa' ? Number(number) : undefined); }
  catch (reason) { error = reason instanceof Error ? reason.message : 'Revisa los datos.'; }
  return <main className="table-links-page">
    <img src="/taco-chido-logo-cream.png" width="150" height="85" alt="Taco Chido" />
    <p>Herramienta del restaurante</p><h1>Enlaces de pedido</h1>
    <p>Crea un enlace por mesa para usarlo en su QR. El cliente verá la mesa asignada y no podrá cambiar su número desde la carta.</p>
    <form onSubmit={event => event.preventDefault()} onChange={() => setCopied(false)}>
      <label htmlFor="link-base">Dirección de la carta digital</label>
      <input id="link-base" type="url" value={base} onChange={event => setBase(event.target.value)} required />
      <label htmlFor="link-mode">Tipo de enlace</label>
      <select id="link-mode" value={mode} onChange={event => setMode(event.target.value as 'mesa' | 'takeaway')}><option value="mesa">Mesa del restaurante</option><option value="takeaway">Para llevar</option></select>
      {mode === 'mesa' && <><label htmlFor="link-table">Número de mesa</label><input id="link-table" type="number" inputMode="numeric" min="1" max="999" step="1" value={number} onChange={event => setNumber(event.target.value)} /></>}
      {error ? <p role="alert">{error}</p> : <>
        <label htmlFor="generated-link">{mode === 'mesa' ? `Enlace para Mesa ${String(Number(number)).padStart(2, '0')}` : 'Enlace para pedidos para llevar'}</label>
        <input id="generated-link" value={link} readOnly onFocus={event => event.currentTarget.select()} />
        <div className="table-links-actions"><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(link); setCopied(true); } catch { document.querySelector<HTMLInputElement>('#generated-link')?.select(); } }}>Copiar enlace</button><a href={link} target="_blank" rel="noopener noreferrer">Probar enlace</a></div>
        <p role="status">{copied ? 'Enlace copiado.' : 'Puedes copiar el enlace y usarlo en el QR impreso de esa mesa.'}</p>
      </>}
    </form>
    <a href="/">Abrir la carta</a>
  </main>;
}
