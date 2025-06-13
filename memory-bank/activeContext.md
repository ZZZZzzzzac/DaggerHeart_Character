# Active Context

This file tracks the project's current status, including recent changes, current goals, and open questions.
2025-05-13 15:03:39 - Log of updates made.

*

## Current Focus

* [2025-06-13 16:01:00] - 完成所有数据源迁移：
    *   道具/消耗品 -> `Daggerheart_Core_Rulebook_战利品与消耗品表.js` (LOOT)。
    *   种族 -> `Daggerheart_Core_Rulebook_种族.js`。
    *   社群 -> `Daggerheart_Core_Rulebook_社群.js`。
    *   职业 -> `Daggerheart_Core_Rulebook_职业.js`。
    *   装备 -> `Daggerheart_Core_Rulebook_主武器表.js`, `_副武器表.js`, `_护甲表.js`。
    *   领域卡 -> `Daggerheart_Core_Rulebook_领域卡.js`。
    *   所有相关的HTML引用和JavaScript逻辑已更新。

## Recent Changes

*
* [2025-05-13 15:34:10] - 创建了 character_creator 应用 (HTML, CSS, JS) 以根据 character_template.json 生成角色表单并支持JSON导出。
* ... (previous entries from before 2025-06-13 remain) ...
* [2025-06-13 15:23:13] - 修改 `character_creator/js/utility.js` 以从 `LOOT.items` 和 `LOOT.consumables` 构建 `ALL_ITEMS_DATA`。修改 `character_creator/js/json.js` 以使用新的字段名 (`name`, `desc`)。
* [2025-06-13 15:28:11] - 假设新的 `Daggerheart_Core_Rulebook_种族.js` 定义了 `RACES_DATA`。修改 `character_creator/js/race_job_community.js` 和 `character_creator/data/template.js` 以使用新的种族数据结构和字段名 (`name`, `trait1_name`, `trait1_desc`, etc.)。
* [2025-06-13 15:43:22] - 修改 `character_creator/js/race_job_community.js` 和 `character_creator/data/template.js` 以使用新的社群数据结构和字段名 (`name`, `trait_name`, `trait_desc`)，假设 `Daggerheart_Core_Rulebook_社群.js` 定义了 `GROUPS_DATA`。
* [2025-06-13 15:44:03] - 更新 `character_creator/index.html` 以引用新的装备数据JS文件 (`Daggerheart_Core_Rulebook_主武器表.js`, `_副武器表.js`, `_护甲表.js`) 并移除对旧 `equipment_data.js` 的引用。更新 `character_creator/js/weapon_armor_item.js` 以使用新的装备数据源 (`PRIMARY_WEAPON`, `ARMOR`, `SECONDARY_WEAPON`) 和新的英文字段名，调整了装备弹窗的筛选和数据显示逻辑。
* [2025-06-13 15:52:00] - 修改 `character_creator/js/race_job_community.js` 和 `character_creator/data/template.js` 以适配新的职业数据结构 (`Daggerheart_Core_Rulebook_职业.js` 定义的 `JOBS_DATA`)，更新了职业名称、希望特性、职业特性、领域和子职相关的字段引用及逻辑。
* [2025-06-13 16:01:00] - 更新 `character_creator/index.html` 以正确引用新的领域卡数据文件。更新 `character_creator/js/domain_card.js` 以处理扁平化的 `DOMAIN_CARDS` 数组结构。

## Open Questions/Issues

*
* [2025-05-16 17:54:36] - 完成了将用户提供的“奥术”领域卡片文本转换为 JSON 对象并更新到 `character_creator/data/domain_card.js` 文件中的 `DOMAIN_CARDS` JavaScript 对象。
* ... (previous entries remain) ...
* 新人引导中子职选择逻辑可能需要进一步调整以完全适配新的职业数据结构，当前仅更新了 `template.js` 中职业选择的字段。