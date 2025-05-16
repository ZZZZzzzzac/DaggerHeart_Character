# Decision Log

This file records architectural and implementation decisions using a list format.
2025-05-13 15:03:53 - Log of updates made.

*

## Decision

*

## Rationale 

*

## Implementation Details

*
---
### Decision (Code)
[2025-05-13 21:54:01] - 修复“经历”和“道具”删除按钮的 bug

**Rationale:**
错误提示 `Uncaught TypeError: Cannot read properties of null (reading 'remove')` 表明在 `script.js` 的删除函数中，`this.closest('tr').remove()` 尝试在非表格行（如 `div.experience-item` 或 `div.item`）上执行，导致 `closest('tr')` 返回 `null`。
修复方案是修改 `addRemoveListener` 函数，使其能够根据点击的按钮上下文，正确地查找到对应的父级条目元素（`.experience-item`, `.item`, 或 `tr.skill-item`）并移除。

**Details:**
File: [`character_creator/script.js`](character_creator/script.js:37-41) (approximate lines after change)
```javascript
// function addRemoveListener(button) {
//     if (button) {
//         button.addEventListener('click', function(event) {
//             const experienceItem = event.target.closest('.experience-item');
//             if (experienceItem) {
//                 experienceItem.remove();
//                 return;
//             }
//             const itemItem = event.target.closest('.item');
//             if (itemItem) {
//                 itemItem.remove();
//                 return;
//             }
//             const skillItemRow = event.target.closest('tr.skill-item');
//             if (skillItemRow) {
//                 skillItemRow.remove();
//                 return;
//             }
//         });
//     }
// }
```
---
### Decision (Code)
[2025-05-13 23:32:28] - 修复导入JSON时技能重复填充问题，并分析经历多出问题。

**Rationale:**
*   **技能重复填充:** 在 `populateForm` 函数 ([`character_creator/script.js`](character_creator/script.js)) 中，从JSON加载完技能数据后，会继续调用 `updateRaceTraitsAsSkills()`, `updateGroupTraitAsSkill()`, 和 `updateJobTraitsAsSkills()`。这些函数会根据已从JSON数据设置好的种族、社群、职业下拉框的值，再次生成并添加相应的特性技能。由于这些特性技能很可能已经作为普通技能存在于导入的JSON数据中（并在第一步被加载），这导致了技能的重复添加。移除在 `populateForm` 函数末尾对这三个 `update...AsSkills` 函数的调用可以解决此问题。这些函数应该只在用户手动更改下拉选择或页面首次加载（非导入情况）时触发。
*   **经历多出问题分析:** 用户报告导入JSON时会多出3个空“经历”。经分析 `populateForm` 函数中处理经历的逻辑：首先通过 `experiencesContainer.innerHTML = '';` 清空容器，然后遍历 `data.设定.经历` 数组，为每条记录通过模拟 `addExperienceBtn.click()` (或直接创建DOM元素) 来添加和填充经历条目。此逻辑本身是正确的，应准确反映JSON中的经历数量，不会额外添加。因此，如果问题依然存在，其根源很可能在于：
    1.  `index.html` 文件中存在3个静态的、未被 `experiencesContainer.innerHTML = '';` 清理掉的经历输入区域（例如它们在 `experiencesContainer` 元素之外）。`form.reset()` 可能会将它们清空，使其看起来像“空的额外经历”。
    2.  `form.reset()` 对某些未良好管理的HTML结构产生了意外的副作用。
    当前的脚本修改不直接解决这类潜在的HTML结构问题，但确保了JavaScript层面在动态添加经历时的正确性。

**Details:**
*   修改了 [`character_creator/script.js`](character_creator/script.js) 文件。
*   在 `populateForm` 函数内部，位于导入技能的循环之后，将以下三行代码注释掉或删除：
    ```javascript
    // updateRaceTraitsAsSkills(); 
    // updateGroupTraitAsSkill();
    // updateJobTraitsAsSkills();
    ```
    (涉及原 [`script.js`](character_creator/script.js) 的大致行号 `297-299` 附近)
---
### Decision (Code)
[2025-05-13 23:38:20] - 修改导出JSON时的经历处理逻辑，不再补齐到5条。

**Rationale:**
用户反馈指出，在导出角色数据为JSON时，即使实际输入的“经历”条目少于5个，系统仍会自动用空的经历条目将其数量补齐至5个。这种行为导致导出的JSON文件包含了用户并未意图创建的空数据。当这样的JSON文件被重新导入时，这些人为添加的空经历条目会被加载到表单中，可能导致用户困惑或需要手动删除。为了使导出和导入行为更符合用户预期，并确保数据的简洁性，决定移除在导出过程中对“经历”条目进行数量补齐的逻辑。现在，导出的JSON将只精确反映用户在表单中实际输入的经历内容。

