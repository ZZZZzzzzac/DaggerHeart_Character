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

  /**
   * 从 Local Storage 读取角色数据
   * @returns {object|null}
   */
  function loadCharacterData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        console.warn('[SkinAPI] 未找到角色数据，请先在主工程中点击"查看皮肤"。');
        return null;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('[SkinAPI] 解析角色数据失败:', e);
      return null;
    }
  }

  /**
   * 调用皮肤作者实现的 renderSkin 函数
   */
  function bootstrap() {
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
    // 已经加载完毕（如果 script 在底部）
    bootstrap();
  }

})();
