# Decision Log

This file records architectural and implementation decisions using a list format.
2025-06-14 10:59:44 - Log of updates made. (Summarized older entries, kept recent ones)

*

## Decision

*

## Rationale 

*

## Implementation Details

*
---
---
---
---
### Decision (Debug)
[2025-06-14 23:23:00] - 将数据持久化方案从 Cookie 迁移到 Local Storage

**Rationale:**
经过多轮调试，最终确定 Cookie 写入失败的根本原因是数据量超出了浏览器对单个 Cookie 约 4KB 的大小限制。即使对 Cookie 值进行编码也无法解决此核心问题，因为编码后的字符串体积更大。因此，必须采用一种能够支持更大存储容量的客户端存储方案。

**Details:**
*   **根本原因**: 角色表单的完整状态（JSON 字符串）超过了 4KB，导致 `document.cookie` 写入操作被浏览器静默拒绝。
*   **解决方案**:
    1.  **弃用 Cookie**: 完全移除 `saveFormStateToCookie` 和 `loadFormStateFromCookie` 函数。
    2.  **采用 Local Storage**:
        *   实现 `saveFormStateToLocalStorage` 函数，使用 `localStorage.setItem('characterSheetData', JSON.stringify(formState))` 来保存数据。`localStorage` API 更简单，且无需手动编码。
        *   实现 `loadFormStateFromLocalStorage` 函数，使用 `localStorage.getItem('characterSheetData')` 来读取数据。
    3.  **更新调用**: 在 `script.js` 中，将所有对旧 Cookie 函数的调用（在 `TriStateCheckbox` 类和 `DOMContentLoaded` 事件监听器中）全部替换为对新的 `localStorage` 函数的调用。
*   **影响文件**: [`script.js`](script.js:1)
*   **结果**: 此项重构彻底解决了数据无法持久化的问题。`localStorage` 提供了充足的存储空间（通常为 5MB+），确保了表单状态能够被可靠地保存和恢复。
### Decision (Code)
[2025-06-14 22:08:00] - 实现浮动操作栏及PDF打印功能

**Rationale:**
为了提供核心的可用性功能，需要在页面上添加一个固定的操作栏，用于导入/导出角色数据和打印角色卡。导出/导入功能利用了现有的 `exportFormState` 和 `importFormState` 函数。打印功能需要将两页的角色卡（包含背景图片和所有交互式表单域）准确地渲染成一个两页的A4 PDF文件。

**Details:**
*   **HTML ([`character_sheet_editor.html`](character_sheet_editor.html:1))**:
    *   在 `<body>` 中添加了一个 `<div id="action-container">`，包含“导入JSON”、“导出JSON”和“打印PDF”按钮，以及一个用于文件上传的隐藏的 `<input type="file">`。
    *   为了实现精确打印，将角色卡的每一页内容（图片和其上的所有控件）分别包裹在 `<div id="page-1">` 和 `<div id="page-2">` 中。
    *   在 `<head>` 中添加了 `jspdf` 和 `html2canvas` 库的CDN链接。
*   **CSS ([`style.css`](style.css:1))**:
    *   为 `#action-container` 添加了 `position: fixed` 样式，将其固定在视口的右上角。
    *   为新的 `.page-container` 类添加了 `position: relative`，以确保页面内的绝对定位元素正确定位。
*   **JavaScript ([`script.js`](script.js:1))**:
    *   创建了 `setupActionButtons` 函数，并在 `DOMContentLoaded` 时调用。
    *   **导出**: “导出JSON”按钮的点击事件会调用 `exportFormState`，将返回的状态对象转换为JSON字符串，并创建一个可下载的 `.json` 文件。
    *   **导入**: “导入JSON”按钮会触发隐藏的文件输入框。文件输入框的 `change` 事件使用 `FileReader` 读取文件内容，解析JSON，然后调用 `importFormState` 来填充表单。
    *   **打印**: “打印PDF”按钮的点击事件是一个 `async` 函数：
        *   它会隐藏操作栏以防被打印。
        *   使用 `await html2canvas(page1)` 和 `await html2canvas(page2)` 按顺序将两个页面容器转换为canvas。
        *   创建一个新的 `jsPDF` 实例。
        *   将第一个canvas作为第一页添加到PDF。
        *   添加一个新页面，然后将第二个canvas添加到PDF。
        *   最后，生成并下载PDF文件。
        *   `finally` 块确保无论打印成功与否，操作栏都会被重新显示。

