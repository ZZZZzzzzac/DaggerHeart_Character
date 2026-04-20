(function() {
  'use strict';

  var BRIDGE_TYPE = 'SC_SKIN_BRIDGE';
  var BRIDGE_VERSION = 1;
  var SKIN_ID = 'SEALCHAT_BRIDGE';
  var READY_RETRY_INTERVAL_MS = 600;
  var READY_RETRY_MAX = 10;

  var _hostBridgeConnected = false;
  var _readyRetryTimer = null;
  var _readyRetryCount = 0;
  var _pendingRollLabel = '';
  var _pendingAttrMod = 0;
  var _pendingRollOptions = { adv: false, dis: false, reaction: false };

  var S = {
    name: '',
    avatarUrl: '',
    attrs: {}
  };

  var ATTR_KEYS = {
    agility: 'AgilityTextbox',
    strength: 'StrengthTextbox',
    finesse: 'FinesseTextbox',
    instinct: 'InstinctTextbox',
    presence: 'PresenceTextbox',
    knowledge: 'KnowledgeTextbox'
  };
  var ATTR_LABELS = {
    agility: '敏捷',
    strength: '力量',
    finesse: '灵巧',
    instinct: '直觉',
    presence: '风度',
    knowledge: '学识'
  };
  var RES_KEYS = {
    hp: { cur: 'HpCurrent', max: 'HpMax' },
    stress: { cur: 'StressCurrent', max: 'StressMax' },
    armor: { cur: 'ArmorCurrent', max: 'ArmorTextbox' },
    hope: { cur: 'HopeCurrent', max: 'HopeMax' }
  };
  var INFO_KEYS = {
    race: 'RaceTextbox',
    community: 'CommunityTextbox',
    class_: 'ClassTextbox',
    classDomain: 'ClassDomainTextbox',
    level: 'LevelTextbox',
    evasion: 'EvasionTextbox',
    major: 'MajorTextbox',
    severe: 'SevereTextbox',
    classFeature: 'ClassFeatureTextbox',
    itemSlot: 'ItemSlot1Textbox'
  };
  var EXP_COUNT = 5;
  var GOLD_KEYS = { handful: 'GoldHandful', bag: 'GoldBag', chest: 'GoldChest' };

  function byId(id) {
    return document.getElementById(id);
  }

  function esc(text) {
    var div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj || {}));
  }

  function num(value) {
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function signed(value) {
    return (value >= 0 ? '+' : '') + value;
  }

  function shallowClone(obj) {
    var out = {};
    for (var key in obj) out[key] = obj[key];
    return out;
  }

  function a(key, source) {
    var obj = source || S.attrs;
    var value = obj[key];
    return value == null ? '' : String(value);
  }

  function an(key, source) {
    return num((source || S.attrs)[key]);
  }

  function setStatus(text) {
    window.__SEALCHAT_BRIDGE_STATUS__ = text || '';
  }

  function withSkinId(payload) {
    var next = {};
    var source = payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : {};
    for (var key in source) next[key] = source[key];
    next.skinId = SKIN_ID;
    return next;
  }

  function postBridge(action, payload) {
    if (window.parent === window) return;
    window.parent.postMessage({
      type: BRIDGE_TYPE,
      version: BRIDGE_VERSION,
      channel: 'skin-to-host',
      action: action,
      payload: withSkinId(payload)
    }, '*');
  }

  function notifyEditState(kind, field) {
    postBridge('UI_EVENT', { kind: kind, field: field || '' });
  }

  function clearReadyRetry() {
    if (_readyRetryTimer) {
      window.clearTimeout(_readyRetryTimer);
      _readyRetryTimer = null;
    }
  }

  function markHostConnected() {
    if (!_hostBridgeConnected) {
      _hostBridgeConnected = true;
      clearReadyRetry();
    }
    setStatus('已连接模板桥');
  }

  function scheduleReadyRetry() {
    if (window.parent === window) return;
    clearReadyRetry();
    _readyRetryCount = 0;

    function pingReady() {
      if (_hostBridgeConnected || _readyRetryCount >= READY_RETRY_MAX) return;
      _readyRetryCount += 1;
      postBridge('READY', { mode: 'embedded', attempt: _readyRetryCount });
      _readyRetryTimer = window.setTimeout(pingReady, READY_RETRY_INTERVAL_MS);
    }

    pingReady();
  }

  function getResourceMax(resId, source) {
    var attrs = source || S.attrs;
    var max = an(RES_KEYS[resId].max, attrs);
    if (max > 0) return max;
    if (resId === 'armor') return num(a('ArmorScoreTextbox', attrs)) || 0;
    if (resId === 'hope') return 6;
    return 6;
  }

  function getResourceState(resId, source) {
    var attrs = source || S.attrs;
    return {
      current: an(RES_KEYS[resId].cur, attrs),
      max: getResourceMax(resId, attrs)
    };
  }

  function getResourceDefByKey(key) {
    for (var resId in RES_KEYS) {
      if (RES_KEYS[resId].cur === key || RES_KEYS[resId].max === key) {
        return { id: resId, cur: RES_KEYS[resId].cur, max: RES_KEYS[resId].max };
      }
    }
    return null;
  }

  function applyLocalPatch(patch) {
    for (var key in patch) {
      S.attrs[key] = patch[key];
      if (key === 'NameTextbox') S.name = patch[key];
    }
  }

  function normalizePatch(patch) {
    var next = {};
    var hasChanges = false;
    for (var key in patch) {
      var value = patch[key] == null ? '' : String(patch[key]);
      if (a(key) === value) continue;
      next[key] = value;
      hasChanges = true;
    }
    return hasChanges ? next : null;
  }

  function postAttrPatch(patch) {
    var next = normalizePatch(patch);
    if (!next) return false;
    applyLocalPatch(next);
    postBridge('PATCH_ATTRS', { attrs: next, source: 'skin-field-edit' });
    render();
    return true;
  }

  function postResourcePatch(resourceId, patch) {
    var next = normalizePatch(patch);
    if (!next) return false;
    applyLocalPatch(next);
    postBridge('PATCH_RESOURCES', { resource: resourceId, attrs: next });
    render();
    return true;
  }

  function commitFieldValue(key, value) {
    var patch = {};
    patch[key] = value;
    var resourceDef = getResourceDefByKey(key);
    if (resourceDef) return postResourcePatch(resourceDef.id, patch);
    return postAttrPatch(patch);
  }

  function syncRollOptionButtons() {
    byId('modalToggleAdv').classList.toggle('active', !!_pendingRollOptions.adv);
    byId('modalToggleDis').classList.toggle('active', !!_pendingRollOptions.dis);
    byId('modalToggleReaction').classList.toggle('active', !!_pendingRollOptions.reaction);
  }

  function openRollModal(label, modifier) {
    _pendingRollLabel = label;
    _pendingAttrMod = num(modifier);
    _pendingRollOptions = { adv: false, dis: false, reaction: false };
    byId('modalTitle').textContent = label + '检定';
    byId('modalAttrMod').textContent = signed(_pendingAttrMod);
    byId('modalMod').value = '0';
    syncRollOptionButtons();
    byId('rollModal').classList.add('active');
  }

  function closeRollModalInternal() {
    byId('rollModal').classList.remove('active');
  }

  function sendRollEvent(rollRequest, sourceLabel) {
    postBridge('ROLL_REQUEST', {
      source: sourceLabel || '检定',
      attrModifier: rollRequest && rollRequest.attrModifier,
      extraModifier: rollRequest && rollRequest.extraModifier,
      advantageMode: rollRequest && rollRequest.advDis,
      isReaction: !!(rollRequest && rollRequest.isReaction)
    });
  }

  window.toggleRollOption = function(option) {
    if (option === 'adv') {
      _pendingRollOptions.adv = !_pendingRollOptions.adv;
      if (_pendingRollOptions.adv) _pendingRollOptions.dis = false;
    }
    if (option === 'dis') {
      _pendingRollOptions.dis = !_pendingRollOptions.dis;
      if (_pendingRollOptions.dis) _pendingRollOptions.adv = false;
    }
    if (option === 'reaction') {
      _pendingRollOptions.reaction = !_pendingRollOptions.reaction;
    }
    syncRollOptionButtons();
  };

  window.closeRollModal = function() {
    closeRollModalInternal();
  };

  window.execRoll = function() {
    var extraMod = num(byId('modalMod').value);
    var rollMode = _pendingRollOptions.adv ? 'adv' : (_pendingRollOptions.dis ? 'dis' : '');
    sendRollEvent({
      attrModifier: _pendingAttrMod,
      extraModifier: extraMod,
      advDis: rollMode,
      isReaction: !!_pendingRollOptions.reaction
    }, _pendingRollLabel || '二元骰掷骰');
    closeRollModalInternal();
  };

  function buildClassLine() {
    var levelText = a(INFO_KEYS.level) || '0';
    return '等级' + levelText + ' ' + (a(INFO_KEYS.class_) || '-') + ' ' + (a(INFO_KEYS.classDomain) || '-');
  }

  function hasEquipmentBlock(prefix) {
    return !!(a(prefix + 'WeaponNameTextbox') || a(prefix + 'WeaponStatTextbox') || a(prefix + 'WeaponDamageTextbox') || a(prefix + 'WeaponTraitTextbox'));
  }

  function equipSummary(prefix) {
    var statKey = prefix + 'WeaponStatTextbox';
    var damageKey = prefix + 'WeaponDamageTextbox';
    return '<div class="equip-line">'
      + '<span data-edit-key="' + statKey + '">' + esc(a(statKey) || '-') + '</span>'
      + ' <span style="color:var(--dim)">·</span> '
      + '<span data-edit-key="' + damageKey + '">' + esc(a(damageKey) || '-') + '</span>'
      + '</div>';
  }

  function equipBlock(prefix, label) {
    var nameKey = prefix + 'WeaponNameTextbox';
    var trait = a(prefix + 'WeaponTraitTextbox');
    return '<div class="equip-block">'
      + '<div class="equip-title" data-edit-key="' + nameKey + '">' + esc(label + ': ' + (a(nameKey) || '(无)')) + '</div>'
      + equipSummary(prefix)
      + (trait ? '<div class="equip-line" data-edit-key="' + prefix + 'WeaponTraitTextbox">' + esc(trait) + '</div>' : '')
      + '</div>';
  }

  function armorBlock() {
    var trait = a('ArmorTraitTextbox');
    return '<div class="equip-block">'
      + '<div class="equip-title" data-edit-key="ArmorNameTextbox">' + esc('护甲: ' + (a('ArmorNameTextbox') || '(无)')) + '</div>'
      + '<div class="equip-line"><span data-edit-key="ArmorThresholdTextbox">阈值 ' + esc(a('ArmorThresholdTextbox') || '-') + '</span> <span style="color:var(--dim)">·</span> <span data-edit-key="ArmorScoreTextbox">护甲 ' + esc(a('ArmorScoreTextbox') || '-') + '</span></div>'
      + (trait ? '<div class="equip-line" data-edit-key="ArmorTraitTextbox">' + esc(trait) + '</div>' : '')
      + '</div>';
  }

  function resRow(label, resId, cls) {
    var state = getResourceState(resId);
    return '<div class="res-row ' + cls + '">'
      + '<span class="res-label">' + esc(label) + '</span>'
      + '<button class="res-btn" data-res-delta="' + resId + ':-1">−</button>'
      + '<span class="res-val" data-edit-key="' + RES_KEYS[resId].cur + '">' + state.current + '</span>'
      + '<span style="color:var(--dim)">/</span>'
      + '<span class="res-val" data-edit-key="' + RES_KEYS[resId].max + '">' + state.max + '</span>'
      + '<button class="res-btn" data-res-delta="' + resId + ':1">+</button>'
      + '</div>';
  }

  function resCard(label, resId, cls) {
    return '<div class="resource-card">' + resRow(label, resId, cls) + '</div>';
  }

  function goldCell(icon, label, key) {
    return '<div class="gold-row"><span>' + icon + '</span><span class="gold-label">' + esc(label) + '</span><span class="gold-val" data-edit-key="' + key + '">' + esc(an(key)) + '</span></div>';
  }

  function resolveCardSrc(src) {
    if (!src) return '';
    if (/^(https?:|data:|\/)/i.test(src)) return src;
    return '../../' + String(src).replace(/^\.\//, '');
  }

  function buildCardsHtml() {
    var cards = Array.isArray(S.attrs.cards) ? S.attrs.cards : [];
    if (!cards.length) {
      return '<div class="empty-state">当前没有卡片数据。</div>';
    }

    var html = '';
    for (var i = 0; i < cards.length; i++) {
      var cardInfo = cards[i];
      var data = cardInfo && cardInfo.data != null ? cardInfo.data : cardInfo;
      if (!data) continue;
      html += '<div class="card-item">';
      if (typeof data === 'string') {
        html += '<img src="' + esc(resolveCardSrc(data)) + '" alt="卡图">';
      } else if (typeof data === 'object') {
        if (data.imageUrl) {
          html += '<img src="' + esc(resolveCardSrc(data.imageUrl)) + '" alt="' + esc(data['名称'] || data.name || '卡图') + '">';
        }
        html += '<div class="card-meta">';
        html += '<div class="card-title">' + esc(data['名称'] || data.name || '未命名卡片') + '</div>';
        if (data['类型'] || data.type) {
          html += '<div class="card-type">' + esc(data['类型'] || data.type) + '</div>';
        }
        if (data['描述'] || data.description || data.desc || data['效果'] || data['特性']) {
          html += '<div class="card-desc">' + esc(data['描述'] || data.description || data.desc || data['效果'] || data['特性']) + '</div>';
        }
        html += '</div>';
      }
      html += '</div>';
    }
    return html || '<div class="empty-state">当前没有卡片数据。</div>';
  }

  function render() {
    var el = byId('app');
    if (!el) return;
    if (!S.attrs || Object.keys(S.attrs).length === 0) {
      el.innerHTML = '<div class="empty">等待角色数据…</div>';
      return;
    }

    var avatarHtml = S.avatarUrl ? '<img src="' + esc(S.avatarUrl) + '">' : esc((a('NameTextbox') || S.name || '?').charAt(0));
    var order = ['agility', 'strength', 'finesse', 'instinct', 'presence', 'knowledge'];
    var html = '';

    html += '<div class="sheet">';
    html += '<div class="header">';
    html += '  <div class="header-main">';
    html += '    <div class="avatar">' + avatarHtml + '</div>';
    html += '    <div class="header-info">';
    html += '      <div class="char-name" data-edit-key="NameTextbox">' + esc(a('NameTextbox') || S.name || '未命名') + '</div>';
    html += '      <div class="char-sub">' + esc(a(INFO_KEYS.race)) + ' · ' + esc(a(INFO_KEYS.community)) + '</div>';
    html += '      <div class="char-sub">' + esc(buildClassLine()) + '</div>';
    html += '    </div>';
    html += '  </div>';
    html += '  <div class="header-side">';
    html += '    <div class="defense-item"><span class="defense-key">闪避</span><span class="inline-link" data-edit-key="' + INFO_KEYS.evasion + '">' + esc(a(INFO_KEYS.evasion) || '-') + '</span></div>';
    html += '    <div class="defense-item"><span class="defense-key">阈值</span><span class="inline-link" data-edit-key="' + INFO_KEYS.major + '">' + esc(a(INFO_KEYS.major) || '-') + '</span> / <span class="inline-link" data-edit-key="' + INFO_KEYS.severe + '">' + esc(a(INFO_KEYS.severe) || '-') + '</span></div>';
    html += '  </div>';
    html += '</div>';

    html += '<div class="section"><div class="grid6">';
    for (var i = 0; i < order.length; i++) {
      var attrId = order[i];
      html += cellV(ATTR_LABELS[attrId], a(ATTR_KEYS[attrId]), ATTR_KEYS[attrId], attrId);
    }
    html += '</div></div>';

    html += '<div class="section"><div class="resource-wrap">';
    html += resCard('生命', 'hp', 'res-hp');
    html += resCard('压力', 'stress', 'res-stress');
    html += resCard('护甲', 'armor', 'res-armor');
    html += resCard('希望', 'hope', 'res-hope');
    html += '</div></div>';

    html += '<div class="section"><div class="exp-wrap">';
    for (var expIndex = 1; expIndex <= EXP_COUNT; expIndex++) {
      var expNameKey = 'Experience' + expIndex + 'Textbox';
      var expModKey = 'Experience' + expIndex + 'ModifierTextbox';
      var expName = a(expNameKey);
      var expMod = a(expModKey);
      if (!expName && !expMod && expIndex > 3) continue;
      html += '<div class="exp-card">';
      html += '  <span class="exp-name" data-edit-key="' + expNameKey + '">' + esc(expName || '(空)') + '</span>';
      html += '  <span class="exp-mod" data-edit-key="' + expModKey + '">' + esc(expMod || '+0') + '</span>';
      html += '</div>';
    }
    html += '</div>';

    html += '<div class="section"><div class="section-title">装备 Equipment</div><div class="equip-grid">';
    html += equipBlock('Primary', '主武器');
    html += equipBlock('Secondary', '副武器');
    html += armorBlock();
    if (hasEquipmentBlock('Backup1')) html += equipBlock('Backup1', '备用武器1');
    if (hasEquipmentBlock('Backup2')) html += equipBlock('Backup2', '备用武器2');
    html += '</div>';
    if (a(INFO_KEYS.itemSlot)) {
      html += '<div class="equip-block"><div class="equip-title">物品栏</div><div class="equip-line" data-edit-key="' + INFO_KEYS.itemSlot + '">' + esc(a(INFO_KEYS.itemSlot)) + '</div></div>';
    }
    html += '</div>';

    html += '<div class="section"><div class="section-title">金币 Gold</div><div class="gold-wrap">';
    html += goldCell('🪙', '一把', GOLD_KEYS.handful);
    html += goldCell('💰', '一袋', GOLD_KEYS.bag);
    html += goldCell('📦', '一箱', GOLD_KEYS.chest);
    html += '</div></div>';

    if (a(INFO_KEYS.classFeature)) {
      html += '<div class="section"><div class="section-title">职业特性 Class Features</div><div class="equip-line" data-edit-key="' + INFO_KEYS.classFeature + '">' + esc(a(INFO_KEYS.classFeature)) + '</div></div>';
    }

    html += '<div class="section"><div class="section-title">卡片 Cards</div><div class="cards-grid">' + buildCardsHtml() + '</div></div>';
    html += '</div>';
    el.innerHTML = html;
  }

  function cellV(label, value, key, rollAttr) {
    var html = '<div class="cell"><span class="cell-label">' + esc(label) + '</span><div class="cell-main"><span class="cell-val" data-edit-key="' + key + '">' + esc(value || '-') + '</span>';
    if (rollAttr) html += '<button class="attr-roll-btn" data-roll-attr="' + rollAttr + '" title="掷骰">🎲</button>';
    html += '</div></div>';
    return html;
  }

  function startEdit(el, key) {
    if (el.dataset.editing === '1') return;
    var current = a(key);
    var isMultiline = current.indexOf('\n') >= 0 || key === INFO_KEYS.classFeature || key === INFO_KEYS.itemSlot || /TraitTextbox$/.test(key);
    var input = document.createElement(isMultiline ? 'textarea' : 'input');
    var finished = false;

    input.className = 'inline-edit';
    input.value = current;
    if (!isMultiline) {
      input.style.width = Math.max(el.offsetWidth + 20, 40) + 'px';
    } else {
      input.style.width = '100%';
      input.style.minHeight = '80px';
      input.style.textAlign = 'left';
    }

    el.textContent = '';
    el.appendChild(input);
    el.dataset.editing = '1';
    notifyEditState('EDIT_START', key);
    input.focus();
    if (input.select) input.select();

    var commit = function() {
      if (finished) return;
      finished = true;
      notifyEditState('EDIT_END', key);
      if (!commitFieldValue(key, input.value)) render();
    };
    var cancel = function() {
      if (finished) return;
      finished = true;
      notifyEditState('EDIT_END', key);
      render();
    };

    input.addEventListener('blur', commit);
    input.addEventListener('keydown', function(e) {
      if (!isMultiline && e.key === 'Enter') {
        e.preventDefault();
        commit();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      }
    });
    input.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  function applyPayload(payload) {
    payload = payload || {};
    if (payload.name != null) S.name = payload.name;
    if (payload.avatarUrl != null) S.avatarUrl = payload.avatarUrl;
    if (payload.attrs && typeof payload.attrs === 'object') {
      S.attrs = clone(payload.attrs);
      if (S.attrs.NameTextbox && !S.name) S.name = S.attrs.NameTextbox;
    }
    render();
  }

  function applyPatch(patch) {
    applyLocalPatch(shallowClone(patch || {}));
    render();
  }

  function handleBridgeMessage(event) {
    var data = event.data;
    if (window.parent !== window && event.source !== window.parent) return;
    if (!data || data.type !== BRIDGE_TYPE || data.channel !== 'host-to-skin') return;

    switch (data.action) {
      case 'INIT':
      case 'STATE_REPLACE':
        markHostConnected();
        applyPayload(data.payload || {});
        break;
      case 'STATE_PATCH':
        markHostConnected();
        applyPatch((data.payload && data.payload.attrs) || {});
        break;
      case 'ROLL_RESULT':
        markHostConnected();
        break;
    }
  }

  window.renderSkin = function(jsonData) {
    applyPayload({
      name: jsonData && jsonData.NameTextbox || '',
      avatarUrl: jsonData && (jsonData.avatarImageSrc || jsonData.avatarUrl) || '',
      attrs: jsonData || {}
    });
    setStatus('独立预览模式');
  };

  document.addEventListener('click', function(e) {
    var target = e.target;
    var editEl = target.closest('[data-edit-key]');
    if (editEl && editEl.dataset.editing !== '1') {
      startEdit(editEl, editEl.dataset.editKey);
      return;
    }

    var resDelta = target.closest('[data-res-delta]');
    if (resDelta) {
      var parts = resDelta.dataset.resDelta.split(':');
      var resId = parts[0];
      var delta = num(parts[1]);
      var state = getResourceState(resId);
      var patch = {};
      patch[RES_KEYS[resId].cur] = clamp(state.current + delta, 0, state.max);
      postResourcePatch(resId, patch);
      return;
    }

    var attrRoll = target.closest('[data-roll-attr]');
    if (attrRoll) {
      var attrId = attrRoll.dataset.rollAttr;
      openRollModal(ATTR_LABELS[attrId] || attrId, an(ATTR_KEYS[attrId]));
      return;
    }

    if (target.id === 'rollModal') {
      closeRollModalInternal();
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    render();
    window.addEventListener('message', handleBridgeMessage);
    if (window.parent !== window) {
      setStatus('等待模板初始化…');
      scheduleReadyRetry();
    } else {
      setStatus('独立预览模式');
    }
  });
})();