# TODO

- [ ] Inspect current `Header.tsx` layout and Tailwind classes (done).
- [ ] Create an edit plan for refactoring Tailwind classes to keep nav horizontal on mobile (pending approval).
- [ ] Refactor `Header.tsx`:
  - [ ] Update `<header>` classes to `w-full flex flex-row items-center justify-between px-2 md:px-6 py-3` (and keep sticky/border/shadow styling).
  - [ ] Update nav links container to `flex flex-row items-center gap-1.5 md:gap-6 text-[10px] sm:text-xs md:text-base whitespace-nowrap`.
  - [ ] Update Booking button to `px-2 py-1 md:px-4 md:py-2 text-[10px] sm:text-xs md:text-sm rounded` with existing colors.
  - [ ] Ensure logo/text left scales down slightly on mobile without causing overflow.
- [ ] Run `next lint` (or build) to ensure no TypeScript/ESLint errors.
- [ ] Provide a summary of changes.

