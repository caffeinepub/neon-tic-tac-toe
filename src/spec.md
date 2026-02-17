# Specification

## Summary
**Goal:** Make AI turns feel faster and smoother by adding an adjustable AI speed control, reducing AI compute time, and improving AI-turn status transitions.

**Planned changes:**
- Replace the fixed 500ms AI delay with a user-selectable “AI Speed” setting (speed steps) that controls the AI move delay.
- Ensure the fastest AI speed step makes moves appear near-instant while only showing “AI is thinking…” when the delay/computation is non-trivial.
- Optimize the existing MiniMax-based AI computation to reduce time spent per move (especially early game) while keeping the AI unbeatable and preserving the existing AI function API (returns an index or -1).
- Smooth AI-turn UX: reliably toggle AI-turn/player-turn states, keep the board unclickable during AI turns, and avoid single-frame flicker of “AI is thinking…” on fast mode.
- Verify no regressions to win/draw detection, reset behavior, sound effects, or leaderboard recording when changing AI speed.

**User-visible outcome:** Players can choose an AI Speed (e.g., Fast/Normal/Smooth) and experience quicker, smoother AI turns with consistent status text and no broken gameplay flow.
