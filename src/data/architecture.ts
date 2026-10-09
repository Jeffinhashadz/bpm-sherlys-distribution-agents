import type { ArchitectureLayer } from '../types/blueprint'

export const architectureStatus = 'Planned. These services are not deployed by this website.'

export const layers: ArchitectureLayer[] = [
  {
    id: 'frontend',
    title: 'Operational web application',
    summary: 'The future ERP interface for warehouse, sales, delivery, accounts and admin work.',
    items: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: 'backend',
    title: 'Application services',
    summary: 'Request handling, validation and integration jobs behind the web application.',
    items: ['Python FastAPI', 'Role checks on every command', 'Background integration jobs'],
  },
  {
    id: 'data',
    title: 'Operational data',
    summary: 'Shared records for customers, products, warehouses and warehouse movements.',
    items: ['Supabase PostgreSQL', 'Supabase Auth', 'Supabase Storage for evidence files'],
  },
  {
    id: 'accounting',
    title: 'Official accounting book',
    summary: 'TallyPrime 7.0 stays on the local server. A connector talks to it. The Tally port is not exposed to the public internet.',
    items: ['TallyPrime 7.0', 'Secure local connector', 'JSON, with XML as a fallback'],
  },
]

export const services = [
  { name: 'Inventory ledger', detail: 'Usable, reserved, damage-hold and approved adjustment quantities.' },
  { name: 'Master data', detail: 'Customer, SKU, salesman, godown, vehicle, supplier and status lists.' },
  { name: 'Approval engine', detail: 'One queue for decisions that start in different modules.' },
  { name: 'Event and audit service', detail: 'Actor, time, reference IDs and the before/after result.' },
  { name: 'GPS activity service', detail: 'Order and delivery events, with privacy limits still to be confirmed.' },
  { name: 'Evidence storage', detail: 'Damage photos and proof of delivery, replacing filename links in the prototypes.' },
  { name: 'Integration jobs', detail: 'Queued Tally reads and writes, with retry and a stored official reference.' },
]

export const inventorySplit = {
  operational: {
    title: 'Operational warehouse records',
    points: [
      'Godown, zone and crate quantities used to receive, reserve and count stock.',
      'Damage holds and pending adjustments stay visible before they are financially posted.',
      'These records answer whether a case can be loaded today.',
    ],
  },
  official: {
    title: 'Official accounting records in Tally',
    points: [
      'Tally remains the financial source of truth and the official inventory book.',
      'Sales invoices, receipts and purchase documents are generated there.',
      'The web application stores Tally’s voucher reference. It does not issue the official number.',
    ],
  },
}

export const assumptions = [
  'TallyPrime 7.0 on a local server, as stated in the accounts manual.',
  'One operating company and one GSTIN, as stated for the accounts MVP.',
  'The connector is local. The blueprint says the Tally HTTP port should not be public.',
  'Supabase is the proposed operational store. It does not replace Tally.',
]
