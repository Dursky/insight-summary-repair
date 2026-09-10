# AI work log

AI wrote the first end-to-end draft from the two-line `summarize` in the
brief: the file split (`types` / `label` / `summarize` / `index`), the
dedupe + threshold + blank-label logic, and the initial three Vitest
cases.

Reviewing that draft, I caught two real bugs before trusting it. A
duplicate item with `confidence: undefined` was overwriting an
already-known confidence with `null` instead of leaving it alone —
which would have thrown away a good score just because a later
duplicate happened to omit it. And the threshold check was comparing
unknown confidence against `minConfidence` as if it were `0`, so every
unscored insight would have been silently dropped instead of passed
through. Both are now covered by tests, not just fixed in place. I also
settled the merge tie-break myself — highest reported confidence wins
on a duplicate, never averaged or overwritten by a later unscored
copy — and checked that this matched what I'd written in the
assumptions section, rather than leaving it as an implicit side effect
of the draft.

To know it actually works, I didn't just run `npm test` and
`npx tsc --noEmit` — I replayed each test's input through the
_original_ `summarize` from the brief to confirm the old function
really did have the bug the new test is asserting against, not only
that my rewrite passes its own assertions.
