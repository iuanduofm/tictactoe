# Continuous Research (Claude Code suite)

Adapted from the *Continuous Research Field Guide* (Edition 1.0). Coordination runs on Opus; gathering runs on Haiku; independent checks run on Sonnet. Workers return JSON, not prose, so the coordinator's context stays small.

## Layout

```
.claude/commands/research.md      coordinator protocol  (model: opus)
.claude/agents/research-scout.md  retrieval worker      (model: haiku)
.claude/agents/coverage-analyst.md coverage mapping     (model: haiku)
.claude/agents/research-verifier.md independent check   (model: sonnet)
research/brief.template.md        copy per project
research/projects/<name>/
    brief.md                      the filled-in brief
    ledger/sources.jsonl          append-only source records
    ledger/claims.jsonl           append-only claim records
    ledger/attempts.jsonl         every search, including failures
    ledger/queue.json             ordered queue, blocked retry conditions
    ledger/checkpoint.md          recoverable state, rewritten each run
    ledger/recovery/              additions when a master save fails
```

## Start a project

1. Copy `research/brief.template.md` to `research/projects/<name>/brief.md` and fill it in.
2. Run `claude --model opus`, then `/research research/projects/<name>/brief.md`.
3. Check the first run: one original retrieval with a precise locator, one independent verification, one verified save, and one runnable successor task. Only then treat the setup as operational.

## Defaults (used when the brief leaves a field blank)

- Public or already-authorised sources only. No spending, no external contact.
- Up to six workers at once.
- One writer: the coordinator.
- Verifier review for every decisive, conflicting or publishable claim.
- Owner update at the start of each run, then about every 15 minutes during a long session.

## Cost controls

- Scouts and the coverage analyst are Haiku. The verifier is Sonnet. Only the coordinator is Opus.
- Verifier use is limited to decisive, conflicting or publishable claims. Expect most claims to need none.
- Escalation to Opus happens only on a verifier `defer` for a conflict.
- Workers return bounded JSON with quotes capped at 40 words. Full pages are never pasted into the coordinator.
- Failed searches are logged once with their condition. Repeating one without a new condition is a defect, and the coverage analyst flags it.

## Things to decide before the first real run

- **Repository.** This suite sits in the tictactoe repo because that is where it was requested. Move `.claude/` and `research/` to a dedicated repo if you want research ledgers kept apart from the game.
- **Verifier independence.** The verifier is a separate agent, but it runs on the same model family as the coordinator's team. For high-stakes claims, the brief can require a verifier from a different source family, which the coordinator enforces through the lane rules.
- **Model IDs.** Agents use the aliases `haiku`, `sonnet` and `opus`, which resolve to the current Claude 5 family (claude-haiku-5-5, claude-sonnet-5-5, claude-opus-5-5). Pin exact IDs in the frontmatter if you need reproducible runs.
- **Schedule.** The guide's 15-minute cadence works only where the host can run recurring tasks. Verify the first scheduled run actually fires before relying on it.
