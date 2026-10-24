export interface OrderRoute { table: string | null; takeaway: boolean; error: boolean; }

export function readOrderRoute(search: string): OrderRoute {
  const params = new URLSearchParams(search);
  const table = params.get('mesa');
  const takeaway = params.get('para_llevar');
  const error = params.getAll('mesa').length > 1 || params.getAll('para_llevar').length > 1
    || (table !== null && takeaway !== null)
    || (table !== null && (!/^\d{1,3}$/.test(table) || Number(table) < 1 || Number(table) > 999))
    || (takeaway !== null && takeaway !== '1');
  return { table: !error && table !== null ? String(Number(table)).padStart(2, '0') : null, takeaway: !error && takeaway === '1', error };
}

export function makeOrderLink(base: string, table?: number): string {
  const url = new URL(base);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('Ingresa una dirección web http o https válida.');
  if (table !== undefined && (!Number.isInteger(table) || table < 1 || table > 999)) throw new Error('Ingresa un número de mesa entre 1 y 999.');
  url.search = '';
  url.hash = '';
  if (table !== undefined) url.searchParams.set('mesa', String(table).padStart(2, '0'));
  else url.searchParams.set('para_llevar', '1');
  return url.href;
}
