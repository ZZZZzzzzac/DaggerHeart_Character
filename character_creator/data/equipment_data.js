const weapon_t0_physics = [
    {
        "名称": "战斧Battleaxe",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+3",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "战锤Warhammer",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d12+3",
        "负荷": "双手",
        "特性": "重型Heavy"
    },
    {
        "名称": "巨剑Greatsword",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+3",
        "负荷": "双手",
        "特性": "巨型Massive"
    },
    {
        "名称": "钉头锤Mace",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+1",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "阔剑Broadsword",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8",
        "负荷": "单手",
        "特性": "可靠Reliable"
    },
    {
        "名称": "长剑Longsword",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+3",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "短刀Cutlass",
        "检定": "风度Presence",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+1",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "刺剑Rapier",
        "检定": "风度Presence",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8",
        "负荷": "单手",
        "特性": "迅速Quick"
    },
    {
        "名称": "匕首Dagger",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+1",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "短棍Quarterstaff",
        "检定": "本能Instinct",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+3",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "戟Halberd",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d8+2",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "长矛Spear",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d8+2",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "短弓Shortbow",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "远距离Far",
        "伤害": "d6+3",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "弩Crossbow",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "远距离Far",
        "伤害": "d6+1",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "长弓Longbow",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "极远Very Far",
        "伤害": "d6+3",
        "负荷": "双手",
        "特性": "繁琐Cumbersome"
    }
];

const weapon_t0_magic = [
    {
        "名称": "圣斧Hallowed Axe",
        "检定": "力量Strength",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d10+1",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "奥术护手Arcane Gauntlets",
        "检定": "力量Strength",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d10+3",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "手持符文Hand Runes",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "邻近Very Close",
        "伤害": "d10",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "发光戒指Glowing Rings",
        "检定": "敏捷Aglity",
        "属性": "魔法",
        "范围": "邻近Very Close",
        "伤害": "d10+2",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "回力剑Returing Blade",
        "检定": "灵巧Finesse",
        "属性": "魔法",
        "范围": "近距离Close",
        "伤害": "d8+1",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "短杖Shortstaff",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "近距离Close",
        "伤害": "d8+1",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "双手法杖Dualstaff",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+3",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "权杖Scepter",
        "检定": "风度Presence",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6",
        "负荷": "双手",
        "特性": "多用Versatile：本能近战d10"
    },
    {
        "名称": "魔杖Wand",
        "检定": "知识Knowledge",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+1",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "巨杖Greatstaff",
        "检定": "知识Knowledge",
        "属性": "魔法",
        "范围": "极远Very Far",
        "伤害": "d6",
        "负荷": "双手",
        "特性": "强力Powerful"
    }
];

const offhand_weapon_t0 = [
    {
        "名称": "圆盾Round Shield",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d4",
        "负荷": "副手",
        "特性": "保护Protective+1"
    },
    {
        "名称": "塔盾Tower Shield",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d6",
        "负荷": "副手",
        "特性": "壁垒Barrie+3 -2"
    },
    {
        "名称": "小匕首Small Dagger",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8",
        "负荷": "副手",
        "特性": "双持Paired +2"
    },
    {
        "名称": "短剑Shortsword",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8",
        "负荷": "副手",
        "特性": "双持Paired +2"
    },
    {
        "名称": "鞭子Whip",
        "检定": "风度Presence",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d6",
        "负荷": "副手",
        "特性": "鞭笞Whipcrack"
    },
    {
        "名称": "抓钩Grappler",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "近距离Close",
        "伤害": "d6",
        "负荷": "副手",
        "特性": "出钩Hook"
    },
    {
        "名称": "手弩Hand Crossbow",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "远距离Far",
        "伤害": "d6+1",
        "负荷": "副手",
        "特性": ""
    }
];

const armor_t0 = [
    {
        "名称": "填充布甲Gambeson Armor",
        "防御": "2",
        "特性": "灵活Flexible"
    },
    {
        "名称": "皮甲Leather Armor",
        "防御": "4",
        "特性": ""
    },
    {
        "名称": "链甲Chainmail Armor",
        "防御": "6",
        "特性": "厚重Heavy"
    },
    {
        "名称": "全板甲Full Plate Armor",
        "防御": "8",
        "特性": "极重Very Heavy"
    }
];

