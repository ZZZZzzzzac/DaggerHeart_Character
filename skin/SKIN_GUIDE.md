# DaggerHeart 人物卡皮肤开发指南

> 面向皮肤作者（包括非程序员 / AI 辅助创作）

---

## 一、皮肤文件夹结构

```
skin/
├── skin_api.js          ← 核心数据桥，必须引用（不需要修改）
├── resource_tracker.js  ← 资源追踪模块，可选引用（不需要修改）
│
└── 你的皮肤名称/           ← 命名随意，就是皮肤的显示名
    ├── skin.json         ← 皮肤元数据（必须）
    ├── index.html        ← 皮肤主页面（必须）
    ├── style.css         ← 样式文件（推荐）
    └── script.js         ← 逻辑文件（推荐）
```

---

## 二、`skin.json` 格式

主工程会读取每个皮肤文件夹里的 `skin.json`，填写以下内容：

```json
{
  "name": "皮肤显示名（给玩家看）",
  "description": "皮肤的简短描述"
}
```

如果 `skin.json` 不存在或格式不合法，主工程会**用文件夹名称代替**。

---

## 三、`index.html` 最小模板

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>我的皮肤</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- 你的 HTML 布局放这里 -->
  <div id="char-name">—</div>

  <!-- 引用顺序：skin_api.js 必须最后加载，在 script.js 之前 -->
  <script src="../skin_api.js"></script>
  <!-- 如果需要资源追踪器，也引入它 -->
  <script src="../resource_tracker.js"></script>
  <!-- 你的皮肤逻辑 -->
  <script src="script.js"></script>
</body>
</html>
```

> **注意**：`skin_api.js` 和 `resource_tracker.js` 在上级目录 `skin/`，路径写 `../`。

---

## 四、`script.js` 核心接口：`window.renderSkin`

`skin_api.js` 会在页面加载完成后自动调用 `window.renderSkin(jsonData)`，并把**角色 JSON 数据**传进来。

你只需要在 `script.js` 里实现这个函数：

```js
window.renderSkin = function(jsonData) {
  // 在这里把 jsonData 里的数据填入你的 HTML

  // 例子：显示角色名
  document.getElementById('char-name').textContent = jsonData.NameTextbox || '未命名';
};
```

---

## 五、角色 JSON 完整字段参考

以下是人物卡所有可用字段，按功能分组：

### 5.1 基本信息

| 字段 | 内容 |
|------|------|
| `NameTextbox` | 角色名 |
| `RaceTextbox` | 种族 |
| `CommunityTextbox` | 社群 |
| `ClassTextbox` | 职业 |
| `ClassDomainTextbox` | 职业领域 |
| `LevelTextbox` | 等级（字符串数字） |
| `EvasionTextbox` | 闪避值 |
| `ArmorTextbox` | 护甲值 |
| `avatarImageSrc` | 头像图片（Base64 DataURL，可直接赋值给 `<img>` 的 `src`） |

### 5.2 六维属性

| 字段 | 中文 |
|------|------|
| `AgilityTextbox` | 敏捷 |
| `StrengthTextbox` | 力量 |
| `FinesseTextbox` | 灵巧 |
| `InstinctTextbox` | 本能 |
| `PresenceTextbox` | 风度 |
| `KnowledgeTextbox` | 知识 |

值是字符串数字，可能为负（如 `"-1"`），用 `parseInt()` 或 `Number()` 转换：

```js
const agi = parseInt(jsonData.AgilityTextbox || '0', 10);
```

### 5.3 阈值

| 字段 | 内容 |
|------|------|
| `MajorTextbox` | 重度伤害阈值 |
| `SevereTextbox` | 严重伤害阈值 |

显示格式示例：`` `${jsonData.MajorTextbox} / ${jsonData.SevereTextbox}` ``

### 5.4 武器

| 字段 | 内容 |
|------|------|
| `PrimaryWeaponNameTextbox` | 主武器名 |
| `PrimaryWeaponStatTextbox` | 主武器属性（如"灵巧／近战"） |
| `PrimaryWeaponDamageTextbox` | 主武器伤害（如"d8+7／物理"） |
| `PrimaryWeaponTraitTextbox` | 主武器特质描述 |
| `SecondaryWeaponNameTextbox` | 副武器名 |
| `SecondaryWeaponStatTextbox` | 副武器属性 |
| `SecondaryWeaponDamageTextbox` | 副武器伤害 |
| `SecondaryWeaponTraitTextbox` | 副武器特质描述 |

### 5.5 护甲

| 字段 | 内容 |
|------|------|
| `ArmorNameTextbox` | 护甲名称 |
| `ArmorScoreTextbox` | 护甲值（数字） |
| `ArmorThresholdTextbox` | 护甲阈值（冗余字段，有时填充；建议使用 Major/Severe） |
| `ArmorTraitTextbox` | 护甲特质描述 |

### 5.6 经历

```js
// 经历 1~5，同结构
jsonData.Experience1Textbox        // 经历名称
jsonData.Experience1ModifierTextbox // 加值（如 "+4"）