**Details:**
*   修改了 [`character_creator/script.js`](character_creator/script.js) 文件。
*   在 `exportButton` 的 `click` 事件监听器函数中，定位到处理“经历” ( `characterData.设定.经历` ) 的代码块。
*   将用于将经历数组长度补齐到5的 `while` 循环注释掉或删除。该循环大致内容如下：
    ```javascript
    // while (characterData.设定.经历.length < 5) { 
    //     characterData.设定.经历.push({"关键词": "", "调整值": 0});
    // }
    ```
    (涉及原 [`script.js`](character_creator/script.js) 的大致行号 `332-334` 附近)
---
### Decision (Code)
[2025-05-13 23:48:38] - Refactor skill system for fixed slots and address skill accumulation bug.

**Rationale:**
User reported that after importing a JSON, changing Race, Community, or Profession dropdowns would add new trait skills instead of updating/replacing existing ones. This was due to imported skills lacking specific CSS classes used by update functions to identify and remove old trait skills.
Additionally, user requested a design change: the character sheet should have 5 fixed, dedicated slots for trait-based skills (2 for Race/Mixed-Race, 1 for Community, 2 for Profession). These slots should be updated in place rather than having rows dynamically added/removed for these core traits.

**Solution Implemented:**
A significant refactor of the skill management in [`character_creator/script.js`](character_creator/script.js) was performed:

1.  **Fixed Skill Slot Initialization:**
    *   Defined `FixedSkillSlotIds` constant for the 5 slot IDs.
    *   `initializeFixedSkillSlots()`: Creates these 5 `<tr>` elements with unique IDs (e.g., `fixed-skill-race-1`) and appends them to `skillsContainer` on `DOMContentLoaded`. These rows are marked with a `.fixed-skill-slot` class and their remove buttons are hidden.

2.  **Skill Slot Update Mechanism:**
    *   `createSkillRowElement()`: A new helper to generate the HTML for a skill row, differentiating between fixed and dynamic rows.
    *   `updateSkillInSlot(slotId, skillData)`: New function to populate the input fields of a specific fixed skill slot (identified by `slotId`) with `skillData`. If `skillData` is null, it clears the slot while retaining placeholder attributes (like "种族" for race slots).

3.  **Trait Update Functions Overhaul:**
    *   `updateRaceTraitsAsSkills()`, `updateGroupTraitAsSkill()`, `updateJobTraitsAsSkills()` were rewritten.
    *   They no longer remove/add skill rows. Instead, they calculate the appropriate trait skill(s) based on current dropdown selections and then call `updateSkillInSlot()` to update the content of the corresponding fixed skill slot(s).

4.  **Import Logic (`populateForm`) Adaptation:**
    *   `skillsContainer.innerHTML = '';` was removed from the start of `populateForm` to preserve the fixed slots.
    *   After `form.reset()`, all fixed skill slots are explicitly cleared using `updateSkillInSlot(slotId, null)`.
    *   Any existing *dynamic* (non-fixed) skill rows are removed from `skillsContainer`.
    *   After dropdown values (Race, Community, Profession) are set from the imported JSON's `data.设定`, the rewritten `updateRaceTraitsAsSkills()`, `updateGroupTraitAsSkill()`, `updateJobTraitsAsSkills()` are called. This populates the fixed slots based on the imported character's specific traits.
    *   The loop processing `data.技能` (from JSON) is now modified to filter out skills whose `属性` field indicates they are race, community, or profession traits. This prevents them from being added as separate dynamic rows, as they are now exclusively managed within the fixed slots. Only other/custom skills from the JSON are added as new dynamic rows via `addSkillEntry()`.

5.  **Dynamic Skill Addition (`addSkillEntry`):**
    *   The `addSkillEntry()` function is now solely for adding user-initiated, dynamic, removable skill rows. It uses `createSkillRowElement()` internally, ensuring these rows do not have fixed slot IDs and have visible remove buttons.

6.  **Export Logic (`exportButton`):**
    *   The skill export process was updated. It first iterates through `AllFixedSlotIds`, reads data from each fixed slot using a new helper `getSkillDataFromRow()`, and adds it to the `characterData.技能` array if the slot contains a skill name.
    *   Then, it queries for all non-fixed skill rows (`tr.skill-item:not(.fixed-skill-slot)`) and adds their data to the array.

This comprehensive refactor ensures that trait-based skills are managed in their dedicated UI slots, are correctly updated on dropdown changes or import, and resolves the skill accumulation bug.

**Details:**
*   Extensive modifications to [`character_creator/script.js`](character_creator/script.js), including new functions (`createSkillRowElement`, `initializeFixedSkillSlots`, `updateSkillInSlot`, `getSkillDataFromRow`) and significant rewrites of `updateRaceTraitsAsSkills`, `updateGroupTraitAsSkill`, `updateJobTraitsAsSkills`, `populateForm`, and the skill export section within `exportButton`'s event listener.
---
### Decision (Code)
[2025-05-14 14:31:18] - 重构“武器”部分：标签改为占位符，“双手”字段类型从布尔值 (checkbox) 改为字符串 (text input)。

