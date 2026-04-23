/**
 * ============================================================
 * Daggerheart 皮肤接口 (Skin API)
 * ============================================================
 * 版本: 1.0
 *
 * 【给皮肤作者的说明】
 * 请在您的皮肤 index.html 中引入本文件：
 *   <script src="../skin_api.js"></script>
 *
 * 然后在您的 script.js 中实现以下函数：
 *   window.renderSkin = function(jsonData) {
 *     // jsonData 是完整的角色 JSON 对象
 *     // 在这里把数据填入您的美术页面
 *   };
 *
 * 接口会自动在页面加载完成后调用 renderSkin。
 *
 * 【JSON 数据结构主要字段参考】
 *   jsonData.NameTextbox          - 角色名称
 *   jsonData.RaceTextbox          - 种族
 *   jsonData.CommunityTextbox     - 社群
 *   jsonData.ClassTextbox         - 职业
 *   jsonData.LevelTextbox         - 等级
 *   jsonData.EvasionTextbox       - 闪避值
 *   jsonData.ArmorTextbox         - 护甲值
 *   jsonData.StrengthTextbox      - 力量
 *   jsonData.AgilityTextbox       - 敏捷
 *   jsonData.FinesseTextbox       - 灵巧
 *   jsonData.InstinctTextbox      - 本能
 *   jsonData.PresenceTextbox      - 风度
 *   jsonData.KnowledgeTextbox     - 知识
 *   jsonData.MajorTextbox         - 重伤阈值
 *   jsonData.SevereTextbox        - 严重阈值
 *   jsonData.ClassFeatureTextbox  - 职业特性
 *   jsonData.Experience1Textbox ~ Experience5Textbox - 经历1~5
 *   jsonData.avatarImageSrc       - 头像（Base64 DataURL）
 *   jsonData.cards                - 技能卡数组
 * ============================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'daggerheart_current_character';

  function isEmbeddedMode() {
    try {
      return window.parent !== window;
    } catch (e) {
      return true;
    }
  }

  /**
   * 从 Local Storage 读取角色数据
   * @returns {object|null}
   */
  function loadCharacterData() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        console.warn('[SkinAPI] 未找到角色数据，请先在主工程中点击"查看皮肤"。');
        return null;
      }
      return JSON.parse(raw);
    } catch (e) {
      if (e && e.name === 'SecurityError') {
        console.info('[SkinAPI] 当前运行在 sandbox iframe 中，跳过 localStorage 预览加载。');
        return null;
      }
      console.error('[SkinAPI] 解析角色数据失败:', e);
      return null;
    }
  }

  /**
   * 调用皮肤作者实现的 renderSkin 函数
   */
  function bootstrap() {
    if (isEmbeddedMode()) {
      return;
    }

    const data = loadCharacterData();

    if (typeof window.renderSkin !== 'function') {
      console.error('[SkinAPI] 未找到 window.renderSkin 函数！请在皮肤的 script.js 中实现它。');
      return;
    }

    if (data) {
      try {
        window.renderSkin(data);
        console.log('[SkinAPI] 皮肤渲染完成。角色：', data.NameTextbox || '(未命名)');
      } catch (e) {
        console.error('[SkinAPI] renderSkin 执行出错:', e);
      }
    }
  }

  // 在 DOM 完全加载后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  /**
   * ── 给皮肤作者的通用工具函数 API ───────────────────────────────
   * 可以通过 window.SkinUtils 在您的 script.js 中调用这些函数，
   * 避免重复编写金币解析、状态解析和升级树解析逻辑。
   */
  window.SkinUtils = {
    /**
     * 1. 解析资源（生命、压力、护甲、希望）
     * 与 resource_tracker.js 逻辑相同，但独立成纯函数方便纯展示皮肤调用。
     * @param {object} jsonData 角色数据
     * @returns {object} {hp, stress, armor, hope} 每个包含 {current, max}
     */
    parseResources: function(jsonData) {
      const count = (prefix, max, states) => {
        let n = 0;
        for (let i = 1; i <= max; i++) {
          if (states.includes(jsonData[`${prefix}${i}`])) n++;
        }
        return n;
      };
      
      let armorMax = parseInt(jsonData.ArmorTextbox, 10);
      if (isNaN(armorMax) || armorMax <= 0) {
        armorMax = count('ArmorSlotCheckbox', 12, ['0', '1']);
      }

      return {
        hp: { max: count('HpSlotCheckbox', 12, ['0', '1']), current: count('HpSlotCheckbox', 12, ['1']) },
        stress: { max: count('StressSlotCheckbox', 12, ['0', '1']), current: count('StressSlotCheckbox', 12, ['1']) },
        armor: { max: armorMax, current: count('ArmorSlotCheckbox', 12, ['1']) },
        hope: { max: count('HopeSlotCheckbox', 6, ['0', '1']), current: count('HopeSlotCheckbox', 6, ['1']) }
      };
    },

    /**
     * 2. 解析金币数量
     * @param {object} jsonData 角色数据
     * @returns {object} { handful, bag, chest } 把/袋/箱 的数量
     */
    parseGold: function(jsonData) {
      let handful = 0, bag = 0, chest = 0;
      for (let i = 1; i <= 9; i++) {
        if (jsonData[`HandfulGoldCheckbox${i}`] === "1") handful++;
        if (jsonData[`BagGoldCheckbox${i}`] === "1") bag++;
      }
      if (jsonData[`ChestGoldCheckbox1`] === "1") chest++;
      return { handful, bag, chest };
    },

    /**
     * 3. 解析升级系统选项
     * 将界面的复杂文本布局与对应位阶的 checkbox 值绑定，直接吐出结构化数组。
     * @param {object} jsonData 角色数据
     * @returns {Array} 包含 T2/T3/T4 数据的数组
     */
    parseLevelUp: function(jsonData) {
      const levelupConfig = [
        {
          tier: 'T2', title: 'T2: 等级2-4', 
          desc1: '当你到达 2 级时，获得一项额外+2经历，并且你的熟练值+1',
          desc2: '从下面列表中选择两个选项并标记他们',
          options: [
            { id: 'A', text: '两项未标记的角色属性+1，然后标记他们。', count: 3, double: false },
            { id: 'B', text: '总生命值+1', count: 2, double: false },
            { id: 'C', text: '总压力槽+1', count: 2, double: false },
            { id: 'D', text: '选择你的两项经历+1', count: 1, double: false },
            { id: 'E', text: '选择一张等级小于或等于你角色等级的领域卡（最高为4级）', count: 1, double: false },
            { id: 'G', text: '闪避值+1', count: 1, double: false }
          ],
          footer: '更新你的等级并相应调整你的伤害阈值，选择一张等级小于或等于你角色等级的领域卡'
        },
        {
          tier: 'T3', title: 'T3: 等级5-7', 
          options: [
            { id: 'A', text: '两项未标记的角色属性+1，然后标记他们。', count: 3, double: false },
            { id: 'B', text: '总生命值+1', count: 2, double: false },
            { id: 'C', text: '总压力槽+1', count: 2, double: false },
            { id: 'D', text: '选择你的两项经历+1', count: 1, double: false },
            { id: 'E', text: '选择一张等级小于或等于你角色等级的领域卡（最高为7级）', count: 1, double: false },
            { id: 'F', text: '升级你的子职并划掉兼职选项', count: 1, double: false },
            { id: 'G', text: '闪避值+1', count: 1, double: false },
            { id: 'H', text: '(一次性用两个可选项)熟练值+1', count: 1, double: true },
            { id: 'I', text: '(一次性用两个可选项)兼职：为你的角色选择一个额外子职，然后删去此位阶中“升级子职业”选项，以及此后所有“兼职”选项。', count: 1, double: true }
          ]
        },
        {
          tier: 'T4', title: 'T4: 等级8-10', 
          options: [
            { id: 'A', text: '两项未标记的角色属性+1，然后标记他们。', count: 3, double: false },
            { id: 'B', text: '总生命值+1', count: 2, double: false },
            { id: 'C', text: '总压力槽+1', count: 2, double: false },
            { id: 'D', text: '选择你的两项经历+1', count: 1, double: false },
            { id: 'E', text: '选择一张等级小于或等于你角色等级的领域卡（最高为10级）', count: 1, double: false },
            { id: 'F', text: '升级你的子职并划掉兼职选项', count: 1, double: false },
            { id: 'G', text: '闪避值+1', count: 1, double: false },
            { id: 'H', text: '(一次性用两个可选项)熟练值+1', count: 1, double: true },
            { id: 'I', text: '(一次性用两个可选项)兼职：为你的角色选择一个额外子职，然后删去此位阶中“升级子职业”选项，以及此后所有“兼职”选项。', count: 1, double: true }
          ]
        }
      ];

      // 深拷贝一份结果作为返回，并在每项 option 中注入解析完的状态数组
      const result = JSON.parse(JSON.stringify(levelupConfig));
      result.forEach(tierData => {
        tierData.options.forEach(opt => {
          opt.states = [];
          if (opt.double) {
            const val = jsonData[`Levelup${tierData.tier}_${opt.id}1`] || '0';
            opt.states.push(val, val); // UI 上两个方块
          } else {
            for (let i = 1; i <= opt.count; i++) {
              const val = jsonData[`Levelup${tierData.tier}_${opt.id}${i}`] || '0';
              opt.states.push(val);
            }
          }
        });
      });
      
      return result;
    }
  };

})();