// 遍历所有经历：
for (let i = 1; i <= 5; i++) {
  const name = jsonData[`Experience${i}Textbox`];
  const mod  = jsonData[`Experience${i}ModifierTextbox`];
  if (name && name.trim()) {
    console.log(mod ? `${name} (${mod})` : name);
  }
}
```

### 5.7 职业特性

| 字段 | 内容 |
|------|------|
| `ClassFeatureTextbox` | 职业特性全文（多行文本） |

### 5.8 物品栏

| 字段 | 内容 |
|------|------|
| `ItemSlot1Textbox` | 物品格 1（文本区域） |

### 5.9 资源计量格（生命/压力/护甲/希望）

这些字段是 checkbox，值为字符串：`"0"` = 空，`"1"` = 已用，`"2"` = 不可用。

| 前缀 | 上限 | 说明 |
|------|------|------|
| `HpSlotCheckbox` | 1~12 | 生命点 |
| `StressSlotCheckbox` | 1~12 | 压力点 |
| `ArmorSlotCheckbox` | 1~12 | 护甲槽 |
| `HopeSlotCheckbox` | 1~6 | 希望点 |

**上限计算规则**：值为 `"0"` 或 `"1"` 的格子数之和（`"2"` 不计）。  
**当前值**：值为 `"1"` 的格子数。

---

## 六、资源追踪器 API（可选）

引入 `resource_tracker.js` 后可以使用 `DH` 命名空间：

### 6.1 解析资源

```js
const resources = DH.parseResources(jsonData);
// 返回：
// {
//   hp:     { current: 5, max: 7 },
//   stress: { current: 2, max: 8 },
//   armor:  { current: 1, max: 6 },
//   hope:   { current: 2, max: 4 }
// }
```

### 6.2 创建资源控件

控件会在指定容器内自动生成「加/减按钮 + 计数」的交互 UI，并通过 `onUpdate` 回调通知你更新自定义视觉：

```js
const tracker = new DH.ResourceWidget({
  container: document.getElementById('my-resource-area'),
  resources:  resources,
  onUpdate: (key, current, max) => {
    // key: 'hp' | 'stress' | 'armor' | 'hope'
    // 在这里更新你自己的显示（emoji、进度条、数字...）
    const display = document.querySelector(`[data-dh-display="${key}"]`);
    if (display) {
      display.textContent = `${current} / ${max}`;
    }
  }
});
```

### 6.3 程序化控制

```js
tracker.increment('hp');      // 生命 +1
tracker.decrement('stress');  // 压力 -1
tracker.set('hope', 3);       // 希望设为 3（会自动 clamp 到 [0, max]）
tracker.get('armor');         // 返回 { current, max }
```

---

## 七、本地预览方法

1. 在 `DaggerHeart_Character/` 目录下，双击运行 `server.bat`（会启动本地 HTTP 服务器）。
2. 打开浏览器访问 `http://localhost:8080`。
3. 主工程里选一个角色，点击**"使用皮肤"** → 选择你的皮肤名称。
4. 皮肤页面会自动弹出并渲染数据。

> **缓存问题**：修改代码后建议用 `Ctrl+F5` 强制刷新，或在引用 `script.js` 时加版本号：
> ```html
> <script src="script.js?v=1"></script>
> ```

---

## 八、最简皮肤示例

以下是一个极简的功能性皮肤，可以直接复制修改：

**`skin/我的皮肤/skin.json`**
```json
{
  "name": "我的皮肤",
  "description": "简单示范"
}
```

**`skin/我的皮肤/index.html`**
```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>我的皮肤</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    .name { font-size: 2em; font-weight: bold; }
  </style>
</head>
<body>
  <div class="name" id="char-name">—</div>
  <div id="char-class">—</div>
  <div id="char-attrs"></div>
  <div id="resources"></div>

  <script src="../skin_api.js"></script>
  <script src="../resource_tracker.js"></script>
  <script>
    window.renderSkin = function(data) {
      document.getElementById('char-name').textContent =
        data.NameTextbox || '未命名';

      document.getElementById('char-class').textContent =
        `${data.RaceTextbox} · ${data.CommunityTextbox} · ${data.ClassTextbox}`;

      document.getElementById('char-attrs').textContent =
        `敏捷${data.AgilityTextbox} 力量${data.StrengthTextbox} ` +
        `灵巧${data.FinesseTextbox} 本能${data.InstinctTextbox} ` +
        `风度${data.PresenceTextbox} 知识${data.KnowledgeTextbox}`;

      const res = DH.parseResources(data);
      new DH.ResourceWidget({
        container: document.getElementById('resources'),
        resources:  res,
        onUpdate: (key, cur, max) => {
          const el = document.querySelector(`[data-dh-display="${key}"]`);
          if (el) el.textContent = `${cur}/${max}`;
        }
      });
    };
  </script>
</body>
</html>
```

---

## 九、注意事项

1. **皮肤只读**：皮肤页面仅用于展示，不能修改角色数据。如需修改，回到主工程操作，再重新"使用皮肤"。
2. **路径**：`skin_api.js` 和 `resource_tracker.js` 始终相对于皮肤文件夹，路径写 `../`。
3. **必须实现 `window.renderSkin`**：否则控制台会报错，皮肤不显示任何数据。
4. **数值转换**：JSON 中所有数值都是字符串，需要自行用 `parseInt()` 或 `Number()` 转换。