---
### Decision (Code)
[2025-06-14 18:56:26] - 将复选框插槽容器化以实现网格布局

**Rationale:**
为了将 `ArmorSlot`、`HpSlot` 和 `StressSlot` 复选框组织成视觉上清晰的网格，需要将它们各自包裹在 `div` 容器中。这种方法利用 Flexbox 来控制布局，而不是对每个复选框进行单独的绝对定位。这简化了 HTML，使 CSS 更具可维护性，并允许容器根据其内容自动调整大小。它还使得设置元素之间的间距和容器周围的填充变得容易。

**Details:**
*   **HTML ([`character_sheet_editor.html`](character_sheet_editor.html:1))**:
    *   创建了 `<div id="armor-slots-container">`, `<div id="stress-container">`, 和 `<div id="hp-container">`。
    *   将相应的 `label` 元素移动到这些容器中。
    *   从 `label` 元素中删除了内联的 `top` 和 `left` 样式。
    *   为容器本身设置了绝对定位的 `top` 和 `left` 内联样式。
*   **CSS ([`style.css`](style.css:1))**:
    *   为三个新容器ID添加了样式规则。
    *   使用 `display: flex` 和 `flex-wrap: wrap` 来创建网格行为。
    *   使用 `gap` 属性在复选框之间创建间距。
    *   使用 `width` 属性来控制每行可以容纳多少个项目，从而强制实现所需的列数（护甲为3列，生命/压力为6列）。
    *   将 `.base-checkbox` 的 `position` 从 `absolute` 更改为 `relative`，因为它们的定位现在由 flex 容器管理。
*   **JavaScript ([`script.js`](script.js:1))**:
    *   创建了 `setDefaultSlotStates` 函数，在 `DOMContentLoaded` 时调用。
    *   此函数以编程方式为后6个生命值和压力插槽设置 `data-state="2"`（虚线状态），实现了任务要求的默认状态。此操作在从 cookie 加载状态之前执行，因此保存的状态可以覆盖默认值。
---
### Decision (Code)
[2025-06-14 18:27:00] - 重构复选框以移除包装器元素

**Rationale:**
根据用户反馈，为了进一步简化DOM结构和CSS，移除了 `.base-checkbox-wrapper` `div` 元素。这些包装器仅用于定位，通过将它们的样式直接合并到子 `label` 元素中，可以使HTML更清晰，元素定位更直接。

**Details:**
*   **HTML ([`character_sheet_editor.html`](character_sheet_editor.html:1))**:
    *   删除了所有 class 为 `base-checkbox-wrapper` 的 `div` 元素。
    *   将每个已删除 `div` 的 `style` 属性（包含 `top` 和 `left`）合并到其子 `label` 元素中。
*   **CSS ([`style.css`](style.css:1))**:
    *   删除了 `.base-checkbox-wrapper` CSS规则。
    *   将 `position: absolute;` 添加到 `.base-checkbox` 规则中，以处理复选框的直接定位。
*   **JavaScript ([`script.js`](script.js:1))**:
    *   更新了 `applyDebugStyles` 函数，使其现在查询 `.base-checkbox` 而不是 `.base-checkbox-wrapper` 来应用调试边框。
---
### Decision (Code)
[2025-06-14 18:24:00] - 实现三态复选框基类 `TriStateCheckbox`

**Rationale:**
为了支持需要超过两种状态（开/关）的复杂交互，例如护甲槽（正常、已用、损坏），需要创建一个可重用的 `TriStateCheckbox` JavaScript 类。该类将封装状态逻辑（0: 未选中, 1: 左键选中, 2: 右键选中）和事件处理（左键/右键单击），从而简化HTML结构并使状态管理集中化。此方法避免了使用多个复选框或复杂的CSS选择器来模拟三种状态，提高了可维护性和可扩展性。

**Details:**
*   **JavaScript ([`script.js`](script.js:1))**:
    *   创建了 `TriStateCheckbox` 类，该类管理一个 `label` 元素的状态。
    *   该类处理 `click`（在状态0和1之间切换）和 `contextmenu`（在状态0和2之间切换）事件。
    *   通过 `dataset.state` 属性在DOM中存储和更新状态。
    *   重构了 `exportFormState` 和 `importFormState` 函数，以保存和加载复选框的数字状态（0, 1, 2），而不是布尔值。
    *   在 `DOMContentLoaded` 时初始化所有 `.base-checkbox` 元素为 `TriStateCheckbox` 实例。
