# Subscription display scripts

Five standalone filters for Shadowrocket's subscription **Script** field.
Paste the whole chosen file. Each embeds its shared logic and needs no local
files, Node.js, external service, credentials, or subscription URL.

| File | View |
| --- | --- |
| [home.js](home.js) | ⚡ Дом; ordinary US/Turkey excluded. |
| [home-us-turkey.js](home-us-turkey.js) | ⚡ Дом; ordinary US/Turkey allowed. |
| [mixed.js](mixed.js) | ✅ Улица + Дом; ordinary Home US/Turkey excluded. |
| [mixed-us-turkey.js](mixed-us-turkey.js) | ✅ Улица + Дом; ordinary Home US/Turkey allowed. |
| [street-reserve.js](street-reserve.js) | 🔑 Улица; all healthy countries retained. |

## Naming and filtering

Names use `flag marker Дом/Улица [country] city/note/ordinal`. The accepted
Russian country abbreviations are fixed in `naming.js` and shared by all
views. A flag takes precedence over country spelling; recognized names are
a fallback when the flag is missing. Unknown countries stay visible. For an
unlisted flag, `Intl.DisplayNames` supplies the Russian name shortened to five
characters; without that API the country code remains visible. City spelling
is preserved. Known material aliases and provider ordinals are removed;
unfamiliar meaningful notes stay visible.

Home views use one leading lightning normally, two for a provider lightning,
and three for Hysteria. Hysteria names and versions disappear. The returned
Home list is ordered `⚡⚡⚡`, `⚡⚡`, `⚡`, preserving provider order for ties.
Mixed/key views have exactly one trailing lightning for a provider lightning
or Hysteria, including when both occur. Other protocol names are omitted
there when redundant. For a Home node in an excluded country, a title-only
protocol label is kept if metadata is missing, so repeat processing cannot
erase its country exception.

Russia, Belarus, and Japan are unconditional **Home** exclusions. Provider
lightning, nonordinary protocol/transport metadata, explicit protocols and
useful annotations override the other ordinary exclusions. Norway, Hungary,
Slovakia, and Romania are allowed. The paired variants differ only in the
ordinary US/Turkey Home rule. Unlisted countries remain visible.

In the mixed view, a positive `whitelist` cue in the original title identifies
Street. Explicit `Улица`/`Street` also identifies Street; negated cues such as
`no-whitelist` do not. Other nodes remain
Home under the existing provider contract. Healthy Street nodes bypass all
country exclusions, including Russia, Belarus, and Japan. Country and
protocol cannot recover a Street role if a provider removes every role cue.

Every view hides explicit outages/maintenance before country exceptions:
`не работает`, `техработы`, `технические работы`, `offline`, etc. Bare work
labels, `для работы`, and completed maintenance remain visible. Torrent is
retained as `Торрент`; it does not by itself override a country exclusion.

Full rendered names determine collisions within a subscription. The first
has no ordinal; identical names get `2`, `3`, etc., before a trailing lightning.
Literal existing suffixes are reserved to prevent generated-name collisions.
Fresh provider snapshots recalculate ordinals; these numbers are not
permanent node identities. No field other than a retained node's title changes.

## Group and scene filters

The new key view uses `🔑 Улица [country]`, replacing the old
`Улица [резерв]` contract. Migrate filters that depended on `[резерв]` when
installing. Configs/groups/scenes are not changed by a source commit.

| Candidate pool | Positive name regex |
| --- | --- |
| All Home Netherlands | `Дом \[Нидер\]` |
| Lightning Home Netherlands | `⚡{1,3} Дом \[Нидер\]` |
| Mixed Home Netherlands | `✅ Дом \[Нидер\]` |
| All Street Germany | `Улица \[Герм\]` |
| Key Street Germany | `🔑 Улица \[Герм\]` |

## Source and verification

Edit `naming.js` and the five view settings in `build.cjs`, then regenerate:

```sh
node scripts/subscriptions/build.cjs
node scripts/subscriptions/build.cjs --check
node scripts/subscriptions/test.cjs
node scripts/subscriptions/test.cjs --native
```

`--native` requires macOS and the installed Shadowrocket executable. It
extracts the actual filter wrapper and runs synthetic cases in JavaScriptCore;
`SHADOWROCKET_EXECUTABLE` can select another installed binary. The ordinary
check uses an equivalent wrapper in Node's VM. Both check retention, ordering,
markers, country normalization, unique names, unchanged connection fields,
and repeated processing. No private subscription data is read by these checks.

The generated files deliberately close the native per-node body, assign the
whole-list `$js_filter_servers` entry, and leave a tail for the native wrapper
to close. This is necessary for full-list sorting and collision reservation.
They are filter-field fragments, not standalone Node scripts; `node --check`
on a generated output is not the right validator. The integration is an
internal ABI verified on Shadowrocket 2.2.92 (3445) on 2026-10-05, not a public
cross-version promise. Run the native check again when the app's wrapper
changes. An app's explicit ping/manual UI sort can override returned order.

These checks exercise the engine and installed wrapper outside the app.
They do not install filters or prove live connectivity, speed, or behavior
on an untested device/version.

## Install and rollback

Save the existing subscription script, paste one whole generated file into
the matching subscription's Script field, and refresh **from the provider**.
A fresh list is needed to recover original role/alias/protocol information
already erased by older scripts and to recalculate current collision ordinals.
Check the visible nodes and group/scene membership. To roll back, restore the
previous script and refresh again. The five files can be copied to other
devices with the matching Shadowrocket script interface.
