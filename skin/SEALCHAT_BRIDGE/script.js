(function() {
  'use strict';

  var BRIDGE_TYPE = 'SC_SKIN_BRIDGE';
  var BRIDGE_VERSION = 1;
  var state = {
    name: '',
    avatarUrl: '',
    attrs: {}
  };
  var selectedAdvantageMode = 'normal';

  var BASIC_FIELDS = [
    { key: 'NameTextbox', label: '姓名' },
    { key: 'RaceTextbox', label: '种族' },
    { key: 'CommunityTextbox', label: '社群' },
    { key: 'ClassTextbox', label: '职业' },
    { key: 'ClassDomainTextbox', label: '领域' },
    { key: 'LevelTextbox', label: '等级', inputMode: 'numeric' },
    { key: 'EvasionTextbox', label: '闪避', inputMode: 'numeric' },
    { key: 'ArmorTextbox', label: '护甲', inputMode: 'numeric' },
    { key: 'MajorTextbox', label: '重伤阈值', inputMode: 'numeric' },
    { key: 'SevereTextbox', label: '严重阈值', inputMode: 'numeric' }
  ];

  var ATTR_FIELDS = [
    { key: 'AgilityTextbox', label: '敏捷' },
    { key: 'StrengthTextbox', label: '力量' },
    { key: 'FinesseTextbox', label: '灵巧' },
    { key: 'InstinctTextbox', label: '直觉' },
    { key: 'PresenceTextbox', label: '风度' },
    { key: 'KnowledgeTextbox', label: '学识' }
  ];

  var RESOURCE_FIELDS = [
    { id: 'hp', label: '生命', curKey: 'HpCurrent', maxKey: 'HpMax' },
    { id: 'stress', label: '压力', curKey: 'StressCurrent', maxKey: 'StressMax' },
    { id: 'armor', label: '护甲', curKey: 'ArmorCurrent', maxKey: 'ArmorTextbox' },
    { id: 'hope', label: '希望', curKey: 'HopeCurrent', maxKey: 'HopeMax' }
  ];

  var EQUIPMENT_FIELDS = [
    { key: 'PrimaryWeaponNameTextbox', label: '主武器名称' },
    { key: 'PrimaryWeaponStatTextbox', label: '主武器属性' },
    { key: 'PrimaryWeaponDamageTextbox', label: '主武器伤害' },
    { key: 'PrimaryWeaponTraitTextbox', label: '主武器特性', multiline: true },
    { key: 'SecondaryWeaponNameTextbox', label: '副武器名称' },
    { key: 'SecondaryWeaponStatTextbox', label: '副武器属性' },
    { key: 'SecondaryWeaponDamageTextbox', label: '副武器伤害' },
    { key: 'SecondaryWeaponTraitTextbox', label: '副武器特性', multiline: true },
    { key: 'ArmorNameTextbox', label: '护甲名称' },
    { key: 'ArmorThresholdTextbox', label: '护甲阈值' },
    { key: 'ArmorTraitTextbox', label: '护甲特性', multiline: true },
    { key: 'Backup1WeaponNameTextbox', label: '备用武器一' },
    { key: 'Backup1WeaponDamageTextbox', label: '备用武器一伤害' },
    { key: 'Backup2WeaponNameTextbox', label: '备用武器二' },
    { key: 'Backup2WeaponDamageTextbox', label: '备用武器二伤害' }
  ];

  var NOTE_FIELDS = [
    { key: 'ClassFeatureTextbox', label: '职业特性', multiline: true },
    { key: 'ItemSlot1Textbox', label: '物品栏', multiline: true }
  ];

  function byId(id) {
    return document.getElementById(id);
  }

  function num(value) {
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function esc(text) {
    var div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj || {}));
  }

  function setStatus(text) {
    var el = byId('bridge-status');
    if (el) el.textContent = text || '';
  }

  function postBridge(action, payload) {
    if (window.parent === window) return;
    window.parent.postMessage({
      type: BRIDGE_TYPE,
      version: BRIDGE_VERSION,
      channel: 'skin-to-host',
      action: action,
      payload: payload || {}
    }, '*');
  }

  function notifyEditState(kind, field) {
    postBridge('UI_EVENT', { kind: kind, field: field || '' });
  }

  function commitAttrPatch(patch) {
    Object.keys(patch || {}).forEach(function(key) {
      state.attrs[key] = patch[key];
      if (key === 'NameTextbox') state.name = patch[key];
    });
    postBridge('PATCH_ATTRS', { attrs: patch, source: 'skin-field-edit' });
  }

  function commitResourcePatch(patch, resourceId) {
    Object.keys(patch || {}).forEach(function(key) {
      state.attrs[key] = patch[key];
    });
    postBridge('PATCH_RESOURCES', {
      resource: resourceId,
      attrs: patch
    });
  }

  function fieldValue(key) {
    var value = state.attrs[key];
    return value == null ? '' : String(value);
  }

  function resolveResourceState(def) {
    var current = num(state.attrs[def.curKey]);
    var max = num(state.attrs[def.maxKey]);
    if (!max && window.SkinUtils && window.SkinUtils.parseResources) {
      var parsed = window.SkinUtils.parseResources(state.attrs || {});
      if (parsed && parsed[def.id]) {
        current = parsed[def.id].current;
        max = parsed[def.id].max;
      }
    }
    if (max < 0) max = 0;
    if (current < 0) current = 0;
    if (current > max && max > 0) current = max;
    return { current: current, max: max };
  }

  function buildField(container, field) {
    var wrap = document.createElement('div');
    wrap.className = 'field-item';

    var label = document.createElement('label');
    label.className = 'field-label';
    label.textContent = field.label;
    wrap.appendChild(label);

    var control = document.createElement(field.multiline ? 'textarea' : 'input');
    control.className = field.multiline ? 'field-textarea' : 'field-control';
    if (!field.multiline && field.inputMode === 'numeric') control.type = 'number';
    control.dataset.field = field.key;
    control.addEventListener('focus', function() {
      notifyEditState('EDIT_START', field.key);
    });
    control.addEventListener('blur', function() {
      notifyEditState('EDIT_END', field.key);
      if (fieldValue(field.key) !== control.value) {
        var patch = {};
        patch[field.key] = control.value;
        commitAttrPatch(patch);
      }
    });
    if (!field.multiline) {
      control.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          control.blur();
        }
      });
    }
    wrap.appendChild(control);
    container.appendChild(wrap);
  }

  function buildAttrField(container, field) {
    var wrap = document.createElement('div');
    wrap.className = 'attr-item';

    var head = document.createElement('div');
    head.className = 'attr-head';
    var label = document.createElement('span');
    label.className = 'attr-label';
    label.textContent = field.label;
    var rollBtn = document.createElement('button');
    rollBtn.type = 'button';
    rollBtn.className = 'roll-btn';
    rollBtn.textContent = '掷骰';
    rollBtn.addEventListener('click', function() {
      postBridge('ROLL_REQUEST', {
        source: field.label,
        attrKey: field.key,
        attrModifier: num(fieldValue(field.key)),
        extraModifier: num(byId('global-extra-mod').value),
        advantageMode: selectedAdvantageMode === 'normal' ? '' : selectedAdvantageMode,
        rollType: 'action'
      });
      setStatus('已发送掷骰请求：' + field.label);
    });
    head.appendChild(label);
    head.appendChild(rollBtn);
    wrap.appendChild(head);

    var body = document.createElement('div');
    body.className = 'attr-body';
    var input = document.createElement('input');
    input.type = 'number';
    input.className = 'field-control';
    input.dataset.field = field.key;
    input.addEventListener('focus', function() {
      notifyEditState('EDIT_START', field.key);
    });
    input.addEventListener('blur', function() {
      notifyEditState('EDIT_END', field.key);
      if (fieldValue(field.key) !== input.value) {
        var patch = {};
        patch[field.key] = input.value;
        commitAttrPatch(patch);
      }
    });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        input.blur();
      }
    });
    body.appendChild(input);
    wrap.appendChild(body);
    container.appendChild(wrap);
  }

  function buildResourceField(container, def) {
    var wrap = document.createElement('div');
    wrap.className = 'resource-item';
    wrap.dataset.resourceId = def.id;

    var head = document.createElement('div');
    head.className = 'resource-head';
    var label = document.createElement('span');
    label.className = 'resource-label';
    label.textContent = def.label;
    head.appendChild(label);
    wrap.appendChild(head);

    var body = document.createElement('div');
    body.className = 'resource-body';
    var minus = document.createElement('button');
    minus.type = 'button';
    minus.className = 'resource-btn';
    minus.textContent = '−';
    minus.addEventListener('click', function() {
      adjustResource(def, -1);
    });

    var current = document.createElement('input');
    current.type = 'number';
    current.className = 'resource-value';
    current.dataset.field = def.curKey;
    current.addEventListener('focus', function() {
      notifyEditState('EDIT_START', def.curKey);
    });
    current.addEventListener('blur', function() {
      notifyEditState('EDIT_END', def.curKey);
      commitResourceValue(def, current.value, null);
    });

    var divider = document.createElement('span');
    divider.className = 'resource-divider';
    divider.textContent = '/';

    var max = document.createElement('input');
    max.type = 'number';
    max.className = 'resource-max';
    max.dataset.field = def.maxKey;
    max.addEventListener('focus', function() {
      notifyEditState('EDIT_START', def.maxKey);
    });
    max.addEventListener('blur', function() {
      notifyEditState('EDIT_END', def.maxKey);
      commitResourceValue(def, null, max.value);
    });

    var plus = document.createElement('button');
    plus.type = 'button';
    plus.className = 'resource-btn';
    plus.textContent = '+';
    plus.addEventListener('click', function() {
      adjustResource(def, 1);
    });

    body.appendChild(minus);
    body.appendChild(current);
    body.appendChild(divider);
    body.appendChild(max);
    body.appendChild(plus);
    wrap.appendChild(body);
    container.appendChild(wrap);
  }

  function buildExperienceField(container, index) {
    var wrap = document.createElement('div');
    wrap.className = 'exp-item';

    var head = document.createElement('div');
    head.className = 'exp-head';
    var label = document.createElement('span');
    label.className = 'exp-label';
    label.textContent = '经历 ' + index;
    head.appendChild(label);
    wrap.appendChild(head);

    var body = document.createElement('div');
    body.className = 'exp-body';
    var nameInput = document.createElement('input');
    nameInput.className = 'field-control';
    nameInput.dataset.field = 'Experience' + index + 'Textbox';
    nameInput.addEventListener('blur', function() {
      var key = 'Experience' + index + 'Textbox';
      if (fieldValue(key) !== nameInput.value) {
        var patch = {};
        patch[key] = nameInput.value;
        commitAttrPatch(patch);
      }
    });
    var modInput = document.createElement('input');
    modInput.className = 'field-control';
    modInput.dataset.field = 'Experience' + index + 'ModifierTextbox';
    modInput.addEventListener('blur', function() {
      var key = 'Experience' + index + 'ModifierTextbox';
      if (fieldValue(key) !== modInput.value) {
        var patch = {};
        patch[key] = modInput.value;
        commitAttrPatch(patch);
      }
    });
    body.appendChild(nameInput);
    body.appendChild(modInput);
    wrap.appendChild(body);
    container.appendChild(wrap);
  }

  function initializeLayout() {
    BASIC_FIELDS.forEach(function(field) {
      buildField(byId('basic-fields'), field);
    });
    ATTR_FIELDS.forEach(function(field) {
      buildAttrField(byId('attr-fields'), field);
    });
    RESOURCE_FIELDS.forEach(function(def) {
      buildResourceField(byId('resource-fields'), def);
    });
    for (var i = 1; i <= 5; i++) {
      buildExperienceField(byId('experience-fields'), i);
    }
    EQUIPMENT_FIELDS.forEach(function(field) {
      buildField(byId('equipment-fields'), field);
    });
    NOTE_FIELDS.forEach(function(field) {
      buildField(byId('note-fields'), field);
    });

    document.querySelectorAll('.tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tab = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(function(item) {
          item.classList.toggle('is-active', item === btn);
        });
        document.querySelectorAll('.tab-panel').forEach(function(panel) {
          panel.classList.toggle('is-active', panel.dataset.panel === tab);
        });
      });
    });

    document.querySelectorAll('#adv-toggle-group .toggle-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        selectedAdvantageMode = btn.dataset.adv || 'normal';
        document.querySelectorAll('#adv-toggle-group .toggle-btn').forEach(function(item) {
          item.classList.toggle('is-active', item === btn);
        });
      });
    });
  }

  function adjustResource(def, delta) {
    var currentState = resolveResourceState(def);
    var next = currentState.current + delta;
    if (next < 0) next = 0;
    if (currentState.max > 0 && next > currentState.max) next = currentState.max;
    var patch = {};
    patch[def.curKey] = String(next);
    commitResourcePatch(patch, def.id);
    renderResources();
  }

  function commitResourceValue(def, currentValue, maxValue) {
    var currentState = resolveResourceState(def);
    var patch = {};
    var nextCurrent = currentState.current;
    var nextMax = currentState.max;

    if (currentValue != null) nextCurrent = num(currentValue);
    if (maxValue != null) nextMax = num(maxValue);

    if (nextMax < 0) nextMax = 0;
    if (nextCurrent < 0) nextCurrent = 0;
    if (nextCurrent > nextMax && nextMax > 0) nextCurrent = nextMax;

    patch[def.curKey] = String(nextCurrent);
    patch[def.maxKey] = String(nextMax);
    commitResourcePatch(patch, def.id);
    renderResources();
  }

  function renderFields() {
    document.querySelectorAll('[data-field]').forEach(function(control) {
      var key = control.dataset.field;
      if (!key) return;
      if (document.activeElement === control) return;
      control.value = fieldValue(key);
    });
  }

  function renderResources() {
    RESOURCE_FIELDS.forEach(function(def) {
      var wrap = document.querySelector('[data-resource-id="' + def.id + '"]');
      if (!wrap) return;
      var resolved = resolveResourceState(def);
      var currentInput = wrap.querySelector('.resource-value');
      var maxInput = wrap.querySelector('.resource-max');
      if (currentInput && document.activeElement !== currentInput) currentInput.value = String(resolved.current);
      if (maxInput && document.activeElement !== maxInput) maxInput.value = String(resolved.max);
    });
  }

  function renderAvatar() {
    var image = byId('avatar-image');
    var fallback = byId('avatar-fallback');
    var avatar = state.avatarUrl || '';
    if (avatar) {
      image.src = avatar;
      image.style.display = 'block';
      fallback.style.display = 'none';
    } else {
      image.removeAttribute('src');
      image.style.display = 'none';
      fallback.style.display = 'flex';
    }
  }

  function resolveCardSrc(src) {
    if (!src) return '';
    if (/^(https?:|data:|\/)/i.test(src)) return src;
    return '../../' + src.replace(/^\.\//, '');
  }

  function renderCards() {
    var cardsGrid = byId('cards-grid');
    cardsGrid.innerHTML = '';
    var cards = Array.isArray(state.attrs.cards) ? state.attrs.cards : [];
    if (!cards.length) {
      cardsGrid.innerHTML = '<div class="empty-state">当前没有卡片数据。</div>';
      return;
    }

    cards.forEach(function(cardInfo) {
      var data = cardInfo && cardInfo.data != null ? cardInfo.data : cardInfo;
      if (!data) return;
      var card = document.createElement('div');
      card.className = 'card-item';

      if (typeof data === 'string') {
        var image = document.createElement('img');
        image.src = resolveCardSrc(data);
        image.alt = '卡图';
        card.appendChild(image);
      } else if (typeof data === 'object') {
        if (data.imageUrl) {
          var imageUrl = document.createElement('img');
          imageUrl.src = resolveCardSrc(data.imageUrl);
          imageUrl.alt = data['名称'] || data.name || '卡图';
          card.appendChild(imageUrl);
        } else {
          var title = data['名称'] || data.name || '未命名卡片';
          var type = data['类型'] || '卡片';
          var desc = data['描述'] || data.description || data.desc || data['效果'] || data['特性'] || '';
          card.innerHTML = '<div class="card-title">' + esc(title) + '</div>' +
            '<div class="card-type">' + esc(type) + '</div>' +
            '<div class="card-desc">' + esc(desc) + '</div>';
        }
      }

      cardsGrid.appendChild(card);
    });
  }

  function renderMeta() {
    if (window.SkinUtils && window.SkinUtils.parseGold) {
      var gold = window.SkinUtils.parseGold(state.attrs || {});
      byId('gold-display').textContent = '金币：' + gold.chest + ' 箱 / ' + gold.bag + ' 袋 / ' + gold.handful + ' 把';
    }
  }

  function renderAll() {
    renderFields();
    renderResources();
    renderAvatar();
    renderCards();
    renderMeta();
  }

  function applyPayload(payload) {
    payload = payload || {};
    if (payload.name != null) state.name = payload.name;
    if (payload.avatarUrl != null) state.avatarUrl = payload.avatarUrl;
    if (payload.attrs && typeof payload.attrs === 'object') {
      state.attrs = clone(payload.attrs);
      if (state.attrs.NameTextbox && !state.name) state.name = state.attrs.NameTextbox;
    }
    renderAll();
  }

  function applyPatch(patch) {
    Object.keys(patch || {}).forEach(function(key) {
      state.attrs[key] = patch[key];
      if (key === 'NameTextbox') state.name = patch[key];
    });
    renderAll();
  }

  function handleBridgeMessage(event) {
    var data = event.data;
    if (!data || data.type !== BRIDGE_TYPE || data.channel !== 'host-to-skin') return;
    switch (data.action) {
      case 'INIT':
      case 'STATE_REPLACE':
        applyPayload(data.payload || {});
        setStatus('已连接模板桥');
        break;
      case 'STATE_PATCH':
        applyPatch((data.payload && data.payload.attrs) || {});
        break;
      case 'ROLL_RESULT':
        setStatus('收到掷骰结果：' + ((data.payload && data.payload.source) || '检定'));
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

  document.addEventListener('DOMContentLoaded', function() {
    initializeLayout();
    renderAll();
    window.addEventListener('message', handleBridgeMessage);
    if (window.parent !== window) {
      setStatus('等待模板初始化…');
      postBridge('READY', { mode: 'embedded', skinId: 'SEALCHAT_BRIDGE' });
    } else {
      setStatus('独立预览模式');
    }
  });
})();