**Rationale:**
根据用户请求，为了使“武器”部分的输入方式与“技能”部分更一致，并提供更灵活的“双手”信息输入（例如，可以填写“单手”、“双手”、“可选”等，而不仅仅是勾选）。

**Details:**
*   [`character_creator/index.html`](character_creator/index.html):
    *   移除了武器1和武器2各字段（名称、检定、属性、距离、伤害、双手、特性）的 `<label>` 元素。
    *   为上述字段的 `<input>` 元素添加了 `placeholder` 属性。
    *   将 `weaponTwoHanded1` 和 `weaponTwoHanded2` 输入元素的 `type` 从 `checkbox` 修改为 `text`。
*   [`character_creator/script.js`](character_creator/script.js):
    *   在 `populateForm` 函数中，将 `form.weaponTwoHanded1.checked = weapon1.双手 || false;` 修改为 `form.weaponTwoHanded1.value = weapon1.双手 || "";` (同样修改了 `weaponTwoHanded2`)。
    *   在 `exportButton` 事件监听器中，将获取 `weaponTwoHanded1` 值的方式从 `form.querySelector('#weaponTwoHanded1').checked` 修改为 `formData.get('weaponTwoHanded1') || ""` (同样修改了 `weaponTwoHanded2`)。
---
### Decision (Code)
[2025-05-14 14:43:06] - 将“经历”、“护甲”和“道具”部分的标签替换为占位符。

**Rationale:**
根据用户请求，统一表单输入风格，移除这些部分的字段标签，改用输入框内的占位符文本提示用户。

**Details:**
*   [`character_creator/index.html`](character_creator/index.html):
    *   在“经历”部分，为静态的“关键词”和“调整值”输入框移除了 `<label>` 元素，并添加了 `placeholder` 属性。
    *   在“护甲”部分，为“名称”、“防御”和“特性”输入框移除了 `<label>` 元素，并添加了 `placeholder` 属性。
    *   在“道具”部分，为静态的“名称”、“数量”和“描述”输入框移除了 `<label>` 元素，并添加了 `placeholder` 属性。
*   [`character_creator/script.js`](character_creator/script.js):
    *   在 `addExperienceBtn` 的事件监听器中，动态创建“经历”条目时，移除了“关键词”和“调整值”的 `<label>`，并为 `<input>` 元素添加了 `placeholder`。
    *   在 `addItemBtn` 的事件监听器中，动态创建“道具”条目时，移除了“名称”、“数量”和“描述”的 `<label>`，并为 `<input>` 元素添加了 `placeholder`。
---
### Decision (Code)
[2025-05-14 14:49:07] - 调整“护甲”部分布局，使其标题与输入框在同一行。

**Rationale:**
根据用户反馈，为了使“护甲”部分的视觉样式与“武器”部分保持一致，将“护甲”标题（原为H3）移入条目内部（改为H4），并调整HTML结构和CSS样式，以实现单行布局。

**Details:**
*   [`character_creator/index.html`](character_creator/index.html):
    *   将原位于 `<div id="armors">` 外部的 `<h3>护甲</h3>` 移至 `<div class="item">` 内部，并更改为 `<h4>护甲</h4>`。
    *   为 `<div id="armors">` 添加了 `armor-item-container` 类。
*   [`character_creator/style.css`](character_creator/style.css):
    *   添加了新的CSS规则，针对 `.armor-item-container .item`、`.armor-item-container .item h4` 以及该容器内的输入框，以实现类似武器部分的单行、紧凑布局。
    *   为护甲的“名称”、“防御”和“特性”输入框设置了特定的宽度和伸缩行为。
---
### Decision (Code)
[2025-05-14 14:52:39] - 将“经历”的“调整值”、“护甲”的“防御”和“道具”的“数量”输入框类型更改为 text 并更新导出逻辑。

**Rationale:**
根据用户反馈，为了在这些字段中允许更灵活的文本输入（而不仅仅是数字），将它们的 `type` 属性从 `number` 更改为 `text`。同时，确保 `placeholder` 文本仍然存在，并更新了 JavaScript 中的导出逻辑以反映这些字段现在是字符串类型（移除了 `parseInt`）。

**Details:**
*   [`character_creator/index.html`](character_creator/index.html):
    *   “经历”部分静态的“调整值”输入框 `type` 改为 `text`。
    *   “护甲”部分“防御”输入框 `type` 改为 `text`。
    *   “道具”部分静态的“数量”输入框 `type` 改为 `text`。