const weapon_t1_physics = [
    {
        "名称": "改良战斧Improved Battleaxe",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+6",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "改良战锤Improved Warhammer",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d12+6",
        "负荷": "双手",
        "特性": "重型Heavy"
    },
    {
        "名称": "改良巨剑Improved Greatsword",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+6",
        "负荷": "双手",
        "特性": "巨型Massive"
    },
    {
        "名称": "改良钉头锤Improved Mace",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+4",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "改良阔剑Improved Broadsword",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+6",
        "负荷": "单手",
        "特性": "可靠Reliable"
    },
    {
        "名称": "改良长剑Improved Longsword",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+6",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "改良短刀Improved Cutlass",
        "检定": "风度Presence",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+4",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "改良刺剑Improved Rapier",
        "检定": "风度Presence",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+3",
        "负荷": "单手",
        "特性": "迅速Quick"
    },
    {
        "名称": "改良匕首Improved Dagger",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+4",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "改良短棍Improved Quarterstaff",
        "检定": "本能Instinct",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+6",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "改良戟Improved Halberd",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d8+5",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "改良长矛Improved Spear",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d8+5",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "改良短弓Improved Shortbow",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "远距离Far",
        "伤害": "d6+6",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "改良弩Improved Crossbow",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "远距离Far",
        "伤害": "d6+4",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "改良长弓Improved Longbow",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "极远Very Far",
        "伤害": "d6+6",
        "负荷": "双手",
        "特性": "繁琐Cumbersome"
    },
    {
        "名称": "鎏金弯刀Gilded Falchion",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+6",
        "负荷": "双手",
        "特性": "强力Powerful"
    },
    {
        "名称": "拳刃Knuckle Blades",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+3",
        "负荷": "单手",
        "特性": "残暴Brutal"
    },
    {
        "名称": "乌洛克阔剑Urok Broadsword",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+6",
        "负荷": "双手",
        "特性": "致命Deadly"
    },
    {
        "名称": "刃鞭Bladed Whip",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d8+3",
        "负荷": "单手",
        "特性": "迅速Quick"
    },
    {
        "名称": "钢铸戟Steelforged Halberd",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d8+4",
        "负荷": "双手",
        "特性": "恐惧Scary"
    },
    {
        "名称": "战镰War Scythe",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d8+5",
        "负荷": "双手",
        "特性": "可靠Reliable"
    },
    {
        "名称": "巨弓Greatbow",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "远距离Far",
        "伤害": "d6+6",
        "负荷": "双手",
        "特性": "强力Powerful"
    },
    {
        "名称": "火铳Blunderbuss",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "远距离Far",
        "伤害": "d6+6",
        "负荷": "单手",
        "特性": "装填Reloading"
    },
    {
        "名称": "细弦弓Finehair Bow",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "极远Very Far",
        "伤害": "d6+5",
        "负荷": "双手",
        "特性": "可靠Reliable"
    }
];

