const professionTemplates = {
    "吟游诗人": { 
        attributes: [-1,0,0,2,1,1], 
        weapon: {
            "名称": "刺剑Rapier",
            "检定": "风度Presence",
            "属性": "物理",
            "范围": "近战Melee",
            "伤害": "d8",
            "负荷": "单手",
            "特性": "迅捷Quick: 标记1个压力以额外攻击一个范围内的目标"
        },
        offHandWeapon: {
            "名称": "小匕首Small Dagger",
            "检定": "灵巧Finesse",
            "属性": "物理",
            "范围": "近战Melee",
            "伤害": "d8",
            "负荷": "副手",
            "特性": "双持Paired: 主武器近战伤害 +2"
        },
        armor: {
            "名称": "填充布甲Gambeson Armor",
            "防御": "3",
            "特性": "灵活Flexible: 闪避值+1"
        }
    },
    "德鲁伊":   { 
        attributes: [0,1,2,-1,0,1], 
        weapon: {
            "名称": "短杖Shortstaff",
            "检定": "本能Instinct",
            "属性": "魔法",
            "范围": "近距离Close",
            "伤害": "d8+1",
            "负荷": "单手",
            "特性": ""
        },
        offHandWeapon: {
            "名称": "圆盾Round Shield",
            "检定": "力量Strength",
            "属性": "物理",
            "范围": "近战Melee",
            "伤害": "d4",
            "负荷": "副手",
            "特性": "保护Protective: 护甲值+1"
        }, 
        armor: {
            "名称": "皮甲Leather Armor",
            "防御": "4",
            "特性": ""
        }
    },
    "守护者":   { 
        attributes: [2,1,0,1,0,-1], 
        weapon: {
            "名称": "战斧Battleaxe",
            "检定": "力量Strength",
            "属性": "物理",
            "范围": "近战Melee",
            "伤害": "d10+3",
            "负荷": "双手",
            "特性": ""
        },
        offHandWeapon: {}, 
        armor: {
            "名称": "链甲Chainmail Armor",
            "防御": "5",
            "特性": "厚重Heavy: 闪避值-1"
        }
    },
    "游侠":     { 
        attributes: [0,2,1,-1,0,1], 
        weapon: {
            "名称": "短弓Shortbow",
            "检定": "敏捷Aglity",
            "属性": "物理",
            "范围": "远距离Far",
            "伤害": "d6+3",
            "负荷": "双手",
            "特性": ""
        },
        offHandWeapon: {}, 
        armor: {
            "名称": "皮甲Leather Armor",
            "防御": "4",
            "特性": ""
        }
    },
    "盗贼":     { 
        attributes: [-1,1,0,1,0,2], 
        weapon: {
            "名称": "匕首Dagger",
            "检定": "灵巧Finesse",
            "属性": "物理",
            "范围": "近战Melee",
            "伤害": "d8+1",
            "负荷": "单手",
            "特性": ""
        },
        offHandWeapon: {
            "名称": "小匕首Small Dagger",
            "检定": "灵巧Finesse",
            "属性": "物理",
            "范围": "近战Melee",
            "伤害": "d8",
            "负荷": "副手",
            "特性": "双持Paired: 主武器近战伤害 +2"
        },
        armor: {
            "名称": "填充布甲Gambeson Armor",
            "防御": "3",
            "特性": "灵活Flexible: 闪避值+1"
        }
    },
    "神使":     { 
        attributes: [2,0,1,1,-1,0], 
        weapon: {
            "名称": "圣斧Hallowed Axe",
            "检定": "力量Strength",
            "属性": "魔法",
            "范围": "近战Melee",
            "伤害": "d10+1",
            "负荷": "单手",
            "特性": ""
        },
        offHandWeapon: {
            "名称": "圆盾Round Shield",
            "检定": "力量Strength",
            "属性": "物理",
            "范围": "近战Melee",
            "伤害": "d4",
            "负荷": "副手",
            "特性": "保护Protective: 护甲值+1"
        },
        armor: {
            "名称": "链甲Chainmail Armor",
            "防御": "5",
            "特性": "厚重Heavy: 闪避值-1"
        }
    },
    "术士":     { 
        attributes: [-1,0,2,1,0,1], 
        weapon: {
            "名称": "双手法杖Dualstaff",
            "检定": "本能Instinct",
            "属性": "魔法",
            "范围": "远距离Far",
            "伤害": "d6+3",
            "负荷": "双手",
            "特性": ""
        },
        offHandWeapon: {}, 
        armor: {
            "名称": "填充布甲Gambeson Armor",
            "防御": "3",
            "特性": "灵活Flexible: 闪避值+1"
        }
    },
    "战士":     { 
        attributes: [1,2,1,-1,0,0], 
        weapon: {
            "名称": "长剑Longsword",
            "检定": "敏捷Aglity",
            "属性": "物理",
            "范围": "近战Melee",
            "伤害": "d8+3",
            "负荷": "双手",
            "特性": ""
        },
        offHandWeapon: {}, 
        armor: {
            "名称": "链甲Chainmail Armor",
            "防御": "5",
            "特性": "厚重Heavy: 闪避值-1"
        }
    },
    "法师":     { 
        attributes: [0,-1,1,1,2,0], 
        weapon: {
            "名称": "巨杖Greatstaff",
            "检定": "知识Knowledge",
            "属性": "魔法",
            "范围": "极远Very Far",
            "伤害": "d6",
            "负荷": "双手",
            "特性": "强力Powerful: 额外骰1个伤害骰并去掉其中最小的一个 "
        },
        offHandWeapon: {}, 
        armor: {
            "名称": "皮甲Leather Armor",
            "防御": "4",
            "特性": ""
        }
    }
};//力量, 敏捷, 本能, 风度, 学识, 灵巧

