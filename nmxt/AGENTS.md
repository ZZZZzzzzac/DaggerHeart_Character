# AGENTS.md

## Scope
- This file is only for `nmxt/`. The root app under `/index.html` is a different character sheet and should not be used as a behavior reference except for focused patterns like print handling.

## Runtime
- `nmxt/` is still plain HTML/CSS/vanilla JS. Serve the repo over HTTP from the repo root and open `http://localhost:8080/nmxt/`.
- `nmxt` persists to `localStorage['nmxt_characterSheetData']`.

## Source Of Truth
- The current `nmxt` data tables were extracted from the workbook `nmxt/逆命仙途半自动卡V0.4（可打印A4) - 增加可选神通1.1 - 副本 (2).xlsx`.
- `nmxt/workbook_dump.txt` is a repo-local full text dump of workbook contents and formulas. Use it before guessing table data or wiring.
- If workbook data and hand-written notes conflict, prefer workbook data unless the repo already contains a deliberate correction.

## UI Wiring
- Selection UI uses small inline `div.picker-btn` buttons labeled `选`. They must stay separate from the textareas so users can both open table selection and hand-edit custom values.
- Do not switch back to full-field overlay buttons; they block manual editing and are easy to hide behind textareas.
- `nf-name` is for short labels / names / numeric summary fields. `nf-desc` is for long effect text. Keep new textareas classified into one of those two classes so future font tuning stays centralized.

## Text Alignment
- Vertical centering for `nmxt` textareas is handled in `nmxt/js/nmxt_script.js` by `_setupFieldAlignment()`, `_realignAllFields()`, and `_alignFieldText()`.
- This uses off-screen measurement; do not replace it with CSS-only textarea centering. Pure CSS attempts were not reliable here.
- If text looks slightly high or low, adjust the JS alignment logic rather than scattering per-field CSS hacks.

## Data / Autofill Decisions
- `道源`, `出身`, `境界`, `法门`, `大道`, `功法`, `天赋/天谴`, `因果值`, and `道源资源速查` are wired from extracted workbook tables in `nmxt/js/nmxt_data.js`.
- `通动1` is intentionally fixed as the normal attack slot. Initial `道源` resource fill goes to `行神1` and `秘法1`, not `通动1`.
- `天赋` names are stored/displayed as `名称（等级类型）`, for example `身体强壮（凡天赋）`.
- `因果值` still fills its description text, but the earlier attempt to enforce `天赋` restrictions was removed on purpose. Do not reintroduce hard gating unless the UX is redesigned; it made replacing existing selections frustrating.

## Placeholders And Incomplete Data
- `NMXT_FABAO`, `NMXT_XINGDONG_SHENTONG`, and `NMXT_MIFA` still contain explicit placeholder rows where workbook extraction was incomplete or absent.
- Keep placeholder rows obvious with `（待填充）` / `（暂无数据）` instead of inventing data.
- If more workbook content is migrated later, replace placeholders in `nmxt/js/nmxt_data.js` rather than adding a second source.

## Checkbox Behavior
- `nmxt` checkboxes use `TriStateCheckbox.js` with states `0` empty, `1` checked, `2` dashed.
- `nmxtClear()` restores each checkbox to its recorded default state from `data-default-state`, not always to `0`. Preserve this behavior when adding new checkboxes.
- If a checkbox should default to dashed or checked after clear, set its initial `data-state` in HTML before initialization.
- All spirit-stone checkboxes were intentionally unified to `cb-sq`; do not reintroduce size-specific classes for them without a concrete layout reason.

## Checkbox Styling Hooks
- Checkbox visuals are centralized in `nmxt/css/checkbox.css`.
- To adjust checkbox size: edit `.cb-sq` or `.cb-circ`.
- To adjust spacing inside a row: edit `.cb-row { gap: ... }`.
- To move or resize one specific group: edit that group's inline `style` on the corresponding `.cb-row` in `nmxt/index.html`.
- Future icon / emoji rendering is intentionally left open via `--nmxt-cb-empty`, `--nmxt-cb-checked`, and `--nmxt-cb-dashed`, plus `.nmxt-cb::before`. Prefer extending that hook instead of rewriting checkbox markup.

## Print
- `nmxt` print handling lives in `nmxt/css/sheet.css` and `nmxt/js/nmxt_action.js`.
- Printing should use the current width control value; do not silently force a different design width.
- `picker-btn` elements must stay hidden during print. There is both print CSS and a JS pre-print hide step because CSS-only hiding was not reliable enough in practice.
- A blank trailing page previously came from unconditional `page-break-after: always`; keep the `last-child` exception.
- Browser page headers/footers still depend on the print dialog; CSS can only request zero margins.

## Release State
- `nmxt` is now close to a first publishable version. Prefer conservative, minimal fixes over structural rewrites.
- Debug and width controls are intentionally hidden in the shipped UI, but the underlying code remains for future maintenance.
