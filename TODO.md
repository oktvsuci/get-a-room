# TODO
- [x] Locate all .ts/.tsx files under `src/` that call `useSearchParams()` from `next/navigation` (fallback grep via PowerShell; ripgrep not available).
- [x] Identify affected files:
  - [x] `src/app/(auth)/login/page.tsx`
  - [x] `src/components/booking/BookingWizard.tsx`
- [ ] For each affected file:
  - [ ] Extract the component that calls `useSearchParams()` into a separate inner component.
  - [ ] Wrap it in the default export (or exported component) with `<Suspense fallback={<div>Loading...</div>}>`.
  - [ ] Keep all existing logic, styling, and functionality identical.
- [ ] Apply changes to all affected files in one batch.
- [ ] Run typecheck/lint.

