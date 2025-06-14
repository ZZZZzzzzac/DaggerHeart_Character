const BEAST_FORM = [
    {
        "名称": "迅捷斥候",
        "位阶": 1,
        "例子": "狐狸、老鼠、黄鼠狼等",
        "属性": "敏捷+1",
        "闪避值": "+2",
        "攻击范围": "近战",
        "攻击属性": "敏捷",
        "攻击伤害": "d4",
        "攻击类型": "物理",
        "获得优势": "欺骗，定位，潜行",
        "特性": "*__敏捷：__* 你的移动悄无声息，你可以**花费 1 希望点**在远距离范围内移动而无需掷骰。\n*__脆弱：__* 当你受到重度伤害或更高的伤害时，解除野兽形态。"
    },
    {
        "名称": "居家伴侣",
        "位阶": 1,
        "例子": "猫、狗、兔子等",
        "属性": "本能+1",
        "闪避值": "+2",
        "攻击范围": "近战",
        "攻击属性": "本能",
        "攻击伤害": "d6",
        "攻击类型": "物理",
        "获得优势": "攀爬，定位，保护",
        "特性": "*__同伴：__* 当你帮助盟友时，你可以掷一个 **d8** 作为你的优势骰。\n*__脆弱：__* 当你受到重度伤害或更高的伤害时，解除野兽形态。"
    },
    {
        "名称": "灵巧食草者",
        "位阶": 1,
        "例子": "鹿、瞪羚、山羊等",
        "属性": "敏捷+1",
        "闪避值": "+3",
        "攻击范围": "近战",
        "攻击属性": "敏捷",
        "攻击伤害": "d6",
        "攻击类型": "物理",
        "获得优势": "跳跃，潜行，疾跑",
        "特性": "*__难缠猎物：__* 当一次针对你的攻击掷骰本应成功时，你可以**标记 1 压力点**并掷一个 **d4**，将骰值加入你对抗这次攻击的闪避值上。\n*__脆弱：__* 当你受到重度伤害或更高的伤害时，解除野兽形态。"
    },
    {
        "名称": "群居捕食者",
        "位阶": 1,
        "例子": "郊狼、鬣狗、狼等",
        "属性": "力量+2",
        "闪避值": "+1",
        "攻击范围": "近战",
        "攻击属性": "力量",
        "攻击伤害": "d8+2",
        "攻击类型": "物理",
        "获得优势": "攻击，疾跑，追踪",
        "特性": "*__蹒跚打击：__* 当你成功攻击一个近战范围内的目标时，你可以**标记 1 压力点**使目标暂时处于 *脆弱* 状态。\n*__群体狩猎：__* 当你与紧接着在你之前行动的盟友攻击了同一个目标时，将一个 **d8** 加入你的伤害掷骰。"
    },
    {
        "名称": "深洋斥候",
        "位阶": 1,
        "例子": "鳗鱼、鱼、章鱼等",
        "属性": "敏捷+1",
        "闪避值": "+2",
        "攻击范围": "近战",
        "攻击属性": "敏捷",
        "攻击伤害": "d4",
        "攻击类型": "物理",
        "获得优势": "导航，潜行，游泳",
        "特性": "*__水生：__* 你天生可以在水下呼吸和移动。\n*__脆弱：__* 当你受到重度伤害或更高的伤害时，你解除野兽形态。"
    },
    {
        "名称": "追猎蜘蛛",
        "位阶": 1,
        "例子": "狼蛛，穴居狼蛛等",
        "属性": "灵巧+1",
        "闪避值": "+2",
        "攻击范围": "近战",
        "攻击属性": "灵巧",
        "攻击伤害": "d6+1",
        "攻击类型": "物理",
        "获得优势": "攻击，攀爬，潜行",
        "特性": "*__剧毒之咬：__* 当你成功攻击一个近战范围内的目标时，目标暂时处于 *中毒* 状态。每次 *中毒* 状态的生物行动时，都会受到 **1d10** 点直接物理伤害。\n*__蛛网射手：__* 你可以制造坚韧的蛛网材料，可用于冒险和战斗。蛛网足够坚韧，可以支撑一个生物。通过对其进行一次灵巧掷骰成功，你可以暂时 *束缚* 一个近距离范围内的目标。\n\n/"
    },
    {
        "名称": "甲壳哨兵",
        "位阶": 2,
        "例子": "犰狳、穿山甲、海龟等",
        "属性": "力量+1",
        "闪避值": "+1",
        "攻击范围": "近战",
        "攻击属性": "力量",
        "攻击伤害": "d8+2",
        "攻击类型": "物理",
        "获得优势": "挖掘，定位，保护",
        "特性": "*__硬化甲壳：__* 你坚硬的外壳使你对物理伤害具有抵抗。此外，**标记 1 护甲槽**以缩入壳中。在壳中时，应用抵抗后的物理伤害会再减少等于你护甲值的数值，但你无法执行其他行动，除非离开此形态。\n*__加农炮弹：__* **标记 1 压力点**允许盟友将你投掷或发射向一名敌人。为此，该盟友对一个近距离范围内的目标进行一次使用敏捷或力量（由其选择）的攻击掷骰。成功时，造成使用投掷者熟练值的**d12+2** 点物理伤害。你可以**花费 1 希望点**来额外指定第一个目标邻近范围内的另一名敌人。第二个目标受到第一个目标所受伤害的一半。"
    },
    {
        "名称": "健步行者",
        "位阶": 2,
        "例子": "骆驼，马，斑马等",
        "属性": "敏捷+1",
        "闪避值": "+2",
        "攻击范围": "近战",
        "攻击属性": "敏捷",
        "攻击伤害": "d8+1",
        "攻击类型": "物理",
        "获得优势": "跳跃，导航，冲刺",
        "特性": "*__驮运：__* 你移动时可以最多驮运两名自愿的盟友。\n*__践踏：__* **标记 1 压力点**，在近距离范围内沿直线移动，并对直线上近战范围内的所有目标进行一次攻击。你成功攻击的目标受到使用你的熟练值 **d8+1** 点物理伤害并暂时变为 *脆弱* 。"
    },
    {
        "名称": "猛扑捕食者",
        "位阶": 2,
        "例子": "猎豹、狮子、黑豹等",
        "属性": "本能+1",
        "闪避值": "+3",
        "攻击范围": "近战",
        "攻击属性": "本能",
        "攻击伤害": "d8+6",
        "攻击类型": "物理",
        "获得优势": "攻击，攀爬，潜行",
        "特性": "*__迅捷：__* **花费 1 希望点**，无需掷骰即可在远距离范围内移动。\n*__扑倒：__* **标记 1 压力点**以移动至一个目标的近战范围并对其进行攻击掷骰。成功时，你的本次攻击熟练值获得 +2 加值，且目标必须**标记 1 压力点**。\n\n/\n\n/"
    },
    {
        "名称": "强大野兽",
        "位阶": 2,
        "例子": "熊、公牛、驼鹿等",
        "属性": "力量+1",
        "闪避值": "+3",
        "攻击范围": "近战",
        "攻击属性": "力量",
        "攻击伤害": "d10+4",
        "攻击类型": "物理",
        "获得优势": "导航，保护，恐吓",
        "特性": "*__残暴：__* 每当你在伤害骰上掷出 1 时，你可以掷一个 **d10** 并将骰值加入伤害掷骰中。此外，在进行攻击掷骰之前，你可以**标记 1 压力点**，以获得该攻击的熟练值 +1 加值。\n*__厚实皮毛：__* 你的伤害阈值获得 +2 加值。"
    },
    {
        "名称": "突袭毒蛇",
        "位阶": 2,
        "例子": "眼镜蛇、响尾蛇、蝰蛇等",
        "属性": "灵巧+1",
        "闪避值": "+2",
        "攻击范围": "邻近",
        "攻击属性": "灵巧",
        "攻击伤害": "d8+4",
        "攻击类型": "物理",
        "获得优势": "攀爬，欺骗，冲刺",
        "特性": "*__剧毒噬咬：__* 对邻近范围内的任意数量目标进行攻击。成功时，目标暂时处于 *中毒* 状态。 *中毒* 状态生物每次行动时受到 **1d10** 点物理直接伤害。\n*__警告嘶声：__* **标记 1 压力点**迫使近战范围内的任意数量目标后退至邻近范围。"
    },
    {
        "名称": "翔空猛禽",
        "位阶": 2,
        "例子": "鹰，猫头鹰，渡鸦等",
        "属性": "灵巧+1",
        "闪避值": "+3",
        "攻击范围": "近战",
        "攻击属性": "灵巧",
        "攻击伤害": "d4+2",
        "攻击类型": "物理",
        "获得优势": "欺骗，定位，恐吓",
        "特性": "*__鸟瞰视角：__* 你可以随意飞行。每次休息一次，当你在空中时，你可以无需掷骰向游戏主持人询问关于下方场景的一个问题。第一个根据此信息进行行动掷骰的角色，其掷骰获得优势。\n*__空心骨骼：__* 你的伤害阈值受到 −2 减值。\n/"
    },
    {
        "名称": "巨型捕食者",
        "位阶": 3,
        "例子": "恐狼、迅猛龙、剑齿虎等",
        "属性": "力量+2",
        "闪避值": "+2",
        "攻击范围": "近战",
        "攻击属性": "力量",
        "攻击伤害": "d12+8",
        "攻击类型": "物理",
        "获得优势": "攻击，潜行，冲刺",
        "特性": "*__驮运：__* 你移动时可以最多驮运两名自愿的盟友。\n*__凶猛撕咬：__* 当你成功攻击一个目标时，你可以**花费 1 希望点**使其暂时变为 *脆弱* ，并且你的本次攻击熟练值获得 +1 加值。"
    },
    {
        "名称": "翔空巨禽",
        "位阶": 3,
        "例子": "巨鹰、猎鹰等",
        "属性": "灵巧+2",
        "闪避值": "+3",
        "攻击范围": "近战",
        "攻击属性": "灵巧",
        "攻击伤害": "d8+6",
        "攻击类型": "物理",
        "获得优势": "欺骗，干扰，定位",
        "特性": "*__鸟瞰视角：__* 你可以随意飞行。每次休息一次，当你在空中时，你可以无需掷骰向游戏主持人询问关于下方场景的一个问题。第一个根据此信息进行行动掷骰的角色，其掷骰获得优势。\n*__驮运：__* 你移动时可以最多驮运两名自愿的盟友。"
    },
    {
        "名称": "传奇野兽",
        "位阶": 3,
        "例子": "",
        "属性": "",
        "闪避值": "",
        "攻击范围": "",
        "攻击属性": "",
        "攻击伤害": "",
        "攻击类型": "",
        "获得优势": "",
        "特性": "（位阶1选项升级）\n*__进化：__* 选择一个位阶1野兽形态选项，并成为该生物更大、更强的版本。处于此形态时，你保留原始形态的所有特性和特征，并获得下列增益：\n\n 伤害掷骰获得 +6 加值\n 此形态使用的属性获得 +1 加值\n 闪避值获得 +2 加值\n/\n\n\n\n/"
    },
    {
        "名称": "巨型蜥种",
        "位阶": 3,
        "例子": "短吻鳄、鳄鱼、吉拉毒蜥等",
        "属性": "本能+2",
        "闪避值": "+1",
        "攻击范围": "近战",
        "攻击属性": "本能",
        "攻击伤害": "d10+7",
        "攻击类型": "物理",
        "获得优势": "攻击，潜行，追踪",
        "特性": "*__体格防御：__* 你的伤害阈值获得 +3 加值。\n*__捕食打击：__* 当你成功攻击近战范围内的一个目标时，你可以**花费 1 希望点**用你的颌部咬住该对手，使其暂时处于 *束缚* 和 *脆弱* 状态。"
    },
    {
        "名称": "深洋捕食者",
        "位阶": 3,
        "例子": "海豚、虎鲸、鲨鱼等",
        "属性": "敏捷+2",
        "闪避值": "+4",
        "攻击范围": "近战",
        "攻击属性": "敏捷",
        "攻击伤害": "d10+6",
        "攻击类型": "物理",
        "获得优势": "攻击，游泳，追踪",
        "特性": "*__水生：__* 你天生可以在水下呼吸和移动。\n*__凶猛撕咬：__* 当你成功攻击一个目标时，你可以**花费 1 希望点**使其暂时处于 *脆弱* 状态，并且你的本次攻击熟练值获得 +1 加值。"
    },
    {
        "名称": "传奇混种生物",
        "位阶": 3,
        "例子": "狮鹫、斯芬克斯等",
        "属性": "力量+2",
        "闪避值": "+3",
        "攻击范围": "近战",
        "攻击属性": "力量",
        "攻击伤害": "d10+8",
        "攻击类型": "物理",
        "获得优势": "",
        "特性": "*__混种特性：__* 要变形成此生物，额外**标记 1 压力点**。从位阶1至位阶2的野兽形态选项中选择任意两个，从这些选项中总共选择四个优势和两个特性。\n/"
    },
    {
        "名称": "庞然巨兽",
        "位阶": 4,
        "例子": "大象、猛犸象、犀牛等",
        "属性": "力量+3",
        "闪避值": "+1",
        "攻击范围": "近战",
        "攻击属性": "力量",
        "攻击伤害": "d12+12",
        "攻击类型": "物理",
        "获得优势": "定位，保护，恐吓，冲刺",
        "特性": "*__驮运：__* 你移动时可以最多驮运四名自愿的盟友。\n*__摧毁：__* **花费 1 希望点**，在远距离范围内沿直线移动，并对直线上近战范围内的所有目标进行一次攻击。你成功攻击的目标会受到使用你的熟练值 **d8+10** 点物理伤害并暂时变为 *脆弱* 。\n*__无畏：__* 你的所有伤害阈值获得 +2 加值。"
    },
    {
        "名称": "神话空猎者",
        "位阶": 4,
        "例子": "龙、翼龙、大鹏、双足飞龙等",
        "属性": "灵巧+3",
        "闪避值": "+4",
        "攻击范围": "近战",
        "攻击属性": "灵巧",
        "攻击伤害": "d10+11",
        "攻击类型": "物理",
        "获得优势": "攻击，欺骗，定位，导航",
        "特性": "*__驮运：__* 你移动时可以最多驮运三名自愿的盟友。\n*__致命猛禽：__* 你可以随意飞行，并且作为你的行动的一部分在远距离范围内移动。当你用同一个动作沿直线移动至少近距离范围，并且攻击敌人时，你可以重掷所有结果低于你熟练值的伤害骰。"
    },
    {
        "名称": "神话野兽",
        "位阶": 4,
        "例子": "",
        "属性": "",
        "闪避值": "",
        "攻击范围": "",
        "攻击属性": "",
        "攻击伤害": "",
        "攻击类型": "",
        "获得优势": "",
        "特性": "（升级版位阶1或位阶2选项）\n*__进化：__* 选择一个位阶1或位阶2的野兽形态选项，并变成该生物更大、更强大的版本。处于此形态时，你保留原形态的所有属性和特性，并获得下列增益：\n\n 伤害掷骰获得 +9 加成\n 该形态使用的属性获得 +2 加成\n 闪避值获得 +3 加成\n 你的伤害骰增加一级大小（d6 变为 d8，d8 变为 d10，等等）\n/\n\n/"
    },
    {
        "名称": "可怖蜥种",
        "位阶": 4,
        "例子": "腕龙、霸王龙等",
        "属性": "力量+3",
        "闪避值": "+2",
        "攻击范围": "近战",
        "攻击属性": "力量",
        "攻击伤害": "d12+10",
        "攻击类型": "物理",
        "获得优势": "攻击，欺骗，恐吓，追踪",
        "特性": "*__毁灭打击：__* 当你对近战范围内的目标造成重伤时，你可以**标记 1 压力点**，迫使其额外**标记 1 生命点**。\n*__巨兽行进：__* 你可以无需掷骰在远距离范围内移动。由于你的体型，你可以无视崎岖地形（由游戏主持人决定）。"
    },
    {
        "名称": "史诗海兽",
        "位阶": 4,
        "例子": "巨型乌贼、鲸鱼等",
        "属性": "敏捷+3",
        "闪避值": "+3",
        "攻击范围": "近战",
        "攻击属性": "敏捷",
        "攻击伤害": "d10+10",
        "攻击类型": "物理",
        "获得优势": "定位，保护，恐吓，追踪",
        "特性": "*__海洋霸主：__* 你天生可以在水下呼吸和移动。当你对近战范围内的目标进行攻击并成功时，你可以暂时使其处于 *束缚* 状态。\n*__不屈：__* 当你将要**标记 1 护甲槽**时，掷一个**d6**。结果为5或更高时，将伤害等级降低一级且无需标记护甲槽。"
    },
    {
        "名称": "神话混种生物",
        "位阶": 4,
        "例子": "奇美拉、鸡蛇怪、曼提柯尔等",
        "属性": "力量+3",
        "闪避值": "+2",
        "攻击范围": "近战",
        "攻击属性": "力量",
        "攻击伤害": "d12+10",
        "攻击类型": "物理",
        "获得优势": "",
        "特性": "*__混种特性：__* 变形为这种生物时，额外**标记 2 压力点**。从位阶13中选择任意三个野兽形态选项。从这些选项中总共选择五个优势和三个特性。\n/"
    }
];