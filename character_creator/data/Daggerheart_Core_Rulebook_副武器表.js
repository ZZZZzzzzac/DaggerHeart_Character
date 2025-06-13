const SECONDARY_WEAPON = [
    {
        "name": "短剑",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d8",
        "two_handed": "副手",
        "desc": "**双持：**近战时主武器伤害+2。",
        "tier": 1
    },
    {
        "name": "圆盾",
        "trait": "力量",
        "range": "近战",
        "damage": "d4",
        "two_handed": "副手",
        "desc": "**保护：**护甲值+1。",
        "tier": 1
    },
    {
        "name": "塔盾",
        "trait": "力量",
        "range": "近战",
        "damage": "d6",
        "two_handed": "副手",
        "desc": "**壁垒：**+2护甲值，-1闪避值。",
        "tier": 1
    },
    {
        "name": "小匕首",
        "trait": "灵巧",
        "range": "近战",
        "damage": "d8",
        "two_handed": "副手",
        "desc": "**双持：**近战时主武器伤害+2。",
        "tier": 1
    },
    {
        "name": "鞭子",
        "trait": "风度",
        "range": "邻近",
        "damage": "d6",
        "two_handed": "副手",
        "desc": "**鞭笞：****标记 1 压力点**，将所有近战范围内的敌人击退至近距离。",
        "tier": 1
    },
    {
        "name": "抓钩",
        "trait": "灵巧",
        "range": "近距离",
        "damage": "d6",
        "two_handed": "副手",
        "desc": "**出钩：**进行一次成功的攻击后，你可以将目标拉至你的近战范围内。",
        "tier": 1
    },
    {
        "name": "手弩",
        "trait": "灵巧",
        "range": "远距离",
        "damage": "d6+1",
        "two_handed": "副手",
        "desc": "",
        "tier": 1
    },
    {
        "name": "改良短剑",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d8+2",
        "two_handed": "副手",
        "desc": "**双持：**近战时主武器伤害+3。",
        "tier": 2
    },
    {
        "name": "改良圆盾",
        "trait": "力量",
        "range": "近战",
        "damage": "d4+2",
        "two_handed": "副手",
        "desc": "**保护：**护甲值+2。",
        "tier": 2
    },
    {
        "name": "改良塔盾",
        "trait": "力量",
        "range": "近战",
        "damage": "d6+2",
        "two_handed": "副手",
        "desc": "**壁垒：**护甲值+3，闪避值-1。",
        "tier": 2
    },
    {
        "name": "改良小匕首",
        "trait": "灵巧",
        "range": "近战",
        "damage": "d8+2",
        "two_handed": "副手",
        "desc": "**双持：**近战时主武器伤害+3。",
        "tier": 2
    },
    {
        "name": "改良鞭子",
        "trait": "风度",
        "range": "邻近",
        "damage": "d6+2",
        "two_handed": "副手",
        "desc": "**鞭笞：****标记 1 压力点**，将所有近战范围内的敌人击退至近距离。",
        "tier": 2
    },
    {
        "name": "改良抓钩",
        "trait": "灵巧",
        "range": "近距离",
        "damage": "d6+2",
        "two_handed": "副手",
        "desc": "**出钩：**进行一次成功的攻击后，你可以将目标拉至你的近战范围内。",
        "tier": 2
    },
    {
        "name": "改良手弩",
        "trait": "灵巧",
        "range": "远距离",
        "damage": "d6+3",
        "two_handed": "副手",
        "desc": "",
        "tier": 2
    },
    {
        "name": "尖刺盾牌",
        "trait": "力量",
        "range": "近战",
        "damage": "d6+2",
        "two_handed": "副手",
        "desc": "**两用：**护甲值+1，近战时主武器伤害+1。",
        "tier": 2
    },
    {
        "name": "格挡匕首",
        "trait": "灵巧",
        "range": "近战",
        "damage": "d6+2",
        "two_handed": "副手",
        "desc": "**格挡：**在你被攻击时，掷出该武器的伤害骰。如果有任何与攻击者匹配的骰子，则在伤害总计之前将其移除。",
        "tier": 2
    },
    {
        "name": "回力斧",
        "trait": "敏捷",
        "range": "近距离",
        "damage": "d6+4",
        "two_handed": "副手",
        "desc": "**回力：**当此武器在射程内被投掷后，会在完成攻击的瞬间重新出现在你手中。",
        "tier": 2
    },
    {
        "name": "高级短剑",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d8+4",
        "two_handed": "副手",
        "desc": "**双持：**近战时主武器伤害+4。",
        "tier": 3
    },
    {
        "name": "高级圆盾",
        "trait": "力量",
        "range": "近战",
        "damage": "d4+4",
        "two_handed": "副手",
        "desc": "**保护：**护甲值+3。",
        "tier": 3
    },
    {
        "name": "高级塔盾",
        "trait": "力量",
        "range": "近战",
        "damage": "d6+4",
        "two_handed": "副手",
        "desc": "**壁垒：**护甲值+4，闪避值-1。",
        "tier": 3
    },
    {
        "name": "高级小匕首",
        "trait": "灵巧",
        "range": "近战",
        "damage": "d8+4",
        "two_handed": "副手",
        "desc": "**双持：**近战时主武器伤害+4。",
        "tier": 3
    },
    {
        "name": "高级鞭子",
        "trait": "风度",
        "range": "邻近",
        "damage": "d6+4",
        "two_handed": "副手",
        "desc": "**鞭笞：****标记 1 压力点**，将所有近战范围内的敌人击退至近距离。",
        "tier": 3
    },
    {
        "name": "高级抓钩",
        "trait": "灵巧",
        "range": "近距离",
        "damage": "d6+4",
        "two_handed": "副手",
        "desc": "**出钩：**进行一次成功的攻击后，你可以将目标拉至你的近战范围内。",
        "tier": 3
    },
    {
        "name": "高级手弩",
        "trait": "灵巧",
        "range": "远距离",
        "damage": "d6+5",
        "two_handed": "副手",
        "desc": "",
        "tier": 3
    },
    {
        "name": "小盾",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d4+4",
        "two_handed": "副手",
        "desc": "**反射：**面对即将到来的攻击时，你可以**标记 1 护甲槽**，你的闪避值获得等同于你护甲值的加值。",
        "tier": 3
    },
    {
        "name": "强力拳套",
        "trait": "知识",
        "range": "近距离",
        "damage": "d6+4",
        "two_handed": "副手",
        "desc": "**充能攻击：****标记 1 压力点**，为主武器的攻击熟练+1。",
        "tier": 3
    },
    {
        "name": "弹弓",
        "trait": "灵巧",
        "range": "极远",
        "damage": "d6+4",
        "two_handed": "副手",
        "desc": "**多用：**这把武器也可以此方式使用 - 灵巧 近距离 d8+4。",
        "tier": 3
    },
    {
        "name": "传奇短剑",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d8+6",
        "two_handed": "副手",
        "desc": "**双持：**近战时主武器伤害+5。",
        "tier": 4
    },
    {
        "name": "传奇圆盾",
        "trait": "力量",
        "range": "近战",
        "damage": "d4+6",
        "two_handed": "副手",
        "desc": "**保护：**护甲值+4。",
        "tier": 4
    },
    {
        "name": "传奇塔盾",
        "trait": "力量",
        "range": "近战",
        "damage": "d6+6",
        "two_handed": "副手",
        "desc": "**壁垒：**护甲值+5，闪避值-1。",
        "tier": 4
    },
    {
        "name": "传奇小匕首",
        "trait": "灵巧",
        "range": "近战",
        "damage": "d8+6",
        "two_handed": "副手",
        "desc": "**双持：**近战时主武器伤害+5。",
        "tier": 4
    },
    {
        "name": "传奇鞭子",
        "trait": "风度",
        "range": "邻近",
        "damage": "d6+6",
        "two_handed": "副手",
        "desc": "**鞭笞：****标记 1 压力点**，将所有近战范围内的敌人击退至近距离。",
        "tier": 4
    },
    {
        "name": "传奇抓钩",
        "trait": "灵巧",
        "range": "近距离",
        "damage": "d6+6",
        "two_handed": "副手",
        "desc": "**出钩：**进行一次成功的攻击后，你可以将目标拉至你的近战范围内。",
        "tier": 4
    },
    {
        "name": "传奇手弩",
        "trait": "灵巧",
        "range": "远距离",
        "damage": "d6+7",
        "two_handed": "副手",
        "desc": "",
        "tier": 4
    },
    {
        "name": "勇气之盾",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d4+6",
        "two_handed": "副手",
        "desc": "**庇护：**当你**标记 1 护甲槽**时，它将为你和所有近战范围内受到同源伤害的盟友减免伤害。",
        "tier": 4
    },
    {
        "name": "拳爪",
        "trait": "力量",
        "range": "近战",
        "damage": "d6+8",
        "two_handed": "副手",
        "desc": "**双击：**当你使用主武器进行一次攻击后，你可以同时使用此武器对另一名近战范围内的敌人造成伤害。",
        "tier": 4
    },
    {
        "name": "引物碎片",
        "trait": "本能",
        "range": "邻近",
        "damage": "d4",
        "two_handed": "副手",
        "desc": "**锁定：**使用此武器对成功攻击一名敌人后，你的主武器对其的下一次攻击将自动命中。",
        "tier": 4
    }
]