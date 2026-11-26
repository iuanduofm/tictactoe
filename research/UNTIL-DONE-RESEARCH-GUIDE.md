# Research Guide: source-verified, multi-wave research

A reusable procedure for researching a person, event or topic with an evidence ledger, verification and an honest coverage statement. Written from the Anita Porchet study (`research/anita-porchet/`).

## When to use it
Any research request that needs claims traced to sources, with disputes shown rather than averaged away.

## Procedure

1. **Define scope.** Write one sentence: subject, time cutoff, what counts (biography, career, awards, etc.). Note the target (default 80% coverage; state it).
2. **Wave 1 — discover.** Run 2–3 web searches in parallel. Treat results as leads, not facts. List the candidate URLs.
3. **Wave 1 — open.** Open each lead with a web-fetch agent. Ask for verbatim sentences with dates, under 125 characters each. Record whether the page loaded fully. Paywalled, 403, 404 or 503 results are recorded as blocked, not skipped silently.
4. **Wave 2 — resolve conflicts.** For each disputed fact, open the sources that disagree and the sources they cite. Prefer primary records (official prize lists, brand press pages, archives) over secondary media.
5. **Wave 3 — cover the gaps.** Open the cited references you have not read yet. Check untouched source families (official records, trade press, interviews, archives, scholarly work, podcasts/video if relevant).
6. **Ledger.** One record per claim: `id`, `claim`, `source` (URL), `tier` (primary/secondary/opinion), `verified_by`, `status` (confirmed, single-source, disputed, blocked). Keep disputes in their own list with both positions and a resolution.
7. **Verify.** A second, separate pass checks each key claim against a different source. Single-source claims stay labelled as such.
8. **Report.** Timeline with confidence per row, a disputed-points section, a not-established section, and a method note. Cite every factual sentence.
9. **Coverage statement.** Without two independent blind researchers you cannot compute a capture-recapture bound. Say so and report the source families covered versus open.

## Rules
- Quote, don't paraphrase, when the wording matters (dates, prize names, awards).
- Never resolve a date conflict by picking the more convenient source; record the conflict.
- Keep opinion ("best-known enamellist") separate from fact.
- Stop only when either the target is met on a stated basis or every reachable source is exhausted. Report blocked sources.

## Files produced
- `ledger.json`: claims, disputes, blocked URLs, source-family status, limitations.
- `REPORT.md`: the write-up.

## Limits to state
- Single-researcher runs cannot certify the 80% target.
- Fetch agents can be blocked by sites (paywalls, 403/404/503, refusals); record that rather than retrying indefinitely.
- Media sources can repeat each other; count independent origins, not outlets.
