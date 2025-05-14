# Active Context

This file tracks the project's current status, including recent changes, current goals, and open questions.
2025-05-13 15:03:39 - Log of updates made.

*

## Current Focus

*   

## Recent Changes

*   

## Open Questions/Issues

*
* [2025-05-13 15:34:10] - 创建了 character_creator 应用 (HTML, CSS, JS) 以根据 character_template.json 生成角色表单并支持JSON导出。
* [2025-05-13 15:43:45] - 根据用户反馈调整了 character_creator 表单布局，使其更加紧凑 (修改了 index.html 和 style.css)。
* [2025-05-13 15:47:21] - 根据用户反馈进一步调整了 character_creator 表单中“状态”部分的布局，采用“当前/最大”格式显示 (修改了 index.html 和 style.css)。
* [2025-05-13 15:50:09] - 根据用户反馈调整了 character_creator 表单中“经历”部分的布局，使其更加紧凑 (修改了 style.css)。
* [2025-05-13 15:52:19] - 根据用户反馈调整了 character_creator 表单中“经历”部分的布局，使其条目可以横向排列并换行 (修改了 style.css)。
* [2025-05-13 15:54:42] - 根据用户反馈调整了 character_creator 表单中“技能”部分的布局，缩短了大部分输入框，并使“描述”框更长 (修改了 style.css)。
* [2025-05-13 16:01:40] - 根据用户反馈将整个页面重构为两栏布局：左栏包含主要信息，右栏为技能 (修改了 index.html 和 style.css)。
* [2025-05-13 16:03:59] - 根据用户更新的 character_template.json (属性合并到状态)，修改了 index.html 和 script.js 以反映新的数据结构。
* [2025-05-13 16:05:04] - 根据用户反馈调整了 character_creator 表单中“状态”部分的布局，将原“属性”字段（力量、敏捷等）单独成行显示 (修改了 index.html)。
* [2025-05-13 16:06:52] - 根据用户反馈移除了 character_creator 页面中的主要 H1 和 H2 标题，以最大化内容显示空间 (修改了 index.html)。
* [2025-05-13 16:27:54] - 根据用户反馈，实现了动态添加/导出“经历”、“道具”和“技能”条目的功能。调整了HTML默认条目数并添加了“+”按钮 (修改了 index.html 和 script.js, 并修正了 style.css 中的一个小错误)。
* [2025-05-13 16:32:41] - 根据用户反馈，将“背景故事”和“形象”并排显示，并将“形象”从文本区改为图片上传（带预览，导出为DataURL）。(修改了 index.html, style.css, script.js)。
* [2025-05-13 16:35:39] - 根据用户反馈，移除了“技能”部分中“描述”文本框的标签 (修改了 index.html 和 script.js)。
* [2025-05-13 16:47:34] - 根据用户反馈调整了 character_creator 表单中“状态”部分的布局，将“护甲值”、“等级”、“熟练”、“金钱”字段单独成行显示 (修改了 index.html)。
* [2025-05-13 16:51:20] - 根据用户反馈调整了 character_creator 表单中“武器”部分的布局，为各字段设置了特定宽度，使特性字段填充剩余空间，确保单行显示 (修改了 style.css)。
* [2025-05-13 16:54:40] - 根据用户反馈，将“道具”部分中“描述”字段从多行文本框更改为单行输入框 (修改了 index.html 和 script.js)。
* [2025-05-13 17:02:07] - 根据用户反馈，将“道具”部分的“数量”字段更改为数字输入框，并调整其显示宽度 (修改了 index.html, script.js, style.css)。
* [2025-05-13 17:06:23] - 根据用户反馈，大幅修改了“形象”部分：移除标签，上传图片后隐藏文件选择按钮并显示带删除按钮的预览图，点击删除按钮可清除图片并恢复文件选择按钮 (修改了 index.html, style.css, script.js)。
* [2025-05-13 17:09:02] - 根据用户反馈，添加了“导入JSON”功能，允许用户选择JSON文件并用其数据填充表单，包括动态条目和形象图片。(修改了 index.html, style.css, script.js)。
* [2025-05-13 17:14:11] - 根据用户反馈，为“经历”、“道具”和“技能”的每个动态条目添加了删除按钮，并更新了JavaScript以处理删除逻辑和确保导出功能正确。(修改了 index.html, style.css, script.js)。
* [2025-05-13 17:19:20] - 根据用户反馈，修改了“经历”部分：1. “关键词”和“调整值”的HTML id/name属性不再包含索引。2. “调整值”输入框改为数字类型 (type="number", min="0", max="99")。3. “调整值”输入框宽度通过CSS设置为50px。影响文件：character_creator/script.js, character_creator/index.html, character_creator/style.css。
* [2025-05-13 17:20:53] - 根据用户反馈，调整了“技能”部分删除按钮的位置，将其移至“回想”输入框之后、“描述”文本区域之前。影响文件：character_creator/script.js, character_creator/index.html。
* [2025-05-13 20:51:17] - 实现了在 character_creator 页面中展示图片卡牌并允许拖拽的功能 (修改了 index.html, style.css, script.js)。
* [2025-05-13 21:17:14] - 将“技能”部分重构为表格布局，表头与输入框对齐 (修改了 index.html, script.js, style.css)。
* [2025-05-13 21:26:25] - 根据用户反馈调整技能表格：移除表头，缩短非描述输入框的长度 (修改了 index.html, style.css)。
* [2025-05-13 21:34:19] - 根据用户反馈再次调整技能表格列宽：非描述列使用固定px宽度，描述列自动宽度，table-layout: auto (修改了 style.css)。
* [2025-05-13 21:38:08] - 根据用户反馈调整技能表格：降低描述输入框高度，使其与其他项平齐 (修改了 style.css)。
* [2025-05-13 21:44:47] - 根据用户反馈实现技能描述框高度根据内容自动调整的功能 (修改了 style.css 以设置初始状态，并修改了 script.js 添加了 autoGrowTextarea 功能)。
* [2025-05-13 21:46:39] - 根据用户反馈调整技能描述框自动高度逻辑：修改 autoGrowTextarea JS 函数，以更精确地控制高度变化，防止过早增加高度 (修改了 script.js)。
* [2025-05-13 21:52:46] - 修复了“经历”和“道具”删除按钮失效的问题。原因是删除逻辑错误地查找 `<tr>` 元素，已修改为正确查找 `.experience-item` 或 `.item`。 (修改了 character_creator/script.js)
* [2025-05-13 22:16:33] - 将 `character_creator/data/race.csv` 文件转换为 JSON 格式并保存为 `character_creator/data/races.json`。
* [2025-05-13 22:28:10] - 将 `character_creator/index.html` 中的“种族”和“混血”输入从文本框更改为 `<select>` 元素。创建了 `character_creator/data/races_data.js` 以解决CORS问题。修改了 `character_creator/script.js` 以从 `RACES_DATA` (源自 `races.json`) 动态填充这些下拉列表，并更新了导入/导出逻辑以适应这些更改。
* [2025-05-13 22:36:17] - 修改了 `character_creator/script.js`，增加了根据用户选择的“种族”和“混血”下拉列表动态添加/更新种族特性到“技能”部分的功能。特性会按照指定格式（配置:“永久”，属性:“种族”，等级:“”）显示。此更改包括新的辅助函数 `addSkillEntry` 和核心逻辑函数 `updateRaceTraitsAsSkills`，以及相关的事件监听器和对 `populateForm` 的调用。
* [2025-05-13 22:54:53] - 将`group.csv`和`job.csv`转换为JS数据文件 (`groups_data.js`, `jobs_data.js`)。修改HTML将社群/职业输入改为下拉框。更新`script.js`以填充下拉框，并在选择时将其特性作为永久技能动态添加到技能列表，同时更新导入/导出逻辑。
* [2025-05-13 23:12:55] - 修复了种族技能未按预期填充的问题。`updateRaceTraitsAsSkills` 函数现在正确地从 `RACES_DATA` 中的 `trait1` 和 `trait2` 属性（而不是 `features` 数组）读取特性数据。
* [2025-05-13 23:31:48] - 修复了导入JSON时技能（种族、职业、社群特性）会填充两次的bug。通过修改 `character_creator/script.js` 中的 `populateForm` 函数，移除了在从JSON加载技能后对 `updateRaceTraitsAsSkills`, `updateGroupTraitAsSkill`, `updateJobTraitsAsSkills` 的多余调用。对于导入时可能多出空“经历”的问题，确认了 `script.js` 的逻辑是正确的（清空并根据数据重建），若问题依旧，则可能与 `index.html` 静态结构有关。
* [2025-05-13 23:37:05] - 根据用户反馈，修改了 `character_creator/script.js` 中的导出逻辑：现在导出JSON时，"经历"字段将只包含用户实际输入的条目，不再用空条目补齐到5个。这解决了导出JSON包含不必要空经历的问题，并可能改善导入时的体验。
* [2025-05-13 23:47:52] - Major refactor of skill management in `character_creator/script.js`:
    *   Implemented 5 fixed skill slots (2 Race, 1 Group, 2 Job) as per user request. These slots are now persistent UI elements.
    *   Modified `updateRaceTraitsAsSkills`, `updateGroupTraitAsSkill`, `updateJobTraitsAsSkills` to update these fixed slots directly, instead of adding/removing skill rows.
    *   Adjusted `populateForm` (JSON import) to:
        *   Clear and then populate these fixed slots based on imported race/group/job selections.
        *   Filter skills from the JSON `技能` array to prevent re-adding fixed-type skills as dynamic rows. Only custom/additional skills from JSON are added as dynamic rows.
    *   Updated `exportButton` logic to correctly gather data from both fixed slots and any additional dynamic skill rows.
    *   This resolves the bug where changing race/group/job after import would add new skills instead of replacing old ones, and fulfills the requirement for fixed, modifiable slots for these core traits.
