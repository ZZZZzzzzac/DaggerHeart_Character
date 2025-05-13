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