*   [`character_creator/script.js`](character_creator/script.js):
    *   在 `addExperienceBtn` 事件监听器中，动态创建的“调整值”输入框 `type` 改为 `text`。
    *   在 `addItemBtn` 事件监听器中，动态创建的“数量”输入框 `type` 改为 `text`。
    *   在 `exportButton` 事件监听器的导出逻辑中：
        *   “经历”的“调整值”不再使用 `parseInt`，直接取 `value` 或空字符串。
        *   “护甲”的“防御”不再使用 `parseInt`，直接取 `value` 或空字符串。
        *   “道具”的“数量”不再使用 `parseInt`，直接取 `value` 或空字符串，包括处理空道具列表时的情况。
---
### Decision (Code)
[2025-05-14 14:56:39] - 移除“背景故事”标签并添加占位符。

**Rationale:**
根据用户反馈，为了进一步统一表单风格，移除了“背景故事”文本区域的 `<label>` 元素，并为其添加了 `placeholder` 属性。

**Details:**
*   [`character_creator/index.html`](character_creator/index.html):
    *   在“背景故事”部分，移除了 `<label for="backgroundStory">背景故事:</label>`。
    *   为 `<textarea id="backgroundStory" name="backgroundStory">` 添加了 `placeholder="背景故事"` 属性。
---
### Decision (Code)
[2025-05-14 15:07:06] - 调整角色创建器初始设定部分的布局

**Rationale:**
根据用户请求，为了优化角色创建器初始信息输入的布局，将相关字段重新组织为三行，并将“等级”字段从“状态”部分提前至第一行，以符合用户期望的逻辑顺序和视觉分组。

**Details:**
*   [`character_creator/index.html`](character_creator/index.html):
    *   修改了ID为 `characterForm` 的表单内，原用于包裹角色名、年龄等基本信息的 `div` (原class `form-group-inline-flex`)。
    *   将其替换为三个独立的 `div`，每个 `div` 拥有新class `form-group-row`。
    *   第一行 `form-group-row` 包含：角色名、年龄、性别、等级。其中“等级”字段 (原位于“状态”部分) 被移动到此处。
    *   第二行 `form-group-row` 包含：种族、混血、社群。
    *   第三行 `form-group-row` 包含：职业、子职业、兼职。
    *   相关的 `<label>` 和 `<input>`/`<select>` 元素被重新组织到这些新的行结构中。
    *   移除了原“状态”部分中“等级”字段的HTML。
*   [`character_creator/style.css`](character_creator/style.css):
    *   添加了新的CSS规则 `.form-group-row`。
    *   该规则设置 `display: flex` 和 `flex-wrap: wrap` 以允许行内元素横向排列。
    *   为 `.form-group-row > div`（即每行中的标签和输入框对）设置了 `display: flex` 和 `align-items: center`。
    *   为 `.form-group-row` 内的 `input[type="text"]`, `input[type="number"]`, 和 `select` 元素设置了默认宽度和间距。
---
### Decision (Code)
[2025-05-14 16:29:30] - 在“等级”输入旁边添加 Tier (T0-T3) 的动态显示。

**Rationale:**
根据用户反馈，为了更直观地展示角色等级对应的 Tier（用于装备或其他游戏机制），需要在等级输入框旁边实时显示计算出的 Tier 值。Tier 的计算规则为：等级 1 -> T0, 等级 2-4 -> T1, 等级 5-7 -> T2, 等级 8+ -> T3。

**Details:**
*   [`character_creator/index.html`](character_creator/index.html): 在 `id="level"` 的输入框后添加了一个 `<span id="levelTierDisplay" class="tier-display"></span>` 用于显示 Tier。
*   [`character_creator/script.js`](character_creator/script.js):
    *   添加了 `calculateTier(level)` 函数，根据传入的等级计算 Tier。
    *   添加了 `updateLevelTierDisplay()` 函数，获取当前等级，调用 `calculateTier`，并更新 `levelTierDisplay` span 的文本内容。
    *   为 `level` 输入框添加了 `input` 事件监听器，以在等级变化时调用 `updateLevelTierDisplay`。
    *   在 `populateForm` 函数中，当从JSON加载等级后，调用 `updateLevelTierDisplay`。
    *   在 `DOMContentLoaded` 后，调用 `updateLevelTierDisplay` 以显示初始 Tier。
*   [`character_creator/style.css`](character_creator/style.css): 为 `.tier-display` 类添加了样式，包括左边距和垂直对齐，以确保其在视觉上与等级输入框协调。
---
### Decision (Code)
[2025-05-14 20:59:41] - 将代码中的 Tier 从 T0-T3 更新为 T1-T4。

**Rationale:**
根据用户请求，需要将游戏中物品和角色等级的 Tier 系统从 T0-T3 调整为 T1-T4。这涉及到修改 JavaScript 代码中计算和显示 Tier 的逻辑，以及在加载装备数据时对 Tier 相关变量名和字符串的引用。[`character_creator/data/equipment_data.js`](character_creator/data/equipment_data.js) 文件已由用户手动更新以包含 T1-T4 的数据。

