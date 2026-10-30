# Firebase — Known Issues and Quirks

## Design consideration
- `getItems` and `updateManyItems` can read an entire collection when called without Firestore constraints. Callers should apply server-side constraints where possible to avoid unnecessary reads and costs.
- `npm audit` reports four high-severity findings in Firebase 12.19.0's Firestore/gRPC dependency tree. npm only proposes a breaking downgrade to Firebase 9.14.0; do not apply it without a separate Firebase SDK migration and compatibility review.
