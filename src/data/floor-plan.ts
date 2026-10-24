// Same illustrative dining-room layout as FLEXQR; replace with the real plan later.
export const TABLE_FLOOR_PLAN = Array.from({ length: 20 }, (_, index) => ({
  label: `Mesa ${String(index + 1).padStart(2, '0')}`,
  number: String(index + 1).padStart(2, '0'),
  capacity: [1, 2, 4, 6][index % 4],
  x: [76, 185, 335, 444][index % 4],
  y: 142 + Math.floor(index / 4) * 94,
}));