**Details:**
*   修改了 [`character_creator/script.js`](character_creator/script.js):
    *   **`calculateTier(level)` 函数:**
        *   调整了逻辑，使其根据等级返回 "T1", "T2", "T3", 或 "T4" 字符串。
        *   例如：`level <= 1` 返回 "T1", `level <= 4` 返回 "T2", `level <= 7` 返回 "T3", `level >= 8` 返回 "T4"。
    *   **`updateLevelTierDisplay()` 函数:**
        *   修改为直接使用 `calculateTier` 函数返回的字符串（例如 "T1"）来更新 `levelTierDisplay.textContent`，不再手动添加 "T" 前缀。
    *   **`filterAndDisplayEquipment(type, weaponSlotType)` 函数:**
        *   在 `addTierToItems` 的调用中，将所有对 `weapon_t0_...`, `offhand_weapon_t0_...`, `armor_t0` 等变量的引用更新为 `weapon_t1_...`, `offhand_weapon_t1_...`, `armor_t1`。
        *   相应地，将传递给 `addTierToItems` 的 Tier 字符串参数从 `'T0'` 更新为 `'T1'`。
        *   对 `t1`, `t2`, `t3` 的引用也相应地增加1，变为 `t2`, `t3`, `t4`。
        *   添加了对新的 `weapon_t4_...`, `offhand_weapon_t4_...`, `armor_t4` 变量的引用，并将 Tier 字符串参数设置为 `'T4'`。
---
### Decision (Code)
[2025-05-16 10:48:50] - 实现职业领域（领域1、领域2）在技能区域标题行的显示

**Rationale:**
用户要求在选择职业时，显示该职业的“领域1”和“领域2”。根据用户最新指示，显示位置调整为与“技能”标题和“添加技能”按钮在同一行，并右对齐。

方案选择为：
1.  在HTML ([`character_creator/index.html`](character_creator/index.html)) 中，将用于显示领域的 `div` (id: `jobDomainsDisplay`) 移入技能部分的 `<div class="section-header">` 内，位于“添加技能”按钮之后。
2.  在CSS ([`character_creator/style.css`](character_creator/style.css)) 中，调整 `.job-domains-display` 的样式，使用 `margin-left: auto;` 使其在flex容器 (`section-header`) 中右对齐，并调整其他视觉样式如 `padding-left` 和 `align-self`。
3.  JavaScript ([`character_creator/script.js`](character_creator/script.js)) 中的 `updateJobTraitsAsSkills` 函数（之前已修改）负责获取 `jobDomainsDisplay` 元素，并在职业选择变更时，从 `JOBS_DATA` 获取对应职业的“领域1”和“领域2”，然后更新 `jobDomainsDisplay` div 的 `textContent`。如果职业未选择或无领域数据，则清空该div。

**Details:**
*   [`character_creator/index.html`](character_creator/index.html): 将 `<div id="jobDomainsDisplay" class="job-domains-display"></div>` 放置于 `<div class="section-header">` 内部，`h3` 和 `button` 之后。
*   [`character_creator/style.css`](character_creator/style.css): 为 `.job-domains-display` 添加了 `margin-left: auto; padding-left: 15px; align-self: center;` 等样式。
*   [`character_creator/script.js`](character_creator/script.js): `updateJobTraitsAsSkills` 函数逻辑保持不变，因为它已准备好填充 `jobDomainsDisplay`。
---
### Decision (Code)
[2025-05-16 16:26:17] - 将子职的“施法”属性整合到 `jobDomainsDisplay`

**Rationale:**
根据用户请求，需要在 `jobDomainsDisplay` 中追加显示所选子职的“施法”属性。这要求修改 JavaScript 逻辑以在职业和子职选择发生变化时更新此显示。

**Details:**
*   修改了 [`character_creator/script.js`](character_creator/script.js:1) 文件。
*   **`updateJobTraitsAsSkills()` 函数 ([`character_creator/script.js:223-329`](character_creator/script.js:223))**:
    *   在更新完职业的“领域1”和“领域2”之后，添加了新的逻辑。
    *   获取当前选中的子职名称 (`subclassSelect.value`)。
    *   如果子职被选中，则在 `JOBS_DATA` ([`character_creator/data/jobs_data.js`](character_creator/data/jobs_data.js:1)) 中查找对应的职业和子职对象。
    *   如果找到子职对象，并且其 `施法` 属性存在且不为空，则将其值追加到 `jobDomainsDisplay.textContent`，格式为 ` (子职施法: [施法属性值])`。
*   **事件监听器**:
    *   为 `subclassSelect` (子职下拉框) 添加了一个 `change` 事件监听器，该监听器会调用 `updateJobTraitsAsSkills()` ([`character_creator/script.js:223-329`](character_creator/script.js:223))。这确保了当用户更改子职选择时，`jobDomainsDisplay` 的内容会相应更新。
