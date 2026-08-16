// Fractional order indexing: moving a card only ever rewrites that one
// card's `order` field, never every card in the list.
const GAP = 1000

export function orderForPosition(sortedOrders: number[], index: number): number {
  const prev = sortedOrders[index - 1]
  const next = sortedOrders[index]

  if (prev === undefined && next === undefined) return GAP
  if (prev === undefined) return next - GAP
  if (next === undefined) return prev + GAP
  return (prev + next) / 2
}
