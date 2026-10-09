import type { LifecycleStep } from '../types/blueprint'

export const company = {
  legalSourceName: 'Sherlys Distributors and Agents',
  publicName: 'Sherlys Distribution & Agents',
  productName: 'Sherlys Business OS',
  blueprintName: 'Business Operations & Automation Blueprint',
  heroTitle: 'How Sherlys Business OS Will Connect Every Operation',
  heroSubtitle:
    'An integrated operational blueprint covering sales, inventory, warehouse management, delivery, accounts and management controls.',
  label: 'Business Process & Automation Blueprint',
  context:
    'Sherlys Distribution & Agents needs one operating system for supplier receiving, warehouse stock handling, customer orders, billing, deliveries and financial controls. The six modules share customer, product, warehouse and transaction records. They are presented here as one blueprint, not as six separate applications.',
  notice:
    'This website is the blueprint presentation. It is not connected to a live warehouse or accounting system. TallyPrime remains the official accounting and inventory book in the proposed design.',
}

export const facts = [
  { value: '6', label: 'Integrated modules', detail: 'One shared operational blueprint' },
  { value: '4', label: 'Core operational pipelines', detail: 'Order, damage, receiving, verification' },
  { value: '7', label: 'Godown locations', detail: 'Six operational godowns and one Surplus Godown' },
  { value: '1', label: 'Unified Business OS', detail: 'Shared customer, product and stock records' },
]

export const improvements = [
  'Better stock visibility across godowns',
  'Less repeated entry of the same order and stock facts',
  'A traceable status for each customer order',
  'Credit decisions supported by a timestamped financial reference',
  'Warehouse movements held to documented controls',
  'Faster identification of open exceptions',
  'Clearer delivery reconciliation',
  'One queue for approvals that start in different modules',
  'A reliable link between operational records and official accounting documents',
]

export const lifecycle: LifecycleStep[] = [
  {
    id: 'purchase',
    title: 'Supplier purchasing / Tally PO',
    summary: 'Accounts reviews a reorder suggestion, chooses a supplier and records a Tally purchase order.',
    moduleIds: ['accounts-tallyprime'],
    lane: 'primary',
  },
  {
    id: 'receiving',
    title: 'Stock receiving',
    summary: 'The Store Keeper records the lorry, expected quantity, received quantity and godown allocation.',
    moduleIds: ['stock-receiving'],
    lane: 'primary',
  },
  {
    id: 'damage-separation',
    title: 'Damage separation',
    summary: 'Damaged cases are linked to a damage record and are excluded from accepted stock.',
    moduleIds: ['damage-management', 'stock-receiving'],
    lane: 'primary',
  },
  {
    id: 'posting',
    title: 'Verified stock posting',
    summary: 'Only verified, fully allocated accepted cases become available inventory.',
    moduleIds: ['stock-receiving'],
    lane: 'primary',
  },
  {
    id: 'available',
    title: 'Available inventory',
    summary: 'Admin can see usable, reserved and damage-hold quantities by godown and SKU.',
    moduleIds: ['admin-dashboard'],
    lane: 'primary',
  },
  {
    id: 'order',
    title: 'Customer order',
    summary: 'The Salesman selects a customer, delivery date and ordered cases. The Order ID stays with the transaction.',
    moduleIds: ['order-to-delivery'],
    lane: 'primary',
  },
  {
    id: 'credit',
    title: 'Accounts credit approval',
    summary: 'Accounts reviews outstanding, overdue and projected exposure, then approves, holds or rejects.',
    moduleIds: ['order-to-delivery', 'accounts-tallyprime'],
    lane: 'primary',
  },
  {
    id: 'loading',
    title: 'Stock reservation and loading',
    summary: 'The Store Keeper allocates godown, zone and crate, then confirms the vehicle.',
    moduleIds: ['order-to-delivery'],
    lane: 'primary',
  },
  {
    id: 'note',
    title: 'Invoice note',
    summary: 'Loaded cases are confirmed. Billable quantity follows what was loaded.',
    moduleIds: ['order-to-delivery'],
    lane: 'primary',
  },
  {
    id: 'billing-approval',
    title: 'Accounts billing approval',
    summary: 'Accounts reviews the billing data prepared from the invoice note.',
    moduleIds: ['order-to-delivery', 'accounts-tallyprime'],
    lane: 'primary',
  },
  {
    id: 'tally-invoice',
    title: 'TallyPrime invoice',
    summary: 'Tally generates the official invoice number. The web app stores that reference.',
    moduleIds: ['accounts-tallyprime'],
    lane: 'primary',
  },
  {
    id: 'delivery',
    title: 'Delivery confirmation',
    summary: 'The Delivery Representative records delivered, returned and short cases with proof.',
    moduleIds: ['order-to-delivery'],
    lane: 'primary',
  },
  {
    id: 'reconcile',
    title: 'Returns, collections and reconciliation',
    summary: 'Exceptions, field collections and quantity differences are resolved before the order is closed.',
    moduleIds: ['order-to-delivery', 'damage-management', 'accounts-tallyprime'],
    lane: 'primary',
  },
  {
    id: 'verification',
    title: 'Daily stock verification',
    summary: 'Physical crate counts are compared with system cases. Corrections require recount and approval.',
    moduleIds: ['daily-stock-verification'],
    lane: 'cross-cutting',
  },
  {
    id: 'admin',
    title: 'Admin monitoring',
    summary: 'Management reviews inventory, field activity, the approval queue, reports and the audit trail.',
    moduleIds: ['admin-dashboard'],
    lane: 'cross-cutting',
  },
]
