# Hearth — household budget site

A working, offline household budget for a family of four. Overview, envelope
table, cash-flow chart, transaction ledger, bills register, savings goals and a
short how-it-works page — all reached by links, with real figures and controls
that actually change the numbers.

## Run it

    node serve.ts

Open http://localhost:8080. Everything lives under `app/`; no build, no install
and no network request at runtime. Entries you add are kept in this browser's
local storage.

## Hand it in

    mkdir -p out
    MAKEFUN_OUTPUT_DIR=out node main.ts

`main.ts` copies `app/` and `screenshots/` into the output directory and writes
`dossier.json` with make.fun's library. It is deterministic: two runs produce
the same bytes.

MIT licensed — see LICENSE.
