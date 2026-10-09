# Documented business rules

These statements are taken from the source manuals. Prototype defaults that the manuals say must be confirmed are listed in `pending-decisions.md`.

## Order to Delivery

- The same order sequence is one customer order. The same SKU is not repeated on that order.
- Credit position is guidance. Accounts records the decision.
- One SKU per crate. The milk prototype allows 50 cases per crate. An order may use more than one godown.
- Billable cases equal loaded cases.
- The original ordered quantity is not overwritten when a later quantity is short.
- Short cases = billed − delivered − returned.
- Excel prepares billing data. It does not issue the official invoice number.

## Damage

- Status is Open, Verified, or Closed.
- Stock deduction is ready only when status is Verified or Closed.
- Actions are Supplier Return, Hold, Write-off, Repacking, Inspection, or Other.
- Warehouse remaining cases are reduced only after verification or closure.

## Receiving

- Accepted cases = received − damaged.
- Expected, received, and damaged quantities are entered only on allocation sequence 1.
- Allocation balance must reach zero.
- Posting requires Verified status, full allocation, and allocated cases above zero.
- Pending, Hold, and Rejected receipts do not post.
- Surplus Godown follows the same allocation and verification rules.

## Daily verification

- The Store Keeper does not overwrite system cases.
- Variance = physical cases − system cases.
- A non-zero variance requires a recount.
- Correction is ready only when the adjustment is required, the supervisor has approved, the status is Adjustment Approved, and the reference and date are present.

## Accounts

- TallyPrime 7.0 remains the official accounting and inventory book.
- Available credit = credit limit − Tally outstanding.
- Projected exposure = Tally outstanding + current order value.
- Overdue age is reviewed even when the value is within limit.
- The web application uses internal IDs. Tally owns official invoice and purchase-order numbers.
- The Tally HTTP port is not exposed to the public internet.
- Reorder uses the documented rule. The sample day counts and MOQ are not confirmed policy.

## Admin

- Admin consolidates the pipelines and does not replace them.
- Location data is sensitive. Continuous tracking, if added later, is limited to working hours and authorized roles.