* [2025-05-13 23:58:29] - 为“技能”部分中的固定技能槽（种族、社群、职业）在 `character_creator/style.css` 中添加了不同的背景色。
* [2025-05-14 14:25:32] - 根据用户反馈进一步调整“武器”部分CSS：为“检定”、“属性”、“距离”、“伤害”输入框明确设置了 `width: 30px;`, `min-width: 30px;`, `flex-basis: 30px;` 并确保 `flex-grow: 0; flex-shrink: 0;` 以强制其宽度。影响文件：character_creator/style.css。
* [2025-05-14 14:33:39] - 重构了“武器”部分的用户界面和数据处理：将输入框标签替换为占位符，并将“双手”字段从复选框更改为文本输入框，以提供更大的灵活性。影响文件：[`character_creator/index.html`](character_creator/index.html), [`character_creator/script.js`](character_creator/script.js)。
* [2025-05-14 14:43:52] - 更新了“经历”、“护甲”和“道具”部分，将字段标签替换为输入框内的占位符，以统一表单风格。影响文件：[`character_creator/index.html`](character_creator/index.html), [`character_creator/script.js`](character_creator/script.js)。
* [2025-05-14 14:49:18] - 根据用户反馈调整了“护甲”部分的布局，使其标题与输入框在同一行，类似于“武器”部分的样式。影响文件：[`character_creator/index.html`](character_creator/index.html), [`character_creator/style.css`](character_creator/style.css)。
* [2025-05-14 14:52:53] - 根据用户反馈，将“经历”的“调整值”、“护甲”的“防御”和“道具”的“数量”输入框类型从 `number` 更改为 `text`，并更新了相应的 `placeholder` 和导出逻辑。影响文件：[`character_creator/index.html`](character_creator/index.html), [`character_creator/script.js`](character_creator/script.js)。
* [2025-05-14 14:56:50] - 根据用户反馈，移除了“背景故事”字段的标签，并为其文本区域添加了 `placeholder`。影响文件：[`character_creator/index.html`](character_creator/index.html)。
* [2025-05-14 15:06:49] - 根据用户反馈调整了角色创建器初始设定部分的布局，将字段分为三行显示，并将“等级”字段移至第一行。(修改了 [`character_creator/index.html`](character_creator/index.html:15) 和 [`character_creator/style.css`](character_creator/style.css:77))