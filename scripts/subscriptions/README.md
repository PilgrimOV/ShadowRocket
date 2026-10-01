# Subscription display scripts

Canonical, credential-free source lives here on this repository's `main`
branch. Do not use the earlier ignored MacBookHelper scratch copies as source.

| File | Purpose |
| --- | --- |
| `home.js` | Home view with country exclusions and provider-marker/protocol exceptions. |
| `home-us-turkey.js` | Same home view, additionally allowing ordinary US and Turkey nodes. |
| `street-reserve.js` | Rename every reserve node; never hide a node. |
| `test.cjs` | Deterministic synthetic behavior and repeat-run checks. |

## Home views

Both home scripts always exclude Russia before any lightning or protocol
exception. Work/torrent titles are also excluded. The other exclusions are
flag-based; unknown countries and unflagged titles remain visible. Norway,
Hungary, Slovakia, and Romania are allowed. Liechtenstein is excluded for
ordinary nodes. Provider lightning, special protocol evidence, and nonempty
annotations can override country exclusions except Russia. This deliberately
favors keeping a potential new protocol over rejecting every unwanted label.

Ordinary titles use `⚡Дом [name]`, provider-marked titles `⚡⚡Дом [name]`,
and Hysteria titles `⚡⚡⚡Дом [name]` with the Hysteria label removed.
The country flag precedes the view name. These two files preserve the approved
home behavior; their only difference is the US/Turkey flag exclusion.

## Reserve view

The compact layout is `flag [provider lightning] distinctive name [protocol]
🔑 Улица [резерв]`. For example, synthetic inputs become:

```text
🇩🇪 ⚡ Alpha 🔑 Улица [резерв]
🇳🇱 Beta · HY2 🔑 Улица [резерв]
🇳🇱 Gamma · XHTTP 🔑 Улица [резерв]
```

The exact substring `Улица [резерв]` is a group/scene naming contract. Keep
its spelling, case, and brackets. The distinctive provider name comes first
to remain visible on a small screen. A regex matching the literal substring
is `Улица \[резерв\]`. Existing filters anchored to the old prefix must be
adjusted deliberately before adopting this layout; substring matches remain
applicable.

Unlike the home views, this script retains **every** node, including Russia,
torrent/work titles, unflagged titles, and unknown countries or protocols.
It removes the provider's leading `Обход`, preserves aliases instead of
mapping them to numbers, and recognizes `[alias] - country` formatting with
hyphens or en/em dashes. Only redundant Polish, German, Dutch, or Russian
country names matching the flag are removed from that structured suffix.
Unknown countries and suffix text remain visible rather than being guessed
away. Provider `^~number~^` markers become `#number`; ordinary names, hyphens,
version numbers, and new annotations remain intact.

Hysteria labels become `HY` plus their version. Optional string-valued
`$server.type` and `$server.obfs` supply protocol/transport labels, including
`HY2` and `XHTTP`, without repeating an existing label. These fields were
observed in local cached records; their availability inside Shadowrocket's
live script runtime has not been verified. If missing, title-based information
is retained, but an unlabeled protocol cannot be inferred. Do not hardcode
provider aliases as protocol identifiers.

## Check and install

Run from this repository:

```sh
node scripts/subscriptions/test.cjs
```

Fixtures are synthetic and contain no endpoints or credentials. On
2026-10-01, the reserve candidate was also evaluated outside Shadowrocket
against all 13 fresh provider titles/protocols: every node was retained, all
resulting names were unique, and repeated evaluation preserved the names.
Private inventory evidence belongs outside Git. This is not a live-app
installation or a connectivity/speed test.

To install after choosing a script, save the existing subscription script,
paste the entire chosen file into that subscription's script field, and
refresh from the provider. Refresh is needed to recover original names that
the previous script reduced to numeric aliases. Check group/scene membership
and protocol labels in the app. Revert by restoring the previous script and
refreshing again. Source commits do not change the live subscription.
