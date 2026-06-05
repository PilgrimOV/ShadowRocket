# AGENTS.md

Rules for agents working with this Shadowrocket config repository.

## Scope

This repository stores live user-managed Shadowrocket configs and rule lists.
Do not create parallel editable copies in other repositories. If another repo
needs access, use links or documented paths back to this repository.

Active layout:

- `configs/Doma_Wi-Fi.conf`
- `configs/Ne_doma_Whitelist.conf`
- `configs/Work.conf`
- `lists/Banking_direct.list`
- `lists/Custom_direct.list`
- `lists/Custom_proxy.list`
- `lists/Gemini_domains.list`
- `lists/Gemini_ip.list`

Archive layout:

- `configs_old/` contains historical profiles and is not part of the active
  edit surface unless the user explicitly asks to change it.

## Hard Edit Rules

- Do not change `.conf` or `.list` files unless the user directly asks for edits.
- Change only the exact files, rules, domains, IPs, sections, or behavior named
  by the user.
- Do not silently improve, reorder, normalize, deduplicate, rename, or move
  unrelated rules while doing another task.
- If the user asks to check for errors, obvious syntax errors, typos, malformed
  duplicates, and broken references may be fixed by default.
- Logical or functional changes require approval first: routing behavior,
  direct/proxy policy, domain/IP additions or removals, DNS settings, proxy
  groups, resource URLs, subscription behavior, and rule ordering that affects
  matching.
- If an agent notices a useful out-of-scope change, it must propose the change
  and wait for approval instead of applying it silently.

## Reporting

After every edit, report:

- exact files changed;
- exact kind of change made;
- whether the change was syntax/typo cleanup or a functional routing change;
- verification performed, if any.

## Privacy

Treat configs and rule lists as private. Do not print proxy hosts, node names,
subscription URLs, local IPs, UUIDs, credentials, or raw large config sections in
responses unless the user explicitly asks for them.

## Verification

Before claiming a config/list is ready, read the edited file again and run the
narrowest relevant check available. If Shadowrocket UI or runtime verification is
needed, say that clearly instead of guessing.