*   **CSS ([`style.css`](style.css:1))**:
    *   移除了依赖于 `:checked` 伪类的样式。
    *   添加了新的类选择器 `.state-checked` 和 `.state-dashed`，以根据 `label` 元素上的类应用不同的 `background-image`。
*   **HTML ([`character_sheet_editor.html`](character_sheet_editor.html:1))**:
    *   从所有复选框包装器中删除了隐藏的 `<input type="checkbox">` 元素，因为状态现在完全由JavaScript管理。
    *   保留了 `label` 上的 `for` 属性作为状态保存/加载的唯一标识符。
---
### Decision (Code)
[2025-06-14 18:07:00] - 重构 Checkbox 实现为可复用的基础组件

**Rationale:**
为了支持多种不同视觉表现的 Checkbox（例如护甲槽、生命值、压力等），需要将现有的 `sampleCheckbox` 实现重构为一个更通用、可扩展的系统。此举旨在通过创建一个共享的 `base-checkbox` 类和为每种具体类型（如 `armor-slot-checkbox`）提供特定样式的方式，来简化 HTML 结构并提高 CSS 的可维护性。

**Details:**
*   **CSS ([`style.css`](style.css:1))**:
    *   移除了旧的 `.styled-checkbox` 和相关的 `:checked` 规则。
    *   创建了 `.base-checkbox` 类，包含所有 Checkbox 共享的样式（如 `display`, `cursor`, `background-size` 等）。
    *   为 `armor-slot` 创建了 `.armor-slot-checkbox` 类，并为其未选中和选中状态定义了不同的 `background-image`。
    *   更新了 `.base-checkbox-wrapper`，使其 `position` 为 `absolute`，因为所有 Checkbox 都将绝对定位。
*   **HTML ([`character_sheet_editor.html`](character_sheet_editor.html:1))**:
    *   移除了旧的 `sampleCheckboxWrapper` div。
    *   为任务中要求的每种 Checkbox 类型（ArmorSlot, HitPoint, Stress 等）添加了新的 HTML 结构。
    *   每个新的 Checkbox 都遵循以下模式：一个包含 `base-checkbox-wrapper` 类的 `div`，内部有一个隐藏的 `input.hidden-checkbox` 和一个应用了 `.base-checkbox` 及特定类型类（如 `.armor-slot-checkbox`）的 `label`。
    *   为所有新添加的 Checkbox 暂时使用了 `armor-slot-checkbox` 的样式作为占位符。
### Decision (Code)
[2025-06-14 13:48:36] - 固定角色卡图片大小，防止缩放

**Rationale:**
根据用户请求，需要将角色卡背景图片设置为固定大小，使其不随浏览器窗口大小的变化而缩放，以确保所有可交互元素的位置保持稳定和精确。

**Details:**
*   **CSS ([`style.css`](style.css:1))**:
    *   在 `.image-container img` 规则中，移除了 `max-height: 95vh;` 和 `width: auto;`。
    *   添加了 `width: 1000px;` 来设置一个固定的宽度，并让 `height: auto;` 来保持图片的原始纵横比。这可以防止图片因视口大小改变而进行缩放。
### Decision (Code)
[2025-06-14 13:04:02] - 禁用网页缩放功能

**Rationale:**
为了防止用户意外通过 `Ctrl` + 鼠标滚轮或 `Ctrl` + `+` / `-` 快捷键缩放页面，影响布局和用户体验，需要添加脚本来阻止这些行为的默认事件。

**Details:**
*   **JavaScript ([`script.js`](script.js:1))**:
    *   添加了一个 `wheel` 事件监听器到 `document`。当 `event.ctrlKey` 为 `true` 时，调用 `event.preventDefault()` 来阻止滚轮缩放。设置 `{ passive: false }` 以确保 `preventDefault` 可以被调用。
    *   添加了一个 `keydown` 事件监听器到 `document`。当 `event.ctrlKey` 为 `true` 且按下的键是 `+`、`-` 或 `0` 时，调用 `event.preventDefault()` 来阻止键盘缩放。
---
### 较早决策总结 (2025-05-13 至 2025-05-16)

