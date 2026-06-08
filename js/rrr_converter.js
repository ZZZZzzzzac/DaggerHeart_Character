/**
 * rrr 格式检测与转换模块
 *
 * rrr 格式：包含包元数据（name/version/author等）+ 按类型分组的卡牌对象
 * zzz 格式：统一扁平数组，每张卡通过 "类型" 字段区分
 *
 * 上传自定义卡包时自动检测格式并转换为 zzz 格式。
 */

(function () {
    'use strict';

    /** rrr 格式中卡牌分组键名 */
    var RRR_CATEGORY_KEYS = ['profession', 'ancestry', 'community', 'subclass', 'domain', 'variant'];

    /**
     * 判断数据是否为 rrr 格式（带元数据的卡包对象）
     */
    function isRRRFormat(data) {
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            return false;
        }
        if (typeof data.name !== 'string' || typeof data.version !== 'string') {
            return false;
        }
        return RRR_CATEGORY_KEYS.some(function (key) {
            return Array.isArray(data[key]) && data[key].length > 0;
        });
    }

    /**
     * 将 rrr 格式的卡包数据转换为 zzz 格式（扁平卡牌数组）
     */
    function convertRRRToZZZ(packData) {
        var result = [];

        // 主职
        var professions = packData.profession || [];
        professions.forEach(function (d) {
            result.push({
                名称: d['名称'] || '',
                原名: d.id || '',
                类型: '主职',
                领域: (d['领域1'] || '') + '+' + (d['领域2'] || ''),
                初始闪避值: d['起始闪避'] !== undefined ? d['起始闪避'] : '',
                初始生命点: d['起始生命'] !== undefined ? d['起始生命'] : '',
                希望特性: d['希望特性'] || '',
                职业特性: d['职业特性'] || '',
                背景问题: d['背景问题'] || [],
                关系问题: d['关系问题'] || [],
                简介: d['简介'] || ''
            });
        });

        // 种族（rrr 中每项是一个独立特性，zzz 中按种族名合并）
        var raceMap = {};
        var ancestries = packData.ancestry || [];
        ancestries.forEach(function (d) {
            var raceName = d['种族'] || '';
            if (!raceMap[raceName]) {
                raceMap[raceName] = {
                    名称: raceName,
                    原名: '',
                    类型: '种族',
                    简介: d['简介'] || '',
                    描述: d['名称'] + '：' + (d['效果'] || '')
                };
            } else {
                raceMap[raceName].描述 = raceMap[raceName].描述 + '\n' + d['名称'] + '：' + (d['效果'] || '');
            }
        });
        for (var key in raceMap) {
            if (Object.prototype.hasOwnProperty.call(raceMap, key)) {
                result.push(raceMap[key]);
            }
        }

        // 社群
        var communities = packData.community || [];
        communities.forEach(function (d) {
            result.push({
                名称: d['名称'] || '',
                原名: d.id || '',
                类型: '社群',
                性格: '',
                简介: d['简介'] || '',
                描述: (d['特性'] || '') + '：' + (d['描述'] || '')
            });
        });

        // 子职
        var subclassLvMap = { '基石': '基础', '专精': '进阶', '大师': '精通' };
        var subclasses = packData.subclass || [];
        subclasses.forEach(function (d) {
            var rawLv = d['等级'] || '';
            var convertedLv = subclassLvMap[rawLv] || rawLv;
            result.push({
                名称: (d['子职业'] || '') + '-' + convertedLv,
                原名: '',
                类型: '子职',
                主职: d['主职'] || '',
                等级: convertedLv,
                施法属性: d['施法'] || '',
                描述: d['描述'] || ''
            });
        });

        // 领域卡
        var domains = packData.domain || [];
        domains.forEach(function (d) {
            result.push({
                名称: d['名称'] || '',
                原名: d.id || '',
                类型: '领域卡',
                领域: d['领域'] || '',
                等级: String(d['等级'] !== undefined ? d['等级'] : ''),
                属性: d['属性'] || '',
                回想: String(d['回想'] !== undefined ? d['回想'] : ''),
                描述: d['描述'] || ''
            });
        });

        // variant（战利品/自定义卡等）
        var variants = packData.variant || [];
        variants.forEach(function (d) {
            var card = {};
            for (var k in d) {
                if (!Object.prototype.hasOwnProperty.call(d, k)) continue;
                if (k === 'id' || k === 'imageUrl') continue;
                card[k] = d[k];
            }
            // 简略信息 从 object → "item0/item1/..." 字符串
            var info = d['简略信息'];
            if (info && typeof info === 'object' && !Array.isArray(info)) {
                var parts = [];
                var keys = Object.keys(info).sort(function (a, b) {
                    var na = parseInt(a.replace(/^item/i, ''), 10);
                    var nb = parseInt(b.replace(/^item/i, ''), 10);
                    return na - nb;
                });
                keys.forEach(function (k2) {
                    if (info[k2]) {
                        parts.push(info[k2]);
                    }
                });
                card['简略信息'] = parts.join('/');
            }
            result.push(card);
        });

        return result;
    }

    /**
     * 统一入口：检测是否 rrr 格式，若是则转换后返回 zzz 数组，否则原样返回
     */
    function normalizeCardPack(data) {
        if (isRRRFormat(data)) {
            return convertRRRToZZZ(data);
        }
        return data;
    }

    window.RRRConverter = {
        isRRRFormat: isRRRFormat,
        convertRRRToZZZ: convertRRRToZZZ,
        normalizeCardPack: normalizeCardPack
    };
})();
