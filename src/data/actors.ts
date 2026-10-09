import type { BPMActor } from '../types/blueprint'

export const actors: BPMActor[] = [
  {
    id: 'ACT-01',
    name: 'Salesman',
    responsibility: 'Creates customer orders and may collect payment in the field.',
    moduleIds: ['order-to-delivery', 'accounts-tallyprime'],
  },
  {
    id: 'ACT-02',
    name: 'Accounts Executive',
    responsibility: 'Reviews credit, billing data, collections and Tally submission.',
    moduleIds: ['order-to-delivery', 'accounts-tallyprime'],
  },
  {
    id: 'ACT-03',
    name: 'Store Keeper',
    responsibility: 'Receives supplier stock, prepares loading, counts crates and records damage.',
    moduleIds: [
      'order-to-delivery',
      'damage-management',
      'stock-receiving',
      'daily-stock-verification',
    ],
  },
  {
    id: 'ACT-04',
    name: 'Delivery Representative',
    responsibility: 'Confirms handover quantities, returns, proof and transit damage.',
    moduleIds: ['order-to-delivery', 'damage-management', 'admin-dashboard'],
  },
  {
    id: 'ACT-05',
    name: 'Warehouse Manager',
    responsibility: 'Verifies receiving, damage cases and warehouse locations.',
    moduleIds: ['damage-management', 'stock-receiving', 'daily-stock-verification'],
  },
  {
    id: 'ACT-06',
    name: 'Accounts Manager',
    responsibility: 'Owns purchase approval, credit exceptions and Accounts-to-Admin escalation.',
    moduleIds: ['accounts-tallyprime', 'order-to-delivery'],
  },
  {
    id: 'ACT-07',
    name: 'Admin / Owner',
    responsibility: 'Reviews inventory, field activity, approvals, permissions and audit history.',
    moduleIds: ['admin-dashboard'],
  },
  {
    id: 'ACT-08',
    name: 'Supervisor',
    responsibility: 'Reviews daily stock variances and approves or rejects adjustments.',
    moduleIds: ['daily-stock-verification'],
  },
  {
    id: 'SYS-01',
    name: 'Sherlys Business OS',
    responsibility: 'Validates entries, calculates quantities and preserves operational references.',
    moduleIds: [
      'order-to-delivery',
      'damage-management',
      'stock-receiving',
      'daily-stock-verification',
      'admin-dashboard',
      'accounts-tallyprime',
    ],
  },
  {
    id: 'EXT-01',
    name: 'TallyPrime',
    responsibility: 'Official accounting and inventory book for invoices, receipts and purchase documents.',
    moduleIds: ['accounts-tallyprime', 'order-to-delivery'],
  },
]

export function actorName(id: string): string {
  return actors.find((actor) => actor.id === id)?.name ?? id
}

export function actorNames(ids: string[]): string {
  return ids.map(actorName).join(', ')
}