**基本原理:**
在2025年5月13日至5月16日期间，角色创建器经历了重大的用户界面增强和功能迭代。关键决策包括：
*   **UI与表单优化:** 大量字段标签被占位符替换，调整了初始设定、护甲等部分的布局，并统一了输入框类型（例如，数字改为文本）。
*   **技能系统重构:** 实现固定技能槽，解决了技能重复添加和累积的错误，动态添加职业/子职特性（包括基石特性），并优化了移除按钮的逻辑。
*   **数据导入/导出修复:** 解决了JSON导入/导出时技能重复、经历补齐、子职加载等问题。
*   **特性实现与调整:** 添加了等级Tier的动态显示（后续更新为T1-T4），实现了职业领域和子职施法属性的显示，并优化了子职下拉列表的行为。
*   **领域卡机制:** 引入了领域卡选择的去重功能。

这些变更旨在改善用户体验、数据完整性，并使工具功能与不断发展的需求保持一致。
---
### Decision (Code)
[2025-05-17 00:06:00] - 根据技能“配置”属性更新技能行可用性及视觉样式

**Rationale:**
用户要求根据技能的“配置”字段（一个下拉选择框）来动态改变技能行的可用性和外观。
-   当“配置”为“宝库”时，技能应标记为“暂不可用”，背景变黄，透明度降低，输入框不可交互。
-   当“配置”为“除外”时，技能应标记为“绝不可用”，背景变红，透明度更低，文字加删除线，输入框不可交互。
-   其他配置（如“激活”、“永久”等）应为正常可用状态。

**Details:**
*   **CSS ([`character_creator/style.css`](character_creator/style.css:1))**:
    *   添加了新的 CSS 类 `.skill-unavailable-temporary` 和 `.skill-unavailable-permanent`。
    *   `.skill-unavailable-temporary`: 设置浅黄色背景 (`#fffde7`)，较低的透明度 (`opacity: 0.7`)。其内部的 `input`, `textarea`, `select` 设置 `pointer-events: none` 和浅灰色背景 (`#f0f0f0`)。
    *   `.skill-unavailable-permanent`: 设置浅红色背景 (`#ffebee`)，更低的透明度 (`opacity: 0.5`)，文本删除线 (`text-decoration: line-through`)。其内部的 `input`, `textarea`, `select` 设置 `pointer-events: none`，更深的灰色背景 (`#e0e0e0`) 和灰色文本 (`#757575`)。
*   **JavaScript ([`character_creator/script.js`](character_creator/script.js:1))**:
    *   **`updateSkillAvailabilityStyle(skillRowElement)` 函数**:
        *   新增此辅助函数，接收一个技能行 `<tr>` 元素。
        *   获取该行内名为 `skillConfig` 的 `<select>` 元素。
        *   根据 `skillConfig.value`：
            *   移除行元素上可能存在的 `.skill-unavailable-temporary` 和 `.skill-unavailable-permanent` 类。
            *   如果值为 "宝库"，添加 `.skill-unavailable-temporary` 类。
            *   如果值为 "除外"，添加 `.skill-unavailable-permanent` 类。
    *   **`createSkillRowElement(skillData, isFixedSlot, slotId)` 函数 ([`character_creator/script.js:759-827`](character_creator/script.js:759))**:
        *   在为 `skillConfig` 的 `<select>` 元素添加 `input` 事件监听器时，除了调用 `updateRemoveButtonVisibility`，也调用 `updateSkillAvailabilityStyle(newRow)`。
        *   在函数末尾，创建完行元素后，立即调用一次 `updateSkillAvailabilityStyle(newRow)` 以根据初始“配置”值设置样式。
        *   修改了技能名称输入框的点击事件监听器，以在打开领域卡模态框前检查技能行是否具有 `.skill-unavailable-temporary` 或 `.skill-unavailable-permanent` 类，如果是，则不打开模态框。
    *   **`updateSkillInSlot(slotId, skillData)` 函数 ([`character_creator/script.js:843-887`](character_creator/script.js:843))**:
        *   在此函数末尾，当固定技能槽的内容被更新后，调用 `updateSkillAvailabilityStyle(slotRow)`。
    *   **`addSkillEntry(skillData)` 函数 ([`character_creator/script.js:889-897`](character_creator/script.js:889))**:
        *   此函数内部调用 `createSkillRowElement`，其中已包含对 `updateSkillAvailabilityStyle` 的调用，因此无需直接修改 `addSkillEntry`。
        *   修改了 `addSkillBtn` 的事件监听器，确保在通过 `addSkillEntry` 添加新技能时，传递的 `skillData` 中“配置”默认为“激活”，以符合 `createSkillRowElement` 中对新动态技能的默认处理。
