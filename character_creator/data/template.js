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
        prompt: "请选择你的混合种族（如果适用）：",
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