const weapon_t1_magic = [
    {
        "名称": "改良圣斧Improved Hallowed Axe",
        "检定": "力量Strength",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d10+4",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "改良奥术护手Improved Arcane Gauntlets",
        "检定": "力量Strength",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d10+6",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "改良手持符文Improved Hand Runes",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "邻近Very Close",
        "伤害": "d10+3",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "改良发光戒指Improved Glowing Rings",
        "检定": "敏捷Aglity",
        "属性": "魔法",
        "范围": "邻近Very Close",
        "伤害": "d10+5",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "改良回力剑Improved Returing Blade",
        "检定": "灵巧Finesse",
        "属性": "魔法",
        "范围": "近距离Close",
        "伤害": "d8+4",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "改良短杖Shortstaff",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "近距离Close",
        "伤害": "d8+4",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "改良双手法杖Improved Dualstaff",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+6",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "改良权杖Improved Scepter",
        "检定": "风度Presence",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+3",
        "负荷": "双手",
        "特性": "多面Versatile：本能近战d10+2"
    },
    {
        "名称": "改良魔杖Improved Wand",
        "检定": "知识Knowledge",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+4",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "改良巨杖Improved Greatstaff",
        "检定": "知识Knowledge",
        "属性": "魔法",
        "范围": "极远Very Far",
        "伤害": "d6+3",
        "负荷": "双手",
        "特性": "强力Powerful"
    },
    {
        "名称": "自我之刃Ego Blade",
        "检定": "敏捷Aglity",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d12+4",
        "负荷": "单手",
        "特性": "傲慢Pompous"
    },
    {
        "名称": "施法剑Casting Sword",
        "检定": "力量Strength",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d10+4",
        "负荷": "双手",
        "特性": "多面Versatile：知识远距离d6+3"
    },
    {
        "名称": "吞噬匕首Devouring Dagger",
        "检定": "灵巧Finesse",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d8+4",
        "负荷": "单手",
        "特性": "恐惧Scary"
    },
    {
        "名称": "异界之锤Hammer of Exota",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d8+6",
        "负荷": "双手",
        "特性": "爆发Eruptive"
    },
    {
        "名称": "尤塔里血弓Yutari Bloodbow",
        "检定": "灵巧Finesse",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+4",
        "负荷": "双手",
        "特性": "残暴Brutal"
    },
    {
        "名称": "长者之弓Elder Bow",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+4",
        "负荷": "双手",
        "特性": "强力Powerful"
    },
    {
        "名称": "伊利亚斯的权杖Scepter of Elias",
        "检定": "风度Presence",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+3",
        "负荷": "单手",
        "特性": "振奋Invigorating"
    },
    {
        "名称": "迷惑魔杖Wand of Enthrallment",
        "检定": "风度Presence",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+4",
        "负荷": "单手",
        "特性": "说服Persuasive"
    },
    {
        "名称": "联结杖Bonded Staff",
        "检定": "知识Knowledge",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+4",
        "负荷": "双手",
        "特性": "可靠Reliable"
    }
];

const offhand_weapon_t1 = [
    {
        "名称": "改良圆盾Improved Round Shield",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d4+2",
        "负荷": "副手",
        "特性": "保护Protective+2"
    },
    {
        "名称": "改良塔盾Improved Tower Shield",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d6+2",
        "负荷": "副手",
        "特性": "壁垒Barrier+4 -2"
    },
    {
        "名称": "改良小匕首Improved Small Dagger",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+2",
        "负荷": "副手",
        "特性": "双持Paired +3"
    },
    {
        "名称": "改良短剑Improved Shortsword",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+2",
        "负荷": "副手",
        "特性": "双持Paired+3"
    },
    {
        "名称": "改良鞭子Improved Whip",
        "检定": "风度Presence",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d6+2",
        "负荷": "副手",
        "特性": "鞭笞Whipcrack"
    },
    {
        "名称": "改良抓钩Improved Grappler",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "近距离Close",
        "伤害": "d6+2",
        "负荷": "副手",
        "特性": "出钩Hook"
    },
    {
        "名称": "改良手弩Improved Hand Crossbow",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "远距离Far",
        "伤害": "d6+3",
        "负荷": "副手",
        "特性": ""
    },
    {
        "名称": "尖刺盾牌Spiked Shield",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d6+2",
        "负荷": "副手",
        "特性": "两用Double Duty"
    },
    {
        "名称": "格挡匕首Parrying Dagger",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d6+2",
        "负荷": "副手",
        "特性": "格挡Parry"
    },
    {
        "名称": "回力斧Returning Axe",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近距离Close",
        "伤害": "d6+4",
        "负荷": "副手",
        "特性": ""
    }
];