---
### Decision (Code)
[2025-05-17 00:34:00] - 调整技能交互：配置为“永久”时名称框不弹窗，固定槽位名称placeholder统一

**Rationale:**
根据用户反馈：
1.  当一个技能的“配置”下拉框被设置为“永久”时，点击该技能的“名称”输入框不应再触发领域卡选择弹窗。
2.  在 `initializeFixedSkillSlots` 函数中，为所有固定技能槽（种族、社群、职业）的“名称”输入框设置一个统一的 `placeholder="名称"`，而不是依赖于传入的 `skillData` 可能为空的情况。

**Details:**
*   **JavaScript ([`character_creator/script.js`](character_creator/script.js:1))**:
    *   **`createSkillRowElement(skillData, isFixedSlot, slotId)` 函数 ([`character_creator/script.js:759-827`](character_creator/script.js:759))**:
        *   在技能“名称”输入框 (`input[name="skillName"].skill-name-input`) 的 `click` 事件监听器内部，获取该行对应的“配置”下拉框 (`select[name="skillConfig"]`) 的当前值。
        *   在打开领域卡选择模态框 (`openDomainCardModal(newRow)`) 的条件判断中，增加了对 `currentConfigValue !== '永久'` 的检查。现在，只有当配置不是“永久” *并且* 技能行没有 `skill-unavailable-temporary` 或 `skill-unavailable-permanent` 类时，才会尝试打开模态框。
    *   **`initializeFixedSkillSlots()` 函数 ([`character_creator/script.js:828-841`](character_creator/script.js:828))**:
        *   在 `AllFixedSlotIds.forEach` 循环中，当调用 `createSkillRowElement({}, true, slotId)` 为固定槽创建行时，明确传递一个包含 `名称: ""` 的对象 (`{ 名称: "" }`) 作为 `skillData`。这确保了 `createSkillRowElement` 内部 `skillData.名称 || ''` 会得到一个空字符串。
        *   紧接着，获取新创建的 `slotRow` 中的“名称”输入框 (`input[name="skillName"]`)。
        *   如果找到了该输入框，则将其 `placeholder` 属性显式设置为 "名称"。
---
### Decision (Code)
[2025-06-13 16:01:00] - 将项目中的多个数据源迁移到新的规则书JS文件

**Rationale:**
根据用户一系列指令，将项目中的核心数据源（道具、种族、社群、职业、装备、领域卡）从旧的、结构各异的 `.js` 或 `.csv` 文件迁移到统一格式的、来自规则书的新 `.js` 文件。此举旨在统一数据结构，简化代码逻辑，并确保数据与核心规则书一致。

**Details:**
*   **数据源替换**:
    *   **道具/消耗品**: `items_data.js`, `consumables_data.js` -> `Daggerheart_Core_Rulebook_战利品与消耗品表.js` (提供 `LOOT` 常量)。
    *   **种族**: `races_data.js` -> `Daggerheart_Core_Rulebook_种族.js` (提供 `RACES_DATA` 常量)。
    *   **社群**: `groups_data.js` -> `Daggerheart_Core_Rulebook_社群.js` (提供 `GROUPS_DATA` 常量，其结构源自新文件)。
    *   **职业**: `jobs_data.js` -> `Daggerheart_Core_Rulebook_职业.js` (提供 `JOBS_DATA` 常量)。
    *   **装备**: `equipment_data.js` -> `Daggerheart_Core_Rulebook_主武器表.js` (`PRIMARY_WEAPON`), `_副武器表.js` (`SECONDARY_WEAPON`), `_护甲表.js` (`ARMOR`)。
    *   **领域卡**: 旧的 `domain_card.js` (可能包含数据) -> `Daggerheart_Core_Rulebook_领域卡.js` (提供 `DOMAIN_CARDS` 常量)。
*   **HTML 修改**:
    *   [`character_creator/index.html`](character_creator/index.html): 更新了 `<script>` 标签，移除了对所有旧数据文件的引用，并添加了对所有新数据文件的引用，确保它们在逻辑脚本之前加载。