*   **`updateSubclassOptions()` 函数 ([`character_creator/script.js:109-162`](character_creator/script.js:109))**:
    *   略作修改，以在填充子职选项时添加一个默认的“选择子职”选项，并尝试在职业更改后恢复之前选择的子职（如果新职业的子职列表中仍然存在该选项）。
*   **`initializeTraits()` 函数 ([`character_creator/script.js:96-106`](character_creator/script.js:96))**:
    *   确保在页面加载时，如果已选择职业，`updateJobTraitsAsSkills()` ([`character_creator/script.js:223-329`](character_creator/script.js:223)) 会被调用，从而也能处理初始状态下子职施法属性的显示。
*   **错误修复**:
    *   之前的 `apply_diff` 操作导致了差异标记被错误地写入文件。通过重新读取文件内容并应用一个新的、干净的 `apply_diff` 操作（包含正确的代码块）解决了此问题。
---
### Decision (Code)
[2025-05-16 16:34:04] - 修复子职下拉列表在主职业更改后不立即刷新的Bug

**Rationale:**
用户反馈在更改主职业后，子职下拉列表的选项不会自动更新以反映新主职业的可用子职，需要手动与子职下拉框交互才能触发刷新。为了提供更流畅的用户体验，需要在主职业更改时立即更新子职选项。

**Details:**
*   修改了 [`character_creator/script.js`](character_creator/script.js:1) 文件。
*   在 `updateJobTraitsAsSkills()` 函数 ([`character_creator/script.js:221-319`](character_creator/script.js:221)) 中，将 `updateSubclassOptions()` 函数 ([`character_creator/script.js:107-160`](character_creator/script.js:107)) 的调用移至该函数较早的位置。具体来说，在获取 `selectedJobName` (所选主职业名称) 之后，但在任何依赖于 `subclassSelect.value` (所选子职名称) 的逻辑（如获取子职的“施法”属性）之前，立即调用 `updateSubclassOptions()`。
*   这样可以确保在 `updateJobTraitsAsSkills()` 函数 ([`character_creator/script.js:221-319`](character_creator/script.js:221)) 继续执行后续操作（例如显示领域和子职施法属性）之前，`subclassSelect` 下拉列表已经填充了与新主职业匹配的正确子职选项，并且其 `value` 也已相应更新（通常会重置为默认的“选择子职”或之前的有效选项）。
*   之前在 `updateJobTraitsAsSkills()` 函数 ([`character_creator/script.js:221-319`](character_creator/script.js:221)) 末尾的条件性 `updateSubclassOptions()` 调用已被移除，因为其功能已被前置的调用所覆盖。
*   此修复由用户在审查期间直接编辑并应用到文件中。
---
### Decision (Code)
[2025-05-16 16:38:37] - 优化子职下拉列表行为：移除占位符并改进默认选择逻辑

**Rationale:**
根据用户反馈，需要移除子职下拉列表中的“选择子职”占位符选项。同时，当主职业更改导致子职列表刷新时，应智能地设置默认选中的子职：如果之前选中的子职在新列表中仍然有效，则保持该选择；否则，默认选择新列表中的第一个子职。用户必须能够自由选择列表中的任何其他有效子职。

**Details:**
*   修改了 [`character_creator/script.js`](character_creator/script.js:1) 文件中的 `updateSubclassOptions` 函数 ([`character_creator/script.js:107-166`](character_creator/script.js:107))。
*   **移除了“选择子职”选项**: 不再显式创建和添加一个空的或带有提示文本（如“选择子职”）的 `<option>` 元素作为下拉列表的第一个条目。
*   **改进的默认选择逻辑**:
    1.  在清空并重新填充子职选项之前，保存当前选中的子职值 (`previousSubclassValue`)。
    2.  遍历新职业对应的子职数据，为每个有效子职创建并添加 `<option>` 元素。
    3.  在填充过程中，记录第一个有效子职的名称 (`firstSubclassName`)，并检查 `previousSubclassValue` 是否存在于新的子职选项中 (`previousValueIsValid`)。
    4.  所有选项添加完毕后，决定 `subclassSelect` 的选中值：
        *   如果 `previousValueIsValid` 为 `true`（即之前选的子职在当前职业下仍然可选），则将 `subclassSelect.value` 设置为 `previousSubclassValue`。
        *   否则，如果 `firstSubclassName` 不为 `null`（即当前职业至少有一个有效子职），则将 `subclassSelect.value` 设置为 `firstSubclassName`（默认选中第一个）。
        *   如果既没有有效的先前选择，也没有可供选择的第一个子职（例如，职业没有子职或子职数据不规范），则 `subclassSelect.value` 可能会被设为空字符串（如果 `firstSubclassName` 为 `null`）。
*   **处理无子职的情况**: 如果选定的主职业没有任何子职，或者没有提供有效的子职数据，则会像以前一样，向 `subclassSelect` 添加一个值为 ""、文本为“无可用子职”的选项，并禁用该下拉框。
*   此更改由用户在审查期间直接编辑并应用到文件中，解决了之前尝试默认选择第一个子职时导致无法选择其他子职的问题。
---
### Decision (Code)
[2025-05-16 16:48:41] - 实现动态添加子职基石特性到技能表