const armor_t1 = [
    {
        "名称": "改良填充布甲Improved Gambeson Armor",
        "防御": "3",
        "特性": "灵活Flexible"
    },
    {
        "名称": "改良皮甲Improved Leather Armor",
        "防御": "5",
        "特性": ""
    },
    {
        "名称": "改良链甲Improved Chainmail Armor",
        "防御": "7",
        "特性": "厚重Heavy"
    },
    {
        "名称": "改良全板甲Improved Full Plate Armor",
        "防御": "9",
        "特性": "极重Very Heavy"
    },
    {
        "名称": "埃伦德里安链甲Elundrian Chain Armor",
        "防御": "2",
        "特性": "强化Reinforced"
    },
    {
        "名称": "掠骸护甲Harrowbone Armor",
        "防御": "5",
        "特性": "抵抗Resistance"
    },
    {
        "名称": "铁木胸甲Irontree Breastplate Armor",
        "防御": "5",
        "特性": "坚固Sturdy"
    },
    {
        "名称": "符文盾Runetan Shield",
        "防御": "5",
        "特性": "护卫Warden"
    },
    {
        "名称": "泰瑞斯软甲Tyris Soft Armor",
        "防御": "5",
        "特性": "安静Quite"
    },
    {
        "名称": "蔷薇野甲Rosewild Armor",
        "防御": "6",
        "特性": "希冀Hope"
    }
];

const weapon_t2_physics = [
    {
        "名称": "高级战斧Advanced Battleaxe",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+9",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "高级战锤Advanced Warhammer",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d12+9",
        "负荷": "双手",
        "特性": "重型Heavy"
    },
    {
        "名称": "高级巨剑Advanced Greatsword",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+9",
        "负荷": "双手",
        "特性": "巨型Massive"
    },
    {
        "名称": "高级钉头锤Advanced Mace",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+7",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "高级阔剑Advanced Broadsword",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+9",
        "负荷": "单手",
        "特性": "可靠Reliable"
    },
    {
        "名称": "高级长剑Advanced Longsword",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+9",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "高级短刀Advanced Cutlass",
        "检定": "风度Presence",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+7",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "高级刺剑Advanced Rapier",
        "检定": "风度Presence",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+6",
        "负荷": "单手",
        "特性": "迅速Quick"
    },
    {
        "名称": "高级匕首Advanced Dagger",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+7",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "高级短棍Advanced Quarterstaff",
        "检定": "本能Instinct",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+9",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "高级戟Advanced Halberd",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d8+9",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "高级长矛Advanced Spear",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d8+8",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "高级短弓Advanced Shortbow",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "远距离Far",
        "伤害": "d6+9",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "高级弩Advanced Crossbow",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "远距离Far",
        "伤害": "d6+7",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "高级长弓Advanced Longbow",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "极远Very Far",
        "伤害": "d6+9",
        "负荷": "双手",
        "特性": "繁琐Cumbersome"
    },
    {
        "名称": "闪蝶之刃Flickerfly Blade",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+5",
        "负荷": "单手",
        "特性": "锐翼Sharpwing"
    },
    {
        "名称": "勇气之剑Bravesword",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d12+7",
        "负荷": "双手",
        "特性": "密集Dense"
    },
    {
        "名称": "地狱之锤Hell’s Hammer",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+7",
        "负荷": "双手",
        "特性": "毁灭Devastating"
    },
    {
        "名称": "拉布里斯斧Labrys Axe",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+7",
        "负荷": "双手",
        "特性": "保护Protectvie"
    },
    {
        "名称": "经络短刀Meridian Cutlass",
        "检定": "风度Presence",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+5",
        "负荷": "单手",
        "特性": "决斗Dueling"
    },
    {
        "名称": "伸缩军刀Retractable Saber",
        "检定": "风度Presence",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+7",
        "负荷": "单手",
        "特性": "伸缩Retractable"
    },
    {
        "名称": "双连枷Double Flail",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d10+8",
        "负荷": "双手",
        "特性": "强力Powerful"
    },
    {
        "名称": "利爪之刃Talon Blades",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "近距离Close",
        "伤害": "d10+7",
        "负荷": "双手",
        "特性": "残暴Brutal"
    },
    {
        "名称": "尖刺弓Spiked Bow",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "极远Very Far",
        "伤害": "d6+7",
        "负荷": "双手",
        "特性": "多面Versatile：敏捷近战d12+5"
    },
    {
        "名称": "黑火药左轮Black Powder Revolver",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "极远Very Far",
        "伤害": "d6+6",
        "负荷": "单手",
        "特性": "装填Reloading"
    }
];

