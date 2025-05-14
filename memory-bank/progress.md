de# Progress

This file tracks the project's progress using a task list format.
2025-05-13 15:03:46 - Log of updates made.

*

## Completed Tasks

*   

## Current Tasks

*   

## Next Steps

*
* [2025-05-13 15:34:00] - 完成了 character_creator 网页应用的创建，包括 index.html, style.css, 和 script.js。
* [2025-05-13 17:19:42] - 完成任务：调整“经历”部分字段属性和样式 (移除索引，调整值为数字输入，限制宽度)。
* [2025-05-13 17:21:03] - 完成任务：调整“技能”部分删除按钮的HTML结构位置。
* [2025-05-13 20:53:08] - 完成任务：初步实现图片卡牌展示机制，包括HTML结构、CSS样式和JavaScript拖拽功能 (涉及 character_creator/index.html, character_creator/style.css, character_creator/script.js)。
* [2025-05-13 21:53:50] - 完成任务：修复“经历”和“道具”删除按钮的 bug (涉及 character_creator/script.js)。
* [2025-05-13 22:16:41] - 完成任务：将 `character_creator/data/race.csv` 转换为 `character_creator/data/races.json`。
* [2025-05-13 22:27:48] - 完成任务：将“种族”和“混血”输入更改为下拉选择，并从 `races.json` (通过 `races_data.js`) 动态加载选项。修复了CORS问题。(涉及 character_creator/index.html, character_creator/script.js, character_creator/data/races_data.js)
* [2025-05-13 22:35:23] - 完成任务：实现根据用户选择的“种族”和“混血”动态将种族特性作为技能添加到角色创建器的技能列表中。(涉及 character_creator/script.js)
* [2025-05-13 22:55:07] - 完成任务：处理`group.csv`和`job.csv`，将其转换为JS数据文件，修改HTML输入为下拉框，并更新JS以动态填充下拉框、根据选择添加/更新技能，并调整导入/导出功能。
* [2025-05-13 23:26:33] - 完成任务：修复了当选择种族后，种族特性技能未正确填充到技能列表的问题。同时确保了技能列表初始默认为空。
* [2025-05-13 23:32:19] - 完成任务：修复导入JSON时技能重复填充的bug。修改涉及 `character_creator/script.js`。对于经历多出的问题，已确认脚本逻辑，若问题持续，需检查HTML。
* [2025-05-13 23:38:06] - 完成任务：根据用户反馈，修改导出逻辑，不再将“经历”补齐到5条，只导出实际存在的经历。修改涉及 `character_creator/script.js`。
* [2025-05-13 23:48:30] - 完成任务：重构技能系统以使用5个固定技能槽（种族x2, 社群x1, 职业x2）。修复了导入JSON后更改种族/职业/社群选择时技能重复添加的bug。修改涉及 `character_creator/script.js` 的技能初始化、更新、导入和导出逻辑。
* [2025-05-14 14:25:53] - 完成任务：根据用户多轮反馈调整“武器”部分。主要包括：1. HTML结构调整以支持两条武器记录。2. 武器伤害字段改为文本类型。3. JS导入/导出逻辑更新以支持两条武器。4. CSS调整以实现武器子标题与输入框平行、移除主标题、移除标签冒号、实现紧凑单行布局、移除“框”样式，并精确控制特定输入框宽度。影响文件：character_creator/index.html, character_creator/style.css, character_creator/script.js。
* [2025-05-14 14:33:51] - 完成任务：重构“武器”部分，将标签改为占位符，并将“双手”字段从布尔型复选框改为字符串型文本输入。影响文件：[`character_creator/index.html`](character_creator/index.html), [`character_creator/script.js`](character_creator/script.js)。
* [2025-05-14 14:43:58] - 完成任务：将“经历”、“护甲”和“道具”部分输入字段的标签改为占位符。影响文件：[`character_creator/index.html`](character_creator/index.html), [`character_creator/script.js`](character_creator/script.js)。
* [2025-05-14 14:49:27] - 完成任务：调整“护甲”部分布局，使其标题与输入框在同一行，以匹配“武器”部分的样式。影响文件：[`character_creator/index.html`](character_creator/index.html), [`character_creator/style.css`](character_creator/style.css)。
* [2025-05-14 14:53:01] - 完成任务：将“经历”的“调整值”、“护甲”的“防御”和“道具”的“数量”输入框类型更改为 `text`，并更新了 `placeholder` 和导出逻辑。影响文件：[`character_creator/index.html`](character_creator/index.html), [`character_creator/script.js`](character_creator/script.js)。
* [2025-05-14 14:57:01] - 完成任务：移除“背景故事”字段的标签，并为其添加 `placeholder`。影响文件：[`character_creator/index.html`](character_creator/index.html)。
* [2025-05-14 15:06:58] - 完成任务：调整角色创建器初始设定部分的布局，将字段分为三行显示，并将“等级”字段移至第一行。(涉及 [`character_creator/index.html`](character_creator/index.html:15) 和 [`character_creator/style.css`](character_creator/style.css:77))