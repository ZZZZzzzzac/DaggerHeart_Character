const professionTemplates = {
    "吟游诗人": { 
        attributes: [-1,0,0,2,1,1], 
        weapon:     {
            "名称": "刺剑",
            "原名": "Rapier",
            "检定": "风度",
            "属性": "物理",
            "范围": "近战",
            "伤害": "d8",
            "负荷": "单手",
            "特性": "迅捷: 标记1个压力以额外攻击一个范围内的目标"
        },
        offHandWeapon: {
            "名称": "小匕首",
            "原名": "Small Dagger",
            "检定": "灵巧",
            "属性": "物理",
            "范围": "近战",
            "伤害": "d8",
            "负荷": "副手",
            "特性": "双持: 近战时主武器伤害 +2"
        },
        armor: {
            "名称": "填充布甲",
            "原名": "Gambeson Armor",
            "护甲值": "3",
            "阈值": ["5","11"],
            "特性": "灵活: 闪避值+1"
        },
    },
    "德鲁伊":   { 
        attributes: [0,1,2,-1,0,1], 
        weapon: {
            "名称": "短杖",
            "原名": "Shortstaff",
            "检定": "本能",
            "属性": "魔法",
            "范围": "近距离",
            "伤害": "d8+1",
            "负荷": "单手",
            "特性": ""
        },
        offHandWeapon: {
            "名称": "圆盾",
            "原名": "Round Shield",
            "检定": "力量",
            "属性": "物理",
            "范围": "近战",
            "伤害": "d4",
            "负荷": "副手",
            "特性": "保护: 护甲值+1"
        },
        armor: {
            "名称": "皮甲",
            "原名": "Leather Armor",
            "护甲值": "3",
            "阈值": ["6","13"],
            "特性": ""
        },
    },
    "守护者":   { 
        attributes: [2,1,0,1,0,-1], 
        weapon: {
            "名称": "战斧",
            "原名": "Battleaxe",
            "检定": "力量",
            "属性": "物理",
            "范围": "近战",
            "伤害": "d10+3",
            "负荷": "双手",
            "特性": ""
        },
        offHandWeapon: {}, 
        armor: {
            "名称": "链甲",
            "原名": "Chainmail Armor",
            "护甲值": "4",
            "阈值": ["7","15"],
            "特性": "重型: 闪避值-1"
        },
    },
    "游侠":     { 
        attributes: [0,2,1,-1,0,1], 
        weapon: {
            "名称": "短弓",
            "原名": "Shortbow",
            "检定": "敏捷",
            "属性": "物理",
            "范围": "远距离",
            "伤害": "d6+3",
            "负荷": "双手",
            "特性": ""
        },
        offHandWeapon: {}, 
        armor: {
            "名称": "皮甲",
            "原名": "Leather Armor",
            "护甲值": "3",
            "阈值": ["6","13"],
            "特性": ""
        },
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
            "护甲值": "3",
            "特性": "灵活Flexible: 闪避值+1"
        }
    },
    "神使":     { 
        attributes: [2,0,1,1,-1,0], 
        weapon: {
            "名称": "圣斧",
            "原名": "Hallowed Axe",
            "检定": "力量",
            "属性": "魔法",
            "范围": "近战",
            "伤害": "d8+1",
            "负荷": "单手",
            "特性": ""
        },
        offHandWeapon: {
            "名称": "圆盾",
            "原名": "Round Shield",
            "检定": "力量",
            "属性": "物理",
            "范围": "近战",
            "伤害": "d4",
            "负荷": "副手",
            "特性": "保护: 护甲值+1"
        },
        armor: {
            "名称": "链甲",
            "原名": "Chainmail Armor",
            "护甲值": "4",
            "阈值": ["7","15"],
            "特性": "重型: 闪避值-1"
        },
    },
    "术士":     { 
        attributes: [-1,0,2,1,0,1], 
        weapon: {
            "名称": "双手法杖",
            "原名": "Dualstaff",
            "检定": "本能",
            "属性": "魔法",
            "范围": "远距离",
            "伤害": "d6+3",
            "负荷": "双手",
            "特性": ""
        },
        offHandWeapon: {}, 
        armor: {
            "名称": "填充布甲",
            "原名": "Gambeson Armor",
            "护甲值": "3",
            "阈值": ["5","11"],
            "特性": "灵活: 闪避值+1"
        },
    },
    "战士":     { 
        attributes: [1,2,1,-1,0,0], 
        weapon: {
            "名称": "长剑",
            "原名": "Longsword",
            "检定": "敏捷",
            "属性": "物理",
            "范围": "近战",
            "伤害": "d8+3",
            "负荷": "双手",
            "特性": ""
        },
        offHandWeapon: {}, 
        armor: {
            "名称": "链甲",
            "原名": "Chainmail Armor",
            "护甲值": "4",
            "阈值": ["7","15"],
            "特性": "重型: 闪避值-1"
        },
    },
    "法师":     { 
        attributes: [0,-1,1,1,2,0], 
        weapon: {
            "名称": "巨杖",
            "原名": "Greatstaff",
            "检定": "知识",
            "属性": "魔法",
            "范围": "极远",
            "伤害": "d6",
            "负荷": "双手",
            "特性": "强力: 额外骰1个伤害骰并去掉其中最小的一个"
        },
        offHandWeapon: {}, 
        armor: {
            "名称": "皮甲",
            "原名": "Leather Armor",
            "护甲值": "3",
            "阈值": ["6","13"],
            "特性": ""
        },
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
        optionValueField: "name", // Changed from "race"
        optionTextField: "name",  // Changed from "race"
        updateFunction: "updateRaceTraitsAsSkills"
    },
    {
        prompt: "请选择你的混血种族（可选）：",
        questionType: "dropdown",
        targetSelectId: "mixedRaceSelect",
        dataSourceVariable: "RACES_DATA",
        optionValueField: "name", // Changed from "race"
        optionTextField: "name",  // Changed from "race"
        updateFunction: "updateRaceTraitsAsSkills"
    },
    {
        prompt: "请选择你的社群：",
        questionType: "dropdown",
        targetSelectId: "communitySelect",
        dataSourceVariable: "GROUPS_DATA",
        optionValueField: "name", // Changed from "社群"
        optionTextField: "name",  // Changed from "社群"
        updateFunction: "updateGroupTraitAsSkill"
    },
    {
        prompt: "请选择你的职业：", // 属性和装备将在此步骤后自动填充
        questionType: "dropdown",
        targetSelectId: "professionSelect",
        dataSourceVariable: "JOBS_DATA",
        optionValueField: "name", // Changed from "职业"
        optionTextField: "name",  // Changed from "职业"
        updateFunction: "updateJobTraitsAsSkills" // This function will be called, then we add our logic
    },
    {
        prompt: "现在，请为您的职业选择一个子职：",
        questionType: "dropdown",
        targetSelectId: "subclassSelect", // Main form's subclass select ID
        dataSourceVariable: "JOBS_DATA", // Subclasses are nested in JOBS_DATA
        optionValueField: "名称", // Field from subclass object for option value
        optionTextField: "名称", // Field from subclass object for option text
        updateFunction: "updateJobTraitsAsSkills" // To update skills/domains based on subclass
    },
    { prompt: "请输入你的角色背景故事：", targetFieldId: "backgroundStory" },
    { prompt: "请输入第一个主要经历的关键词：", targetFieldId: "expKeyword" },
    { prompt: "请输入第二个主要经历的关键词：", targetFieldId: "expKeyword2" }
    // Removed equipment and attribute questions
];