const weapon_t2_magic = [
    {
        "名称": "高级圣斧Advanced Hallowed Axe",
        "检定": "力量Strength",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d10+7",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "高级奥术护手Advanced Arcane Gauntlets",
        "检定": "力量Strength",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d10+9",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "高级手持符文Advanced Hand Runes",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "邻近Very Close",
        "伤害": "d10+8",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "高级发光戒指Advanced Glowing Rings",
        "检定": "敏捷Aglity",
        "属性": "魔法",
        "范围": "邻近Very Close",
        "伤害": "d10+6",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "高级回力剑Advanced Returing Blade",
        "检定": "灵巧Finesse",
        "属性": "魔法",
        "范围": "近距离Close",
        "伤害": "d8+7",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "高级短杖Shortstaff",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "近距离Close",
        "伤害": "d8+7",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "高级双手法杖Advanced Dualstaff",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+9",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "高级权杖Advanced Scepter",
        "检定": "风度Presence",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+6",
        "负荷": "双手",
        "特性": "多面Versatile：本能近战d10+4"
    },
    {
        "名称": "高级魔杖Advanced Wand",
        "检定": "知识Knowledge",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+7",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "高级巨杖Advanced Greatstaff",
        "检定": "知识Knowledge",
        "属性": "魔法",
        "范围": "极远Very Far",
        "伤害": "d6+6",
        "负荷": "双手",
        "特性": "强力Powerful"
    },
    {
        "名称": "运气之斧Axe of Fortunis",
        "检定": "力量Strength",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d10+8",
        "负荷": "双手",
        "特性": "幸运Lucky"
    },
    {
        "名称": "祝福匕首Blessed Anlace",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d10+6",
        "负荷": "单手",
        "特性": "治愈Healing"
    },
    {
        "名称": "鬼魂之刃Ghostblade",
        "检定": "风度Presence",
        "属性": "任意",
        "范围": "近战Melee",
        "伤害": "d10+7",
        "负荷": "单手",
        "特性": "异界Otherworldy"
    },
    {
        "名称": "符文纹身Body Runes",
        "检定": "知识Knowledge",
        "属性": "魔法",
        "范围": "邻近Very Close",
        "伤害": "d20+4",
        "负荷": "单手",
        "特性": "苦痛Painful"
    },
    {
        "名称": "维多加斯特的吊坠Widogast Pendant",
        "检定": "知识Knowledge",
        "属性": "魔法",
        "范围": "近距离Close",
        "伤害": "d10+5",
        "负荷": "单手",
        "特性": "时间扭曲者Timebender"
    },
    {
        "名称": "鎏金弓Gilded Bow",
        "检定": "灵巧Finesse",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+7",
        "负荷": "双手",
        "特性": "自省Self-Correcting"
    },
    {
        "名称": "火焰杖Firestaff",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+7",
        "负荷": "双手",
        "特性": "灼烧Burn"
    },
    {
        "名称": "法师球Mage Orb",
        "检定": "知识Knowledge",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+7",
        "负荷": "单手",
        "特性": "强力Powerful"
    },
    {
        "名称": "伊尔玛里的火枪Ilmari’s Blunderbuss",
        "检定": "灵巧Finesse",
        "属性": "魔法",
        "范围": "极远Very Far",
        "伤害": "d6+6",
        "负荷": "单手",
        "特性": "装填Reloading"
    }
];

const offhand_weapon_t2 = [
    {
        "名称": "高级圆盾Advanced Round Shield",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d4+4",
        "负荷": "副手",
        "特性": "保护Protective+3"
    },
    {
        "名称": "高级塔盾Advanced Tower Shield",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d6+4",
        "负荷": "副手",
        "特性": "壁垒Barrier+5 -2"
    },
    {
        "名称": "高级小匕首Advanced Small Dagger",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+4",
        "负荷": "副手",
        "特性": "双持Paired+4"
    },
    {
        "名称": "高级短剑Advanced Shortsword",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+4",
        "负荷": "副手",
        "特性": "双持Paired+4"
    },
    {
        "名称": "高级鞭子Advanced Whip",
        "检定": "风度Presence",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d6+4",
        "负荷": "副手",
        "特性": "鞭笞Whipcrack"
    },
    {
        "名称": "高级抓钩AdvancedGrappler",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "近距离Close",
        "伤害": "d6+4",
        "负荷": "副手",
        "特性": "出钩Hook"
    },
    {
        "名称": "高级手弩AdvancedHand Crossbow",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "远距离Far",
        "伤害": "d6+4",
        "负荷": "副手",
        "特性": ""
    },
    {
        "名称": "小盾Buckler",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d4+4",
        "负荷": "副手",
        "特性": "反射Deflecting"
    },
    {
        "名称": "强力拳套Powered Gauntlet",
        "检定": "知识Knowledge",
        "属性": "魔法",
        "范围": "近距离Close",
        "伤害": "d6+4",
        "负荷": "副手",
        "特性": "充能攻击Charged Attack"
    },
    {
        "名称": "弹弓Hand Sling",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "极远Very Far",
        "伤害": "d6+4",
        "负荷": "副手",
        "特性": "多面Versatile：灵巧近距离d8+4"
    }
];

