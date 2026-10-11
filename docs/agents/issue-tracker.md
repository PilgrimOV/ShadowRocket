# Issue tracker: local Markdown

Use local Markdown under `.scratch/` for project specs, implementation tickets, and Wayfinder exploration. Keep durable project facts with their existing code, documentation, and configuration owners.

## Layout and regular tickets

- One effort lives in `.scratch/<feature-slug>/`; its spec is `spec.md`.
- Keep implementation tickets as separate files in `issues/`, numbered from `01` and named `NN-<slug>.md`.
- A new ticket records acceptance criteria, `Status: open`, and any blocking ticket numbers or paths.
- Start implementation by setting `Status: in-progress`. After checking the acceptance criteria, record the result and verification evidence, then set `Status: closed`.
- Append ticket discussion under `## Comments`.
- Fetch a ticket by its supplied path. Resolve a bare number inside the selected effort; ask only if it is ambiguous.
- When a skill asks to publish work to the tracker, create or update the corresponding file under `.scratch/`.

## Wayfinder maps

- Store the map at `.scratch/<effort>/map.md` and one child ticket per question in `.scratch/<effort>/issues/NN-<slug>.md`.
- Keep `## Notes`, `## Decisions-so-far`, and `## Fog` sections in the map; add `## Out-of-scope` when an exclusion needs recording.
- Put the question in each child body. Add `Type: research|prototype|grilling|task`, `Status: open|claimed|resolved`, and, when needed, `Blocked by: NN, NN` near the top. Blocker numbers refer to child tickets in the same effort.
- The frontier is the open, unclaimed child tickets whose blockers are all resolved; scan in number order and take the first eligible ticket.
- Claim a child before work by setting `Status: claimed` and saving the file.
- Resolve it by adding the answer under `## Answer`, setting `Status: resolved`, and adding a short linked gist to the map's `Decisions-so-far`.
- For an out-of-scope child, set `Status: resolved` with the exclusion reason and link it from the map's `Out-of-scope`, not `Decisions-so-far`.