const newbieGuidePrompts = {
    race: {
        "": "    种族代表了一个角色的血缘关系，这对他们的外貌产生了影响。也就是说，任何一个角色都可能具备超出其种族“标准”或“平均”的特征。在同一个种族内，每个个体对世界的看法也会有所不同。例如，一个精灵可能认为他们相比兄弟姐妹而言耳朵很大，但一个费尔伯格（Firbolg）可能会发现，与他们自己相比，精灵的耳朵很小。\n    我们希望这能为你提供一个窗口，让你看到Daggerheart世界中各种生物的不同体态。随着你继续游戏，遇到不同种族的成员，你会有机会了解他们之间的细微差别和独特品质。你还会注意到，在Daggerheart的世界里，“人们”这个词被用来指代所有的种族。他们各自拥有独特的特征、文化和人格。\n    每个种族都有一个或多个种族特征，这是由他们的种族授予的独特动作或多种动作，可以在游戏中使用。有些是可以在会话中激活的法术或能力，而其他的则是被动加成或独特的休息动作。"
        // Specific race descriptions will be dynamically loaded from RACES_DATA
    },
    community: {
        "": "    你的社区描述了你的角色成长的文化或环境。虽然他们很可能在成长过程中是众多社区的一员，但这个选择代表的是他们感觉对其性格和能力影响最大的那一个。就像种族一样，描述一个集体的特征是很微妙的，因为人们总是通过自己的经历来看待他人。\n    例如，虽然一个出身滨海之民（Seaborne）的水手可能觉得他们自己的社区特别严格，但生活在大城市的战团之民（Orderborne）角色可能会觉得那个群体非常善变。个人与社区的关系也创造了各种各样的体验。如果你的角色与定义他们成长的地方或人产生了分歧，他们可能仍然承载着那种影响，但他们可能正在追求与所受教育不同的生活方式。\n    当你探索以下的社区时，想象一下它们在你的游戏中可能以各种方式体现。一些社区卡片提到了地点，其他的是某种理念，还有一些是共同的目标。但是，没有两个属于同一类别的地方是相同的。一个漂泊之民（Wanderborne）可能会跟随着商队自愿周游世界，但另一个也有是被迫离开家园的，那么他们的物质环境和某人对他们生活方式的感受会截然不同。\n    当你构建你的角色时，你可能会从与你所选择扮演的社区不同的社区细节中获得灵感。一如既往，这个游戏的部分旨在以最适合你团队游戏的方式来运用。"
        // Specific community descriptions will be dynamically loaded from GROUPS_DATA
    },
    profession: {
        "": "    你可以通过各职业的描述选中你最中意的那一个, 也可以详读规则书后选择你认为最有趣的那一个.\n    当你选择职业后, 会自动生成其对应的默认推荐属性/武器/护甲/道具. 你可以在本引导完成之后的角色卡制作中再自由更改这些选项, 但请确保符合规则限制, 如有疑问可随时查阅规则书或询问gm."
        // Specific profession descriptions will be dynamically loaded from JOBS_DATA
    },
    subclass: { // Added prompts for subclass selection
        "": "    子职是你职业的专精方向，它会赋予你独特的特性和能力。请根据你的职业选择一个子职。如果你的职业没有子职，或者你暂时不想选择，可以跳过此步骤。",
        // Specific subclass prompts can be added here if needed, keyed by subclass name
        // e.g., "特定子职名称": "关于这个特定子职的提示..."
    },
    textInput: {
        "roleName": "    本引导旨在帮助完全不熟悉规则的萌新建立ta们第一张角色卡, 其中不会涉及任何具体的规则和数值, 而只需要根据你对角色的设想来填写和选择.",
        "age": "   《Daggerheart》鼓励玩家进行角色扮演和叙事, 而不是仅仅依赖于数值和机制. 在建立人物时你可以充分发挥想象, 而不必拘泥与规则之中. 但依然需要注意角色的画风和设定, 不要偏离GM设定的世界观太多.\n    换句话说就是, 只要你的设定足够合理并且能说服GM, 你可以在西幻世界里开高达. 当然, 只是扮演画风如此, 实际游戏依然要遵循规则书的限制.",
        "gender": "    你可以与GM共同讨论你的人物卡与设定, 让GM帮助你的角色更好地融入到游戏中, 以及检查一些人物卡上的错误. 或是与你的队友们讨论, 让你们的角色之间有更多的互动和联系.",
        "backgroundStory": "    简要描述你的角色来自哪里，以及是什么塑造了他们成为现在的样子. 你对背景所做的选择纯粹是叙述性的，但它们会深刻影响你所扮演的角色类型以及GM为你的冒险准备的故事。在角色创建的过程中，如果角色形象更加清晰明确了，不妨自由调整之前步骤中做出的一些机制性选择，让它们更好地反映这一背景。\n    如果你计划参加一场战役，完成背景问题后，你可以按照最适合你的方式来继续发展你的角色。有许多角色背景构建工具可供你使用——只需记得也要把你的背景故事提供给GM，这样他们就能将其中的人物、地点或想法融入到他们主持的战役中。你也可能选择不做更多的背景工作，而是随着游戏的进行逐渐了解你的角色。无论你发现什么有趣的事情，只要能让你以吸引人和兴奋的方式扮演角色，那就是你应该深入挖掘的方向。",
        "expKeyword": "    在《Daggerheart》中，你的“经历（Experience）”是通过机制表达角色背景故事和专长的核心方式之一。经历是一个词或短语，用来概括角色由于其精彩的生活而可能具备的特定技能集合。\n    角色创建时，你将从两个经历开始，并在冒险过程中获得更多。在选择之前，你需要对自己的角色有一个清晰的认识；背景故事的问题在这方面特别有帮助。当你准备好了，与GM合作挑选两个塑造了你角色的经历。确保这些经历能够反映出角色过去的冒险、学习、挑战或任何对其性格和能力有重大影响的事件。这些经历不仅丰富了角色的故事背景，也在游戏中提供了实用的机制加成，让角色在特定情境下更为出色。",
        "expKeyword2": "    这里并没有固定的经历选择列表。相反，选择一个能够体现你角色独特之处的词语或短语。每个经历都应该是具体的。例如，“才华横溢”或“专心致志”太过宽泛，几乎可以适用于任何情境；相反，你可能使用“剑客”或“魔法研究”。另外，你的经历不能直接给予你法术或特定的游戏能力。比如，“飞翔”或“一击必杀”太过偏向于游戏机制；你或许可以考虑“杂技”或“刺客”。\n    我们也鼓励你为经历增添风味，使其在游戏中的应用更加多样。例如，不仅仅是“刺客”，你可以选择“蓝宝石帮的刺客”。这种细节为GM提供了一个可以融入战役的激动人心的派系，同时也使得这项经历在非战斗情景下更容易发挥作用。例如，如果你遇到帮派的盟友，基于你的经历，你可能特别擅长与他们协商。"
    }
};