const armor_t2 = [
    {
        "名称": "高级填充布甲Advanced Gambeson Armor",
        "防御": "4",
        "特性": "灵活Flexible"
    },
    {
        "名称": "高级皮甲Advanced Leather Armor",
        "防御": "6",
        "特性": ""
    },
    {
        "名称": "高级链甲Advanced Chainmail Armor",
        "防御": "8",
        "特性": "厚重Heavy"
    },
    {
        "名称": "高级全板甲Advanced Full Plate Armor",
        "防御": "10",
        "特性": "极重Very Heavy"
    },
    {
        "名称": "贝拉莫伊精致护甲Bellamoi Fine Armor",
        "防御": "6",
        "特性": "鎏金Gilded"
    },
    {
        "名称": "龙鳞护甲Dragonscale Armor",
        "防御": "6",
        "特性": "坚不可摧Impenetrable"
    },
    {
        "名称": "尖刺护甲 Spiked Armor Plating",
        "防御": "6",
        "特性": "锋利Sharp"
    },
    {
        "名称": "剑刃护甲Bladefare Armor",
        "防御": "9",
        "特性": "物理防御Physical"
    },
    {
        "名称": "莫奈特的斗篷Monett’s Cloak",
        "防御": "9",
        "特性": "魔法防御Magic"
    },
    {
        "名称": "符文纹身Body Runes",
        "防御": "10",
        "特性": "苦痛Painful"
    }
];

const weapon_t3_physics = [
    {
        "名称": "传奇战斧Legendary Battleaxe",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+12",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "传奇战锤Legendary Warhammer",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d12+12",
        "负荷": "双手",
        "特性": "重型Heavy"
    },
    {
        "名称": "传奇巨剑Legendary Greatsword",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+12",
        "负荷": "双手",
        "特性": "巨型Massive"
    },
    {
        "名称": "传奇钉头锤Legendary Mace",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+10",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "传奇阔剑Legendary Broadsword",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+12",
        "负荷": "单手",
        "特性": "可靠Reliable"
    },
    {
        "名称": "传奇长剑Legendary Longsword",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+12",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "传奇短刀Legendary Cutlass",
        "检定": "风度Presence",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+10",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "传奇刺剑Legendary Rapier",
        "检定": "风度Presence",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+9",
        "负荷": "单手",
        "特性": "迅速Quick"
    },
    {
        "名称": "传奇匕首Legendary Dagger",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+10",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "传奇短棍Legendary Quarterstaff",
        "检定": "本能Instinct",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+12",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "传奇戟Legendary Halberd",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d8+12",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "传奇长矛Legendary Spear",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d8+11",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "传奇短弓Legendary Shortbow",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "远距离Far",
        "伤害": "d6+12",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "传奇弩Legendary Crossbow",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "远距离Far",
        "伤害": "d6+10",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "传奇长弓Legendary Longbow",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "极远Very Far",
        "伤害": "d6+12",
        "负荷": "双手",
        "特性": "繁琐Cumbersome"
    },
    {
        "名称": "双刃剑Double-Slide Sword",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+9",
        "负荷": "双手",
        "特性": "迅速Quick"
    },
    {
        "名称": "冲击拳套Impact Gauntlet",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d10+11",
        "负荷": "单手",
        "特性": "震荡Concussive"
    },
    {
        "名称": "巨斧Sledge Axe",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d12+13",
        "负荷": "双手",
        "特性": "破坏Destructive"
    },
    {
        "名称": "弧形匕首Curved Dagger",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+9",
        "负荷": "单手",
        "特性": "锯齿Serrated"
    },
    {
        "名称": "延伸长柄武器Extended Polearm",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d8+10",
        "负荷": "双手",
        "特性": "延长Long"
    },
    {
        "名称": "摆动绳刃Swinging Ropeblade",
        "检定": "风度Presence",
        "属性": "物理",
        "范围": "近距离Close",
        "伤害": "d8+9",
        "负荷": "双手",
        "特性": "捕获Grapping"
    },
    {
        "名称": "弹跳斧Ricochet Axes",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "远距离Far",
        "伤害": "d6+11",
        "负荷": "双手",
        "特性": "弹跳Bouncing"
    },
    {
        "名称": "安塔利弓Aantari Bow",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "远距离Far",
        "伤害": "d6+11",
        "负荷": "双手",
        "特性": "可靠Reliable"
    },
    {
        "名称": "手炮Hand Cannon",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "极远Very Far",
        "伤害": "d6+12",
        "负荷": "单手",
        "特性": "装填Reloading"
    }
];