**Rationale:**
用户要求在选择职业或子职时，将所选子职的“特性”数组中所有“等级”为“基石”的特性动态添加到 `skillsTable`。这需要修改 `updateJobTraitsAsSkills` 函数 ([`character_creator/script.js:227-325`](character_creator/script.js:227))。

**Details:**
*   修改了 [`character_creator/script.js`](character_creator/script.js:1) 中的 `updateJobTraitsAsSkills` 函数 ([`character_creator/script.js:227-325`](character_creator/script.js:227))：
    *   **清除旧特性**: 在函数开始时，除了清除 `.dynamic-job-feature-row`，还清除了所有带有新类名 `subclass-keystone-trait-row` 的行。这确保了在职业或子职更改时，旧的子职基石特性会被移除。
    *   **获取子职数据**: 在现有逻辑（处理职业希望特性、职业特性、职业领域和子职施法）之后，获取当前选中的子职名称 (`selectedSubclassName`)。
    *   **遍历子职特性**: 如果找到了有效的子职数据 (`subclassData`) 及其 `特性` 数组：
        *   遍历 `subclassData.特性`。
        *   对每个特性，检查 `trait.等级 === "基石"`。
        *   **创建并添加新行**: 如果是基石特性，则：
            *   创建一个 `keystoneTraitSkillData` 对象，包含名称、描述、配置（设为"永久"）、属性（设为"子职特性"）、等级（设为"基石"）。
            *   使用 `createSkillRowElement(keystoneTraitSkillData, false)` ([`character_creator/script.js:722-760`](character_creator/script.js:722)) 创建新的 `<tr>` 元素。
            *   为新行添加 `subclass-keystone-trait-row` 类。
            *   隐藏该行的移除按钮 (`.remove-item-btn`)。
            *   将新行附加到 `skillsContainer` ([`character_creator/index.html:248`](character_creator/index.html:248))。
            *   如果描述字段是 `textarea`，调用 `autoGrowTextarea` ([`character_creator/script.js:1666-1670`](character_creator/script.js:1666))。
    *   **事件监听**: `professionSelect` 和 `subclassSelect` 的 `change` 事件监听器已配置为调用 `updateJobTraitsAsSkills` 函数 ([`character_creator/script.js:227-325`](character_creator/script.js:227))，因此当职业或子职更改时，此新逻辑会被触发。
    *   **初始加载和导入**: `initializeTraits()` ([`character_creator/script.js:94-104`](character_creator/script.js:94)) 和 `populateForm()` ([`character_creator/script.js:868-1049`](character_creator/script.js:868)) 函数通过调用 `updateJobTraitsAsSkills()` ([`character_creator/script.js:227-325`](character_creator/script.js:227)) 来处理初始加载和数据导入时的特性显示，这也将包括新添加的子职基石特性逻辑。

---
### Decision (Code)
[2025-05-16 20:55:36] - 调整技能列表移除按钮的显示逻辑

**Rationale:**
用户要求技能列表中的所有项目默认都显示移除按钮。仅当某个技能项目的“配置”属性明确设置为“永久”时，其对应的移除按钮才应被隐藏。

**Details:**
*   修改了 [`character_creator/script.js`](character_creator/script.js:1) 文件。
*   **`updateRemoveButtonVisibility(skillRowElement)` 函数**:
    *   新增此辅助函数，接收一个技能行 `<tr>` 元素作为参数。
    *   它会查找该行内的“配置”输入框 (`input[name="skillConfig"]`) 和移除按钮 (`.remove-item-btn`)。
    *   如果“配置”输入框的值（去除前后空格后）为 "永久"，则隐藏移除按钮；否则，显示移除按钮（通过将 `display` 设置为空字符串来恢复默认显示）。
*   **`createSkillRowElement(skillData, isFixedSlot, slotId)` 函数 ([`character_creator/script.js:744-782`](character_creator/script.js:744))**:
    *   移除了原先在创建固定技能槽时硬编码 `style="display:none;"` 来隐藏移除按钮的逻辑。现在所有移除按钮在创建时都是可见的。
    *   为每行新创建的“配置”输入框添加了一个 `input` 事件监听器，当其值改变时，会调用 `updateRemoveButtonVisibility` 函数并传入当前行元素，以动态更新移除按钮的可见性。
    *   在函数末尾，创建完行元素后，立即调用一次 `updateRemoveButtonVisibility` 以根据初始的“配置”值设置移除按钮的正确状态。
