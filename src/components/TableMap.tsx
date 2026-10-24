import { useState } from 'react';
import { MapPin, List, Map, Check, Users } from 'lucide-react';
import { TABLE_FLOOR_PLAN as tables } from '../data/floor-plan';

// Adapted from FLEXQR/src/components/TableMap.tsx, using its blueprint and styles.
const capacities = [...new Set(tables.map(table => table.capacity))].sort((a, b) => a - b);
const people = (capacity: number) => `${capacity} ${capacity === 1 ? 'persona' : 'personas'}`;
const chairPositions = (capacity: number) => capacity === 1 ? [[0, 33]] : capacity === 2 ? [[0, -33], [0, 33]] : capacity === 4 ? [[-18, -33], [18, -33], [-18, 33], [18, 33]] : [[-24, -33], [0, -33], [24, -33], [-24, 33], [0, 33], [24, 33]];

export function TableMap({ initialTable, onConfirm }: { initialTable: string | null; onConfirm: (number: string) => void }) {
  const [selected, setSelected] = useState(initialTable ?? '');
  const [view, setView] = useState<'map' | 'list'>('map');
  const [capacity, setCapacity] = useState<number | null>(null);
  const matchingTables = tables.filter(table => capacity === null || table.capacity === capacity);
  const selectedTable = tables.find(table => table.number === selected);
  const linkedTableOutsidePlan = initialTable && !tables.some(table => table.number === initialTable);

  return <form className="table-selector" onSubmit={event => { event.preventDefault(); if (selected) onConfirm(selected); }}>
    <div className="map-toolbar"><span><MapPin size={16} aria-hidden="true" />Salón principal</span>
      <div className="map-view-controls" role="group" aria-label="Vista de mesas">
        <button type="button" aria-pressed={view === 'map'} onClick={() => setView('map')}><Map size={16} aria-hidden="true" />Plano</button>
        <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}><List size={16} aria-hidden="true" />Lista</button>
      </div>
    </div>
    <div className="capacity-toolbar"><span><Users size={16} aria-hidden="true" />Capacidad de la mesa</span>
      <div className="capacity-options" role="group" aria-label="Filtrar mesas por capacidad"><button type="button" aria-pressed={capacity === null} onClick={() => setCapacity(null)}>Todas</button>{capacities.map(value => <button type="button" key={value} aria-pressed={capacity === value} onClick={() => setCapacity(value)}>{people(value)}</button>)}</div>
      <p role="status">{capacity === null ? `${tables.length} mesas en el plano de ejemplo` : `${matchingTables.length} mesas para ${people(capacity)}`}</p>
    </div>
    {view === 'map' ? <>
      <div className="table-floor" role="group" aria-label="Selecciona tu mesa en el plano ilustrativo">
        <svg viewBox="0 0 520 640" aria-hidden="true" className="floor-blueprint">
          <path d="M225 622 H16 V18 H504 V622 H295" className="floor-wall" />
          <rect x="30" y="30" width="220" height="58" rx="6" className="floor-zone" /><rect x="362" y="30" width="128" height="58" rx="6" className="floor-zone" />
          <text x="140" y="66" textAnchor="middle">COCINA</text><text x="426" y="66" textAnchor="middle">CAJA</text>
          <path d="M260 105 V584" className="floor-aisle" /><text x="260" y="614" textAnchor="middle">ENTRADA ↑</text>
          {tables.map(table => <g key={table.number} className={`floor-chairs ${capacity !== null && capacity !== table.capacity ? 'capacity-muted' : ''}`}>
            {chairPositions(table.capacity).map(([x, y], index) => <rect key={index} x={table.x + x - 8} y={table.y + y - 5} width="16" height="10" rx="3" />)}
          </g>)}
        </svg>
        {tables.map(table => <button key={table.number} type="button" className={`floor-table seats-${table.capacity} ${selected === table.number ? 'selected' : ''} ${capacity !== null && capacity !== table.capacity ? 'capacity-muted' : ''}`}
          style={{ left: `${table.x / 520 * 100}%`, top: `${table.y / 640 * 100}%` }} aria-label={`${table.label}, para ${people(table.capacity)}`} aria-pressed={selected === table.number} onClick={() => setSelected(table.number)}>
          <span className="floor-table-number">{table.number}{selected === table.number && <Check size={12} aria-hidden="true" />}</span><small>{table.capacity} pers.</small>
        </button>)}
      </div>
      <p className="floor-legend">Toca el número de tu mesa. Las sillas indican su capacidad ilustrativa.</p>
    </> : <div className="table-list"><h3>Mesas{capacity !== null && ` para ${people(capacity)}`}</h3><div className="table-list-grid">{matchingTables.map(table => <button key={table.number} type="button" aria-pressed={selected === table.number} onClick={() => setSelected(table.number)}><span>{table.label}{selected === table.number && <Check size={13} aria-hidden="true" />}</span><small>{people(table.capacity)}</small></button>)}</div></div>}
    {linkedTableOutsidePlan && <button className="linked-table-choice" type="button" aria-pressed={selected === initialTable} onClick={() => setSelected(initialTable)}>Mesa {initialTable} · indicada por tu enlace</button>}
    <p className="floor-disclaimer">Plano de ejemplo de FLEXQR. La distribución y las capacidades se ajustarán al local; no indican disponibilidad.</p>
    <div className="table-confirm"><p role="status">{selected ? <><Check size={18} aria-hidden="true" /><span><strong>Mesa {selected}</strong>{selectedTable && ` · ${people(selectedTable.capacity)}`}</span></> : 'Toca tu mesa para seleccionarla.'}</p>
      <button type="submit" className="flow-primary" disabled={!selected}>{selected ? `Ver carta · Mesa ${selected}` : 'Selecciona tu mesa'}</button>
    </div>
  </form>;
}