const weapon_t3_magic = [
    {
        "名称": "传奇圣斧Legendary Hallowed Axe",
        "检定": "力量Strength",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d10+10",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "传奇奥术护手Legendary Arcane Gauntlets",
        "检定": "力量Strength",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d10+12",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "传奇手持符文Legendary Hand Runes",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "邻近Very Close",
        "伤害": "d10+11",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "传奇发光戒指Legendary Glowing Rings",
        "检定": "敏捷Aglity",
        "属性": "魔法",
        "范围": "邻近Very Close",
        "伤害": "d10+9",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "传奇回力剑Legendary Returing Blade",
        "检定": "灵巧Finesse",
        "属性": "魔法",
        "范围": "近距离Close",
        "伤害": "d8+10",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "传奇短杖Shortstaff",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "近距离Close",
        "伤害": "d8+10",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "传奇双手法杖Legendary Dualstaff",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d8+12",
        "负荷": "双手",
        "特性": ""
    },
    {
        "名称": "传奇权杖Legendary Scepter",
        "检定": "风度Presence",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+9",
        "负荷": "双手",
        "特性": "多面Versatile：本能近战d10+6"
    },
    {
        "名称": "传奇魔杖Legendary Wand",
        "检定": "知识Knowledge",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+10",
        "负荷": "单手",
        "特性": ""
    },
    {
        "名称": "传奇巨杖Legendary Greatstaff",
        "检定": "知识Knowledge",
        "属性": "魔法",
        "范围": "极远Very Far",
        "伤害": "d6+9",
        "负荷": "双手",
        "特性": "强力Powerful"
    },
    {
        "名称": "光焰剑Sword of Light&Flame",
        "检定": "力量Strength",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d10+11",
        "负荷": "双手",
        "特性": "穿透Penetrating"
    },
    {
        "名称": "虹吸拳套Siphoning Gauntlets",
        "检定": "风度Presence",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d10+9",
        "负荷": "双手",
        "特性": "系命Lifestealing"
    },
    {
        "名称": "迈达斯镰刀Midas Scythe",
        "检定": "知识Knowledge",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d10+9",
        "负荷": "双手",
        "特性": "贪婪Greedy"
    },
    {
        "名称": "漂浮碎刃Floating Bladeshards",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "近距离Close",
        "伤害": "d8+9",
        "负荷": "单手",
        "特性": "强力Powerful"
    },
    {
        "名称": "血杖Bloodstaff",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d20+7",
        "负荷": "双手",
        "特性": "苦痛Painful"
    },
    {
        "名称": "蓟弓Thistlebow",
        "检定": "本能Instinct",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d6+13",
        "负荷": "双手",
        "特性": "可靠Reliable"
    },
    {
        "名称": "埃塞克之杖Wand of Essek",
        "检定": "知识Knowledge",
        "属性": "魔法",
        "范围": "远距离Far",
        "伤害": "d8+13",
        "负荷": "单手",
        "特性": "时间扭曲者Timebender"
    },
    {
        "名称": "魔战士左轮Magus Revolver",
        "检定": "灵巧Finesse",
        "属性": "魔法",
        "范围": "极远Very Far",
        "伤害": "d6+13",
        "负荷": "单手",
        "特性": "装填Reloading"
    },
    {
        "名称": "融合手套Fusion Gloves",
        "检定": "知识Knowledge",
        "属性": "魔法",
        "范围": "极远Very Far",
        "伤害": "d6+9",
        "负荷": "双手",
        "特性": "绑定Bonded"
    }
];

