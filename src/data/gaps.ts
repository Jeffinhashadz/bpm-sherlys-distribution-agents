import type { ProcessGap } from '../types/blueprint'

export const gaps: ProcessGap[] = [
  {
    id: 'GAP-01',
    title: 'Fragmented operational visibility',
    moduleIds: [
      'order-to-delivery',
      'damage-management',
      'stock-receiving',
      'daily-stock-verification',
      'admin-dashboard',
      'accounts-tallyprime',
    ],
    currentWorkflow:
      'Each pipeline is specified as its own Excel workbook. Admin is described as the layer that should consolidate their output.',
    limitation:
      'Separate workbook prototypes do not themselves provide one live operational record.',
    impact:
      'Status, stock and approvals can only be understood by opening more than one prototype. This is a system-design limit, not a measured operating loss.',
    proposal: 'Use one shared operational database and a consolidated management view.',
    actorIds: ['ACT-07', 'SYS-01'],
    priority: 'foundation',
    sourceReference: 'Admin manual, section 1 — four pipelines feed one control layer',
    validationStatus: 'identified-gap',
    links: [
      { moduleId: 'admin-dashboard', flowIds: ['ADM-INV-01', 'ADM-APR-01', 'ADM-AUD-01'] },
      { moduleId: 'order-to-delivery', flowIds: ['ORD-08', 'ACC-09', 'DEL-09'] },
    ],
  },
  {
    id: 'GAP-02',
    title: 'Credit approval data dependency',
    moduleIds: ['order-to-delivery', 'accounts-tallyprime'],
    currentWorkflow:
      'Accounts reviews outstanding, overdue and credit position before warehouse preparation. The accounts blueprint calculates available credit and projected exposure from Tally outstanding.',
    limitation:
      'The order workbook displays credit fields, but it does not define a timestamped snapshot of the Tally balances used for that decision.',
    impact:
      'A later change in outstanding could make the approval difficult to explain. This dependency needs a control; it is not evidence of incorrect approvals today.',
    proposal: 'Read the customer balance from TallyPrime and store a timestamped approval snapshot.',
    actorIds: ['ACT-02', 'EXT-01'],
    priority: 'high',
    sourceReference: 'Order manual tab 2; Accounts manual credit and receivables',
    validationStatus: 'identified-gap',
    links: [
      {
        moduleId: 'order-to-delivery',
        flowIds: ['ACC-02', 'ACC-03', 'ACC-04', 'ACC-05', 'ACC-06'],
      },
      {
        moduleId: 'accounts-tallyprime',
        flowIds: ['FIN-CRD-02', 'FIN-CRD-03', 'FIN-CRD-05', 'FIN-CRD-06'],
      },
    ],
  },
  {
    id: 'GAP-03',
    title: 'Inventory availability and reservation',
    moduleIds: ['order-to-delivery', 'stock-receiving', 'admin-dashboard'],
    currentWorkflow:
      'Loading allocates godown, zone and crate for an approved order. Receiving posts only verified, fully allocated accepted cases. Admin describes usable, reserved and damage-hold stock.',
    limitation:
      'The workbooks do not define one calculation that reserves cases atomically when preparation is confirmed.',
    impact:
      'Preparation could use stock that is still unverified, held as damage, or already assigned. This is a design dependency, not a counted shortage.',
    proposal: 'Calculate availability in one ledger and reserve stock when preparation is confirmed.',
    actorIds: ['ACT-03', 'SYS-01'],
    priority: 'high',
    sourceReference: 'Order manual tab 3; Receiving posting rule; Admin inventory overview',
    validationStatus: 'identified-gap',
    links: [
      {
        moduleId: 'order-to-delivery',
        flowIds: ['LOAD-02', 'LOAD-03', 'LOAD-04', 'LOAD-05', 'LOAD-06', 'LOAD-07', 'LOAD-08', 'LOAD-09'],
      },
      { moduleId: 'stock-receiving', flowIds: ['STK-PST-01', 'STK-PST-02'] },
      { moduleId: 'admin-dashboard', flowIds: ['ADM-INV-01', 'ADM-INV-02'] },
    ],
  },
  {
    id: 'GAP-04',
    title: 'Receiving and damage consistency',
    moduleIds: ['stock-receiving', 'damage-management'],
    currentWorkflow:
      'Receiving records damaged cases and a Damage ID. Damage management holds the cause, action, evidence and verification. Accepted cases exclude damaged cases.',
    limitation:
      'The two workbooks can both describe the same damaged quantity. Nothing in the prototype enforces a single posting of that quantity.',
    impact:
      'Damaged cases could be treated as accepted stock, or reduced twice, if the records are not linked. This is a control requirement.',
    proposal: 'Link each receiving damage quantity to one damage movement and post it once.',
    actorIds: ['ACT-03', 'ACT-05'],
    priority: 'high',
    sourceReference: 'Receiving manual section 7; Damage manual stock-deduction rule',
    validationStatus: 'identified-gap',
    links: [
      { moduleId: 'stock-receiving', flowIds: ['STK-DMG-01', 'STK-DMG-02', 'STK-DMG-03'] },
      { moduleId: 'damage-management', flowIds: ['DMG-RCV-01', 'DMG-RCV-02', 'DMG-VER-04', 'DMG-ACT-02'] },
    ],
  },
  {
    id: 'GAP-05',
    title: 'Stock variance and adjustment control',
    moduleIds: ['daily-stock-verification', 'admin-dashboard'],
    currentWorkflow:
      'A mismatch is recorded, recounted and reviewed. Stock correction is ready only after approval, reference and date. The Store Keeper does not overwrite system cases.',
    limitation:
      'The workbook calculates the adjustment. It does not yet write an immutable ledger movement back into shared inventory.',
    impact:
      'A correction could be applied without a durable history once the workbooks are replaced. The manual already defines the gate.',
    proposal: 'Post approved adjustments as ledger movements with an audit history that cannot be overwritten.',
    actorIds: ['ACT-03', 'ACT-08', 'SYS-01'],
    priority: 'high',
    sourceReference: 'Daily stock verification manual, correction gate',
    validationStatus: 'identified-gap',
    links: [
      {
        moduleId: 'daily-stock-verification',
        flowIds: ['DSV-VAR-02', 'DSV-RCT-01', 'DSV-APR-02', 'DSV-ADJ-01', 'DSV-ADJ-02'],
      },
      { moduleId: 'admin-dashboard', flowIds: ['ADM-INV-02', 'ADM-AUD-01'] },
    ],
  },
  {
    id: 'GAP-06',
    title: 'Order-to-billing quantity consistency',
    moduleIds: ['order-to-delivery', 'accounts-tallyprime'],
    currentWorkflow:
      'Ordered, prepared, loaded and billable cases are separate fields. Billable cases equal loaded cases. The original order quantity is not overwritten.',
    limitation:
      'The workbook keeps the fields on different tabs. A future screen could collapse them into one quantity unless the data model forbids it.',
    impact:
      'Billing could follow the ordered quantity after a short load. The manual already forbids that outcome.',
    proposal: 'Store ordered, prepared, loaded and billed quantities as separate values on one order.',
    actorIds: ['ACT-03', 'ACT-02'],
    priority: 'high',
    sourceReference: 'Order manual tabs 4 and 5, and the audit principle',
    validationStatus: 'identified-gap',
    links: [
      { moduleId: 'order-to-delivery', flowIds: ['NOTE-02', 'NOTE-03', 'NOTE-06', 'BILL-02'] },
      { moduleId: 'accounts-tallyprime', flowIds: ['FIN-INV-01', 'FIN-INV-02'] },
    ],
  },
  {
    id: 'GAP-07',
    title: 'Official invoice synchronization',
    moduleIds: ['order-to-delivery', 'accounts-tallyprime'],
    currentWorkflow:
      'Excel prepares billing data and records the invoice number produced by the accounting software. The accounts blueprint says Tally generates and owns the official number.',
    limitation:
      'The prototypes do not include the connector, retry queue or stored voucher reference.',
    impact:
      'An operational order could lack a reliable link to the official invoice. No sync-failure rate is claimed.',
    proposal: 'Use an approved billing queue, a local connector, a unique transaction map and reconciliation.',
    actorIds: ['ACT-02', 'EXT-01'],
    priority: 'high',
    sourceReference: 'Order manual tab 5; Accounts manual invoice and Tally architecture',
    validationStatus: 'identified-gap',
    links: [
      { moduleId: 'order-to-delivery', flowIds: ['BILL-05', 'BILL-06', 'BILL-07', 'BILL-08', 'BILL-09'] },
      { moduleId: 'accounts-tallyprime', flowIds: ['FIN-INV-05', 'FIN-INV-06', 'FIN-SYN-01', 'FIN-SYN-02'] },
    ],
  },
  {
    id: 'GAP-08',
    title: 'Delivery exception reconciliation',
    moduleIds: ['order-to-delivery', 'damage-management', 'accounts-tallyprime'],
    currentWorkflow:
      'Delivery records delivered, returned and short cases. Transit damage is a separate case linked to the order, invoice and vehicle. Short cases are billed minus delivered minus returned.',
    limitation:
      'The three workbooks do not define one investigation that closes the stock and financial effect together.',
    impact:
      'A return, transit damage case and short delivery could be handled as unrelated rows. This is a traceability requirement.',
    proposal: 'Open a linked exception, inspect it in the warehouse, and route any financial adjustment through Accounts.',
    actorIds: ['ACT-04', 'ACT-05', 'ACT-02'],
    priority: 'medium',
    sourceReference: 'Order manual tab 6; Damage manual transit tab; Accounts escalation',
    validationStatus: 'identified-gap',
    links: [
      { moduleId: 'order-to-delivery', flowIds: ['DEL-04', 'DEL-05', 'DEL-06', 'REC-02', 'REC-03'] },
      { moduleId: 'damage-management', flowIds: ['DMG-TRN-01', 'DMG-TRN-02', 'DMG-VER-04'] },
      { moduleId: 'accounts-tallyprime', flowIds: ['FIN-ESC-01', 'FIN-ESC-02'] },
    ],
  },
  {
    id: 'GAP-09',
    title: 'Field activity visibility',
    moduleIds: ['order-to-delivery', 'admin-dashboard'],
    currentWorkflow:
      'The admin blueprint records salesman login and order location, and delivery dispatch, arrival and delivery location, including events outside a configured customer radius.',
    limitation:
      'The order workbook does not capture those events. Privacy limits for location data are stated as controls still to be defined.',
    impact:
      'Management cannot review field timing or location exceptions from the order workbook alone.',
    proposal: 'Capture events with time and location, check a configurable customer radius, and limit who can review them.',
    actorIds: ['ACT-01', 'ACT-04', 'ACT-07'],
    priority: 'medium',
    sourceReference: 'Admin manual salesman and delivery activity tabs, and location privacy note',
    validationStatus: 'identified-gap',
    links: [
      { moduleId: 'order-to-delivery', flowIds: ['ORD-07', 'DEL-02', 'DEL-03', 'DEL-07'] },
      { moduleId: 'admin-dashboard', flowIds: ['ADM-SAL-01', 'ADM-SAL-02', 'ADM-DEL-01', 'ADM-DEL-02'] },
    ],
  },
  {
    id: 'GAP-10',
    title: 'Financial collection visibility',
    moduleIds: ['order-to-delivery', 'accounts-tallyprime'],
    currentWorkflow:
      'Salesmen and delivery representatives may collect cash, UPI, cheque or bank payments. Accounts reviews settlement before a Tally receipt is created.',
    limitation:
      'The delivery tab records handover. It does not define the collection record that Accounts approves before the official receipt.',
    impact:
      'Field money can be known operationally before it exists as a Tally receipt. The blueprint treats that interval as a control point.',
    proposal: 'Capture the collection, reconcile settlement, obtain Accounts approval, and store the Tally receipt reference.',
    actorIds: ['ACT-04', 'ACT-02', 'EXT-01'],
    priority: 'medium',
    sourceReference: 'Accounts manual collections and receipts',
    validationStatus: 'identified-gap',
    links: [
      { moduleId: 'order-to-delivery', flowIds: ['DEL-08'] },
      {
        moduleId: 'accounts-tallyprime',
        flowIds: ['FIN-COL-01', 'FIN-COL-02', 'FIN-COL-03', 'FIN-COL-04'],
      },
    ],
  },
  {
    id: 'GAP-11',
    title: 'Centralized approvals and exceptions',
    moduleIds: ['admin-dashboard', 'order-to-delivery', 'damage-management', 'stock-receiving', 'daily-stock-verification', 'accounts-tallyprime'],
    currentWorkflow:
      'Approvals are specified inside order, damage, receiving, stock verification and accounts workbooks. Admin describes one queue for those exceptions.',
    limitation:
      'Each workbook has its own status. The shared queue, owner, priority and aging are specified only at the admin layer.',
    impact:
      'An open hold can sit in one workbook without appearing beside the others. No aging backlog is claimed.',
    proposal: 'Use one queue with owner, priority, status and age, linked back to the source record.',
    actorIds: ['ACT-07', 'ACT-06'],
    priority: 'foundation',
    sourceReference: 'Admin manual approvals and exceptions tab',
    validationStatus: 'identified-gap',
    links: [
      { moduleId: 'admin-dashboard', flowIds: ['ADM-APR-01', 'ADM-APR-02', 'ADM-APR-03'] },
      { moduleId: 'accounts-tallyprime', flowIds: ['FIN-ESC-01', 'FIN-ESC-02'] },
    ],
  },
  {
    id: 'GAP-12',
    title: 'Cross-module audit traceability',
    moduleIds: [
      'order-to-delivery',
      'damage-management',
      'stock-receiving',
      'daily-stock-verification',
      'admin-dashboard',
      'accounts-tallyprime',
    ],
    currentWorkflow:
      'Each manual defines its own reference: Order ID, Loading Note ID, Damage ID, Stock-In ID, adjustment reference and Tally voucher reference. Admin describes an audit log of who changed what, when and with what result.',
    limitation:
      'Those references are not yet one shared event history.',
    impact:
      'Tracing a case from source to resolution would depend on matching IDs across workbooks.',
    proposal: 'Record shared audit events with actor, reference IDs and a history timeline.',
    actorIds: ['ACT-07', 'SYS-01'],
    priority: 'foundation',
    sourceReference: 'Admin manual audit log; order continuity principle',
    validationStatus: 'identified-gap',
    links: [
      { moduleId: 'admin-dashboard', flowIds: ['ADM-AUD-01', 'ADM-AUD-02'] },
      { moduleId: 'order-to-delivery', flowIds: ['ORD-08', 'REC-05'] },
      { moduleId: 'daily-stock-verification', flowIds: ['DSV-ADJ-01'] },
    ],
  },
]
