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