const newbieGuideQuestions = [
    { prompt: "请输入你的角色名字：", targetFieldId: "roleName" },
    { prompt: "请输入你的角色年龄：", targetFieldId: "age" },
    { prompt: "请输入你的角色性别：", targetFieldId: "gender" },
    {
        prompt: "请选择你的种族：",
        questionType: "dropdown",
        targetSelectId: "raceSelect",
        dataSourceVariable: "RACES_DATA",
        optionValueField: "race",
        optionTextField: "race",
        updateFunction: "updateRaceTraitsAsSkills"
    },
    {
        prompt: "请选择你的混血种族（可选）：",
        questionType: "dropdown",
        targetSelectId: "mixedRaceSelect",
        dataSourceVariable: "RACES_DATA",
        optionValueField: "race",
        optionTextField: "race",
        updateFunction: "updateRaceTraitsAsSkills"
    },
    {
        prompt: "请选择你的社群：",
        questionType: "dropdown",
        targetSelectId: "communitySelect",
        dataSourceVariable: "GROUPS_DATA",
        optionValueField: "社群",
        optionTextField: "社群",
        updateFunction: "updateGroupTraitAsSkill"
    },
    {
        prompt: "请选择你的职业：", // 属性和装备将在此步骤后自动填充
        questionType: "dropdown",
        targetSelectId: "professionSelect",
        dataSourceVariable: "JOBS_DATA",
        optionValueField: "职业",
        optionTextField: "职业",
        updateFunction: "updateJobTraitsAsSkills" // This function will be called, then we add our logic
    },
    { prompt: "请输入第一个主要经历的关键词：", targetFieldId: "expKeyword" },
    { prompt: "请输入第二个主要经历的关键词：", targetFieldId: "expKeyword2" },
    { prompt: "请输入你的角色背景故事：", targetFieldId: "backgroundStory" }
    // Removed equipment and attribute questions
];

const newbieGuidePrompts = {
    race: {
        "械灵": "关于【械灵】的提示词...",
        "恶魔": "关于【恶魔】的提示词...",
        "龙人": "关于【龙人】的提示词...",
        "矮人": "关于【矮人】的提示词...",
        "精灵": "关于【精灵】的提示词...",
        "仙灵": "关于【仙灵】的提示词...",
        "羊蹄人": "关于【羊蹄人】的提示词...",
        "费尔伯格": "关于【费尔伯格】的提示词...",
        "孢菌人": "关于【孢菌人】的提示词...",
        "龟人": "关于【龟人】的提示词...",
        "巨人": "关于【巨人】的提示词...",
        "哥布林": "关于【哥布林】的提示词...",
        "半身人": "关于【半身人】的提示词...",
        "人类": "关于【人类】的提示词...",
        "猫族": "关于【猫族】的提示词...",
        "兽人": "关于【兽人】的提示词...",
        "蛙裔": "关于【蛙裔】的提示词...",
        "猿族": "关于【猿族】的提示词..."
    },
    mixedRace: {
        "械灵": "关于【械灵】的提示词...",
        "恶魔": "关于【恶魔】的提示词...",
        "龙人": "关于【龙人】的提示词...",
        "矮人": "关于【矮人】的提示词...",
        "精灵": "关于【精灵】的提示词...",
        "仙灵": "关于【仙灵】的提示词...",
        "羊蹄人": "关于【羊蹄人】的提示词...",
        "费尔伯格": "关于【费尔伯格】的提示词...",
        "孢菌人": "关于【孢菌人】的提示词...",
        "龟人": "关于【龟人】的提示词...",
        "巨人": "关于【巨人】的提示词...",
        "哥布林": "关于【哥布林】的提示词...",
        "半身人": "关于【半身人】的提示词...",
        "人类": "关于【人类】的提示词...",
        "猫族": "关于【猫族】的提示词...",
        "兽人": "关于【兽人】的提示词...",
        "蛙裔": "关于【蛙裔】的提示词...",
        "猿族": "关于【猿族】的提示词..."
    },
    community: {
        "高城之民": "关于【高城之民】的提示词...",
        "博识之民": "关于【博识之民】的提示词...",
        "结社之民": "关于【结社之民】的提示词...",
        "山岭之民": "关于【山岭之民】的提示词...",
        "滨海之民": "关于【滨海之民】的提示词...",
        "法外之民": "关于【法外之民】的提示词...",
        "地下之民": "关于【地下之民】的提示词...",
        "漂泊之民": "关于【漂泊之民】的提示词...",
        "荒野之民": "关于【荒野之民】的提示词..."
    },
    profession: {
        "吟游诗人": "关于【吟游诗人】的提示词...",
        "德鲁伊": "关于【德鲁伊】的提示词...",
        "守护者": "关于【守护者】的提示词...",
        "游侠": "关于【游侠】的提示词...",
        "盗贼": "关于【盗贼】的提示词...",
        "神使": "关于【神使】的提示词...",
        "术士": "关于【术士】的提示词...",
        "战士": "关于【战士】的提示词...",
        "法师": "关于【法师】的提示词..."
    },
    textInput: {
        "roleName": "例如：勇敢的艾拉，神秘的泽phyr...",
        "age": "例如：25，150 (对于长寿种族)...",
        "gender": "例如：男，女，无性别，流体...",
        "expKeyword": "描述一个定义你角色的经历，例如：第一次屠龙，拯救村庄...",
        "expKeyword2": "描述另一个重要经历，例如：在古代遗迹中发现秘密，被导师背叛...",
        "backgroundStory": "简要描述你的角色来自哪里，以及是什么塑造了他们成为现在的样子..."
    }
};