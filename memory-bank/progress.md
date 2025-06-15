de# Progress

This file tracks the project's progress using a task list format.
2025-05-13 15:03:46 - Log of updates made.

*

## Completed Tasks

* [2025-06-15 22:49:00] - **[FEAT]** Implemented a generic tooltip feature that displays help text on hover for any element with a `data-tooltip` attribute. Added a 1-second delay based on user feedback.
* [2025-06-15 22:40:14] - **[FEAT]** Implemented the "Add Variant Card" feature. This allows users to upload a JSON card pack, select a specific 'variant' from a modal table, and generate it as a card on the character sheet.
* [2025-06-15 18:15:00] - **[FEAT]** Implemented the "Upload Custom Card Pack" feature. This includes adding a button to the UI, handling JSON file uploads, parsing the file, standardizing card data keys with a many-to-one mapping, and merging the new cards with the existing data sources.
* [2025-06-15 16:14:15] - **[FEAT]** 完成任务：创建了 `data_transformer.js` 脚本，该脚本成功将 `JOBS_DATA` 转换为 `CLASS_DATA` 和 `SUBCLASS_DATA`，为应用程序提供了标准化的职业和子职业数据结构。
* [2025-06-15 11:47:34] - **[FIX]** 彻底修复了打印功能。通过结合动态DOM操作（在`action.js`中创建`#print-wrapper`）和精确的CSS重置（在`style.css`中强制`position: static`），确保了角色卡和技能卡片能够按正确的顺序和分页进行打印。
* [2025-06-15 12:58:03] - 完成任务：修复了 JavaScript 引用错误、按钮显示问题以及数据表格模态框的功能（筛选和行选择）。涉及文件：`script.js`, `character_sheet_editor.html`, `data_table_modal.css`, `data_table_modal.js`。
* [2025-06-15 10:58:58] - 完成任务：为新的技能卡片功能添加了基础的HTML结构和CSS样式。修改了 `character_sheet_editor.html` 和 `style.css`。
* [2025-06-15 11:01:13] - 完成任务：为技能卡片编写了交互逻辑。在 `script.js` 中实现了卡片创建、内容处理（图片/JSON）、拖动、置顶和关闭功能。
* [2025-06-15 00:09:36] - 完成任务：为 `character_creator/js/data_table_modal.js` 添加了筛选、状态持久化和列宽同步功能。
* [2025-06-14 18:56:15] - 完成任务：将护甲、生命值和压力插槽放入各自的容器中，并使用Flexbox进行布局。在JavaScript中为生命值和压力插槽设置了默认状态。
* [2025-06-14 18:27:00] - 完成任务：根据反馈重构了复选框，移除了包装器 `div` 并将样式直接合并到 `label` 元素中。
* [2025-06-14 18:24:00] - 完成任务：将 `ArmorSlotCheckbox` 实现为具有三种状态的复选框，并创建了一个可重用的 `TriStateCheckbox` 基类用于未来的开发。
* [2025-06-14 18:07:14] - 完成任务：将 `sampleCheckbox` 重构为可复用的 `base-checkbox` 组件，并在 `character_sheet_editor.html` 中为多种统计数据创建了新的、模块化的 Checkbox 实例。
* [2025-06-14 13:48:36] - 完成任务：修改 [`style.css`](style.css:1) 以固定角色卡图片的宽度，防止其随浏览器窗口缩放。
* [2025-06-14 13:04:02] - 完成任务：在 `script.js` 中添加了事件监听器，以禁用用户通过 Ctrl+滚轮 或 Ctrl+/- 缩放网页的功能。
* [2025-06-14 12:08:56] - 完成任务：修改 [`style.css`](style.css:1) 和 [`character_sheet_editor.html`](character_sheet_editor.html:1) 以调整角色卡图片（适配视口高度，从左上角开始）和调试按钮（固定在右上角）的布局。
* [2025-06-14 11:45:00] - Completed debugging: `sampleTextbox` not appearing in `character_sheet_editor.html`. Fixed by correcting CSS specificity for the debug border in `style.css`.
* [2025-06-14 11:39:45] - 完成任务：在 `character_sheet_editor.html`, `style.css`, 和 `script.js` 中实现自定义Checkbox组件及其调试功能。
* [2025-06-14 11:33:01] - 完成任务：在 `character_sheet_editor.html` 中实现可交互文本输入框组件，包括创建 `style.css` 和 `script.js`，添加HTML元素，CSS样式和JavaScript调试功能。
* [2025-06-13 16:01:00] - 完成任务：将领域卡数据源替换为 `character_creator/data/Daggerheart_Core_Rulebook_领域卡.js`，并更新了 [`character_creator/js/domain_card.js`](character_creator/js/domain_card.js) 的逻辑以处理扁平化数据结构。
* [2025-06-13 15:52:00] - 完成任务：将职业数据源替换为 `character_creator/data/Daggerheart_Core_Rulebook_职业.js` (定义 `JOBS_DATA`)，并更新了 [`character_creator/js/race_job_community.js`](character_creator/js/race_job_community.js) 和 [`character_creator/data/template.js`](character_creator/data/template.js) 中的字段引用及相关逻辑。
* [2025-06-13 15:44:03] - 完成任务：将装备数据源替换为 `Daggerheart_Core_Rulebook_主武器表.js`, `_副武器表.js`, `_护甲表.js`。更新了 [`character_creator/index.html`](character_creator/index.html) 的脚本引用和 [`character_creator/js/weapon_armor_item.js`](character_creator/js/weapon_armor_item.js) 的逻辑与字段引用。
* [2025-06-13 15:43:22] - 完成任务：将社群数据源替换为 `character_creator/data/Daggerheart_Core_Rulebook_社群.js` (定义 `GROUPS_DATA`，使用其 `COMM_DATA` 结构)，并更新了 [`character_creator/js/race_job_community.js`](character_creator/js/race_job_community.js) 和 [`character_creator/data/template.js`](character_creator/data/template.js) 中的字段引用。
* [2025-06-13 15:28:11] - 完成任务：将种族数据源替换为 `character_creator/data/Daggerheart_Core_Rulebook_种族.js` (定义 `RACES_DATA`)，并更新了 [`character_creator/js/race_job_community.js`](character_creator/js/race_job_community.js) 和 [`character_creator/data/template.js`](character_creator/data/template.js) 中的字段引用。
* [2025-06-13 15:23:13] - 完成任务：将 `ALL_ITEMS_DATA` 相关逻辑改用 `character_creator/data/Daggerheart_Core_Rulebook_战利品与消耗品表.js` 的 `LOOT` 数据。影响文件：[`character_creator/js/utility.js`](character_creator/js/utility.js), [`character_creator/js/json.js`](character_creator/js/json.js)。
* [2025-05-18 14:54:10] - 完成任务：将 [`character_creator/script.js`](character_creator/script.js) 中的 "Weapon & Armor & Item" 功能模块提取到新的 [`character_creator/script_weapon_armor_item.js`](character_creator/script_weapon_armor_item.js) 文件中，并更新了 [`character_creator/script.js`](character_creator/script.js) 和 [`character_creator/index.html`](character_creator/index.html) 以集成此新模块。
* ... (previous entries remain) ...
* [2025-05-13 15:34:00] - 完成了 character_creator 网页应用的创建，包括 index.html, style.css, 和 script.js。


## Current Tasks

*

## Completed Tasks

* [2025-06-14 22:06:00] - 完成任务：添加了浮动操作栏，实现了JSON导入/导出功能，并添加了将角色卡打印为两页PDF的功能。

## Next Steps

*
* [2025-05-16 17:54:49] - 完成任务：将用户提供的“奥术”领域卡片文本转换为 JSON 对象并更新到 `character_creator/data/domain_card.js` 文件。
* ... (previous entries remain) ...
* [2025-06-14 16:39:10] - Completed task: Refactored `character_sheet_editor.html` and `style.css` to remove `control-container` divs and merge styles, simplifying the DOM and CSS.