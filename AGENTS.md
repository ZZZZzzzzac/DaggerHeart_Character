# AGENTS.md

## Runtime
- This repo is plain HTML/CSS/vanilla JS, not a Node workspace. There is no `package.json`, lint, typecheck, or automated test setup to run.
- Serve the repo over HTTP for real verification. Use `python -m http.server 8080` from the repo root, or run `server.bat` on Windows. Do not rely on `file://` because the app uses `fetch()` for skin discovery and skin metadata.

## Entry Points
- Main app: `index.html`.
- Separate second app: `nmxt/index.html`. It has its own JS/CSS and its own localStorage key; changes in the main app do not automatically apply there.

## Script / Data Wiring
- The main app is wired by script tags in `index.html`, not a bundler. Load order matters.
- `data/*.js` files define globals such as `DOMAIN_CARDS`, `MAIN_CLASS`, `SUB_CLASS`, `RACES_DATA`, `COMM_DATA`, `PRIMARY_WEAPON`, `SECONDARY_WEAPON`, `ARMOR`, `LOOT_DATA`, and `BEAST_FORM`.
- `js/data_table_modal.js` and related UI code consume those globals directly. If you rename a dataset variable or move a script tag, modal selection will break.

## Persistence Keys
- Main sheet autosaves to `localStorage['characterSheetData']`.
- Skin preview reads `localStorage['daggerheart_current_character']`.
- `nmxt/` uses `localStorage['nmxt_characterSheetData']`.
- Table filter state is also persisted in localStorage per modal `storageKey`, so stale filters can affect manual testing.

## Skins
- Skin selection in `js/action.js` reads `skin/folders.json` first and only falls back to directory listing if the server exposes it. In normal repo work, keep `skin/folders.json` current.
- After adding/removing a skin folder under `skin/`, run `python skin/gen_skins_manifest.py`.
- A skin must provide `skin/<name>/index.html` and usually `skin.json`; the host opens the skin in a new window after exporting current character data to `daggerheart_current_character`.
- Skin pages depend on `../skin_api.js`; optional resource controls come from `../resource_tracker.js`.

## Packaging
- Release zips are built with `python package_project.py`.
- The packaging script excludes `.git`, `memory-bank`, `build`, `__pycache__`, and the packager itself, and emits zip files into `build/`.

## Manual Verification
- Main app: load `http://localhost:8080`, verify import/export JSON, one or two table-modal selections, card creation/dragging, and skin launch if touched.
- Skin work: verify the skin appears in the selector and still opens from the main app, not just by opening the skin HTML directly.
- `nmxt/` work: verify through `http://localhost:8080/nmxt/` separately.
