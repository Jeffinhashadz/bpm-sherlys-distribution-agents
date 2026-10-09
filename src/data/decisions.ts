import type { PendingDecision } from '../types/blueprint'

export const pendingDecisions: PendingDecision[] = [
  {
    id: 'PD-01',
    title: 'Credit limit is guidance or a hard stop',
    context:
      'The order manual says credit position is guidance and approval stays a manual Accounts decision. The accounts manual calculates within-limit and over-limit conditions, and still records an Accounts decision.',
    neededFrom: 'Accounts Manager',
    evidenceStatus: 'pending-validation',
  },
  {
    id: 'PD-02',
    title: 'Supervisor and Warehouse Manager',
    context:
      'Damage verification names the Warehouse / Operations Manager. Daily stock verification names a Supervisor. The blueprint does not say whether these are the same person.',
    neededFrom: 'Admin / Owner',
    evidenceStatus: 'pending-validation',
  },
  {
    id: 'PD-03',
    title: 'When GPS is captured',
    context:
      'The admin manual describes order and delivery time/location events and a configured customer radius. It also says continuous duty tracking, if enabled later, should be limited to working hours and authorized roles. The exact capture moment is not fixed.',
    neededFrom: 'Admin / Owner',
    evidenceStatus: 'pending-validation',
  },
  {
    id: 'PD-04',
    title: 'Reorder defaults are sample values',
    context:
      'The accounts prototype uses lead time 4 days, safety stock 5 days, target stock 14 days and MOQ 10 cases. The manual says these are sample defaults to be configured after purchase history is reviewed.',
    neededFrom: 'Accounts Manager',
    evidenceStatus: 'pending-validation',
  },
  {
    id: 'PD-05',
    title: 'Crate capacity beyond the milk prototype',
    context:
      'The prototypes use one SKU per crate and a capacity of 50 cases. The receiving manual says other categories may later use an SKU-specific capacity from Admin.',
    neededFrom: 'Warehouse Manager',
    evidenceStatus: 'pending-validation',
  },
  {
    id: 'PD-06',
    title: 'Inventory alert thresholds',
    context:
      'The admin inventory view includes OK / LOW / CRITICAL status. The manuals reviewed do not state the numeric thresholds.',
    neededFrom: 'Admin / Owner',
    evidenceStatus: 'pending-validation',
  },
  {
    id: 'PD-07',
    title: 'Official document numbering stays in Tally',
    context:
      'The accounts manual says the web app uses an internal Billing Data ID and Tally owns the official invoice and purchase-order numbers. This should be confirmed before build.',
    neededFrom: 'Accounts Manager',
    evidenceStatus: 'pending-validation',
  },
]
