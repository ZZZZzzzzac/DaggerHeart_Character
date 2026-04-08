# 最终版“皮肤接口”架构与集成计划

根据您的反馈，我们采用 **统一接口 + 弹出独立窗口** 的方案。这种方案不仅完美符合“类似打印、可随时关闭、可截图保存在浏览器外”的场景，还通过统一定义的接口规范了以后所有皮肤作者的开发流程。

## User Review Required

请您过目以下落地计划，如果确认无误，我将立刻开始编写代码完成改造。

## 架构设计方案 (Pop-up + Unified API)

### 1. 目录结构
在根目录下创建统一的 `skin` 文件夹。当前我们做好的皮肤作为默认模板：
```text
DaggerHeart_Character/
  ├─ skin/
  │   ├─ skin_api.js         <-- [NEW] 核心接口文件，您提供给所有的皮肤作者
  │   └─ default/            <-- 我们刚做好的这套皮肤
  │       ├─ index.html
  │       ├─ style.css
  │       └─ script.js       <-- 皮肤作者的实现代码
```

### 2. 统一的数据接收接口 (`skin_api.js`)
皮肤作者**不需要**自己写读取逻辑。他们在自己的 `index.html` 里只需引入您的 `<script src="../skin_api.js"></script>`。
该脚本在运行时，会自动从当前被传送过来的缓存（Local Storage）中抓取 JSON 数据，然后调用一个全局函数 `window.renderSkin(jsonData)`。

**皮肤作者的任务**：
只需要在他们的 JS 中实现 `window.renderSkin = function(jsonData) { ... }` 这个函数，把数据赋值进自己的美术页面即可。

### 3. 各模块修改与分工

#### Phase 1: 迁移文件
- 将刚创建的 `character_sheet_ui` 文件夹移动/重命名为根目录下的 `skin/default`。

#### Phase 2: 编写核心接口 `skin/skin_api.js`
- 职责：读取数据，并强制约定/调用 `renderSkin`，充当引擎核心层。

#### Phase 3: 改造默认皮肤 (`skin/default/script.js`)
- 在 HTML 中引入 `skin_api.js`。
- 将原来单独写的逻辑封装进 `window.renderSkin(jsonData)`。
- 从 `jsonData.StrengthTextbox`，`jsonData.LevelTextbox` 等原生 JSON 键值对中读取数据并进行雷达图与文本框渲染。
- 用 JavaScript 遍历皮肤里的所有 `input` 和 `textarea`，统一设置为 `readOnly = true`。

#### Phase 4: 原工程接入 (`index.html` & `js/action.js`)
- 在 `index.html` 顶部按钮区加一个 `<button id="view-skin-btn">查看皮肤</button>`。
- 修改 `js/action.js` 中的 `setupGlobalActionButtons`，为该按钮绑定点击事件：
  1. 调用现有的 `exportFormState()` 生成最新 JSON 数据。
  2. 将数据暂存为 `localStorage.setItem('daggerheart_current_character', ...)`。
  3. 弹出新窗口：`window.open('skin/default/index.html', '_blank')`。

这样，业务逻辑完全分离，既完成了“预览皮肤”，又输出了开源的皮肤接口标准。