*   **JavaScript 逻辑修改**:
    *   **字段名统一**: 在所有相关的JS文件 (`utility.js`, `json.js`, `race_job_community.js`, `weapon_armor_item.js`, `domain_card.js`, `template.js`) 中，将对旧数据字段（通常是中文键名，如 `名称`, `特性`, `职业`）的引用更新为新数据结构中的英文字段名（如 `name`, `desc`, `trait`, `class_feature`）。
    *   **数据结构适配**:
        *   **扁平化处理**: 对于领域卡，逻辑从处理按领域分组的对象改为处理扁平的卡片数组。
        *   **动态过滤**: 对于装备，`filterAndDisplayEquipment` 函数被重构，不再依赖按Tier和类型预分割的常量，而是从新的主数组 (`PRIMARY_WEAPON`, `ARMOR`, `SECONDARY_WEAPON`) 中根据角色等级动态筛选。
        *   **子职逻辑重构**: `updateSubclassOptions` 和 `updateJobTraitsAsSkills` 函数被大幅修改，以适应新的职业数据结构，其中子职信息不再是嵌套数组，而是主职业对象的直接属性 (`subclass1`, `subclass2`, `subclass1_base_feature` 等)。
---
### Decision (Debug)
[2025-06-14 11:45:00] - Bug Fix Strategy: Correct CSS specificity for `sampleTextbox` debug border.

**Rationale:**
The `sampleTextbox` was not appearing in debug mode because the CSS rule `#sampleTextbox { border: none; }` had higher specificity or was processed in a way that overrode the `.debug-mode { border: 1px solid red; }` rule. The fix involves increasing the specificity of the debug mode selector.

**Details:**
*   Modified [`style.css`](style.css:1).
*   Changed the selector for the debug mode from `.debug-mode` to `#sampleTextbox.debug-mode`. This increases specificity, ensuring that the debug border (`border: 1px solid red;`) is applied when the `debug-mode` class is active on the `#sampleTextbox` element, overriding the default `border: none;`.
---
### Decision (Code)
[2025-06-14 12:09:04] - 调整角色卡图片显示和调试按钮布局

**Rationale:**
根据用户请求，调整角色卡图片的显示方式和调试按钮的布局。
最初目标是图片原始尺寸显示，后根据用户反馈调整为图片适配视口高度。
调试按钮统一移至右上角固定显示，方便调试。

**Details:**
*   **[`style.css`](style.css:1)**:
    *   `body`: 设置 `margin: 0; padding: 0;`。
    *   `.image-container`: 设置 `position: absolute; top: 0; left: 0;`，移除了原有的flex布局。
    *   `.image-container img`: 设置 `display: block; max-height: 95vh; width: auto;`，移除了 `max-width`。确保图片从左上角开始，适配视口高度，宽度自动调整。
    *   `.debug-controls`: 新增类，设置 `position: fixed; top: 10px; right: 10px; display: flex; flex-direction: column; gap: 5px; z-index: 1000;` 使调试按钮固定在右上角垂直排列。
*   **[`character_sheet_editor.html`](character_sheet_editor.html:1)**:
    *   将原有的调试按钮包裹在 `<div class="debug-controls">` 中，并确保此 `div` 为 `<body>` 的直接子元素。
---
### Decision (Code)
[2025-06-14 16:39:01] - Refactor HTML and CSS to remove container elements and streamline positioning.

**Rationale:**
To simplify the DOM structure and CSS, the `.control-container` divs, which were used solely for positioning, were removed. Their positioning styles (`top`, `left`) were merged directly into the inline styles of the child `textarea` elements. This makes the HTML cleaner and the element positioning more direct.

**Details:**
*   **HTML ([`character_sheet_editor.html`](character_sheet_editor.html:1))**:
    *   Removed all `div` elements with the class `control-container`.
    *   Merged the `style` attribute from each removed `div` into its child `textarea` or `div`.
*   **CSS ([`style.css`](style.css:1))**:
    *   Deleted the `.control-container` CSS rule.
    *   Changed `position: relative` to `position: absolute` in the `.base-textbox` rule to handle the direct positioning of the textboxes.
    *   Commented out `position: relative` in `.base-checkbox-wrapper` as its positioning is now handled inline.