*   **`updateJobTraitsAsSkills()` 函数 ([`character_creator/script.js:225-343`](character_creator/script.js:225))**:
    *   在动态添加“职业特性”行 (`.dynamic-job-feature-row`) 后，移除了之前硬编码隐藏其移除按钮的逻辑。
    *   在将这些行添加到 `skillsContainer` 后，调用 `updateRemoveButtonVisibility` 并传入新创建的行。
    *   同样，在动态添加“子职基石特性”行 (`.subclass-keystone-trait-row`) 后，移除了硬编码隐藏移除按钮的逻辑，并在添加后调用 `updateRemoveButtonVisibility`。
*   **`updateSkillInSlot(slotId, skillData)` 函数 ([`character_creator/script.js:798-841`](character_creator/script.js:798))**:
    *   在此函数末尾，当固定技能槽的内容被更新（无论是填充数据还是清空）后，调用 `updateRemoveButtonVisibility` 并传入对应的槽行元素，以确保移除按钮的可见性基于更新后的“配置”值。
*   **`addSkillEntry(skillData)` 函数 ([`character_creator/script.js:843-850`](character_creator/script.js:843))**:
    *   在此函数末尾，当通过“添加技能”按钮动态创建新的空白技能行后，调用 `updateRemoveButtonVisibility` 并传入新创建的行，以根据其（通常为空或默认的）“配置”值设置移除按钮的初始状态。
    
    ---
    ### Decision (Code)
    [2025-05-16 21:06:46] - 修复导入JSON时技能重复及子职加载问题
    
    **Rationale:**
    用户反馈在导入JSON后，存在两个问题：
    1.  职业和子职相关的特性技能（“职业特性”、“子职特性”）会重复出现。这是因为它们既从JSON的 `技能` 数组中被加载，又在 `populateForm` 函数 ([`character_creator/script.js:904-1079`](character_creator/script.js:904)) 中调用 `updateJobTraitsAsSkills` ([`character_creator/script.js:225-343`](character_creator/script.js:225)) 时被重新生成。
    2.  子职下拉框在导入后显示为空，没有正确加载JSON中指定的子职。
    
    **Details:**
    *   修改了 [`character_creator/script.js`](character_creator/script.js:1) 文件中的 `populateForm` 函数 ([`character_creator/script.js:904-1079`](character_creator/script.js:904))。
    *   **防止技能重复导入**:
        *   在 `populateForm` 函数 ([`character_creator/script.js:904-1079`](character_creator/script.js:904)) 中遍历 `data.技能` 数组时，扩展了原有的 `isFixedTypeAttribute` ([`character_creator/script.js:1067`](character_creator/script.js:1067)) 条件判断。
        *   新的条件现在还包括检查 `skill.属性 === "职业特性"` 和 `skill.属性 === "子职特性"`。
        *   如果技能的属性是这些类型之一（或之前已有的固定类型如“种族”、“社群”、“职业”、“混血”），则 `if (!isFixedTypeAttribute)` ([`character_creator/script.js:1071`](character_creator/script.js:1071)) 条件为假，该技能不会通过 `addSkillEntry` ([`character_creator/script.js:856-864`](character_creator/script.js:856)) 作为动态行被添加到技能列表中。这避免了与 `updateJobTraitsAsSkills` ([`character_creator/script.js:225-343`](character_creator/script.js:225)) 函数生成的特性重复。
    *   **修复子职加载问题**:
        *   调整了 `populateForm` 函数 ([`character_creator/script.js:904-1079`](character_creator/script.js:904)) 内部设置表单字段和调用更新函数的顺序：
            1.  设置主职业下拉框的值 (`form.professionSelect.value = data.设定.职业 || "";`)。
            2.  **立即调用 `updateSubclassOptions()` ([`character_creator/script.js:106-165`](character_creator/script.js:106))**。这会根据刚设置的主职业，填充子职下拉列表 (`subclassSelect`) 的可用选项。
            3.  **然后设置子职下拉框的值** (`if (form.subclassSelect) form.subclassSelect.value = data.设定.子职业 || "";`)。此时 `subclassSelect` 已有正确的选项，可以正确选中从JSON读取的值。
            4.  最后，在所有相关的下拉框（包括种族、社群、职业和现在已正确设置的子职）的值都从JSON加载完毕后，再调用 `updateRaceTraitsAsSkills()` ([`character_creator/script.js:166-206`](character_creator/script.js:166)), `updateGroupTraitAsSkill()` ([`character_creator/script.js:207-224`](character_creator/script.js:207)), 和 `updateJobTraitsAsSkills()` ([`character_creator/script.js:225-343`](character_creator/script.js:225))。`updateJobTraitsAsSkills` ([`character_creator/script.js:225-343`](character_creator/script.js:225)) 现在可以基于正确选中的子职来生成相应的特性和更新显示。
        *   移除了之前错误的 `form.subProfession.value = data.设定.子职业 || "";` ([`character_creator/script.js:944`](character_creator/script.js:944)) 行，因为它使用的是错误的ID，并且其功能已被新的 `subclassSelect` 设置逻辑取代。