const offhand_weapon_t3 = [
    {
        "名称": "传奇圆盾Legendary Round Shield",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d4+6",
        "负荷": "副手",
        "特性": "保护Protective+4"
    },
    {
        "名称": "传奇塔盾Legendary Tower Shield",
        "检定": "力量Strength",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d6+6",
        "负荷": "副手",
        "特性": "壁垒Barrier+6 -2"
    },
    {
        "名称": "传奇小匕首Legendary Small Dagger",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+6",
        "负荷": "副手",
        "特性": "双持Paired+5"
    },
    {
        "名称": "传奇短剑Legendary Shortsword",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d8+6",
        "负荷": "副手",
        "特性": "双持Paired+5"
    },
    {
        "名称": "传奇鞭子Legendary Whip",
        "检定": "风度Presence",
        "属性": "物理",
        "范围": "邻近Very Close",
        "伤害": "d6+6",
        "负荷": "副手",
        "特性": "鞭笞Whipcrack"
    },
    {
        "名称": "传奇抓钩Legendary Grappler",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "近距离Close",
        "伤害": "d6+6",
        "负荷": "副手",
        "特性": "出钩Hook"
    },
    {
        "名称": "传奇手弩Legendary Hand Crossbow",
        "检定": "灵巧Finesse",
        "属性": "物理",
        "范围": "远距离Far",
        "伤害": "d6+7",
        "负荷": "副手",
        "特性": ""
    },
    {
        "名称": "勇气之盾Braveshield",
        "检定": "敏捷Aglity",
        "属性": "物理",
        "范围": "近战Melee",
        "伤害": "d4+6",
        "负荷": "副手",
        "特性": "庇护Sheltering"
    },
    {
        "名称": "拳爪Kunckle Claws",
        "检定": "力量Strength",
        "属性": "魔法",
        "范围": "近战Melee",
        "伤害": "d6+6",
        "负荷": "副手",
        "特性": "双击Double Up"
    },
    {
        "名称": "引物碎片Primer Shard",
        "检定": "本能Instinct",
        "属性": "无",
        "范围": "邻近Very Close",
        "伤害": "0",
        "负荷": "副手",
        "特性": "锁定Locked On"
    }
];

const armor_t3 = [
    {
        "名称": "传奇填充布甲Legendary Gambeson Armor",
        "防御": "6",
        "特性": "灵活Flexible"
    },
    {
        "名称": "传奇皮甲Legendary Leather Armor",
        "防御": "8",
        "特性": ""
    },
    {
        "名称": "传奇链甲Legendary Chainmail Armor",
        "防御": "10",
        "特性": "厚重Heavy"
    },
    {
        "名称": "传奇全板甲Legendary Full Plate Armor",
        "防御": "12",
        "特性": "极重Very Heavy"
    },
    {
        "名称": "威能丝甲Dunamis Silkchain",
        "防御": "5",
        "特性": "时缓Timeslowing"
    },
    {
        "名称": "引导护甲Channeling Armor",
        "防御": "7",
        "特性": "引导Channeling"
    },
    {
        "名称": "织烬护甲Emberwoven Armor",
        "防御": "8",
        "特性": "燃烧Buring"
    },
    {
        "名称": "全面强化护甲Full Reinforced Armor",
        "防御": "8",
        "特性": "可变Variable"
    },
    {
        "名称": "诚实蛋白石护甲Veritas Opal Armor",
        "防御": "8",
        "特性": "求真Truthseeking"
    },
    {
        "名称": "救世主链甲Savior Chainmail",
        "防御": "15",
        "特性": "困难Difficult"
    }
];