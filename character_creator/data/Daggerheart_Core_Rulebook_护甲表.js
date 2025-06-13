const ARMOR = [
    {
        "name": "填充布甲",
        "major_threshold": "5",
        "severe_threshold": "11",
        "score": "3",
        "desc": "**灵活：**闪避值+1。",
        "tier": 1
    },
    {
        "name": "皮甲",
        "major_threshold": "6",
        "severe_threshold": "13",
        "score": "3",
        "desc": "",
        "tier": 1
    },
    {
        "name": "链甲",
        "major_threshold": "7",
        "severe_threshold": "15",
        "score": "4",
        "desc": "**重型：**闪避值-1。",
        "tier": 1
    },
    {
        "name": "全板甲",
        "major_threshold": "8",
        "severe_threshold": "17",
        "score": "4",
        "desc": "**极重：**闪避值-2，敏捷-1。",
        "tier": 1
    },
    {
        "name": "改良填充布甲",
        "major_threshold": "7",
        "severe_threshold": "16",
        "score": "4",
        "desc": "**灵活：**闪避值+1。",
        "tier": 2
    },
    {
        "name": "改良皮甲",
        "major_threshold": "9",
        "severe_threshold": "20",
        "score": "4",
        "desc": "",
        "tier": 2
    },
    {
        "name": "改良链甲",
        "major_threshold": "11",
        "severe_threshold": "24",
        "score": "5",
        "desc": "**重型：**闪避值-1。",
        "tier": 2
    },
    {
        "name": "改良全板甲",
        "major_threshold": "13",
        "severe_threshold": "28",
        "score": "5",
        "desc": "**极重：**闪避值-2，敏捷-1。",
        "tier": 2
    },
    {
        "name": "埃伦德里安链甲",
        "major_threshold": "9",
        "severe_threshold": "21",
        "score": "4",
        "desc": "**防护：**受魔法伤害时，在计算伤害阈值前按护甲值减免伤害。",
        "tier": 2
    },
    {
        "name": "掠骸护甲",
        "major_threshold": "9",
        "severe_threshold": "21",
        "score": "4",
        "desc": "**坚韧：**在标记最后一个护甲槽之前，掷一个d6。如果掷出6，则可以降低伤害一个等级而无需标记槽位。",
        "tier": 2
    },
    {
        "name": "铁木胸甲",
        "major_threshold": "9",
        "severe_threshold": "20",
        "score": "4",
        "desc": "**强化：**当你标记最后一个护甲槽时，你的伤害阈值提升+2，直至你清除至少1个护甲槽。",
        "tier": 2
    },
    {
        "name": "符文浮甲",
        "major_threshold": "9",
        "severe_threshold": "20",
        "score": "4",
        "desc": "**转移：**当你成为攻击目标时，可以**标记 1 护甲槽**，使针对你的攻击检定具有劣势。",
        "tier": 2
    },
    {
        "name": "泰瑞斯软甲",
        "major_threshold": "8",
        "severe_threshold": "18",
        "score": "5",
        "desc": "**安静：**任何试图不被人听到的移动动作掷骰+2。",
        "tier": 2
    },
    {
        "name": "蔷薇野甲",
        "major_threshold": "11",
        "severe_threshold": "23",
        "score": "5",
        "desc": "**希冀：**每当你需要**花费希望点**时，可以改为**标记护甲槽**。",
        "tier": 2
    },
    {
        "name": "高级填充布甲",
        "major_threshold": "9",
        "severe_threshold": "23",
        "score": "5",
        "desc": "**灵活：**闪避值+1。",
        "tier": 3
    },
    {
        "name": "高级皮甲",
        "major_threshold": "11",
        "severe_threshold": "27",
        "score": "5",
        "desc": "",
        "tier": 3
    },
    {
        "name": "高级链甲",
        "major_threshold": "13",
        "severe_threshold": "31",
        "score": "6",
        "desc": "**重型：**闪避值-1。",
        "tier": 3
    },
    {
        "name": "高级全板甲",
        "major_threshold": "15",
        "severe_threshold": "35",
        "score": "6",
        "desc": "**极重：**闪避值-2，敏捷-1。",
        "tier": 3
    },
    {
        "name": "贝拉莫伊精致护甲",
        "major_threshold": "11",
        "severe_threshold": "27",
        "score": "5",
        "desc": "**鎏金：**风度+1。",
        "tier": 3
    },
    {
        "name": "龙鳞护甲",
        "major_threshold": "11",
        "severe_threshold": "27",
        "score": "5",
        "desc": "**坚不可摧：**每短休一次，当你的生命值即将归零时，可以改为**标记 1 压力点**。",
        "tier": 3
    },
    {
        "name": "尖刺护甲",
        "major_threshold": "10",
        "severe_threshold": "25",
        "score": "5",
        "desc": "**锋利：**每当你成功进行近战攻击时，伤害骰加1d4。",
        "tier": 3
    },
    {
        "name": "剑刃护甲",
        "major_threshold": "16",
        "severe_threshold": "39",
        "score": "6",
        "desc": "**物理防御：**你不能使用此护甲抵消魔法伤害。",
        "tier": 3
    },
    {
        "name": "莫奈特的斗篷",
        "major_threshold": "16",
        "severe_threshold": "39",
        "score": "6",
        "desc": "**魔法防御：**你不能使用此护甲抵消物理伤害。",
        "tier": 3
    },
    {
        "name": "强化符文",
        "major_threshold": "17",
        "severe_threshold": "43",
        "score": "6",
        "desc": "**苦痛：**每当你因受到攻击而标记1点或更多的护甲槽时，需**标记 1 压力点**。",
        "tier": 3
    },
    {
        "name": "传奇填充布甲",
        "major_threshold": "11",
        "severe_threshold": "32",
        "score": "6",
        "desc": "**灵活：**闪避值+1。",
        "tier": 4
    },
    {
        "name": "传奇皮甲",
        "major_threshold": "13",
        "severe_threshold": "36",
        "score": "6",
        "desc": "",
        "tier": 4
    },
    {
        "name": "传奇链甲",
        "major_threshold": "15",
        "severe_threshold": "40",
        "score": "7",
        "desc": "**重型：**闪避值-1。",
        "tier": 4
    },
    {
        "name": "传奇全板甲",
        "major_threshold": "17",
        "severe_threshold": "44",
        "score": "7",
        "desc": "**极重：**闪避值-2，敏捷-1。",
        "tier": 4
    },
    {
        "name": "威能丝甲",
        "major_threshold": "13",
        "severe_threshold": "36",
        "score": "7",
        "desc": "**时缓：****标记 1 护甲槽**，掷一个d4，并将结果作为闪避加值应用于对抗此次来袭攻击。",
        "tier": 4
    },
    {
        "name": "引导护甲",
        "major_threshold": "13",
        "severe_threshold": "36",
        "score": "5",
        "desc": "**引导：**当装备此护甲时，所有施法掷骰+1",
        "tier": 4
    },
    {
        "name": "织烬护甲",
        "major_threshold": "13",
        "severe_threshold": "36",
        "score": "6",
        "desc": "**燃烧：**每当有敌人在近战范围内击中你时，其立即**标记 1 压力点**。",
        "tier": 4
    },
    {
        "name": "全面强化护甲",
        "major_threshold": "15",
        "severe_threshold": "40",
        "score": "4",
        "desc": "**坚毅：**当你**标记 1 护甲槽**时，可将攻击的严重程度降低两级而非一级。",
        "tier": 4
    },
    {
        "name": "诚实蛋白石护甲",
        "major_threshold": "13",
        "severe_threshold": "36",
        "score": "6",
        "desc": "**求真：**当任何人在近距离范围内说谎时，此护甲将会发光。",
        "tier": 4
    },
    {
        "name": "救世主链甲",
        "major_threshold": "18",
        "severe_threshold": "48",
        "score": "8",
        "desc": "**困难：**装备角色所有属性以及闪避值-1。",
        "tier": 4
    }
]