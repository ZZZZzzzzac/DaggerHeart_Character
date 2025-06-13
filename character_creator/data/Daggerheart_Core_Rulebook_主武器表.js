const PRIMARY_WEAPON = [
    {
        "name": "阔剑",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d8",
        "two_handed": "单手",
        "physical": true,
        "desc": "**可靠：**你的攻击掷骰+1。",
        "tier": 1
    },
    {
        "name": "长剑",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d8+3",
        "two_handed": "双手",
        "physical": true,
        "desc": "",
        "tier": 1
    },
    {
        "name": "战斧",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+3",
        "two_handed": "双手",
        "physical": true,
        "desc": "",
        "tier": 1
    },
    {
        "name": "巨剑",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+3",
        "two_handed": "双手",
        "physical": true,
        "desc": "**巨型：**闪避值-1，额外掷一个伤害骰并去掉其中最小的一个。",
        "tier": 1
    },
    {
        "name": "钉头锤",
        "trait": "力量",
        "range": "近战",
        "damage": "d8+1",
        "two_handed": "单手",
        "physical": true,
        "desc": "",
        "tier": 1
    },
    {
        "name": "战锤",
        "trait": "力量",
        "range": "近战",
        "damage": "d12+3",
        "two_handed": "双手",
        "physical": true,
        "desc": "**重型：**闪避值-1。",
        "tier": 1
    },
    {
        "name": "匕首",
        "trait": "灵巧",
        "range": "近战",
        "damage": "d8+1",
        "two_handed": "单手",
        "physical": true,
        "desc": "",
        "tier": 1
    },
    {
        "name": "短棍",
        "trait": "本能",
        "range": "近战",
        "damage": "d10+3",
        "two_handed": "双手",
        "physical": true,
        "desc": "",
        "tier": 1
    },
    {
        "name": "短刀",
        "trait": "风度",
        "range": "近战",
        "damage": "d8+1",
        "two_handed": "单手",
        "physical": true,
        "desc": "",
        "tier": 1
    },
    {
        "name": "刺剑",
        "trait": "风度",
        "range": "近战",
        "damage": "d8",
        "two_handed": "单手",
        "physical": true,
        "desc": "**迅捷：****标记 1 压力点**以额外攻击一个范围内的目标。",
        "tier": 1
    },
    {
        "name": "戟",
        "trait": "力量",
        "range": "邻近",
        "damage": "d10+2",
        "two_handed": "双手",
        "physical": true,
        "desc": "**繁琐：**灵巧-1。",
        "tier": 1
    },
    {
        "name": "长矛",
        "trait": "灵巧",
        "range": "邻近",
        "damage": "d10+2",
        "two_handed": "双手",
        "physical": true,
        "desc": "**繁琐：**灵巧-1。",
        "tier": 1
    },
    {
        "name": "短弓",
        "trait": "敏捷",
        "range": "远距离",
        "damage": "d6+3",
        "two_handed": "双手",
        "physical": true,
        "desc": "",
        "tier": 1
    },
    {
        "name": "弩",
        "trait": "灵巧",
        "range": "远距离",
        "damage": "d6+1",
        "two_handed": "单手",
        "physical": true,
        "desc": "",
        "tier": 1
    },
    {
        "name": "长弓",
        "trait": "敏捷",
        "range": "极远",
        "damage": "d8+3",
        "two_handed": "双手",
        "physical": true,
        "desc": "**繁琐：**灵巧-1。",
        "tier": 1
    },
    {
        "name": "奥术护手",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+3",
        "two_handed": "双手",
        "physical": false,
        "desc": "",
        "tier": 1
    },
    {
        "name": "圣斧",
        "trait": "力量",
        "range": "近战",
        "damage": "d8+1",
        "two_handed": "单手",
        "physical": false,
        "desc": "",
        "tier": 1
    },
    {
        "name": "发光戒指",
        "trait": "敏捷",
        "range": "邻近",
        "damage": "d10+1",
        "two_handed": "双手",
        "physical": false,
        "desc": "",
        "tier": 1
    },
    {
        "name": "手持符文",
        "trait": "本能",
        "range": "邻近",
        "damage": "d10",
        "two_handed": "单手",
        "physical": false,
        "desc": "",
        "tier": 1
    },
    {
        "name": "回力剑",
        "trait": "灵巧",
        "range": "近距离",
        "damage": "d8",
        "two_handed": "单手",
        "physical": false,
        "desc": "**回力：**当此武器在射程内被投掷后，会在完成攻击的瞬间重新出现在你手中。",
        "tier": 1
    },
    {
        "name": "短杖",
        "trait": "本能",
        "range": "近距离",
        "damage": "d8+1",
        "two_handed": "单手",
        "physical": false,
        "desc": "",
        "tier": 1
    },
    {
        "name": "双手法杖",
        "trait": "本能",
        "range": "远距离",
        "damage": "d6+3",
        "two_handed": "双手",
        "physical": false,
        "desc": "",
        "tier": 1
    },
    {
        "name": "权杖",
        "trait": "风度",
        "range": "远距离",
        "damage": "d6",
        "two_handed": "双手",
        "physical": false,
        "desc": "**多用：**这把武器也可以此方式使用 - 风度 近战 d8。",
        "tier": 1
    },
    {
        "name": "魔杖",
        "trait": "知识",
        "range": "远距离",
        "damage": "d6+1",
        "two_handed": "单手",
        "physical": false,
        "desc": "",
        "tier": 1
    },
    {
        "name": "巨杖",
        "trait": "知识",
        "range": "极远",
        "damage": "d6",
        "two_handed": "双手",
        "physical": false,
        "desc": "**强力：**额外掷一个伤害骰并去掉其中最小的一个。",
        "tier": 1
    },
    {
        "name": "改良阔剑",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d8+3",
        "two_handed": "单手",
        "physical": true,
        "desc": "**可靠：**你的攻击掷骰+1。",
        "tier": 2
    },
    {
        "name": "改良长剑",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d8+6",
        "two_handed": "双手",
        "physical": true,
        "desc": "",
        "tier": 2
    },
    {
        "name": "改良战斧",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+6",
        "two_handed": "双手",
        "physical": true,
        "desc": "",
        "tier": 2
    },
    {
        "name": "改良巨剑",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+6",
        "two_handed": "双手",
        "physical": true,
        "desc": "**巨型：**闪避值-1，额外掷一个伤害骰并去掉其中最小的一个。",
        "tier": 2
    },
    {
        "name": "改良钉头锤",
        "trait": "力量",
        "range": "近战",
        "damage": "d8+4",
        "two_handed": "单手",
        "physical": true,
        "desc": "",
        "tier": 2
    },
    {
        "name": "改良战锤",
        "trait": "力量",
        "range": "近战",
        "damage": "d12+6",
        "two_handed": "双手",
        "physical": true,
        "desc": "**重型：**闪避值-1。",
        "tier": 2
    },
    {
        "name": "改良匕首",
        "trait": "灵巧",
        "range": "近战",
        "damage": "d8+4",
        "two_handed": "单手",
        "physical": true,
        "desc": "",
        "tier": 2
    },
    {
        "name": "改良短棍",
        "trait": "本能",
        "range": "近战",
        "damage": "d10+6",
        "two_handed": "双手",
        "physical": true,
        "desc": "",
        "tier": 2
    },
    {
        "name": "改良短刀",
        "trait": "风度",
        "range": "近战",
        "damage": "d8+4",
        "two_handed": "单手",
        "physical": true,
        "desc": "",
        "tier": 2
    },
    {
        "name": "改良刺剑",
        "trait": "风度",
        "range": "近战",
        "damage": "d8+3",
        "two_handed": "单手",
        "physical": true,
        "desc": "**迅捷：****标记 1 压力点**以额外攻击一个范围内的目标。",
        "tier": 2
    },
    {
        "name": "改良戟",
        "trait": "力量",
        "range": "邻近",
        "damage": "d10+5",
        "two_handed": "双手",
        "physical": true,
        "desc": "**繁琐：**灵巧-1。",
        "tier": 2
    },
    {
        "name": "改良长矛",
        "trait": "灵巧",
        "range": "邻近",
        "damage": "d10+5",
        "two_handed": "双手",
        "physical": true,
        "desc": "**繁琐：**灵巧-1。",
        "tier": 2
    },
    {
        "name": "改良短弓",
        "trait": "敏捷",
        "range": "远距离",
        "damage": "d6+6",
        "two_handed": "双手",
        "physical": true,
        "desc": "",
        "tier": 2
    },
    {
        "name": "改良弩",
        "trait": "灵巧",
        "range": "远距离",
        "damage": "d6+4",
        "two_handed": "单手",
        "physical": true,
        "desc": "",
        "tier": 2
    },
    {
        "name": "改良长弓",
        "trait": "敏捷",
        "range": "极远",
        "damage": "d8+6",
        "two_handed": "双手",
        "physical": true,
        "desc": "**繁琐：**灵巧-1。",
        "tier": 2
    },
    {
        "name": "鎏金弯刀",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+4",
        "two_handed": "单手",
        "physical": true,
        "desc": "**强力：**额外掷一个伤害骰并去掉其中最小的一个。",
        "tier": 2
    },
    {
        "name": "拳刃",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+6",
        "two_handed": "双手",
        "physical": true,
        "desc": "**残暴：**伤害骰每掷出一次最大值，就额外掷出一个伤害骰。",
        "tier": 2
    },
    {
        "name": "乌洛克阔剑",
        "trait": "灵巧",
        "range": "近战",
        "damage": "d8+3",
        "two_handed": "单手",
        "physical": true,
        "desc": "**致命：**造成严重伤害时，额外造成 1 生命点的伤害。",
        "tier": 2
    },
    {
        "name": "刃鞭",
        "trait": "敏捷",
        "range": "邻近",
        "damage": "d8+3",
        "two_handed": "单手",
        "physical": true,
        "desc": "**迅捷：****标记 1 压力点**以额外攻击一个范围内的目标 。",
        "tier": 2
    },
    {
        "name": "钢铸戟",
        "trait": "力量",
        "range": "邻近",
        "damage": "d8+4",
        "two_handed": "双手",
        "physical": true,
        "desc": "**恐惧：**成功的攻击同时会额外**标记 1 压力点**。",
        "tier": 2
    },
    {
        "name": "战镰",
        "trait": "灵巧",
        "range": "邻近",
        "damage": "d8+5",
        "two_handed": "双手",
        "physical": true,
        "desc": "**可靠：**你的攻击掷骰+1。",
        "tier": 2
    },
    {
        "name": "火铳",
        "trait": "灵巧",
        "range": "近距离",
        "damage": "d8+6",
        "two_handed": "双手",
        "physical": true,
        "desc": "**装填：**攻击后掷一个d6，掷出1时，下次攻击前你必须**标记 1 压力点**进行装填。",
        "tier": 2
    },
    {
        "name": "巨弓",
        "trait": "力量",
        "range": "远距离",
        "damage": "d6+6",
        "two_handed": "双手",
        "physical": true,
        "desc": "**强力：**额外掷一个伤害骰并去掉其中最小的一个。",
        "tier": 2
    },
    {
        "name": "细弦弓",
        "trait": "敏捷",
        "range": "极远",
        "damage": "d6+5",
        "two_handed": "双手",
        "physical": true,
        "desc": "**可靠：**你的攻击掷骰+1。",
        "tier": 2
    },
    {
        "name": "改良奥术护手",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+6",
        "two_handed": "双手",
        "physical": false,
        "desc": "",
        "tier": 2
    },
    {
        "name": "改良圣斧",
        "trait": "力量",
        "range": "近战",
        "damage": "d8+4",
        "two_handed": "单手",
        "physical": false,
        "desc": "",
        "tier": 2
    },
    {
        "name": "改良发光戒指",
        "trait": "敏捷",
        "range": "邻近",
        "damage": "d10+5",
        "two_handed": "双手",
        "physical": false,
        "desc": "",
        "tier": 2
    },
    {
        "name": "改良手持符文",
        "trait": "本能",
        "range": "邻近",
        "damage": "d10+3",
        "two_handed": "单手",
        "physical": false,
        "desc": "",
        "tier": 2
    },
    {
        "name": "改良回力剑",
        "trait": "灵巧",
        "range": "近距离",
        "damage": "d8+3",
        "two_handed": "单手",
        "physical": false,
        "desc": "**回力：**当此武器在射程内被投掷后，会在完成攻击的瞬间重新出现在你手中。",
        "tier": 2
    },
    {
        "name": "改良短杖",
        "trait": "本能",
        "range": "近距离",
        "damage": "d8+4",
        "two_handed": "单手",
        "physical": false,
        "desc": "",
        "tier": 2
    },
    {
        "name": "改良双手法杖",
        "trait": "本能",
        "range": "远距离",
        "damage": "d6+6",
        "two_handed": "双手",
        "physical": false,
        "desc": "",
        "tier": 2
    },
    {
        "name": "改良权杖",
        "trait": "风度",
        "range": "远距离",
        "damage": "d6+3",
        "two_handed": "双手",
        "physical": false,
        "desc": "**多用：**这把武器也可以此方式使用 - 风度 近战 d8+3。",
        "tier": 2
    },
    {
        "name": "改良魔杖",
        "trait": "知识",
        "range": "远距离",
        "damage": "d6+4",
        "two_handed": "单手",
        "physical": false,
        "desc": "",
        "tier": 2
    },
    {
        "name": "改良巨杖",
        "trait": "知识",
        "range": "极远",
        "damage": "d6+3",
        "two_handed": "双手",
        "physical": false,
        "desc": "**强力：**额外掷一个伤害骰并去掉其中最小的一个。",
        "tier": 2
    },
    {
        "name": "自我之刃",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d12+4",
        "two_handed": "单手",
        "physical": false,
        "desc": "**傲慢：**0或者更低的风度才可以使用该武器。",
        "tier": 2
    },
    {
        "name": "施法剑",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+4",
        "two_handed": "双手",
        "physical": false,
        "desc": "**多用：**这把武器也可以此方式使用 - 知识 远距离 d6+3。",
        "tier": 2
    },
    {
        "name": "吞噬匕首",
        "trait": "灵巧",
        "range": "近战",
        "damage": "d8+4",
        "two_handed": "单手",
        "physical": false,
        "desc": "**恐惧：**成功攻击的同时会额外**标记 1 压力点**。",
        "tier": 2
    },
    {
        "name": "异界之锤",
        "trait": "本能",
        "range": "近战",
        "damage": "d8+6",
        "two_handed": "双手",
        "physical": false,
        "desc": "**爆发：**当你在近战中击中一个生物时，每个邻近的敌人都必须进行反应掷骰（14），否则也会受到一半的伤害。",
        "tier": 2
    },
    {
        "name": "尤塔里血弓",
        "trait": "灵巧",
        "range": "远距离",
        "damage": "d6+4",
        "two_handed": "双手",
        "physical": false,
        "desc": "**残暴：**伤害骰每掷出一次最大值，就额外掷出一个伤害骰。",
        "tier": 2
    },
    {
        "name": "长者之弓",
        "trait": "本能",
        "range": "远距离",
        "damage": "d6+4",
        "two_handed": "双手",
        "physical": false,
        "desc": "**强力：**额外掷一个伤害骰并去掉其中最小的一个。",
        "tier": 2
    },
    {
        "name": "伊利亚斯的权杖",
        "trait": "风度",
        "range": "远距离",
        "damage": "d6+3",
        "two_handed": "单手",
        "physical": false,
        "desc": "**振奋：**当你成功攻击时，掷一个 d4。掷出 4 时，**清除 1 压力点** 。",
        "tier": 2
    },
    {
        "name": "迷惑魔杖",
        "trait": "风度",
        "range": "远距离",
        "damage": "d6+4",
        "two_handed": "单手",
        "physical": false,
        "desc": "**说服：**在进行风度掷骰前可**标记 1 压力点**以获得+2加值。",
        "tier": 2
    },
    {
        "name": "看守者之杖",
        "trait": "知识",
        "range": "远距离",
        "damage": "d6+4",
        "two_handed": "双手",
        "physical": false,
        "desc": "**可靠：**你的攻击掷骰+1。",
        "tier": 2
    },
    {
        "name": "高级阔剑",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d8+6",
        "two_handed": "单手",
        "physical": true,
        "desc": "**可靠：**你的攻击掷骰+1。",
        "tier": 3
    },
    {
        "name": "高级长剑",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d8+9",
        "two_handed": "双手",
        "physical": true,
        "desc": "",
        "tier": 3
    },
    {
        "name": "高级战斧",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+9",
        "two_handed": "双手",
        "physical": true,
        "desc": "",
        "tier": 3
    },
    {
        "name": "高级巨剑",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+9",
        "two_handed": "双手",
        "physical": true,
        "desc": "**巨型：**闪避值-1，额外掷一个伤害骰并去掉其中最小的一个。",
        "tier": 3
    },
    {
        "name": "高级钉头锤",
        "trait": "力量",
        "range": "近战",
        "damage": "d8+7",
        "two_handed": "单手",
        "physical": true,
        "desc": "",
        "tier": 3
    },
    {
        "name": "高级战锤",
        "trait": "力量",
        "range": "近战",
        "damage": "d12+9",
        "two_handed": "双手",
        "physical": true,
        "desc": "**重型：**闪避值-1。",
        "tier": 3
    },
    {
        "name": "高级匕首",
        "trait": "灵巧",
        "range": "近战",
        "damage": "d8+7",
        "two_handed": "单手",
        "physical": true,
        "desc": "",
        "tier": 3
    },
    {
        "name": "高级短棍",
        "trait": "本能",
        "range": "近战",
        "damage": "d10+9",
        "two_handed": "双手",
        "physical": true,
        "desc": "",
        "tier": 3
    },
    {
        "name": "高级短刀",
        "trait": "风度",
        "range": "近战",
        "damage": "d8+7",
        "two_handed": "单手",
        "physical": true,
        "desc": "",
        "tier": 3
    },
    {
        "name": "高级刺剑",
        "trait": "风度",
        "range": "近战",
        "damage": "d8+6",
        "two_handed": "单手",
        "physical": true,
        "desc": "**迅捷：****标记 1 压力点**以额外攻击一个范围内的目标。",
        "tier": 3
    },
    {
        "name": "高级戟",
        "trait": "力量",
        "range": "邻近",
        "damage": "d10+8",
        "two_handed": "双手",
        "physical": true,
        "desc": "**繁琐：**灵巧-1。",
        "tier": 3
    },
    {
        "name": "高级长矛",
        "trait": "灵巧",
        "range": "邻近",
        "damage": "d10+8",
        "two_handed": "双手",
        "physical": true,
        "desc": "**繁琐：**灵巧-1。",
        "tier": 3
    },
    {
        "name": "高级短弓",
        "trait": "敏捷",
        "range": "远距离",
        "damage": "d6+9",
        "two_handed": "双手",
        "physical": true,
        "desc": "",
        "tier": 3
    },
    {
        "name": "高级弩",
        "trait": "灵巧",
        "range": "远距离",
        "damage": "d6+7",
        "two_handed": "单手",
        "physical": true,
        "desc": "",
        "tier": 3
    },
    {
        "name": "高级长弓",
        "trait": "敏捷",
        "range": "极远",
        "damage": "d8+9",
        "two_handed": "双手",
        "physical": true,
        "desc": "**繁琐：**灵巧-1。",
        "tier": 3
    },
    {
        "name": "闪蝶之刃",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d8+5",
        "two_handed": "单手",
        "physical": true,
        "desc": "**锐翼：**将你的敏捷属性值加入该武器的伤害掷骰加值中。",
        "tier": 3
    },
    {
        "name": "勇气之剑",
        "trait": "力量",
        "range": "近战",
        "damage": "d12+7",
        "two_handed": "双手",
        "physical": true,
        "desc": "**勇气：**闪避值 -1 ，严重伤害阈值 +3 。",
        "tier": 3
    },
    {
        "name": "愤怒之锤",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+7",
        "two_handed": "双手",
        "physical": true,
        "desc": "**毁灭：**在攻击掷骰之前**标记 1 压力点**，在进行伤害掷骰时，把你的伤害骰改为d20",
        "tier": 3
    },
    {
        "name": "拉布里斯斧",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+7",
        "two_handed": "双手",
        "physical": true,
        "desc": "**保护：**护甲值+1。",
        "tier": 3
    },
    {
        "name": "经络短刀",
        "trait": "风度",
        "range": "近战",
        "damage": "d10+5",
        "two_handed": "单手",
        "physical": true,
        "desc": "**决斗：**当近距离内除了当前目标外没有其他生物时，攻击掷骰时获得优势。",
        "tier": 3
    },
    {
        "name": "伸缩军刀",
        "trait": "风度",
        "range": "近战",
        "damage": "d10+7",
        "two_handed": "单手",
        "physical": true,
        "desc": "**伸缩：**刀片可以隐藏在刀柄中以避免被识别为武器。",
        "tier": 3
    },
    {
        "name": "双连枷",
        "trait": "敏捷",
        "range": "邻近",
        "damage": "d10+8",
        "two_handed": "双手",
        "physical": true,
        "desc": "**强力：**额外掷一个伤害骰并去掉其中最小的一个。",
        "tier": 3
    },
    {
        "name": "利爪之刃",
        "trait": "灵巧",
        "range": "近距离",
        "damage": "d10+7",
        "two_handed": "双手",
        "physical": true,
        "desc": "**残暴：**伤害骰每掷出一次最大值，就额外掷出一个伤害骰。",
        "tier": 3
    },
    {
        "name": "黑火药左轮",
        "trait": "灵巧",
        "range": "远距离",
        "damage": "d6+8",
        "two_handed": "单手",
        "physical": true,
        "desc": "**装填：**攻击后掷一个d6，掷出1时，下次攻击前你必须**标记 1 压力点**进行装填",
        "tier": 3
    },
    {
        "name": "尖刺弓",
        "trait": "敏捷",
        "range": "极远",
        "damage": "d6+7",
        "two_handed": "双手",
        "physical": true,
        "desc": "**多用：**这把武器也可以此方式使用 - 敏捷 近战 d10+5。",
        "tier": 3
    },
    {
        "name": "高级奥术护手",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+9",
        "two_handed": "双手",
        "physical": false,
        "desc": "",
        "tier": 3
    },
    {
        "name": "高级圣斧",
        "trait": "力量",
        "range": "近战",
        "damage": "d8+7",
        "two_handed": "单手",
        "physical": false,
        "desc": "",
        "tier": 3
    },
    {
        "name": "高级发光戒指",
        "trait": "敏捷",
        "range": "邻近",
        "damage": "d10+8",
        "two_handed": "双手",
        "physical": false,
        "desc": "",
        "tier": 3
    },
    {
        "name": "高级手持符文",
        "trait": "本能",
        "range": "邻近",
        "damage": "d10+6",
        "two_handed": "单手",
        "physical": false,
        "desc": "",
        "tier": 3
    },
    {
        "name": "高级回力剑",
        "trait": "灵巧",
        "range": "近距离",
        "damage": "d8+6",
        "two_handed": "单手",
        "physical": false,
        "desc": "**回力：**当此武器在射程内被投掷后，会在完成攻击的瞬间重新出现在你手中。",
        "tier": 3
    },
    {
        "name": "高级短杖",
        "trait": "本能",
        "range": "近距离",
        "damage": "d8+7",
        "two_handed": "单手",
        "physical": false,
        "desc": "",
        "tier": 3
    },
    {
        "name": "高级双手法杖",
        "trait": "本能",
        "range": "远距离",
        "damage": "d6+9",
        "two_handed": "双手",
        "physical": false,
        "desc": "",
        "tier": 3
    },
    {
        "name": "高级权杖",
        "trait": "风度",
        "range": "远距离",
        "damage": "d6+6",
        "two_handed": "双手",
        "physical": false,
        "desc": "**多用：**这把武器也可以此方式使用 - 本能 近战 d8+4。",
        "tier": 3
    },
    {
        "name": "高级魔杖",
        "trait": "知识",
        "range": "远距离",
        "damage": "d6+7",
        "two_handed": "单手",
        "physical": false,
        "desc": "",
        "tier": 3
    },
    {
        "name": "高级巨杖",
        "trait": "知识",
        "range": "极远",
        "damage": "d6+6",
        "two_handed": "双手",
        "physical": false,
        "desc": "**强力：**额外掷一个伤害骰并去掉其中最小的一个。",
        "tier": 3
    },
    {
        "name": "运气之斧",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+8",
        "two_handed": "双手",
        "physical": false,
        "desc": "**幸运：****花费 1 压力点**重骰一次失败的掷骰，并接受新的结果。",
        "tier": 3
    },
    {
        "name": "祝福匕首",
        "trait": "本能",
        "range": "近战",
        "damage": "d10+6",
        "two_handed": "单手",
        "physical": false,
        "desc": "**治愈：**休息时间时，自动**恢复 1 生命点**",
        "tier": 3
    },
    {
        "name": "鬼魂之刃",
        "trait": "风度",
        "range": "近战",
        "damage": "d10+7",
        "two_handed": "单手",
        "physical": false,
        "desc": "**异界：**你可以选择造成物理或者魔法伤害。",
        "tier": 3
    },
    {
        "name": "毁灭符文",
        "trait": "知识",
        "range": "邻近",
        "damage": "d20+4",
        "two_handed": "单手",
        "physical": false,
        "desc": "**苦痛：**每次你使用此武器成功攻击时，你需**标记 1 压力点**。",
        "tier": 3
    },
    {
        "name": "维多加斯特的吊坠",
        "trait": "知识",
        "range": "近距离",
        "damage": "d10+5",
        "two_handed": "单手",
        "physical": false,
        "desc": "**时间扭曲者：**你可以在攻击掷骰后选择攻击目标。",
        "tier": 3
    },
    {
        "name": "鎏金弓",
        "trait": "灵巧",
        "range": "远距离",
        "damage": "d6+7",
        "two_handed": "双手",
        "physical": false,
        "desc": "**自省：**伤害掷骰中的所有1都视为6。",
        "tier": 3
    },
    {
        "name": "火焰杖",
        "trait": "本能",
        "range": "远距离",
        "damage": "d6+7",
        "two_handed": "双手",
        "physical": false,
        "desc": "**灼烧：**伤害掷骰中掷出的每个6都使目标**标记 1 压力点**。",
        "tier": 3
    },
    {
        "name": "法师球",
        "trait": "知识",
        "range": "远距离",
        "damage": "d6+7",
        "two_handed": "单手",
        "physical": false,
        "desc": "**强力：**额外掷一个伤害骰并去掉其中最小的一个。",
        "tier": 3
    },
    {
        "name": "伊尔玛里的步枪",
        "trait": "灵巧",
        "range": "极远",
        "damage": "d6+6",
        "two_handed": "单手",
        "physical": false,
        "desc": "**装填：**攻击后掷一个d6，掷出1时，下次攻击前你必须**标记 1 压力点**进行装填。",
        "tier": 3
    },
    {
        "name": "传奇阔剑",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d8+9",
        "two_handed": "单手",
        "physical": true,
        "desc": "**可靠：**你的攻击掷骰+1。",
        "tier": 4
    },
    {
        "name": "传奇长剑",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d8+12",
        "two_handed": "双手",
        "physical": true,
        "desc": "",
        "tier": 4
    },
    {
        "name": "传奇战斧",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+12",
        "two_handed": "双手",
        "physical": true,
        "desc": "",
        "tier": 4
    },
    {
        "name": "传奇巨剑",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+12",
        "two_handed": "双手",
        "physical": true,
        "desc": "**巨型：**闪避值-1，额外掷一个伤害骰并去掉其中最小的一个。",
        "tier": 4
    },
    {
        "name": "传奇钉头锤",
        "trait": "力量",
        "range": "近战",
        "damage": "d8+10",
        "two_handed": "单手",
        "physical": true,
        "desc": "",
        "tier": 4
    },
    {
        "name": "传奇战锤",
        "trait": "力量",
        "range": "近战",
        "damage": "d12+12",
        "two_handed": "双手",
        "physical": true,
        "desc": "**重型：**闪避值-1。",
        "tier": 4
    },
    {
        "name": "传奇匕首",
        "trait": "灵巧",
        "range": "近战",
        "damage": "d8+10",
        "two_handed": "单手",
        "physical": true,
        "desc": "",
        "tier": 4
    },
    {
        "name": "传奇短棍",
        "trait": "本能",
        "range": "近战",
        "damage": "d10+12",
        "two_handed": "双手",
        "physical": true,
        "desc": "",
        "tier": 4
    },
    {
        "name": "传奇短刀",
        "trait": "风度",
        "range": "近战",
        "damage": "d8+10",
        "two_handed": "单手",
        "physical": true,
        "desc": "",
        "tier": 4
    },
    {
        "name": "传奇刺剑",
        "trait": "风度",
        "range": "近战",
        "damage": "d8+9",
        "two_handed": "单手",
        "physical": true,
        "desc": "**迅捷：****标记 1 压力点**以额外攻击一个范围内的目标。",
        "tier": 4
    },
    {
        "name": "传奇戟",
        "trait": "力量",
        "range": "邻近",
        "damage": "d10+11",
        "two_handed": "双手",
        "physical": true,
        "desc": "**繁琐：**灵巧-1。",
        "tier": 4
    },
    {
        "name": "传奇长矛",
        "trait": "灵巧",
        "range": "邻近",
        "damage": "d10+11",
        "two_handed": "双手",
        "physical": true,
        "desc": "**繁琐：**灵巧-1。",
        "tier": 4
    },
    {
        "name": "传奇短弓",
        "trait": "敏捷",
        "range": "远距离",
        "damage": "d6+12",
        "two_handed": "双手",
        "physical": true,
        "desc": "",
        "tier": 4
    },
    {
        "name": "传奇弩",
        "trait": "灵巧",
        "range": "远距离",
        "damage": "d6+10",
        "two_handed": "单手",
        "physical": true,
        "desc": "",
        "tier": 4
    },
    {
        "name": "传奇长弓",
        "trait": "敏捷",
        "range": "极远",
        "damage": "d8+12",
        "two_handed": "双手",
        "physical": true,
        "desc": "**繁琐：**灵巧-1。",
        "tier": 4
    },
    {
        "name": "双刃剑",
        "trait": "敏捷",
        "range": "近战",
        "damage": "d10+9",
        "two_handed": "双手",
        "physical": true,
        "desc": "**迅捷：****标记 1 压力点**以额外攻击一个范围内的目标。",
        "tier": 4
    },
    {
        "name": "冲击拳套",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+11",
        "two_handed": "单手",
        "physical": true,
        "desc": "**震荡：**在一次成功攻击后**花费 1 希望点**，将目标击退至远距离。",
        "tier": 4
    },
    {
        "name": "巨斧",
        "trait": "力量",
        "range": "近战",
        "damage": "d12+13",
        "two_handed": "双手",
        "physical": true,
        "desc": "**破坏：**敏捷-1，成功攻击后为所有邻近范围内的敌人**标记 1 压力点**。",
        "tier": 4
    },
    {
        "name": "弧形匕首",
        "trait": "灵巧",
        "range": "近战",
        "damage": "d8+9",
        "two_handed": "单手",
        "physical": true,
        "desc": "**锯齿：**伤害掷骰中的所有1都视为8。",
        "tier": 4
    },
    {
        "name": "延伸长柄武器",
        "trait": "灵巧",
        "range": "邻近",
        "damage": "d8+10",
        "two_handed": "双手",
        "physical": true,
        "desc": "**延长：**你能够将范围内所有处于一条直线上的敌人同时作为你的攻击目标。",
        "tier": 4
    },
    {
        "name": "摆动绳刃",
        "trait": "风度",
        "range": "近距离",
        "damage": "d8+9",
        "two_handed": "双手",
        "physical": true,
        "desc": "**捕获：**在一次成功攻击后**花费 1 希望点**，使目标处于束缚状态或者将其拉至你的近战范围。",
        "tier": 4
    },
    {
        "name": "弹跳斧",
        "trait": "敏捷",
        "range": "远距离",
        "damage": "d6+11",
        "two_handed": "双手",
        "physical": true,
        "desc": "**弹跳：**标记任意压力点，可同时攻击范围内等量的敌人。",
        "tier": 4
    },
    {
        "name": "安塔利弓",
        "trait": "灵巧",
        "range": "远距离",
        "damage": "d6+11",
        "two_handed": "双手",
        "physical": true,
        "desc": "**可靠：**你的攻击掷骰+1。",
        "tier": 4
    },
    {
        "name": "手炮",
        "trait": "灵巧",
        "range": "极远",
        "damage": "d6+12",
        "two_handed": "单手",
        "physical": true,
        "desc": "**装填：**攻击后掷一个d6，掷出1时，下次攻击前你必须**标记 1 压力点**进行装填。",
        "tier": 4
    },
    {
        "name": "传奇奥术护手",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+12",
        "two_handed": "双手",
        "physical": false,
        "desc": "",
        "tier": 4
    },
    {
        "name": "传奇圣斧",
        "trait": "力量",
        "range": "近战",
        "damage": "d8+10",
        "two_handed": "单手",
        "physical": false,
        "desc": "",
        "tier": 4
    },
    {
        "name": "传奇发光戒指",
        "trait": "敏捷",
        "range": "邻近",
        "damage": "d10+11",
        "two_handed": "双手",
        "physical": false,
        "desc": "",
        "tier": 4
    },
    {
        "name": "传奇手持符文",
        "trait": "本能",
        "range": "邻近",
        "damage": "d10+9",
        "two_handed": "单手",
        "physical": false,
        "desc": "",
        "tier": 4
    },
    {
        "name": "传奇回力剑",
        "trait": "灵巧",
        "range": "近距离",
        "damage": "d8+9",
        "two_handed": "单手",
        "physical": false,
        "desc": "**回力：**当此武器在射程内被投掷后，会在完成攻击的瞬间重新出现在你手中。",
        "tier": 4
    },
    {
        "name": "传奇短杖",
        "trait": "本能",
        "range": "近距离",
        "damage": "d8+10",
        "two_handed": "单手",
        "physical": false,
        "desc": "",
        "tier": 4
    },
    {
        "name": "传奇双手法杖",
        "trait": "本能",
        "range": "远距离",
        "damage": "d8+12",
        "two_handed": "双手",
        "physical": false,
        "desc": "",
        "tier": 4
    },
    {
        "name": "传奇权杖",
        "trait": "风度",
        "range": "远距离",
        "damage": "d6+9",
        "two_handed": "双手",
        "physical": false,
        "desc": "**多用：**这把武器也可以此方式使用 - 本能 近战 d8+6。",
        "tier": 4
    },
    {
        "name": "传奇魔杖",
        "trait": "知识",
        "range": "远距离",
        "damage": "d6+10",
        "two_handed": "单手",
        "physical": false,
        "desc": "",
        "tier": 4
    },
    {
        "name": "传奇巨杖",
        "trait": "知识",
        "range": "极远",
        "damage": "d6+9",
        "two_handed": "双手",
        "physical": false,
        "desc": "**强力：**额外掷一个伤害骰并去掉其中最小的一个。",
        "tier": 4
    },
    {
        "name": "光焰剑",
        "trait": "力量",
        "range": "近战",
        "damage": "d10+11",
        "two_handed": "双手",
        "physical": false,
        "desc": "**烧融：**可以切开坚固的材质。",
        "tier": 4
    },
    {
        "name": "虹吸拳套",
        "trait": "风度",
        "range": "近战",
        "damage": "d10+9",
        "two_handed": "双手",
        "physical": false,
        "desc": "**系命：**在一次成功攻击后掷一个6，如果掷出6则**恢复 1 生命点**或**清除 1 压力点**",
        "tier": 4
    },
    {
        "name": "迈达斯镰刀",
        "trait": "知识",
        "range": "近战",
        "damage": "d10+9",
        "two_handed": "双手",
        "physical": false,
        "desc": "**贪婪：**你可以花费一把金币，使你的伤害掷骰熟练值+1。",
        "tier": 4
    },
    {
        "name": "漂浮碎刃",
        "trait": "本能",
        "range": "近距离",
        "damage": "d8+9",
        "two_handed": "单手",
        "physical": false,
        "desc": "**强力：**额外掷一个伤害骰并去掉其中最小的一个。",
        "tier": 4
    },
    {
        "name": "血杖",
        "trait": "本能",
        "range": "远距离",
        "damage": "d20+7",
        "two_handed": "双手",
        "physical": false,
        "desc": "**苦痛：**每次你使用此武器攻击时，你需**标记 1 压力点**。",
        "tier": 4
    },
    {
        "name": "蓟弓",
        "trait": "本能",
        "range": "远距离",
        "damage": "d6+13",
        "two_handed": "双手",
        "physical": false,
        "desc": "**可靠：**你的攻击掷骰+1。",
        "tier": 4
    },
    {
        "name": "埃塞克之杖",
        "trait": "知识",
        "range": "远距离",
        "damage": "d8+13",
        "two_handed": "单手",
        "physical": false,
        "desc": "**时间扭曲者：**你可以在攻击掷骰后选择攻击目标。",
        "tier": 4
    },
    {
        "name": "魔战士左轮",
        "trait": "灵巧",
        "range": "极远",
        "damage": "d6+13",
        "two_handed": "单手",
        "physical": false,
        "desc": "**装填：**攻击后掷一个6，如果掷出1，下次攻击前你必须**标记 1 压力点**进行装填。",
        "tier": 4
    },
    {
        "name": "融合手套",
        "trait": "知识",
        "range": "极远",
        "damage": "d6+9",
        "two_handed": "双手",
        "physical": false,
        "desc": "**绑定：**将你的等级数添加到伤害掷骰中。",
        "tier": 4
    }
]