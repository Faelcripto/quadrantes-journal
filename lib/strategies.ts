export const quadrantesStrategies = [
  { name: 'Correção', rules: 'Setup 1 — Estratégia dos Quadrantes.' },
  { name: 'Reversão', rules: 'Setup 2 — Estratégia dos Quadrantes.' },
  { name: 'Continuação', rules: 'Setup 3 — Estratégia dos Quadrantes.' },
];
// The active catalog contains only the three Quadrantes setups.
export function currentStrategies(_saved?: {name:string;rules:string}[]) {
  return quadrantesStrategies.map(s => ({...s}));
}
