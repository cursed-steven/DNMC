//=============================================================================
// RPG Maker MZ - DNMC_randomStatics
// ----------------------------------------------------------------------------
// (C)2022 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/12/26 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc ランダム生成用定数
 * @author cursed_twitch
 * @base DNMC_system3
 * @orderAfter DNMC_system3
 * 
 * @help DNMC_randomStatics.js
 */

/**
 * jsonデータパス。
 */
const DATA_PATH = {
    WEAPON: "data/Weapons.json",
    ARMOR: "data/Armors.json",
    ACTOR: "data/Actors.json"
};

/**
 * ランクとそれに属する職業
 */

const RANKS_JOBS = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13],
    [14, 15]
];

/**
 * 属性定数
 */
const ELEMENT = {
    SLASH: 1,
    PENETRATE: 2,
    BASH: 3,
    FIRE: 4,
    ICE: 5,
    THUNDER: 6,
    WATER: 7,
    EARTH: 8,
    WIND: 9,
    LIGHT: 10,
    DARKNESS: 11
};

/**
 * ステートID定数
 */
const STATE = {
    DEAD: 1,
    BERSERK: 3,
    CONFUSE: 4,
    TEMPTATION: 5,
    SILENCE: 6,
    PHANTOM: 7,
    PARALYZE: 9,
    POISON: 16,
    DEADLY_POISON: 17,
    MAGICAL_POISON: 19,
    SLEEP: 20,
    MP_DOUBLECOST: 25,
    VULNERABLE: 27
};

/**
 * データIDテーブル
 */
const PARAMS_DATAIDS = [
    PARAM.ATK, PARAM.ATK,
    PARAM.MAT, PARAM.MAT,
    PARAM.AGI, PARAM.AGI,
    PARAM.LUK, PARAM.LUK,
    PARAM.MHP, PARAM.MHP,
    PARAM.MMP, PARAM.MMP
];
const ADDITIONAL_PARAMS_DATAIDS = [
    ADDITIONAL_PARAM.HIT_RATE, ADDITIONAL_PARAM.HIT_RATE,
    ADDITIONAL_PARAM.EVADE_RATE, ADDITIONAL_PARAM.EVADE_RATE,
    ADDITIONAL_PARAM.CRITICAL_RATE, ADDITIONAL_PARAM.CRITICAL_RATE,
    ADDITIONAL_PARAM.STRIKE_BACK_RATE, ADDITIONAL_PARAM.STRIKE_BACK_RATE,
    0, 0
];
const ELEMENT_DATAIDS = [
    ELEMENT.SLASH,
    ELEMENT.PENETRATE,
    ELEMENT.BASH,
    ELEMENT.FIRE,
    ELEMENT.ICE,
    ELEMENT.THUNDER,
    ELEMENT.WATER,
    ELEMENT.EARTH,
    ELEMENT.WIND,
    ELEMENT.LIGHT,
    ELEMENT.DARKNESS
];
const DEBUFF_DATAIDS = [
    PARAM.MHP,
    PARAM.MMP,
    PARAM.ATK,
    PARAM.DEF,
    PARAM.MAT,
    PARAM.MDF,
    PARAM.AGI,
    PARAM.LUK
];
const STATE_DATAIDS = [
    STATE.DEAD,
    STATE.BERSERK,
    STATE.CONFUSE,
    STATE.TEMPTATION,
    STATE.SILENCE,
    STATE.PHANTOM,
    STATE.PARALYZE,
    STATE.POISON,
    STATE.DEADLY_POISON,
    STATE.MAGICAL_POISON,
    STATE.SLEEP,
    STATE.MP_DOUBLECOST,
    STATE.VULNERABLE
];
const PARTY_ABILITIES_DATAIDS = [
    PARTY_ABILITIY.REDUCE_ENCOUNTER,
    PARTY_ABILITIY.NO_ENCOUNTER,
    PARTY_ABILITIY.NO_AMBUSH,
    PARTY_ABILITIY.MORE_PREEMPTIVE,
    PARTY_ABILITIY.DOUBLE_GOLD,
    PARTY_ABILITIY.DOUBLE_DROPS
];
const SPECIAL_PARAMS_DATAIDS = [
    SPECIAL_PARAM.TARGETTED_RATE, SPECIAL_PARAM.TARGETTED_RATE,
    SPECIAL_PARAM.PHARMACY,
    SPECIAL_PARAM.MP_COST_RATE,
    SPECIAL_PARAM.TP_CHARGE_RATE, SPECIAL_PARAM.TP_CHARGE_RATE,
    SPECIAL_PARAM.FLOOR_DAMAGE_RATE,
    SPECIAL_PARAM.EXP_GET_RATE
];

/**
 * 共通スキルID
 */
const COMMON_SKILL_IDS = {
    ATTACK: 1,
    DEFEND: 2,
    ESCAPE: 4,
    UNINTERESTED: 5
};

/**
 * 地形タグ定数
 */
const BIOMES = {
    GRASS: 1,
    DESERT: 2,
    SNOW: 3,
    WOODS: 4,
    HEAT: 5,
    WATER: 6,
    DUNGEON: 7,
    SKY: 8
};

const BIOME_NAMES = [
    null,
    "grass",
    "desert",
    "snow",
    "woods",
    "heat",
    "water",
    "dungeon",
    "sky"
];

/**
 * キャラクター画像サイズ
 */
const CHARACTER_IMAGE = {
    WIDTH: 78,
    HEIGHT: 108,
    WIDTH_OFFSET: 39,
    HEIGHT_OFFSET: 108
};

//-----------------------------------------------------------------------------
// 武器関連
//

/**
 * 武器タイプID定数
 */
const WEAPON_TYPE_ID = {
    KNIFE: 1,
    SWORD: 2,
    FLAIL: 3,
    AXE: 4,
    WHIP: 5,
    STAFF: 6,
    BOW: 7,
    CROSS_BOW: 8,
    GUN: 9,
    CLAW: 10,
    GLOVE: 11,
    SPEAR: 12
};

/**
 * 材質ID定数
 */
const MATERIAL_ID = {
    LEATHER: 1,
    WOOD: 2,
    STONE: 3,
    COPPER: 4,
    IRON: 5,
    STEEL: 6,
    SILVER: 7,
    GOLD: 8,
    PLATINUM: 9,
    DIAMIND: 10,
    CRYSTAL: 11,
    FIRE: 12,
    ICE: 13,
    THUNDER: 14,
    WATER: 15,
    EARTH: 16,
    WIND: 17,
    LIGHT: 18,
    DARKNESS: 19
};

/**
 * 武器タイプ定数オブジェクト。
 * 
 * id: 武器タイプID。
 * name: 名称(武器名称等にも使用)。
 * iconIndex: それぞれ rank0,1,2,3のアイコン。
 * params: それぞれの材質ごとの基礎値
 */
const WEAPON_TYPE = [
    null,
    {
        id: 1,
        iconIndex: [96, 96, 96, 96],
        animationId: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 13, 14, 15, 12, 12, 12, 12, 12],
        fixedTraits: [
            { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.PENETRATE }
        ],
        params: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [8, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 120, 120, 120, 120, 120, 120, 120, 120],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    {
        id: 2,
        iconIndex: [97, 123, 123, 119],
        animationId: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 8, 9, 10, 7, 7, 7, 7, 7],
        fixedTraits: [
            { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.SLASH }
        ],
        params: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [13, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 200, 200, 200, 200, 200, 200, 200, 200],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    {
        id: 3,
        iconIndex: [98, 98, 98, 98],
        animationId: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 2, 2, 2, 2, 2],
        fixedTraits: [
            { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.BASH }
        ],
        params: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [10, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 160, 160, 160, 160, 160, 160, 160, 160],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    {
        id: 4,
        iconIndex: [99, 99, 99, 99],
        animationId: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 8, 9, 10, 7, 7, 7, 7, 7],
        fixedTraits: [
            { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.SLASH },
            { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.BASH },
        ],
        params: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [15, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 240, 240, 240, 240, 240, 240, 240, 240],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-5, -10, -15, -20, -35, -40, -35, -30, -20, -20, -10, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    {
        id: 5,
        iconIndex: [100, 100, 100, 100],
        animationId: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 2, 2, 2, 2, 2],
        fixedTraits: [
            { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.BASH }
        ],
        params: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [9, 18, 36, 54, 72, 90, 108, 126, 144, 162, 180, 144, 144, 144, 144, 144, 144, 144, 144],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    {
        id: 6,
        iconIndex: [101, 109, 109, 108],
        animationId: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 2, 2, 2, 2, 2],
        fixedTraits: [
            { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.BASH }
        ],
        params: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [5, 9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 72, 72, 72, 72, 72, 72, 72, 72],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    {
        id: 7,
        iconIndex: [102, 102, 102, 102],
        animationId: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 13, 14, 15, 12, 12, 12, 12, 12],
        fixedTraits: [
            { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.PENETRATE }
        ],
        params: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [10, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 160, 160, 160, 160, 160, 160, 160, 160],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    {
        id: 8,
        iconIndex: [103, 103, 103, 103],
        animationId: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 13, 14, 15, 12, 12, 12, 12, 12],
        fixedTraits: [
            { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.PENETRATE }
        ],
        params: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [9, 18, 36, 54, 72, 90, 108, 126, 144, 162, 180, 144, 144, 144, 144, 144, 144, 144, 144],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    {
        id: 9,
        iconIndex: [104, 104, 115, 116],
        animationId: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 13, 14, 15, 12, 12, 12, 12, 12],
        fixedTraits: [
            { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.PENETRATE }
        ],
        params: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [18, 35, 70, 105, 140, 175, 210, 245, 280, 315, 350, 280, 280, 280, 280, 280, 280, 280, 280],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    {
        id: 10,
        iconIndex: [105, 105, 105, 105],
        animationId: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 8, 9, 10, 7, 7, 7, 7, 7],
        fixedTraits: [
            { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.SLASH }
        ],
        params: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [9, 18, 36, 54, 72, 90, 108, 126, 144, 162, 180, 144, 144, 144, 144, 144, 144, 144, 144],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    {
        id: 11,
        iconIndex: [106, 106, 106, 106],
        animationId: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 2, 2, 2, 2, 2],
        fixedTraits: [
            { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.BASH }
        ],
        params: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [8, 16, 32, 48, 64, 80, 96, 112, 128, 144, 160, 144, 144, 144, 144, 144, 144, 144, 144],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    {
        id: 12,
        iconIndex: [107, 107, 107, 107],
        animationId: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 13, 14, 15, 12, 12, 12, 12, 12],
        fixedTraits: [
            { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.PENETRATE }
        ],
        params: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [13, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 200, 200, 200, 200, 200, 200, 200, 200],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    }
];

/**
 * 武器材質オブジェクト。
 * 
 * rank: ランク。
 * materials: 材質。
 *     id: ID。
 *     name: 材質名。
 *     traits: 特徴追加発生率と発生時の追加値範囲。
 */
const WEAPON_MATERIALS = [
    {
        rank: 0,
        materials: [
            {
                id: 1,
                name: "革",
                price: 50,
                traits: [
                    //atk+, atk++
                    [5, 5, 10],
                    [0, 11, 25],
                    // mat+, mat++
                    [0, 5, 10],
                    [0, 11, 25],
                    // agi-, agi--
                    [10, -10, -5],
                    [5, -25, -11],
                    // luk+, luk-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ert+, ert-
                    [5, 5, 10],
                    [5, -10, -5],
                    // cri+, cri-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ctr+, ctr-
                    [5, 5, 10],
                    [5, -10, -5],
                    // additional
                    [5],
                    [5]
                ]
            },
            {
                id: 2,
                name: "木",
                price: 50,
                traits: [
                    //atk+, atk++
                    [5, 5, 10],
                    [0, 11, 25],
                    // mat+, mat++
                    [0, 5, 10],
                    [0, 11, 25],
                    // agi-, agi--
                    [10, -10, -5],
                    [5, -25, -11],
                    // luk+, luk-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ert+, ert-
                    [5, 5, 10],
                    [5, -10, -5],
                    // cri+, cri-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ctr+, ctr-
                    [5, 5, 10],
                    [5, -10, -5],
                    // additional
                    [5],
                    [5]
                ]
            },
            {
                id: 3,
                name: "石",
                price: 50,
                traits: [
                    //atk+, atk++
                    [5, 5, 10],
                    [0, 11, 25],
                    // mat+, mat++
                    [0, 5, 10],
                    [0, 11, 25],
                    // agi-, agi--
                    [10, -10, -5],
                    [5, -25, -11],
                    // luk+, luk-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ert+, ert-
                    [5, 5, 10],
                    [5, -10, -5],
                    // cri+, cri-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ctr+, ctr-
                    [5, 5, 10],
                    [5, -10, -5],
                    // additional
                    [5],
                    [5]
                ]
            },
            {
                id: 4,
                name: "銅",
                price: 100,
                traits: [
                    //atk+, atk++
                    [5, 5, 10],
                    [0, 11, 25],
                    // mat+, mat++
                    [0, 5, 10],
                    [0, 11, 25],
                    // agi-, agi--
                    [10, -10, -5],
                    [5, -25, -11],
                    // luk+, luk-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ert+, ert-
                    [5, 5, 10],
                    [5, -10, -5],
                    // cri+, cri-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ctr+, ctr-
                    [5, 5, 10],
                    [5, -10, -5],
                    // additional
                    [5],
                    [5]
                ]
            }
        ]
    },
    {
        rank: 1,
        materials: [
            {
                id: 5,
                name: "鉄",
                price: 300,
                traits: [
                    //atk+, atk++
                    [5, 5, 10],
                    [0, 11, 25],
                    // mat+, mat++
                    [0, 5, 10],
                    [0, 11, 25],
                    // agi-, agi--
                    [10, -10, -5],
                    [5, -25, -11],
                    // luk+, luk-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ert+, ert-
                    [5, 5, 10],
                    [5, -10, -5],
                    // cri+, cri-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ctr+, ctr-
                    [5, 5, 10],
                    [5, -10, -5],
                    // additional
                    [5],
                    [5]
                ]
            },
            {
                id: 6,
                name: "鋼鉄",
                price: 500,
                traits: [
                    //atk+, atk++
                    [5, 5, 10],
                    [0, 11, 25],
                    // mat+, mat++
                    [0, 5, 10],
                    [0, 11, 25],
                    // agi-, agi--
                    [10, -10, -5],
                    [5, -25, -11],
                    // luk+, luk-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ert+, ert-
                    [5, 5, 10],
                    [5, -10, -5],
                    // cri+, cri-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ctr+, ctr-
                    [5, 5, 10],
                    [5, -10, -5],
                    // additional
                    [5],
                    [5]
                ]
            },
            {
                id: 7,
                name: "銀",
                price: 1000,
                traits: [
                    //atk+, atk++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mat+, mat++
                    [10, 5, 10],
                    [5, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [5, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ert+, ert-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0]
                ]
            }
        ]
    },
    {
        rank: 2,
        materials: [
            {
                id: 8,
                name: "金",
                price: 3500,
                traits: [
                    //atk+, atk++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mat+, mat++
                    [0, 5, 10],
                    [0, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ert+, ert-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0]
                ]
            },
            {
                id: 9,
                name: "プラチナ",
                price: 6000,
                traits: [
                    //atk+, atk++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mat+, mat++
                    [0, 5, 10],
                    [0, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ert+, ert-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0]
                ]
            },
            {
                id: 10,
                name: "ダイヤ",
                price: 10000,
                traits: [
                    //atk+, atk++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mat+, mat++
                    [10, 5, 10],
                    [5, 11, 25],
                    // agi-, agi--
                    [0, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [5, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ert+, ert-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0]
                ]
            },
            {
                id: 11,
                name: "クリスタル",
                price: 20000,
                traits: [
                    //atk+, atk++
                    [15, 5, 10],
                    [10, 11, 25],
                    // mat+, mat++
                    [15, 5, 10],
                    [10, 11, 25],
                    // agi-, agi--
                    [0, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [15, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mmp+, mmp-
                    [10, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [15, 5, 10],
                    [0, -10, -5],
                    // ert+, ert-
                    [15, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [15, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [15, 5, 10],
                    [0, -10, -5],
                    // additional
                    [15],
                    [0]
                ]
            },
        ]
    },
    {
        rank: 3,
        materials: [
            {
                id: 12,
                name: "炎",
                price: 15000,
                elementTraits: [
                    { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.FIRE }
                ],
                traits: [
                    //atk+, atk++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mat+, mat++
                    [10, 5, 10],
                    [10, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ert+, ert-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0]
                ]
            },
            {
                id: 13,
                name: "氷",
                price: 15000,
                elementTraits: [
                    { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.ICE }
                ],
                traits: [
                    //atk+, atk++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mat+, mat++
                    [10, 5, 10],
                    [10, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ert+, ert-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0]
                ]
            },
            {
                id: 14,
                name: "雷",
                price: 15000,
                elementTraits: [
                    { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.THUNDER }
                ],
                traits: [
                    //atk+, atk++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mat+, mat++
                    [10, 5, 10],
                    [10, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ert+, ert-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0]
                ]
            },
            {
                id: 15,
                name: "水",
                price: 15000,
                elementTraits: [
                    { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.WATER }
                ],
                traits: [
                    //atk+, atk++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mat+, mat++
                    [10, 5, 10],
                    [10, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ert+, ert-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0]
                ]
            },
            {
                id: 16,
                name: "土",
                price: 15000,
                elementTraits: [
                    { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.EARTH }
                ],
                traits: [
                    //atk+, atk++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mat+, mat++
                    [10, 5, 10],
                    [10, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ert+, ert-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0]
                ]
            },
            {
                id: 17,
                name: "風",
                price: 15000,
                elementTraits: [
                    { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.WIND }
                ],
                traits: [
                    //atk+, atk++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mat+, mat++
                    [10, 5, 10],
                    [10, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ert+, ert-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0]
                ]
            },
            {
                id: 18,
                name: "光",
                price: 15000,
                elementTraits: [
                    { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.LIGHT }
                ],
                traits: [
                    //atk+, atk++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mat+, mat++
                    [10, 5, 10],
                    [10, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ert+, ert-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0]
                ]
            },
            {
                id: 19,
                name: "闇",
                price: 15000,
                elementTraits: [
                    { code: TRAITS.ATTACK_ELEMENT.CODE, dataId: ELEMENT.DARKNESS }
                ],
                traits: [
                    //atk+, atk++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mat+, mat++
                    [10, 5, 10],
                    [10, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ert+, ert-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0]
                ]
            }
        ]
    }
];

//-----------------------------------------------------------------------------
// 防具関連
//

/**
 * 防具タイプID定数
 */
const ARMOR_TYPE_ID = {
    COMMON: 1,
    WARRIOR: 2,
    KNIGHT: 3,
    SORCERER: 4,
    WIZARD: 5
};

/**
 * スロットID
 */
const SLOT_TYPE_ID = {
    SHIELD: 1,
    HEAD: 2,
    BODY: 3,
    ACCESORY: 4
};

/**
 * 防具タイプ定数オブジェクト
 * 
 * id: 防具タイプID。> {{type}}-{{slot}}
 * name: 名称(防具名称等にも使用)。
 * iconIndex: それぞれ rank0,1,2,3 x 盾,頭部,胴体,アクセのアイコン
 * params: それぞれの材質ごとの基礎値
 */
const ARMOR_TYPE = [
    null,
    [
        null,
        {
            id: "1-2",
            desc: "汎用品／盾",
            name: ["バックラー", "バックラー", "バックラー", "バックラー"],
            iconIndex: [128, 128, 129, 129],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 2, 4, 6, 8, 11, 13, 15, 17, 19, 21, 17, 17, 17, 17, 17, 17, 17, 17],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, -10, -10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        },
        {
            id: "1-3",
            desc: "汎用品／頭部",
            name: ["帽子", "帽子", "頭巾", "頭巾"],
            iconIndex: [130, 130, 150, 150],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 7, 7, 7, 7, 7, 7, 7, 7],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        },
        {
            id: "1-4",
            desc: "汎用品／胴体",
            name: ["服", "服", "服", "服"],
            iconIndex: [135, 135, 136, 136],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [3, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 48, 48, 48, 48, 48, 48, 48, 48],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, -15, -15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        },
        {
            id: "1-5",
            desc: "汎用品／アクセサリ",
            name: ["手袋", "手袋", "マント", "マント"],
            iconIndex: [142, 142, 138, 138],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        }
    ],
    [
        null,
        {
            id: "2-2",
            desc: "戦士用／盾",
            iconIndex: [128, 128, 129, 129],
            name: ["盾", "盾", "大盾", "大盾"],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [3, 6, 11, 17, 22, 28, 34, 39, 45, 50, 56, 45, 45, 45, 45, 45, 45, 45, 45],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, -15, -20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        },
        {
            id: "2-3",
            desc: "戦士用／頭部",
            iconIndex: [131, 131, 132, 132],
            name: ["兜", "兜", "大兜", "大兜"],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 2, 5, 7, 10, 12, 14, 17, 19, 22, 24, 19, 19, 19, 19, 19, 19, 19, 19],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, -10, -10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        },
        {
            id: "2-4",
            desc: "戦士用／胴体",
            iconIndex: [137, 137, 137, 137],
            name: ["鎧", "鎧", "大鎧", "大鎧"],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [4, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 64, 64, 64, 64, 64, 64, 64, 64],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, -25, -35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        },
        {
            id: "2-5",
            desc: "戦士用／アクセサリ",
            iconIndex: [143, 143, 143, 143],
            name: ["籠手", "籠手", "籠手", "籠手"],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 8, 8, 8, 8, 8, 8, 8, 8],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [-5, -5, -5, -5, -10, -10, -10, -5, -5, -5, -5, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        }
    ],
    [
        null,
        {
            id: "3-2",
            desc: "騎士用／盾",
            name: ["盾", "盾", "大盾", "大盾"],
            iconIndex: [128, 128, 129, 129],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [4, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 56, 56, 56, 56, 56, 56, 56, 56],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, -15, -20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        },
        {
            id: "3-3",
            desc: "騎士用／頭部",
            name: ["兜", "兜", "大兜", "大兜"],
            iconIndex: [131, 131, 132, 132],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [2, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 24, 24, 24, 24, 24, 24, 24, 24],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, -10, -10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        },
        {
            id: "3-4",
            desc: "騎士用／胴体",
            name: ["鎧", "鎧", "大鎧", "大鎧"],
            iconIndex: [137, 137, 137, 137],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 80, 80, 80, 80, 80, 80, 80, 80],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, -25, -35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        },
        {
            id: "3-5",
            desc: "騎士用／アクセサリ",
            name: ["籠手", "籠手", "籠手", "籠手"],
            iconIndex: [143, 143, 143, 143],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 8, 8, 8, 8, 8, 8, 8, 8],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [-5, -5, -5, -5, -10, -10, -10, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        }
    ],
    [
        null,
        {
            id: "4-2",
            desc: "術師用／盾",
            name: ["バックラー", "バックラー", "バックラー", "バックラー"],
            iconIndex: [129, 129, 129, 129],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [2, 4, 7, 11, 14, 18, 21, 25, 28, 31, 35, 28, 28, 28, 28, 28, 28, 28, 28],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 40, 40, 40, 40, 40, 40, 40, 40],
                [0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        },
        {
            id: "4-3",
            desc: "術師用／頭部",
            name: ["頭巾", "頭巾", "帽子", "帽子"],
            iconIndex: [139, 139, 133, 133],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 12, 12, 12, 12, 12, 12, 12, 12],
                [4, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 64, 64, 64, 64, 64, 64, 64, 64],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        },
        {
            id: "4-4",
            desc: "術師用／胴体",
            name: ["ローブ", "ローブ", "ローブ", "ローブ"],
            iconIndex: [138, 138, 138, 138],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 40, 40, 40, 40, 40, 40, 40, 40],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 80, 80, 80, 80, 80, 80, 80, 80],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        },
        {
            id: "4-5",
            desc: "術師用／アクセサリ",
            name: ["バングル", "指輪", "指輪", "ペンダント"],
            iconIndex: [144, 145, 145, 146],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [4, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 64, 64, 64, 64, 64, 64, 64, 64],
                [3, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 48, 48, 48, 48, 48, 48, 48, 48],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        }
    ],
    [
        null,
        {
            id: "5-2",
            desc: "魔道士用／盾",
            name: ["バックラー", "バックラー", "バックラー", "バックラー"],
            iconIndex: [129, 129, 129, 129],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [2, 4, 8, 13, 17, 21, 25, 29, 34, 38, 42, 34, 34, 34, 34, 34, 34, 34, 34],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 40, 40, 40, 40, 40, 40, 40, 40],
                [0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        },
        {
            id: "5-3",
            desc: "魔道士用／頭部",
            name: ["頭巾", "頭巾", "帽子", "帽子"],
            iconIndex: [139, 139, 133, 133],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 2, 4, 5, 7, 9, 11, 12, 14, 16, 18, 14, 14, 14, 14, 14, 14, 14, 14],
                [8, 16, 20, 30, 40, 50, 60, 70, 80, 90, 100, 80, 80, 80, 80, 80, 80, 80, 80],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        },
        {
            id: "5-4",
            desc: "魔道士用／胴体",
            name: ["ローブ", "ローブ", "ローブ", "ローブ"],
            iconIndex: [138, 138, 138, 138],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [3, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 48, 48, 48, 48, 48, 48, 48, 48],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [6, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 96, 96, 96, 96, 96, 96, 96, 96],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        },
        {
            id: "5-5",
            desc: "魔道士用／アクセサリ",
            name: ["バングル", "指輪", "指輪", "ペンダント"],
            iconIndex: [144, 145, 145, 146],
            fixedTraits: [],
            params: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 80, 80, 80, 80, 80, 80, 80, 80],
                [4, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 64, 64, 64, 64, 64, 64, 64, 64],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        }
    ]
];

/**
 * 盾材質オブジェクト。
 * 
 * rank: ランク
 * materials: 材質。
 *     id: ID。
 *     name: 材質名。
 *     traits: 特徴追加発生率と発生時の追加値範囲。
 */
const SHIELD_MATERIALS = [
    {
        rank: 0,
        materials: [
            {
                id: 1,
                name: "革",
                price: 50,
                traits: [
                    // def+, def++
                    [5, 2, 5],
                    [0, 5, 10],
                    // mdf+, mdf++
                    [0, 2, 5],
                    [0, 5, 10],
                    // agi-, agi--
                    [10, -5, -2],
                    [5, -10, -5],
                    // luk+, luk-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [5, 2, 5],
                    [5, -5, -2],
                    // evd+, evd-
                    [5, 2, 5],
                    [5, -5, -2],
                    // cri+, cri-
                    [5, 2, 5],
                    [5, -5, -2],
                    // ctr+, ctr-
                    [5, 2, 5],
                    [5, -5, -2],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [20, 25, 45],
                    [20, 25, 45],
                    [40, 25, 45],
                    // fire/ice/thunder
                    [0, 25, 45],
                    [10, 25, 45],
                    [10, 25, 45],
                    // water/earth/wind
                    [0, 25, 45],
                    [20, 25, 45],
                    [20, 25, 45],
                    // light/dark
                    [20, 25, 45],
                    [20, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [10, 0, 50],
                    // mmp-debuff
                    [10, 0, 50],
                    // atk-debuff
                    [10, 0, 50],
                    // def-debuff
                    [10, 0, 50],
                    // mat-debuff
                    [10, 0, 50],
                    // mdf-debuff
                    [10, 0, 50],
                    // agi-debuff
                    [10, 0, 50],
                    // luk-debuff
                    [10, 0, 50],
                    // death
                    [0, 0, 50],
                    // berserk
                    [0, 0, 50],
                    // confuse
                    [0, 0, 50],
                    // temptation
                    [0, 0, 50],
                    // silent
                    [0, 0, 50],
                    // phantom
                    [0, 0, 50],
                    // paralyze
                    [0, 0, 50],
                    // poison
                    [0, 0, 50],
                    // deadly-poison
                    [0, 0, 50],
                    // magical-poison
                    [0, 0, 50],
                    // sleep
                    [0, 0, 50],
                    // mp-doublecost
                    [0, 0, 50],
                    // vulnerable
                    [0, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0]
                ]
            },
            {
                id: 2,
                name: "木",
                price: 50,
                traits: [
                    // def+, def++
                    [5, 2, 5],
                    [0, 5, 10],
                    // mdf+, mdf++
                    [0, 2, 5],
                    [0, 5, 10],
                    // agi-, agi--
                    [10, -5, -2],
                    [5, -10, -5],
                    // luk+, luk-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [5, 2, 5],
                    [5, -5, -2],
                    // evd+, evd-
                    [5, 2, 5],
                    [5, -5, -2],
                    // cri+, cri-
                    [5, 2, 5],
                    [5, -5, -2],
                    // ctr+, ctr-
                    [5, 2, 5],
                    [5, -5, -2],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [20, 25, 45],
                    [20, 25, 45],
                    [40, 25, 45],
                    // fire/ice/thunder
                    [0, 25, 45],
                    [10, 25, 45],
                    [10, 25, 45],
                    // water/earth/wind
                    [0, 25, 45],
                    [20, 25, 45],
                    [20, 25, 45],
                    // light/dark
                    [20, 25, 45],
                    [20, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [10, 0, 50],
                    // mmp-debuff
                    [10, 0, 50],
                    // atk-debuff
                    [10, 0, 50],
                    // def-debuff
                    [10, 0, 50],
                    // mat-debuff
                    [10, 0, 50],
                    // mdf-debuff
                    [10, 0, 50],
                    // agi-debuff
                    [10, 0, 50],
                    // luk-debuff
                    [10, 0, 50],
                    // death
                    [0, 0, 50],
                    // berserk
                    [0, 0, 50],
                    // confuse
                    [0, 0, 50],
                    // temptation
                    [0, 0, 50],
                    // silent
                    [0, 0, 50],
                    // phantom
                    [0, 0, 50],
                    // paralyze
                    [0, 0, 50],
                    // poison
                    [0, 0, 50],
                    // deadly-poison
                    [0, 0, 50],
                    // magical-poison
                    [0, 0, 50],
                    // sleep
                    [0, 0, 50],
                    // mp-doublecost
                    [0, 0, 50],
                    // vulnerable
                    [0, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0]
                ]
            },
            {
                id: 3,
                name: "石",
                price: 50,
                traits: [
                    // def+, def++
                    [5, 2, 5],
                    [0, 5, 10],
                    // mdf+, mdf++
                    [0, 2, 5],
                    [0, 5, 10],
                    // agi-, agi--
                    [10, -5, -2],
                    [5, -10, -5],
                    // luk+, luk-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [5, 2, 5],
                    [5, -5, -2],
                    // evd+, evd-
                    [5, 2, 5],
                    [5, -5, -2],
                    // cri+, cri-
                    [5, 2, 5],
                    [5, -5, -2],
                    // ctr+, ctr-
                    [5, 2, 5],
                    [5, -5, -2],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [40, 25, 45],
                    [40, 25, 45],
                    [5, 25, 45],
                    // fire/ice/thunder
                    [40, 25, 45],
                    [10, 25, 45],
                    [10, 25, 45],
                    // water/earth/wind
                    [10, 25, 45],
                    [40, 25, 45],
                    [20, 25, 45],
                    // light/dark
                    [20, 25, 45],
                    [20, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [10, 0, 50],
                    // mmp-debuff
                    [10, 0, 50],
                    // atk-debuff
                    [10, 0, 50],
                    // def-debuff
                    [10, 0, 50],
                    // mat-debuff
                    [10, 0, 50],
                    // mdf-debuff
                    [10, 0, 50],
                    // agi-debuff
                    [10, 0, 50],
                    // luk-debuff
                    [10, 0, 50],
                    // death
                    [0, 0, 50],
                    // berserk
                    [0, 0, 50],
                    // confuse
                    [0, 0, 50],
                    // temptation
                    [0, 0, 50],
                    // silent
                    [0, 0, 50],
                    // phantom
                    [0, 0, 50],
                    // paralyze
                    [0, 0, 50],
                    // poison
                    [0, 0, 50],
                    // deadly-poison
                    [0, 0, 50],
                    // magical-poison
                    [0, 0, 50],
                    // sleep
                    [0, 0, 50],
                    // mp-doublecost
                    [0, 0, 50],
                    // vulnerable
                    [0, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0]
                ]
            },
            {
                id: 4,
                name: "銅",
                price: 100,
                traits: [
                    // def+, def++
                    [5, 2, 5],
                    [0, 5, 10],
                    // mdf+, mdf++
                    [0, 2, 5],
                    [0, 5, 10],
                    // agi-, agi--
                    [10, -5, -2],
                    [5, -10, -5],
                    // luk+, luk-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [5, 2, 5],
                    [5, -5, -2],
                    // evd+, evd-
                    [5, 2, 5],
                    [5, -5, -2],
                    // cri+, cri-
                    [5, 2, 5],
                    [5, -5, -2],
                    // ctr+, ctr-
                    [5, 2, 5],
                    [5, -5, -2],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [40, 25, 45],
                    [40, 25, 45],
                    [40, 25, 45],
                    // fire/ice/thunder
                    [10, 25, 45],
                    [20, 25, 45],
                    [0, 25, 45],
                    // water/earth/wind
                    [10, 25, 45],
                    [40, 25, 45],
                    [20, 25, 45],
                    // light/dark
                    [20, 25, 45],
                    [20, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [10, 0, 50],
                    // mmp-debuff
                    [10, 0, 50],
                    // atk-debuff
                    [10, 0, 50],
                    // def-debuff
                    [10, 0, 50],
                    // mat-debuff
                    [10, 0, 50],
                    // mdf-debuff
                    [10, 0, 50],
                    // agi-debuff
                    [10, 0, 50],
                    // luk-debuff
                    [10, 0, 50],
                    // death
                    [0, 0, 50],
                    // berserk
                    [0, 0, 50],
                    // confuse
                    [0, 0, 50],
                    // temptation
                    [0, 0, 50],
                    // silent
                    [0, 0, 50],
                    // phantom
                    [0, 0, 50],
                    // paralyze
                    [0, 0, 50],
                    // poison
                    [0, 0, 50],
                    // deadly-poison
                    [0, 0, 50],
                    // magical-poison
                    [0, 0, 50],
                    // sleep
                    [0, 0, 50],
                    // mp-doublecost
                    [0, 0, 50],
                    // vulnerable
                    [0, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0]
                ]
            }
        ]
    },
    {
        rank: 1,
        materials: [
            {
                id: 5,
                name: "鉄",
                price: 300,
                traits: [
                    // def+, def++
                    [5, 2, 5],
                    [0, 5, 10],
                    // mdf+, mdf++
                    [0, 2, 5],
                    [0, 5, 10],
                    // agi-, agi--
                    [10, -5, -2],
                    [5, -10, -5],
                    // luk+, luk-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [5, 2, 5],
                    [5, -5, -2],
                    // evd+, evd-
                    [5, 2, 5],
                    [5, -5, -2],
                    // cri+, cri-
                    [5, 2, 5],
                    [5, -5, -2],
                    // ctr+, ctr-
                    [5, 2, 5],
                    [5, -5, -2],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [40, 25, 45],
                    [40, 25, 45],
                    [40, 25, 45],
                    // fire/ice/thunder
                    [10, 25, 45],
                    [20, 25, 45],
                    [0, 25, 45],
                    // water/earth/wind
                    [10, 25, 45],
                    [40, 25, 45],
                    [20, 25, 45],
                    // light/dark
                    [20, 25, 45],
                    [20, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [10, 0, 50],
                    // mmp-debuff
                    [10, 0, 50],
                    // atk-debuff
                    [10, 0, 50],
                    // def-debuff
                    [10, 0, 50],
                    // mat-debuff
                    [10, 0, 50],
                    // mdf-debuff
                    [10, 0, 50],
                    // agi-debuff
                    [10, 0, 50],
                    // luk-debuff
                    [10, 0, 50],
                    // death
                    [0, 0, 50],
                    // berserk
                    [0, 0, 50],
                    // confuse
                    [0, 0, 50],
                    // temptation
                    [0, 0, 50],
                    // silent
                    [0, 0, 50],
                    // phantom
                    [0, 0, 50],
                    // paralyze
                    [0, 0, 50],
                    // poison
                    [0, 0, 50],
                    // deadly-poison
                    [0, 0, 50],
                    // magical-poison
                    [0, 0, 50],
                    // sleep
                    [0, 0, 50],
                    // mp-doublecost
                    [0, 0, 50],
                    // vulnerable
                    [0, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0]
                ]
            },
            {
                id: 6,
                name: "鋼鉄",
                price: 500,
                traits: [
                    // def+, def++
                    [5, 2, 5],
                    [0, 5, 10],
                    // mdf+, mdf++
                    [0, 2, 5],
                    [0, 5, 10],
                    // agi-, agi--
                    [10, -5, -2],
                    [5, -10, -5],
                    // luk+, luk-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [5, 2, 5],
                    [5, -5, -2],
                    // evd+, evd-
                    [5, 2, 5],
                    [5, -5, -2],
                    // cri+, cri-
                    [5, 2, 5],
                    [5, -5, -2],
                    // ctr+, ctr-
                    [5, 2, 5],
                    [5, -5, -2],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [40, 25, 45],
                    [40, 25, 45],
                    [40, 25, 45],
                    // fire/ice/thunder
                    [10, 25, 45],
                    [20, 25, 45],
                    [0, 25, 45],
                    // water/earth/wind
                    [10, 25, 45],
                    [40, 25, 45],
                    [20, 25, 45],
                    // light/dark
                    [20, 25, 45],
                    [20, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // luk-debuff
                    [20, 0, 50],
                    // death
                    [0, 0, 50],
                    // berserk
                    [0, 0, 50],
                    // confuse
                    [0, 0, 50],
                    // temptation
                    [0, 0, 50],
                    // silent
                    [0, 0, 50],
                    // phantom
                    [0, 0, 50],
                    // paralyze
                    [0, 0, 50],
                    // poison
                    [0, 0, 50],
                    // deadly-poison
                    [0, 0, 50],
                    // magical-poison
                    [0, 0, 50],
                    // sleep
                    [0, 0, 50],
                    // mp-doublecost
                    [0, 0, 50],
                    // vulnerable
                    [0, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0]
                ]
            },
            {
                id: 7,
                name: "銀",
                price: 1000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [5, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, 5, 10],
                    // luk+, luk-
                    [10, 2, 5],
                    [5, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, 2, 5],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, 2, 5],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [40, 25, 45],
                    [40, 25, 45],
                    [40, 25, 45],
                    // fire/ice/thunder
                    [10, 25, 45],
                    [20, 25, 45],
                    [0, 25, 45],
                    // water/earth/wind
                    [10, 25, 45],
                    [40, 25, 45],
                    [20, 25, 45],
                    // light/dark
                    [20, 25, 45],
                    [20, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // death
                    [5, 0, 50],
                    // berserk
                    [5, 0, 50],
                    // confuse
                    [5, 0, 50],
                    // temptation
                    [5, 0, 50],
                    // silent
                    [5, 0, 50],
                    // phantom
                    [5, 0, 50],
                    // paralyze
                    [5, 0, 50],
                    // poison
                    [5, 0, 50],
                    // deadly-poison
                    [5, 0, 50],
                    // magical-poison
                    [5, 0, 50],
                    // sleep
                    [5, 0, 50],
                    // mp-doublecost
                    [5, 0, 50],
                    // vulnerable
                    [5, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [5],
                    // confuse+
                    [5],
                    // temptation+
                    [5],
                    // silent+
                    [5],
                    // phantom+
                    [5],
                    // paralyze+
                    [5],
                    // poison+
                    [5],
                    // deadly-poison+
                    [5],
                    // magical-poison+
                    [5],
                    // sleep+
                    [5],
                    // mp-doublecost+
                    [5],
                    // vulnerable+
                    [5],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [3],
                    // double-gold
                    [10],
                    // double-drop
                    [5]
                ]
            }
        ]
    },
    {
        rank: 2,
        materials: [
            {
                id: 8,
                name: "金",
                price: 3500,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [0, 2, 5],
                    [0, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, 5, 10],
                    // luk+, luk-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [60, 25, 45],
                    [60, 25, 45],
                    [60, 25, 45],
                    // fire/ice/thunder
                    [15, 25, 45],
                    [30, 25, 45],
                    [0, 25, 45],
                    // water/earth/wind
                    [10, 25, 45],
                    [60, 25, 45],
                    [30, 25, 45],
                    // light/dark
                    [30, 25, 45],
                    [30, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // death
                    [5, 0, 50],
                    // berserk
                    [5, 0, 50],
                    // confuse
                    [5, 0, 50],
                    // temptation
                    [5, 0, 50],
                    // silent
                    [5, 0, 50],
                    // phantom
                    [5, 0, 50],
                    // paralyze
                    [5, 0, 50],
                    // poison
                    [5, 0, 50],
                    // deadly-poison
                    [5, 0, 50],
                    // magical-poison
                    [5, 0, 50],
                    // sleep
                    [5, 0, 50],
                    // mp-doublecost
                    [5, 0, 50],
                    // vulnerable
                    [5, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [5],
                    // confuse+
                    [5],
                    // temptation+
                    [5],
                    // silent+
                    [5],
                    // phantom+
                    [5],
                    // paralyze+
                    [5],
                    // poison+
                    [5],
                    // deadly-poison+
                    [5],
                    // magical-poison+
                    [5],
                    // sleep+
                    [5],
                    // mp-doublecost+
                    [5],
                    // vulnerable+
                    [5],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [3],
                    // double-gold
                    [20],
                    // double-drop
                    [10]
                ]
            },
            {
                id: 9,
                name: "プラチナ",
                price: 6000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [0, 2, 5],
                    [0, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [60, 25, 45],
                    [60, 25, 45],
                    [60, 25, 45],
                    // fire/ice/thunder
                    [15, 25, 45],
                    [30, 25, 45],
                    [0, 25, 45],
                    // water/earth/wind
                    [10, 25, 45],
                    [60, 25, 45],
                    [30, 25, 45],
                    // light/dark
                    [30, 25, 45],
                    [30, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // death
                    [5, 0, 50],
                    // berserk
                    [5, 0, 50],
                    // confuse
                    [5, 0, 50],
                    // temptation
                    [5, 0, 50],
                    // silent
                    [5, 0, 50],
                    // phantom
                    [5, 0, 50],
                    // paralyze
                    [5, 0, 50],
                    // poison
                    [5, 0, 50],
                    // deadly-poison
                    [5, 0, 50],
                    // magical-poison
                    [5, 0, 50],
                    // sleep
                    [5, 0, 50],
                    // mp-doublecost
                    [5, 0, 50],
                    // vulnerable
                    [5, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [5],
                    // confuse+
                    [5],
                    // temptation+
                    [5],
                    // silent+
                    [5],
                    // phantom+
                    [5],
                    // paralyze+
                    [5],
                    // poison+
                    [5],
                    // deadly-poison+
                    [5],
                    // magical-poison+
                    [5],
                    // sleep+
                    [5],
                    // mp-doublecost+
                    [5],
                    // vulnerable+
                    [5],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [8],
                    // double-gold
                    [30],
                    // double-drop
                    [15]
                ]
            },
            {
                id: 10,
                name: "ダイヤ",
                price: 10000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [5, 5, 10],
                    // agi-, agi--
                    [0, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [5, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [60, 25, 45],
                    [60, 25, 45],
                    [60, 25, 45],
                    // fire/ice/thunder
                    [15, 25, 45],
                    [30, 25, 45],
                    [0, 25, 45],
                    // water/earth/wind
                    [10, 25, 45],
                    [60, 25, 45],
                    [30, 25, 45],
                    // light/dark
                    [30, 25, 45],
                    [30, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // death
                    [10, 0, 50],
                    // berserk
                    [10, 0, 50],
                    // confuse
                    [10, 0, 50],
                    // temptation
                    [10, 0, 50],
                    // silent
                    [10, 0, 50],
                    // phantom
                    [10, 0, 50],
                    // paralyze
                    [10, 0, 50],
                    // poison
                    [10, 0, 50],
                    // deadly-poison
                    [10, 0, 50],
                    // magical-poison
                    [10, 0, 50],
                    // sleep
                    [10, 0, 50],
                    // mp-doublecost
                    [10, 0, 50],
                    // vulnerable
                    [10, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [5],
                    // confuse+
                    [5],
                    // temptation+
                    [5],
                    // silent+
                    [5],
                    // phantom+
                    [5],
                    // paralyze+
                    [5],
                    // poison+
                    [5],
                    // deadly-poison+
                    [5],
                    // magical-poison+
                    [5],
                    // sleep+
                    [5],
                    // mp-doublecost+
                    [5],
                    // vulnerable+
                    [5],
                    // reduce-encounter
                    [8],
                    // disable-encounter
                    [3],
                    // disable-ambush
                    [8],
                    // double-preemptive
                    [10],
                    // double-gold
                    [20],
                    // double-drop
                    [10]
                ]
            },
            {
                id: 11,
                name: "クリスタル",
                price: 20000,
                traits: [
                    // def+, def++
                    [15, 2, 5],
                    [10, 5, 10],
                    // mdf+, mdf++
                    [15, 2, 5],
                    [10, 5, 10],
                    // agi-, agi--
                    [0, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [15, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mmp+, mmp-
                    [10, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [15, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [15, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [15, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [15, 2, 5],
                    [0, -5, -2],
                    // additional
                    [15],
                    [0],
                    // slash/pen/bash
                    [60, 25, 45],
                    [60, 25, 45],
                    [60, 25, 45],
                    // fire/ice/thunder
                    [50, 25, 45],
                    [50, 25, 45],
                    [20, 25, 45],
                    // water/earth/wind
                    [25, 25, 45],
                    [80, 25, 45],
                    [50, 25, 45],
                    // light/dark
                    [50, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [40, 0, 50],
                    // mmp-debuff
                    [40, 0, 50],
                    // atk-debuff
                    [40, 0, 50],
                    // def-debuff
                    [40, 0, 50],
                    // mat-debuff
                    [40, 0, 50],
                    // mdf-debuff
                    [40, 0, 50],
                    // agi-debuff
                    [40, 0, 50],
                    // luk-debuff
                    [40, 0, 50],
                    // death
                    [20, 0, 50],
                    // berserk
                    [20, 0, 50],
                    // confuse
                    [20, 0, 50],
                    // temptation
                    [20, 0, 50],
                    // silent
                    [20, 0, 50],
                    // phantom
                    [20, 0, 50],
                    // paralyze
                    [20, 0, 50],
                    // poison
                    [20, 0, 50],
                    // deadly-poison
                    [20, 0, 50],
                    // magical-poison
                    [20, 0, 50],
                    // sleep
                    [20, 0, 50],
                    // mp-doublecost
                    [20, 0, 50],
                    // vulnerable
                    [20, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [10],
                    // confuse+
                    [10],
                    // temptation+
                    [10],
                    // silent+
                    [10],
                    // phantom+
                    [10],
                    // paralyze+
                    [10],
                    // poison+
                    [10],
                    // deadly-poison+
                    [10],
                    // magical-poison+
                    [10],
                    // sleep+
                    [10],
                    // mp-doublecost+
                    [10],
                    // vulnerable+
                    [10],
                    // reduce-encounter
                    [10],
                    // disable-encounter
                    [5],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [13],
                    // double-gold
                    [10],
                    // double-drop
                    [5]
                ]
            }
        ]
    },
    {
        rank: 3,
        materials: [
            {
                id: 12,
                name: "炎",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [10, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 25, 45],
                    [50, 25, 45],
                    [50, 25, 45],
                    // fire/ice/thunder
                    [100, 25, 45],
                    [50, 25, 45],
                    [20, 25, 45],
                    // water/earth/wind
                    [0, 25, 45],
                    [20, 25, 45],
                    [20, 25, 45],
                    // light/dark
                    [20, 25, 45],
                    [20, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [100, 40, 70],
                    [50, 40, 70],
                    [20, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [20, 40, 70],
                    [20, 40, 70],
                    // light+/dark+
                    [20, 40, 70],
                    [20, 40, 70],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 0, 50],
                    // berserk
                    [15, 0, 50],
                    // confuse
                    [15, 0, 50],
                    // temptation
                    [15, 0, 50],
                    // silent
                    [15, 0, 50],
                    // phantom
                    [15, 0, 50],
                    // paralyze
                    [15, 0, 50],
                    // poison
                    [15, 0, 50],
                    // deadly-poison
                    [15, 0, 50],
                    // magical-poison
                    [15, 0, 50],
                    // sleep
                    [15, 0, 50],
                    // mp-doublecost
                    [15, 0, 50],
                    // vulnerable
                    [15, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [3],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [3],
                    // double-preemptive
                    [5],
                    // double-gold
                    [0],
                    // double-drop
                    [3]
                ]
            },
            {
                id: 13,
                name: "氷",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [10, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 25, 45],
                    [50, 25, 45],
                    [50, 25, 45],
                    // fire/ice/thunder
                    [0, 25, 45],
                    [100, 25, 45],
                    [20, 25, 45],
                    // water/earth/wind
                    [25, 25, 45],
                    [20, 25, 45],
                    [20, 25, 45],
                    // light/dark
                    [20, 25, 45],
                    [20, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [100, 40, 70],
                    [20, 40, 70],
                    // water+/earth+/wind+
                    [25, 40, 70],
                    [20, 40, 70],
                    [20, 40, 70],
                    // light+/dark+
                    [20, 40, 70],
                    [20, 40, 70],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 0, 50],
                    // berserk
                    [15, 0, 50],
                    // confuse
                    [15, 0, 50],
                    // temptation
                    [15, 0, 50],
                    // silent
                    [15, 0, 50],
                    // phantom
                    [15, 0, 50],
                    // paralyze
                    [15, 0, 50],
                    // poison
                    [15, 0, 50],
                    // deadly-poison
                    [15, 0, 50],
                    // magical-poison
                    [15, 0, 50],
                    // sleep
                    [15, 0, 50],
                    // mp-doublecost
                    [15, 0, 50],
                    // vulnerable
                    [15, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [15],
                    // reduce-encounter
                    [3],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [3],
                    // double-preemptive
                    [5],
                    // double-gold
                    [0],
                    // double-drop
                    [3]
                ]
            },
            {
                id: 14,
                name: "雷",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [10, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 25, 45],
                    [50, 25, 45],
                    [50, 25, 45],
                    // fire/ice/thunder
                    [25, 25, 45],
                    [25, 25, 45],
                    [100, 25, 45],
                    // water/earth/wind
                    [0, 25, 45],
                    [20, 25, 45],
                    [20, 25, 45],
                    // light/dark
                    [20, 25, 45],
                    [20, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [25, 40, 70],
                    [25, 40, 70],
                    [100, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [20, 40, 70],
                    [20, 40, 70],
                    // light+/dark+
                    [20, 40, 70],
                    [20, 40, 70],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 0, 50],
                    // berserk
                    [15, 0, 50],
                    // confuse
                    [15, 0, 50],
                    // temptation
                    [15, 0, 50],
                    // silent
                    [15, 0, 50],
                    // phantom
                    [15, 0, 50],
                    // paralyze
                    [15, 0, 50],
                    // poison
                    [15, 0, 50],
                    // deadly-poison
                    [15, 0, 50],
                    // magical-poison
                    [15, 0, 50],
                    // sleep
                    [15, 0, 50],
                    // mp-doublecost
                    [15, 0, 50],
                    // vulnerable
                    [15, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [3],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [3],
                    // double-preemptive
                    [5],
                    // double-gold
                    [0],
                    // double-drop
                    [3]
                ]
            },
            {
                id: 15,
                name: "水",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [10, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 25, 45],
                    [50, 25, 45],
                    [50, 25, 45],
                    // fire/ice/thunder
                    [50, 25, 45],
                    [50, 25, 45],
                    [0, 25, 45],
                    // water/earth/wind
                    [100, 25, 45],
                    [20, 25, 45],
                    [20, 25, 45],
                    // light/dark
                    [20, 25, 45],
                    [20, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [50, 40, 70],
                    [50, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [100, 40, 70],
                    [20, 40, 70],
                    [20, 40, 70],
                    // light+/dark+
                    [20, 40, 70],
                    [20, 40, 70],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 0, 50],
                    // berserk
                    [15, 0, 50],
                    // confuse
                    [15, 0, 50],
                    // temptation
                    [15, 0, 50],
                    // silent
                    [15, 0, 50],
                    // phantom
                    [15, 0, 50],
                    // paralyze
                    [15, 0, 50],
                    // poison
                    [15, 0, 50],
                    // deadly-poison
                    [15, 0, 50],
                    // magical-poison
                    [15, 0, 50],
                    // sleep
                    [15, 0, 50],
                    // mp-doublecost
                    [15, 0, 50],
                    // vulnerable
                    [15, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [3],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [3],
                    // double-preemptive
                    [5],
                    // double-gold
                    [0],
                    // double-drop
                    [3]
                ]
            },
            {
                id: 16,
                name: "土",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [10, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 25, 45],
                    [50, 25, 45],
                    [50, 25, 45],
                    // fire/ice/thunder
                    [25, 25, 45],
                    [25, 25, 45],
                    [25, 25, 45],
                    // water/earth/wind
                    [25, 25, 45],
                    [100, 25, 45],
                    [0, 25, 45],
                    // light/dark
                    [20, 25, 45],
                    [20, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [25, 40, 70],
                    [25, 40, 70],
                    [25, 40, 70],
                    // water+/earth+/wind+
                    [25, 40, 70],
                    [100, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [20, 40, 70],
                    [20, 40, 70],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 0, 50],
                    // berserk
                    [15, 0, 50],
                    // confuse
                    [15, 0, 50],
                    // temptation
                    [15, 0, 50],
                    // silent
                    [15, 0, 50],
                    // phantom
                    [15, 0, 50],
                    // paralyze
                    [15, 0, 50],
                    // poison
                    [15, 0, 50],
                    // deadly-poison
                    [15, 0, 50],
                    // magical-poison
                    [15, 0, 50],
                    // sleep
                    [15, 0, 50],
                    // mp-doublecost
                    [15, 0, 50],
                    // vulnerable
                    [15, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [3],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [3],
                    // double-preemptive
                    [5],
                    // double-gold
                    [0],
                    // double-drop
                    [3]
                ]
            },
            {
                id: 17,
                name: "風",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [10, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 25, 45],
                    [50, 25, 45],
                    [50, 25, 45],
                    // fire/ice/thunder
                    [25, 25, 45],
                    [25, 25, 45],
                    [25, 25, 45],
                    // water/earth/wind
                    [25, 25, 45],
                    [0, 25, 45],
                    [100, 25, 45],
                    // light/dark
                    [20, 25, 45],
                    [20, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [25, 40, 70],
                    [25, 40, 70],
                    [25, 40, 70],
                    // water+/earth+/wind+
                    [25, 40, 70],
                    [0, 40, 70],
                    [100, 40, 70],
                    // light+/dark+
                    [20, 40, 70],
                    [20, 40, 70],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 0, 50],
                    // berserk
                    [15, 0, 50],
                    // confuse
                    [15, 0, 50],
                    // temptation
                    [15, 0, 50],
                    // silent
                    [15, 0, 50],
                    // phantom
                    [15, 0, 50],
                    // paralyze
                    [15, 0, 50],
                    // poison
                    [15, 0, 50],
                    // deadly-poison
                    [15, 0, 50],
                    // magical-poison
                    [15, 0, 50],
                    // sleep
                    [15, 0, 50],
                    // mp-doublecost
                    [15, 0, 50],
                    // vulnerable
                    [15, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [3],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [3],
                    // double-preemptive
                    [5],
                    // double-gold
                    [0],
                    // double-drop
                    [3]
                ]
            },
            {
                id: 18,
                name: "光",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [10, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 25, 45],
                    [50, 25, 45],
                    [50, 25, 45],
                    // fire/ice/thunder
                    [25, 25, 45],
                    [25, 25, 45],
                    [25, 25, 45],
                    // water/earth/wind
                    [25, 25, 45],
                    [25, 25, 45],
                    [25, 25, 45],
                    // light/dark
                    [100, 25, 45],
                    [0, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [25, 40, 70],
                    [25, 40, 70],
                    [25, 40, 70],
                    // water+/earth+/wind+
                    [25, 40, 70],
                    [25, 40, 70],
                    [25, 40, 70],
                    // light+/dark+
                    [100, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 0, 50],
                    // berserk
                    [15, 0, 50],
                    // confuse
                    [15, 0, 50],
                    // temptation
                    [15, 0, 50],
                    // silent
                    [15, 0, 50],
                    // phantom
                    [15, 0, 50],
                    // paralyze
                    [15, 0, 50],
                    // poison
                    [15, 0, 50],
                    // deadly-poison
                    [15, 0, 50],
                    // magical-poison
                    [15, 0, 50],
                    // sleep
                    [15, 0, 50],
                    // mp-doublecost
                    [15, 0, 50],
                    // vulnerable
                    [15, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [3],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [3],
                    // double-preemptive
                    [5],
                    // double-gold
                    [0],
                    // double-drop
                    [3]
                ]
            },
            {
                id: 19,
                name: "闇",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [10, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 25, 45],
                    [50, 25, 45],
                    [50, 25, 45],
                    // fire/ice/thunder
                    [25, 25, 45],
                    [25, 25, 45],
                    [25, 25, 45],
                    // water/earth/wind
                    [25, 25, 45],
                    [25, 25, 45],
                    [25, 25, 45],
                    // light/dark
                    [0, 25, 45],
                    [100, 25, 45],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [25, 40, 70],
                    [25, 40, 70],
                    [25, 40, 70],
                    // water+/earth+/wind+
                    [25, 40, 70],
                    [25, 40, 70],
                    [25, 40, 70],
                    // light+/dark+
                    [100, 25, 45],
                    [0, 25, 45],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 0, 50],
                    // berserk
                    [15, 0, 50],
                    // confuse
                    [15, 0, 50],
                    // temptation
                    [15, 0, 50],
                    // silent
                    [15, 0, 50],
                    // phantom
                    [15, 0, 50],
                    // paralyze
                    [15, 0, 50],
                    // poison
                    [15, 0, 50],
                    // deadly-poison
                    [15, 0, 50],
                    // magical-poison
                    [15, 0, 50],
                    // sleep
                    [15, 0, 50],
                    // mp-doublecost
                    [15, 0, 50],
                    // vulnerable
                    [15, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [3],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [3],
                    // double-preemptive
                    [5],
                    // double-gold
                    [0],
                    // double-drop
                    [3]
                ]
            }
        ]
    }
];

/**
 * 頭部・胴体防具材質定数オブジェクト
 * 
 * rank: ランク
 * materials: 材質。
 *     id: ID。
 *     name: 材質名。
 *     traits: 特徴追加発生率と発生時の追加値範囲。
 */
const HEAD_BODY_MATERIALS = [
    {
        rank: 0,
        materials: [
            {
                id: 1,
                name: "革",
                price: 50,
                traits: [
                    // def+, def++
                    [5, 5, 10],
                    [0, 11, 25],
                    // mdf+, mdf++
                    [0, 5, 10],
                    [0, 11, 25],
                    // agi-, agi--
                    [10, -10, -5],
                    [5, -25, -11],
                    // luk+, luk-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [5, 5, 10],
                    [5, -10, -5],
                    // evd+, evd-
                    [5, 5, 10],
                    [5, -10, -5],
                    // cri+, cri-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ctr+, ctr-
                    [5, 5, 10],
                    [5, -10, -5],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [20, 15, 30],
                    [20, 15, 30],
                    [40, 15, 30],
                    // fire/ice/thunder
                    [0, 15, 30],
                    [10, 15, 30],
                    [10, 15, 30],
                    // water/earth/wind
                    [0, 15, 30],
                    [20, 15, 30],
                    [20, 15, 30],
                    // light/dark
                    [20, 15, 30],
                    [20, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [10, 0, 50],
                    // mmp-debuff
                    [10, 0, 50],
                    // atk-debuff
                    [10, 0, 50],
                    // def-debuff
                    [10, 0, 50],
                    // mat-debuff
                    [10, 0, 50],
                    // mdf-debuff
                    [10, 0, 50],
                    // agi-debuff
                    [10, 0, 50],
                    // luk-debuff
                    [10, 0, 50],
                    // death
                    [0, 0, 50],
                    // berserk
                    [0, 0, 50],
                    // confuse
                    [0, 0, 50],
                    // temptation
                    [0, 0, 50],
                    // silent
                    [0, 0, 50],
                    // phantom
                    [0, 0, 50],
                    // paralyze
                    [0, 0, 50],
                    // poison
                    [0, 0, 50],
                    // deadly-poison
                    [0, 0, 50],
                    // magical-poison
                    [0, 0, 50],
                    // sleep
                    [0, 0, 50],
                    // mp-doublecost
                    [0, 0, 50],
                    // vulnerable
                    [0, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0]
                ]
            },
            {
                id: 2,
                name: "木",
                price: 50,
                traits: [
                    // def+, def++
                    [5, 5, 10],
                    [0, 11, 25],
                    // mdf+, mdf++
                    [0, 5, 10],
                    [0, 11, 25],
                    // agi-, agi--
                    [10, -10, -5],
                    [5, -25, -11],
                    // luk+, luk-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [5, 5, 10],
                    [5, -10, -5],
                    // evd+, evd-
                    [5, 5, 10],
                    [5, -10, -5],
                    // cri+, cri-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ctr+, ctr-
                    [5, 5, 10],
                    [5, -10, -5],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [20, 15, 30],
                    [20, 15, 30],
                    [40, 15, 30],
                    // fire/ice/thunder
                    [0, 15, 30],
                    [10, 15, 30],
                    [10, 15, 30],
                    // water/earth/wind
                    [0, 15, 30],
                    [20, 15, 30],
                    [20, 15, 30],
                    // light/dark
                    [20, 15, 30],
                    [20, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [10, 0, 50],
                    // mmp-debuff
                    [10, 0, 50],
                    // atk-debuff
                    [10, 0, 50],
                    // def-debuff
                    [10, 0, 50],
                    // mat-debuff
                    [10, 0, 50],
                    // mdf-debuff
                    [10, 0, 50],
                    // agi-debuff
                    [10, 0, 50],
                    // luk-debuff
                    [10, 0, 50],
                    // death
                    [0, 0, 50],
                    // berserk
                    [0, 0, 50],
                    // confuse
                    [0, 0, 50],
                    // temptation
                    [0, 0, 50],
                    // silent
                    [0, 0, 50],
                    // phantom
                    [0, 0, 50],
                    // paralyze
                    [0, 0, 50],
                    // poison
                    [0, 0, 50],
                    // deadly-poison
                    [0, 0, 50],
                    // magical-poison
                    [0, 0, 50],
                    // sleep
                    [0, 0, 50],
                    // mp-doublecost
                    [0, 0, 50],
                    // vulnerable
                    [0, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0]
                ]
            },
            {
                id: 3,
                name: "石",
                price: 50,
                traits: [
                    // def+, def++
                    [5, 5, 10],
                    [0, 11, 25],
                    // mdf+, mdf++
                    [0, 5, 10],
                    [0, 11, 25],
                    // agi-, agi--
                    [10, -10, -5],
                    [5, -25, -11],
                    // luk+, luk-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [5, 5, 10],
                    [5, -10, -5],
                    // evd+, evd-
                    [5, 5, 10],
                    [5, -10, -5],
                    // cri+, cri-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ctr+, ctr-
                    [5, 5, 10],
                    [5, -10, -5],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [40, 15, 30],
                    [40, 15, 30],
                    [5, 15, 30],
                    // fire/ice/thunder
                    [40, 15, 30],
                    [10, 15, 30],
                    [10, 15, 30],
                    // water/earth/wind
                    [10, 15, 30],
                    [40, 15, 30],
                    [20, 15, 30],
                    // light/dark
                    [20, 15, 30],
                    [20, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [10, 0, 50],
                    // mmp-debuff
                    [10, 0, 50],
                    // atk-debuff
                    [10, 0, 50],
                    // def-debuff
                    [10, 0, 50],
                    // mat-debuff
                    [10, 0, 50],
                    // mdf-debuff
                    [10, 0, 50],
                    // agi-debuff
                    [10, 0, 50],
                    // luk-debuff
                    [10, 0, 50],
                    // death
                    [0, 0, 50],
                    // berserk
                    [0, 0, 50],
                    // confuse
                    [0, 0, 50],
                    // temptation
                    [0, 0, 50],
                    // silent
                    [0, 0, 50],
                    // phantom
                    [0, 0, 50],
                    // paralyze
                    [0, 0, 50],
                    // poison
                    [0, 0, 50],
                    // deadly-poison
                    [0, 0, 50],
                    // magical-poison
                    [0, 0, 50],
                    // sleep
                    [0, 0, 50],
                    // mp-doublecost
                    [0, 0, 50],
                    // vulnerable
                    [0, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0]
                ]
            },
            {
                id: 4,
                name: "銅",
                price: 100,
                traits: [
                    // def+, def++
                    [5, 5, 10],
                    [0, 11, 25],
                    // mdf+, mdf++
                    [0, 5, 10],
                    [0, 11, 25],
                    // agi-, agi--
                    [10, -10, -5],
                    [5, -25, -11],
                    // luk+, luk-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [5, 5, 10],
                    [5, -10, -5],
                    // evd+, evd-
                    [5, 5, 10],
                    [5, -10, -5],
                    // cri+, cri-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ctr+, ctr-
                    [5, 5, 10],
                    [5, -10, -5],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [40, 15, 30],
                    [40, 15, 30],
                    [40, 15, 30],
                    // fire/ice/thunder
                    [10, 15, 30],
                    [20, 15, 30],
                    [5, 15, 30],
                    // water/earth/wind
                    [10, 15, 30],
                    [40, 15, 30],
                    [20, 15, 30],
                    // light/dark
                    [20, 15, 30],
                    [20, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [10, 0, 50],
                    // mmp-debuff
                    [10, 0, 50],
                    // atk-debuff
                    [10, 0, 50],
                    // def-debuff
                    [10, 0, 50],
                    // mat-debuff
                    [10, 0, 50],
                    // mdf-debuff
                    [10, 0, 50],
                    // agi-debuff
                    [10, 0, 50],
                    // luk-debuff
                    [10, 0, 50],
                    // death
                    [0, 0, 50],
                    // berserk
                    [0, 0, 50],
                    // confuse
                    [0, 0, 50],
                    // temptation
                    [0, 0, 50],
                    // silent
                    [0, 0, 50],
                    // phantom
                    [0, 0, 50],
                    // paralyze
                    [0, 0, 50],
                    // poison
                    [0, 0, 50],
                    // deadly-poison
                    [0, 0, 50],
                    // magical-poison
                    [0, 0, 50],
                    // sleep
                    [0, 0, 50],
                    // mp-doublecost
                    [0, 0, 50],
                    // vulnerable
                    [0, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0]
                ]
            }
        ]
    },
    {
        rank: 1,
        materials: [
            {
                id: 5,
                name: "鉄",
                price: 300,
                traits: [
                    // def+, def++
                    [5, 5, 10],
                    [0, 11, 25],
                    // mdf+, mdf++
                    [0, 5, 10],
                    [0, 11, 25],
                    // agi-, agi--
                    [10, -10, -5],
                    [5, -25, -11],
                    // luk+, luk-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [5, 5, 10],
                    [5, -10, -5],
                    // evd+, evd-
                    [5, 5, 10],
                    [5, -10, -5],
                    // cri+, cri-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ctr+, ctr-
                    [5, 5, 10],
                    [5, -10, -5],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [40, 15, 30],
                    [40, 15, 30],
                    [40, 15, 30],
                    // fire/ice/thunder
                    [10, 15, 30],
                    [20, 15, 30],
                    [5, 15, 30],
                    // water/earth/wind
                    [10, 15, 30],
                    [40, 15, 30],
                    [20, 15, 30],
                    // light/dark
                    [20, 15, 30],
                    [20, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [10, 0, 50],
                    // mmp-debuff
                    [10, 0, 50],
                    // atk-debuff
                    [10, 0, 50],
                    // def-debuff
                    [10, 0, 50],
                    // mat-debuff
                    [10, 0, 50],
                    // mdf-debuff
                    [10, 0, 50],
                    // agi-debuff
                    [10, 0, 50],
                    // luk-debuff
                    [10, 0, 50],
                    // death
                    [0, 0, 50],
                    // berserk
                    [0, 0, 50],
                    // confuse
                    [0, 0, 50],
                    // temptation
                    [0, 0, 50],
                    // silent
                    [0, 0, 50],
                    // phantom
                    [0, 0, 50],
                    // paralyze
                    [0, 0, 50],
                    // poison
                    [0, 0, 50],
                    // deadly-poison
                    [0, 0, 50],
                    // magical-poison
                    [0, 0, 50],
                    // sleep
                    [0, 0, 50],
                    // mp-doublecost
                    [0, 0, 50],
                    // vulnerable
                    [0, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0]
                ]
            },
            {
                id: 6,
                name: "鋼鉄",
                price: 500,
                traits: [
                    // def+, def++
                    [5, 5, 10],
                    [0, 11, 25],
                    // mdf+, mdf++
                    [0, 5, 10],
                    [0, 11, 25],
                    // agi-, agi--
                    [10, -10, -5],
                    [5, -25, -11],
                    // luk+, luk-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [5, 5, 10],
                    [5, -10, -5],
                    // evd+, evd-
                    [5, 5, 10],
                    [5, -10, -5],
                    // cri+, cri-
                    [5, 5, 10],
                    [5, -10, -5],
                    // ctr+, ctr-
                    [5, 5, 10],
                    [5, -10, -5],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [40, 15, 30],
                    [40, 15, 30],
                    [40, 15, 30],
                    // fire/ice/thunder
                    [10, 15, 30],
                    [20, 15, 30],
                    [5, 15, 30],
                    // water/earth/wind
                    [10, 15, 30],
                    [40, 15, 30],
                    [20, 15, 30],
                    // light/dark
                    [20, 15, 30],
                    [20, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // luk-debuff
                    [20, 0, 50],
                    // death
                    [0, 0, 50],
                    // berserk
                    [0, 0, 50],
                    // confuse
                    [0, 0, 50],
                    // temptation
                    [0, 0, 50],
                    // silent
                    [0, 0, 50],
                    // phantom
                    [0, 0, 50],
                    // paralyze
                    [0, 0, 50],
                    // poison
                    [0, 0, 50],
                    // deadly-poison
                    [0, 0, 50],
                    // magical-poison
                    [0, 0, 50],
                    // sleep
                    [0, 0, 50],
                    // mp-doublecost
                    [0, 0, 50],
                    // vulnerable
                    [0, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0]
                ]
            },
            {
                id: 7,
                name: "銀",
                price: 1000,
                traits: [
                    // def+, def++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mdf+, mdf++
                    [10, 5, 10],
                    [5, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [5, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // evd+, evd-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [40, 15, 30],
                    [40, 15, 30],
                    [40, 15, 30],
                    // fire/ice/thunder
                    [10, 15, 30],
                    [20, 15, 30],
                    [5, 15, 30],
                    // water/earth/wind
                    [10, 15, 30],
                    [40, 15, 30],
                    [20, 15, 30],
                    // light/dark
                    [20, 15, 30],
                    [20, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // luk-debuff
                    [20, 0, 50],
                    // death
                    [5, 0, 50],
                    // berserk
                    [5, 0, 50],
                    // confuse
                    [5, 0, 50],
                    // temptation
                    [5, 0, 50],
                    // silent
                    [5, 0, 50],
                    // phantom
                    [5, 0, 50],
                    // paralyze
                    [5, 0, 50],
                    // poison
                    [5, 0, 50],
                    // deadly-poison
                    [5, 0, 50],
                    // magical-poison
                    [5, 0, 50],
                    // sleep
                    [5, 0, 50],
                    // mp-doublecost
                    [5, 0, 50],
                    // vulnerable
                    [5, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [5],
                    // confuse+
                    [5],
                    // temptation+
                    [5],
                    // silent+
                    [5],
                    // phantom+
                    [5],
                    // paralyze+
                    [5],
                    // poison+
                    [5],
                    // deadly-poison+
                    [5],
                    // magical-poison+
                    [5],
                    // sleep+
                    [5],
                    // mp-doublecost+
                    [5],
                    // vulnerable+
                    [5],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [5],
                    // double-gold
                    [20],
                    // double-drop
                    [10]
                ]
            },
        ]
    },
    {
        rank: 2,
        materials: [
            {
                id: 8,
                name: "金",
                price: 3500,
                traits: [
                    // def+, def++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mdf+, mdf++
                    [0, 5, 10],
                    [0, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // evd+, evd-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [60, 15, 30],
                    [60, 15, 30],
                    [60, 15, 30],
                    // fire/ice/thunder
                    [15, 15, 30],
                    [30, 15, 30],
                    [5, 15, 30],
                    // water/earth/wind
                    [10, 15, 30],
                    [60, 15, 30],
                    [30, 15, 30],
                    // light/dark
                    [30, 15, 30],
                    [30, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // luk-debuff
                    [20, 0, 50],
                    // death
                    [5, 0, 50],
                    // berserk
                    [5, 0, 50],
                    // confuse
                    [5, 0, 50],
                    // temptation
                    [5, 0, 50],
                    // silent
                    [5, 0, 50],
                    // phantom
                    [5, 0, 50],
                    // paralyze
                    [5, 0, 50],
                    // poison
                    [5, 0, 50],
                    // deadly-poison
                    [5, 0, 50],
                    // magical-poison
                    [5, 0, 50],
                    // sleep
                    [5, 0, 50],
                    // mp-doublecost
                    [5, 0, 50],
                    // vulnerable
                    [5, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [5],
                    // confuse+
                    [5],
                    // temptation+
                    [5],
                    // silent+
                    [5],
                    // phantom+
                    [5],
                    // paralyze+
                    [5],
                    // poison+
                    [5],
                    // deadly-poison+
                    [5],
                    // magical-poison+
                    [5],
                    // sleep+
                    [5],
                    // mp-doublecost+
                    [5],
                    // vulnerable+
                    [5],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [5],
                    // double-gold
                    [40],
                    // double-drop
                    [20]
                ]
            },
            {
                id: 9,
                name: "プラチナ",
                price: 6000,
                traits: [
                    // def+, def++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mdf+, mdf++
                    [0, 5, 10],
                    [0, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mhp+, mhp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // mmp+, mmp-
                    [0, 5, 10],
                    [0, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // evd+, evd-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [60, 15, 30],
                    [60, 15, 30],
                    [60, 15, 30],
                    // fire/ice/thunder
                    [15, 15, 30],
                    [30, 15, 30],
                    [5, 15, 30],
                    // water/earth/wind
                    [10, 15, 30],
                    [60, 15, 30],
                    [30, 15, 30],
                    // light/dark
                    [30, 15, 30],
                    [30, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // luk-debuff
                    [20, 0, 50],
                    // death
                    [5, 0, 50],
                    // berserk
                    [5, 0, 50],
                    // confuse
                    [5, 0, 50],
                    // temptation
                    [5, 0, 50],
                    // silent
                    [5, 0, 50],
                    // phantom
                    [5, 0, 50],
                    // paralyze
                    [5, 0, 50],
                    // poison
                    [5, 0, 50],
                    // deadly-poison
                    [5, 0, 50],
                    // magical-poison
                    [5, 0, 50],
                    // sleep
                    [5, 0, 50],
                    // mp-doublecost
                    [5, 0, 50],
                    // vulnerable
                    [5, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [5],
                    // confuse+
                    [5],
                    // temptation+
                    [5],
                    // silent+
                    [5],
                    // phantom+
                    [5],
                    // paralyze+
                    [5],
                    // poison+
                    [5],
                    // deadly-poison+
                    [5],
                    // magical-poison+
                    [5],
                    // sleep+
                    [5],
                    // mp-doublecost+
                    [5],
                    // vulnerable+
                    [5],
                    // reduce-encounter
                    [10],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [10],
                    // double-preemptive
                    [15],
                    // double-gold
                    [60],
                    // double-drop
                    [30]
                ]
            },
            {
                id: 10,
                name: "ダイヤ",
                price: 10000,
                traits: [
                    // def+, def++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mdf+, mdf++
                    [10, 5, 10],
                    [5, 11, 25],
                    // agi-, agi--
                    [0, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [5, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // evd+, evd-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [60, 15, 30],
                    [60, 15, 30],
                    [60, 15, 30],
                    // fire/ice/thunder
                    [15, 15, 30],
                    [30, 15, 30],
                    [5, 15, 30],
                    // water/earth/wind
                    [10, 15, 30],
                    [60, 15, 30],
                    [30, 15, 30],
                    // light/dark
                    [30, 15, 30],
                    [30, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // luk-debuff
                    [20, 0, 50],
                    // death
                    [10, 0, 50],
                    // berserk
                    [10, 0, 50],
                    // confuse
                    [10, 0, 50],
                    // temptation
                    [10, 0, 50],
                    // silent
                    [10, 0, 50],
                    // phantom
                    [10, 0, 50],
                    // paralyze
                    [10, 0, 50],
                    // poison
                    [10, 0, 50],
                    // deadly-poison
                    [10, 0, 50],
                    // magical-poison
                    [10, 0, 50],
                    // sleep
                    [10, 0, 50],
                    // mp-doublecost
                    [10, 0, 50],
                    // vulnerable
                    [10, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [5],
                    // confuse+
                    [5],
                    // temptation+
                    [5],
                    // silent+
                    [5],
                    // phantom+
                    [5],
                    // paralyze+
                    [5],
                    // poison+
                    [5],
                    // deadly-poison+
                    [5],
                    // magical-poison+
                    [5],
                    // sleep+
                    [5],
                    // mp-doublecost+
                    [5],
                    // vulnerable+
                    [5],
                    // reduce-encounter
                    [15],
                    // disable-encounter
                    [5],
                    // disable-ambush
                    [15],
                    // double-preemptive
                    [20],
                    // double-gold
                    [40],
                    // double-drop
                    [20]
                ]
            },
            {
                id: 11,
                name: "クリスタル",
                price: 20000,
                traits: [
                    // def+, def++
                    [15, 5, 10],
                    [10, 11, 25],
                    // mdf+, mdf++
                    [15, 5, 10],
                    [10, 11, 25],
                    // agi-, agi--
                    [0, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [15, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mmp+, mmp-
                    [10, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [15, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [15, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [15, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [15, 2, 5],
                    [0, -5, -2],
                    // additional
                    [15],
                    [0],
                    // slash/pen/bash
                    [60, 15, 30],
                    [60, 15, 30],
                    [60, 15, 30],
                    // fire/ice/thunder
                    [15, 15, 30],
                    [30, 15, 30],
                    [5, 15, 30],
                    // water/earth/wind
                    [10, 15, 30],
                    [60, 15, 30],
                    [30, 15, 30],
                    // light/dark
                    [30, 15, 30],
                    [30, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [40, 0, 50],
                    // mmp-debuff
                    [40, 0, 50],
                    // atk-debuff
                    [40, 0, 50],
                    // def-debuff
                    [40, 0, 50],
                    // mat-debuff
                    [40, 0, 50],
                    // mdf-debuff
                    [40, 0, 50],
                    // agi-debuff
                    [40, 0, 50],
                    // luk-debuff
                    [40, 0, 50],
                    // death
                    [20, 0, 50],
                    // berserk
                    [20, 0, 50],
                    // confuse
                    [20, 0, 50],
                    // temptation
                    [20, 0, 50],
                    // silent
                    [20, 0, 50],
                    // phantom
                    [20, 0, 50],
                    // paralyze
                    [20, 0, 50],
                    // poison
                    [20, 0, 50],
                    // deadly-poison
                    [20, 0, 50],
                    // magical-poison
                    [20, 0, 50],
                    // sleep
                    [20, 0, 50],
                    // mp-doublecost
                    [20, 0, 50],
                    // vulnerable
                    [20, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [10],
                    // confuse+
                    [10],
                    // temptation+
                    [10],
                    // silent+
                    [10],
                    // phantom+
                    [10],
                    // paralyze+
                    [10],
                    // poison+
                    [10],
                    // deadly-poison+
                    [10],
                    // magical-poison+
                    [10],
                    // sleep+
                    [10],
                    // mp-doublecost+
                    [10],
                    // vulnerable+
                    [10],
                    // reduce-encounter
                    [10],
                    // disable-encounter
                    [5],
                    // disable-ambush
                    [20],
                    // double-preemptive
                    [25],
                    // double-gold
                    [20],
                    // double-drop
                    [10]
                ]
            },
        ]
    },
    {
        rank: 3,
        materials: [
            {
                id: 12,
                name: "炎",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mdf+, mdf++
                    [10, 5, 10],
                    [5, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // evd+, evd-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 15, 30],
                    [50, 15, 30],
                    [50, 15, 30],
                    // fire/ice/thunder
                    [100, 15, 30],
                    [50, 15, 30],
                    [20, 15, 30],
                    // water/earth/wind
                    [0, 15, 30],
                    [20, 15, 30],
                    [20, 15, 30],
                    // light/dark
                    [20, 15, 30],
                    [20, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [100, 40, 70],
                    [50, 40, 70],
                    [20, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [20, 40, 70],
                    [20, 40, 70],
                    // light+/dark+
                    [20, 40, 70],
                    [20, 40, 70],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 0, 50],
                    // berserk
                    [15, 0, 50],
                    // confuse
                    [15, 0, 50],
                    // temptation
                    [15, 0, 50],
                    // silent
                    [15, 0, 50],
                    // phantom
                    [15, 0, 50],
                    // paralyze
                    [15, 0, 50],
                    // poison
                    [15, 0, 50],
                    // deadly-poison
                    [15, 0, 50],
                    // magical-poison
                    [15, 0, 50],
                    // sleep
                    [15, 0, 50],
                    // mp-doublecost
                    [15, 0, 50],
                    // vulnerable
                    [15, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [10],
                    // double-gold
                    [0],
                    // double-drop
                    [5]
                ]
            },
            {
                id: 13,
                name: "氷",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mdf+, mdf++
                    [10, 5, 10],
                    [5, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // evd+, evd-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 15, 30],
                    [50, 15, 30],
                    [50, 15, 30],
                    // fire/ice/thunder
                    [0, 15, 30],
                    [100, 15, 30],
                    [20, 15, 30],
                    // water/earth/wind
                    [25, 15, 30],
                    [20, 15, 30],
                    [20, 15, 30],
                    // light/dark
                    [20, 15, 30],
                    [20, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [100, 40, 70],
                    [20, 40, 70],
                    // water+/earth+/wind+
                    [25, 40, 70],
                    [20, 40, 70],
                    [20, 40, 70],
                    // light+/dark+
                    [20, 40, 70],
                    [20, 40, 70],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 0, 50],
                    // berserk
                    [15, 0, 50],
                    // confuse
                    [15, 0, 50],
                    // temptation
                    [15, 0, 50],
                    // silent
                    [15, 0, 50],
                    // phantom
                    [15, 0, 50],
                    // paralyze
                    [15, 0, 50],
                    // poison
                    [15, 0, 50],
                    // deadly-poison
                    [15, 0, 50],
                    // magical-poison
                    [15, 0, 50],
                    // sleep
                    [15, 0, 50],
                    // mp-doublecost
                    [15, 0, 50],
                    // vulnerable
                    [15, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [10],
                    // double-gold
                    [0],
                    // double-drop
                    [5]
                ]
            },
            {
                id: 14,
                name: "雷",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mdf+, mdf++
                    [10, 5, 10],
                    [5, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // evd+, evd-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 15, 30],
                    [50, 15, 30],
                    [50, 15, 30],
                    // fire/ice/thunder
                    [25, 40, 70],
                    [25, 40, 70],
                    [100, 40, 70],
                    // water/earth/wind
                    [25, 15, 30],
                    [20, 15, 30],
                    [20, 15, 30],
                    // light/dark
                    [20, 15, 30],
                    [20, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [25, 40, 70],
                    [25, 40, 70],
                    [100, 40, 70],
                    // water+/earth+/wind+
                    [25, 40, 70],
                    [20, 40, 70],
                    [20, 40, 70],
                    // light+/dark+
                    [20, 40, 70],
                    [20, 40, 70],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 0, 50],
                    // berserk
                    [15, 0, 50],
                    // confuse
                    [15, 0, 50],
                    // temptation
                    [15, 0, 50],
                    // silent
                    [15, 0, 50],
                    // phantom
                    [15, 0, 50],
                    // paralyze
                    [15, 0, 50],
                    // poison
                    [15, 0, 50],
                    // deadly-poison
                    [15, 0, 50],
                    // magical-poison
                    [15, 0, 50],
                    // sleep
                    [15, 0, 50],
                    // mp-doublecost
                    [15, 0, 50],
                    // vulnerable
                    [15, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [10],
                    // double-gold
                    [0],
                    // double-drop
                    [5]
                ]
            },
            {
                id: 15,
                name: "水",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mdf+, mdf++
                    [10, 5, 10],
                    [5, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // evd+, evd-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 15, 30],
                    [50, 15, 30],
                    [50, 15, 30],
                    // fire/ice/thunder
                    [50, 15, 30],
                    [50, 15, 30],
                    [0, 15, 30],
                    // water/earth/wind
                    [100, 15, 30],
                    [20, 15, 30],
                    [20, 15, 30],
                    // light/dark
                    [20, 15, 30],
                    [20, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [50, 40, 70],
                    [50, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [100, 40, 70],
                    [20, 40, 70],
                    [20, 40, 70],
                    // light+/dark+
                    [20, 40, 70],
                    [20, 40, 70],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 0, 50],
                    // berserk
                    [15, 0, 50],
                    // confuse
                    [15, 0, 50],
                    // temptation
                    [15, 0, 50],
                    // silent
                    [15, 0, 50],
                    // phantom
                    [15, 0, 50],
                    // paralyze
                    [15, 0, 50],
                    // poison
                    [15, 0, 50],
                    // deadly-poison
                    [15, 0, 50],
                    // magical-poison
                    [15, 0, 50],
                    // sleep
                    [15, 0, 50],
                    // mp-doublecost
                    [15, 0, 50],
                    // vulnerable
                    [15, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [10],
                    // double-gold
                    [0],
                    // double-drop
                    [5]
                ]
            },
            {
                id: 16,
                name: "土",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mdf+, mdf++
                    [10, 5, 10],
                    [5, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // evd+, evd-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 15, 30],
                    [50, 15, 30],
                    [50, 15, 30],
                    // fire/ice/thunder
                    [50, 15, 30],
                    [50, 15, 30],
                    [50, 15, 30],
                    // water/earth/wind
                    [25, 15, 30],
                    [25, 15, 30],
                    [100, 15, 30],
                    // light/dark
                    [20, 15, 30],
                    [20, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [25, 40, 70],
                    [25, 40, 70],
                    [25, 40, 70],
                    // water+/earth+/wind+
                    [25, 40, 70],
                    [100, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [20, 40, 70],
                    [20, 40, 70],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 0, 50],
                    // berserk
                    [15, 0, 50],
                    // confuse
                    [15, 0, 50],
                    // temptation
                    [15, 0, 50],
                    // silent
                    [15, 0, 50],
                    // phantom
                    [15, 0, 50],
                    // paralyze
                    [15, 0, 50],
                    // poison
                    [15, 0, 50],
                    // deadly-poison
                    [15, 0, 50],
                    // magical-poison
                    [15, 0, 50],
                    // sleep
                    [15, 0, 50],
                    // mp-doublecost
                    [15, 0, 50],
                    // vulnerable
                    [15, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [10],
                    // double-gold
                    [0],
                    // double-drop
                    [5]
                ]
            },
            {
                id: 17,
                name: "風",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mdf+, mdf++
                    [10, 5, 10],
                    [5, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // evd+, evd-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 15, 30],
                    [50, 15, 30],
                    [50, 15, 30],
                    // fire/ice/thunder
                    [25, 15, 30],
                    [25, 15, 30],
                    [25, 15, 30],
                    // water/earth/wind
                    [25, 15, 30],
                    [0, 15, 30],
                    [100, 15, 30],
                    // light/dark
                    [20, 15, 30],
                    [20, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [25, 40, 70],
                    [25, 40, 70],
                    [25, 40, 70],
                    // water+/earth+/wind+
                    [25, 40, 70],
                    [0, 40, 70],
                    [100, 40, 70],
                    // light+/dark+
                    [20, 40, 70],
                    [20, 40, 70],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 0, 50],
                    // berserk
                    [15, 0, 50],
                    // confuse
                    [15, 0, 50],
                    // temptation
                    [15, 0, 50],
                    // silent
                    [15, 0, 50],
                    // phantom
                    [15, 0, 50],
                    // paralyze
                    [15, 0, 50],
                    // poison
                    [15, 0, 50],
                    // deadly-poison
                    [15, 0, 50],
                    // magical-poison
                    [15, 0, 50],
                    // sleep
                    [15, 0, 50],
                    // mp-doublecost
                    [15, 0, 50],
                    // vulnerable
                    [15, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [10],
                    // double-gold
                    [0],
                    // double-drop
                    [5]
                ]
            },
            {
                id: 18,
                name: "光",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mdf+, mdf++
                    [10, 5, 10],
                    [5, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // evd+, evd-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 15, 30],
                    [50, 15, 30],
                    [50, 15, 30],
                    // fire/ice/thunder
                    [25, 15, 30],
                    [25, 15, 30],
                    [25, 15, 30],
                    // water/earth/wind
                    [25, 15, 30],
                    [25, 15, 30],
                    [25, 15, 30],
                    // light/dark
                    [100, 15, 30],
                    [0, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [25, 40, 70],
                    [25, 40, 70],
                    [25, 40, 70],
                    // water+/earth+/wind+
                    [25, 40, 70],
                    [25, 40, 70],
                    [25, 40, 70],
                    // light+/dark+
                    [100, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 0, 50],
                    // berserk
                    [15, 0, 50],
                    // confuse
                    [15, 0, 50],
                    // temptation
                    [15, 0, 50],
                    // silent
                    [15, 0, 50],
                    // phantom
                    [15, 0, 50],
                    // paralyze
                    [15, 0, 50],
                    // poison
                    [15, 0, 50],
                    // deadly-poison
                    [15, 0, 50],
                    // magical-poison
                    [15, 0, 50],
                    // sleep
                    [15, 0, 50],
                    // mp-doublecost
                    [15, 0, 50],
                    // vulnerable
                    [15, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [10],
                    // double-gold
                    [0],
                    // double-drop
                    [5]
                ]
            },
            {
                id: 19,
                name: "闇",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 5, 10],
                    [5, 11, 25],
                    // mdf+, mdf++
                    [10, 5, 10],
                    [5, 11, 25],
                    // agi-, agi--
                    [5, -10, -5],
                    [0, -25, -11],
                    // luk+, luk-
                    [10, 5, 10],
                    [10, -10, -5],
                    // mhp+, mhp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // mmp+, mmp-
                    [5, 5, 10],
                    [5, -10, -5],
                    // hrt+, hrt-
                    [10, 5, 10],
                    [0, -10, -5],
                    // evd+, evd-
                    [10, 5, 10],
                    [0, -10, -5],
                    // cri+, cri-
                    [10, 5, 10],
                    [0, -10, -5],
                    // ctr+, ctr-
                    [10, 5, 10],
                    [0, -10, -5],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 15, 30],
                    [50, 15, 30],
                    [50, 15, 30],
                    // fire/ice/thunder
                    [25, 15, 30],
                    [25, 15, 30],
                    [25, 15, 30],
                    // water/earth/wind
                    [25, 15, 30],
                    [25, 15, 30],
                    [25, 15, 30],
                    // light/dark
                    [0, 15, 30],
                    [100, 15, 30],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [25, 40, 70],
                    [25, 40, 70],
                    [25, 40, 70],
                    // water+/earth+/wind+
                    [25, 40, 70],
                    [25, 40, 70],
                    [25, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [100, 40, 70],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 0, 50],
                    // berserk
                    [15, 0, 50],
                    // confuse
                    [15, 0, 50],
                    // temptation
                    [15, 0, 50],
                    // silent
                    [15, 0, 50],
                    // phantom
                    [15, 0, 50],
                    // paralyze
                    [15, 0, 50],
                    // poison
                    [15, 0, 50],
                    // deadly-poison
                    [15, 0, 50],
                    // magical-poison
                    [15, 0, 50],
                    // sleep
                    [15, 0, 50],
                    // mp-doublecost
                    [15, 0, 50],
                    // vulnerable
                    [15, 0, 50],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [10],
                    // double-gold
                    [0],
                    // double-drop
                    [5]
                ]
            },
        ]
    }
];

/**
 * アクセサリー材質定数オブジェクト
 * 
 * rank: ランク
 * materials: 材質。
 *     id: ID。
 *     name: 材質名。
 *     traits: 特徴追加発生率と発生時の追加値範囲。
 */
const ACCESORY_MATERIALS = [
    {
        rank: 0,
        materials: [
            {
                id: 1,
                name: "革",
                price: 50,
                traits: [
                    // def+, def++
                    [5, 2, 5],
                    [0, 5, 10],
                    // mdf+, mdf++
                    [0, 2, 5],
                    [0, 5, 10],
                    // agi-, agi--
                    [10, -5, -2],
                    [5, -10, -5],
                    // luk+, luk-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [5, 2, 5],
                    [5, -5, -2],
                    // evd+, evd-
                    [5, 2, 5],
                    [5, -5, -2],
                    // cri+, cri-
                    [5, 2, 5],
                    [5, -5, -2],
                    // ctr+, ctr-
                    [5, 2, 5],
                    [5, -5, -2],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [20, 5, 10],
                    [20, 5, 10],
                    [40, 5, 10],
                    // fire/ice/thunder
                    [0, 5, 10],
                    [10, 5, 10],
                    [10, 5, 10],
                    // water/earth/wind
                    [0, 5, 10],
                    [20, 5, 10],
                    [20, 5, 10],
                    // light/dark
                    [20, 5, 10],
                    [20, 5, 10],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [10, 0, 50],
                    // mmp-debuff
                    [10, 0, 50],
                    // atk-debuff
                    [10, 0, 50],
                    // def-debuff
                    [10, 0, 50],
                    // mat-debuff
                    [10, 0, 50],
                    // mdf-debuff
                    [10, 0, 50],
                    // agi-debuff
                    [10, 0, 50],
                    // luk-debuff
                    [10, 0, 50],
                    // death
                    [0, 40, 80],
                    // berserk
                    [0, 40, 80],
                    // confuse
                    [0, 40, 80],
                    // temptation
                    [0, 40, 80],
                    // silent
                    [0, 40, 80],
                    // phantom
                    [0, 40, 80],
                    // paralyze
                    [0, 40, 80],
                    // poison
                    [0, 40, 80],
                    // deadly-poison
                    [0, 40, 80],
                    // magical-poison
                    [0, 40, 80],
                    // sleep
                    [0, 40, 80],
                    // mp-doublecost
                    [0, 40, 80],
                    // vulnerable
                    [0, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0],
                    // trt+, trt-
                    [0, 20, 40],
                    [0, -40, -20],
                    // pha
                    [0, 150, 250],
                    // mp-save
                    [0, 25, 80],
                    // tpc+, tpc-
                    [5, -30, -20],
                    [10, 10, 20],
                    // fdm, exr
                    [0, 60, 100],
                    [0, 150, 250]
                ]
            },
            {
                id: 2,
                name: "木",
                price: 50,
                traits: [
                    // def+, def++
                    [5, 2, 5],
                    [0, 5, 10],
                    // mdf+, mdf++
                    [0, 2, 5],
                    [0, 5, 10],
                    // agi-, agi--
                    [10, -5, -2],
                    [5, -10, -5],
                    // luk+, luk-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [5, 2, 5],
                    [5, -5, -2],
                    // evd+, evd-
                    [5, 2, 5],
                    [5, -5, -2],
                    // cri+, cri-
                    [5, 2, 5],
                    [5, -5, -2],
                    // ctr+, ctr-
                    [5, 2, 5],
                    [5, -5, -2],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [20, 5, 10],
                    [20, 5, 10],
                    [40, 5, 10],
                    // fire/ice/thunder
                    [0, 5, 10],
                    [10, 5, 10],
                    [10, 5, 10],
                    // water/earth/wind
                    [0, 5, 10],
                    [20, 5, 10],
                    [20, 5, 10],
                    // light/dark
                    [20, 5, 10],
                    [20, 5, 10],
                    // slash+/pen+/bash+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // fire+/ice+/thunder+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // water+/earth+/wind+
                    [0, 40, 70],
                    [0, 40, 70],
                    [0, 40, 70],
                    // light+/dark+
                    [0, 40, 70],
                    [0, 40, 70],
                    // mhp-debuff
                    [10, 0, 50],
                    // mmp-debuff
                    [10, 0, 50],
                    // atk-debuff
                    [10, 0, 50],
                    // def-debuff
                    [10, 0, 50],
                    // mat-debuff
                    [10, 0, 50],
                    // mdf-debuff
                    [10, 0, 50],
                    // agi-debuff
                    [10, 0, 50],
                    // luk-debuff
                    [10, 0, 50],
                    // death
                    [0, 40, 80],
                    // berserk
                    [0, 40, 80],
                    // confuse
                    [0, 40, 80],
                    // temptation
                    [0, 40, 80],
                    // silent
                    [0, 40, 80],
                    // phantom
                    [0, 40, 80],
                    // paralyze
                    [0, 40, 80],
                    // poison
                    [0, 40, 80],
                    // deadly-poison
                    [0, 40, 80],
                    // magical-poison
                    [0, 40, 80],
                    // sleep
                    [0, 40, 80],
                    // mp-doublecost
                    [0, 40, 80],
                    // vulnerable
                    [0, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0],
                    // trt+, trt-
                    [0, 20, 40],
                    [0, -40, -20],
                    // pha
                    [0, 150, 250],
                    // mp-save
                    [0, 25, 80],
                    // tpc+, tpc-
                    [5, -30, -20],
                    [10, 10, 20],
                    // fdm, exr
                    [0, 60, 100],
                    [0, 150, 250]
                ]
            },
            {
                id: 3,
                name: "石",
                price: 50,
                traits: [
                    // def+, def++
                    [5, 2, 5],
                    [0, 5, 10],
                    // mdf+, mdf++
                    [0, 2, 5],
                    [0, 5, 10],
                    // agi-, agi--
                    [10, -5, -2],
                    [5, -10, -5],
                    // luk+, luk-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [5, 2, 5],
                    [5, -5, -2],
                    // evd+, evd-
                    [5, 2, 5],
                    [5, -5, -2],
                    // cri+, cri-
                    [5, 2, 5],
                    [5, -5, -2],
                    // ctr+, ctr-
                    [5, 2, 5],
                    [5, -5, -2],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [40, 5, 10],
                    [40, 5, 10],
                    [5, 5, 10],
                    // fire/ice/thunder
                    [40, 5, 10],
                    [10, 5, 10],
                    [10, 5, 10],
                    // water/earth/wind
                    [10, 5, 10],
                    [40, 5, 10],
                    [20, 5, 10],
                    // light/dark
                    [20, 5, 10],
                    [20, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // water+/earth+/wind+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // light+/dark+
                    [0, 15, 25],
                    [0, 15, 25],
                    // mhp-debuff
                    [10, 0, 50],
                    // mmp-debuff
                    [10, 0, 50],
                    // atk-debuff
                    [10, 0, 50],
                    // def-debuff
                    [10, 0, 50],
                    // mat-debuff
                    [10, 0, 50],
                    // mdf-debuff
                    [10, 0, 50],
                    // agi-debuff
                    [10, 0, 50],
                    // luk-debuff
                    [10, 0, 50],
                    // death
                    [0, 40, 80],
                    // berserk
                    [0, 40, 80],
                    // confuse
                    [0, 40, 80],
                    // temptation
                    [0, 40, 80],
                    // silent
                    [0, 40, 80],
                    // phantom
                    [0, 40, 80],
                    // paralyze
                    [0, 40, 80],
                    // poison
                    [0, 40, 80],
                    // deadly-poison
                    [0, 40, 80],
                    // magical-poison
                    [0, 40, 80],
                    // sleep
                    [0, 40, 80],
                    // mp-doublecost
                    [0, 40, 80],
                    // vulnerable
                    [0, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0],
                    // trt+, trt-
                    [0, 20, 40],
                    [0, -40, -20],
                    // pha
                    [0, 150, 250],
                    // mp-save
                    [0, 25, 80],
                    // tpc+, tpc-
                    [5, -30, -20],
                    [10, 10, 20],
                    // fdm, exr
                    [0, 60, 100],
                    [0, 150, 250]
                ]
            },
            {
                id: 4,
                name: "銅",
                price: 100,
                traits: [
                    // def+, def++
                    [5, 2, 5],
                    [0, 5, 10],
                    // mdf+, mdf++
                    [0, 2, 5],
                    [0, 5, 10],
                    // agi-, agi--
                    [10, -5, -2],
                    [5, -10, -5],
                    // luk+, luk-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [5, 2, 5],
                    [5, -5, -2],
                    // evd+, evd-
                    [5, 2, 5],
                    [5, -5, -2],
                    // cri+, cri-
                    [5, 2, 5],
                    [5, -5, -2],
                    // ctr+, ctr-
                    [5, 2, 5],
                    [5, -5, -2],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [40, 5, 10],
                    [40, 5, 10],
                    [40, 5, 10],
                    // fire/ice/thunder
                    [10, 5, 10],
                    [20, 5, 10],
                    [5, 5, 10],
                    // water/earth/wind
                    [10, 5, 10],
                    [40, 5, 10],
                    [20, 5, 10],
                    // light/dark
                    [20, 5, 10],
                    [20, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // water+/earth+/wind+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // light+/dark+
                    [0, 15, 25],
                    [0, 15, 25],
                    // mhp-debuff
                    [10, 0, 50],
                    // mmp-debuff
                    [10, 0, 50],
                    // atk-debuff
                    [10, 0, 50],
                    // def-debuff
                    [10, 0, 50],
                    // mat-debuff
                    [10, 0, 50],
                    // mdf-debuff
                    [10, 0, 50],
                    // agi-debuff
                    [10, 0, 50],
                    // luk-debuff
                    [10, 0, 50],
                    // death
                    [0, 40, 80],
                    // berserk
                    [0, 40, 80],
                    // confuse
                    [0, 40, 80],
                    // temptation
                    [0, 40, 80],
                    // silent
                    [0, 40, 80],
                    // phantom
                    [0, 40, 80],
                    // paralyze
                    [0, 40, 80],
                    // poison
                    [0, 40, 80],
                    // deadly-poison
                    [0, 40, 80],
                    // magical-poison
                    [0, 40, 80],
                    // sleep
                    [0, 40, 80],
                    // mp-doublecost
                    [0, 40, 80],
                    // vulnerable
                    [0, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0],
                    // trt+, trt-
                    [0, 20, 40],
                    [0, -40, -20],
                    // pha
                    [0, 150, 250],
                    // mp-save
                    [0, 25, 80],
                    // tpc+, tpc-
                    [5, -30, -20],
                    [10, 10, 20],
                    // fdm, exr
                    [0, 60, 100],
                    [0, 150, 250]
                ]
            }
        ]
    },
    {
        rank: 1,
        materials: [
            {
                id: 5,
                name: "鉄",
                price: 300,
                traits: [
                    // def+, def++
                    [5, 2, 5],
                    [0, 5, 10],
                    // mdf+, mdf++
                    [0, 2, 5],
                    [0, 5, 10],
                    // agi-, agi--
                    [10, -5, -2],
                    [5, -10, -5],
                    // luk+, luk-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [5, 2, 5],
                    [5, -5, -2],
                    // evd+, evd-
                    [5, 2, 5],
                    [5, -5, -2],
                    // cri+, cri-
                    [5, 2, 5],
                    [5, -5, -2],
                    // ctr+, ctr-
                    [5, 2, 5],
                    [5, -5, -2],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [40, 5, 10],
                    [40, 5, 10],
                    [40, 5, 10],
                    // fire/ice/thunder
                    [10, 5, 10],
                    [20, 5, 10],
                    [5, 5, 10],
                    // water/earth/wind
                    [10, 5, 10],
                    [40, 5, 10],
                    [20, 5, 10],
                    // light/dark
                    [20, 5, 10],
                    [20, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // water+/earth+/wind+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // light+/dark+
                    [0, 15, 25],
                    [0, 15, 25],
                    // mhp-debuff
                    [10, 0, 50],
                    // mmp-debuff
                    [10, 0, 50],
                    // atk-debuff
                    [10, 0, 50],
                    // def-debuff
                    [10, 0, 50],
                    // mat-debuff
                    [10, 0, 50],
                    // mdf-debuff
                    [10, 0, 50],
                    // agi-debuff
                    [10, 0, 50],
                    // luk-debuff
                    [10, 0, 50],
                    // death
                    [0, 40, 80],
                    // berserk
                    [0, 40, 80],
                    // confuse
                    [0, 40, 80],
                    // temptation
                    [0, 40, 80],
                    // silent
                    [0, 40, 80],
                    // phantom
                    [0, 40, 80],
                    // paralyze
                    [0, 40, 80],
                    // poison
                    [0, 40, 80],
                    // deadly-poison
                    [0, 40, 80],
                    // magical-poison
                    [0, 40, 80],
                    // sleep
                    [0, 40, 80],
                    // mp-doublecost
                    [0, 40, 80],
                    // vulnerable
                    [0, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0],
                    // trt+, trt-
                    [0, 20, 40],
                    [0, -40, -20],
                    // pha
                    [0, 150, 250],
                    // mp-save
                    [0, 25, 80],
                    // tpc+, tpc-
                    [10, -30, -20],
                    [5, 10, 20],
                    // fdm, exr
                    [0, 60, 100],
                    [0, 150, 250]
                ]
            },
            {
                id: 6,
                name: "鋼鉄",
                price: 500,
                traits: [
                    // def+, def++
                    [5, 2, 5],
                    [0, 5, 10],
                    // mdf+, mdf++
                    [0, 2, 5],
                    [0, 5, 10],
                    // agi-, agi--
                    [10, -5, -2],
                    [5, -10, -5],
                    // luk+, luk-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [5, 2, 5],
                    [5, -5, -2],
                    // evd+, evd-
                    [5, 2, 5],
                    [5, -5, -2],
                    // cri+, cri-
                    [5, 2, 5],
                    [5, -5, -2],
                    // ctr+, ctr-
                    [5, 2, 5],
                    [5, -5, -2],
                    // additional
                    [5],
                    [5],
                    // slash/pen/bash
                    [40, 5, 10],
                    [40, 5, 10],
                    [40, 5, 10],
                    // fire/ice/thunder
                    [10, 5, 10],
                    [20, 5, 10],
                    [5, 5, 10],
                    // water/earth/wind
                    [10, 5, 10],
                    [40, 5, 10],
                    [20, 5, 10],
                    // light/dark
                    [20, 5, 10],
                    [20, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // water+/earth+/wind+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // light+/dark+
                    [0, 15, 25],
                    [0, 15, 25],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // luk-debuff
                    [20, 0, 50],
                    // death
                    [0, 40, 80],
                    // berserk
                    [0, 40, 80],
                    // confuse
                    [0, 40, 80],
                    // temptation
                    [0, 40, 80],
                    // silent
                    [0, 40, 80],
                    // phantom
                    [0, 40, 80],
                    // paralyze
                    [0, 40, 80],
                    // poison
                    [0, 40, 80],
                    // deadly-poison
                    [0, 40, 80],
                    // magical-poison
                    [0, 40, 80],
                    // sleep
                    [0, 40, 80],
                    // mp-doublecost
                    [0, 40, 80],
                    // vulnerable
                    [0, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [0],
                    // confuse+
                    [0],
                    // temptation+
                    [0],
                    // silent+
                    [0],
                    // phantom+
                    [0],
                    // paralyze+
                    [0],
                    // poison+
                    [0],
                    // deadly-poison+
                    [0],
                    // magical-poison+
                    [0],
                    // sleep+
                    [0],
                    // mp-doublecost+
                    [0],
                    // vulnerable+
                    [0],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [0],
                    // double-gold
                    [0],
                    // double-drop
                    [0],
                    // trt+, trt-
                    [0, 20, 40],
                    [0, -40, -20],
                    // pha
                    [0, 150, 250],
                    // mp-save
                    [0, 25, 80],
                    // tpc+, tpc-
                    [15, -30, -20],
                    [10, 10, 20],
                    // fdm, exr
                    [0, 60, 100],
                    [0, 150, 250]
                ]
            },
            {
                id: 7,
                name: "銀",
                price: 1000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [5, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [5, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [40, 5, 10],
                    [40, 5, 10],
                    [40, 5, 10],
                    // fire/ice/thunder
                    [10, 5, 10],
                    [20, 5, 10],
                    [5, 5, 10],
                    // water/earth/wind
                    [10, 5, 10],
                    [40, 5, 10],
                    [20, 5, 10],
                    // light/dark
                    [20, 5, 10],
                    [20, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // water+/earth+/wind+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // light+/dark+
                    [0, 15, 25],
                    [0, 15, 25],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // luk-debuff
                    [20, 0, 50],
                    // death
                    [5, 40, 80],
                    // berserk
                    [5, 40, 80],
                    // confuse
                    [5, 40, 80],
                    // temptation
                    [5, 40, 80],
                    // silent
                    [5, 40, 80],
                    // phantom
                    [5, 40, 80],
                    // paralyze
                    [5, 40, 80],
                    // poison
                    [5, 40, 80],
                    // deadly-poison
                    [5, 40, 80],
                    // magical-poison
                    [5, 40, 80],
                    // sleep
                    [5, 40, 80],
                    // mp-doublecost
                    [5, 40, 80],
                    // vulnerable
                    [5, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [5],
                    // confuse+
                    [5],
                    // temptation+
                    [5],
                    // silent+
                    [5],
                    // phantom+
                    [5],
                    // paralyze+
                    [5],
                    // poison+
                    [5],
                    // deadly-poison+
                    [5],
                    // magical-poison+
                    [5],
                    // sleep+
                    [5],
                    // mp-doublecost+
                    [5],
                    // vulnerable+
                    [5],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [5],
                    // double-gold
                    [20],
                    // double-drop
                    [10],
                    // trt+, trt-
                    [0, 20, 40],
                    [0, -40, -20],
                    // pha
                    [0, 150, 250],
                    // mp-save
                    [0, 25, 80],
                    // tpc+, tpc-
                    [10, -30, -20],
                    [5, 10, 20],
                    // fdm, exr
                    [0, 60, 100],
                    [40, 150, 250]
                ]
            },
        ]
    },
    {
        rank: 2,
        materials: [
            {
                id: 8,
                name: "金",
                price: 3500,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [0, 2, 5],
                    [0, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [60, 5, 10],
                    [60, 5, 10],
                    [60, 5, 10],
                    // fire/ice/thunder
                    [15, 5, 10],
                    [30, 5, 10],
                    [5, 5, 10],
                    // water/earth/wind
                    [10, 5, 10],
                    [60, 5, 10],
                    [30, 5, 10],
                    // light/dark
                    [30, 5, 10],
                    [30, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // water+/earth+/wind+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // light+/dark+
                    [0, 15, 25],
                    [0, 15, 25],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // luk-debuff
                    [20, 0, 50],
                    // death
                    [5, 40, 80],
                    // berserk
                    [5, 40, 80],
                    // confuse
                    [5, 40, 80],
                    // temptation
                    [5, 40, 80],
                    // silent
                    [5, 40, 80],
                    // phantom
                    [5, 40, 80],
                    // paralyze
                    [5, 40, 80],
                    // poison
                    [5, 40, 80],
                    // deadly-poison
                    [5, 40, 80],
                    // magical-poison
                    [5, 40, 80],
                    // sleep
                    [5, 40, 80],
                    // mp-doublecost
                    [5, 40, 80],
                    // vulnerable
                    [5, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [5],
                    // confuse+
                    [5],
                    // temptation+
                    [5],
                    // silent+
                    [5],
                    // phantom+
                    [5],
                    // paralyze+
                    [5],
                    // poison+
                    [5],
                    // deadly-poison+
                    [5],
                    // magical-poison+
                    [5],
                    // sleep+
                    [5],
                    // mp-doublecost+
                    [5],
                    // vulnerable+
                    [5],
                    // reduce-encounter
                    [0],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [0],
                    // double-preemptive
                    [5],
                    // double-gold
                    [40],
                    // double-drop
                    [20],
                    // trt+, trt-
                    [0, 20, 40],
                    [0, -40, -20],
                    // pha
                    [10, 150, 250],
                    // mp-save
                    [5, 25, 80],
                    // tpc+, tpc-
                    [10, -30, -20],
                    [5, 10, 20],
                    // fdm, exr
                    [0, 60, 100],
                    [0, 150, 250]
                ]
            },
            {
                id: 9,
                name: "プラチナ",
                price: 6000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [0, 2, 5],
                    [0, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mhp+, mhp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // mmp+, mmp-
                    [0, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [60, 5, 10],
                    [60, 5, 10],
                    [60, 5, 10],
                    // fire/ice/thunder
                    [15, 5, 10],
                    [30, 5, 10],
                    [5, 5, 10],
                    // water/earth/wind
                    [10, 5, 10],
                    [60, 5, 10],
                    [30, 5, 10],
                    // light/dark
                    [30, 5, 10],
                    [30, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // water+/earth+/wind+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // luk-debuff
                    [20, 0, 50],
                    // death
                    [5, 40, 80],
                    // berserk
                    [5, 40, 80],
                    // confuse
                    [5, 40, 80],
                    // temptation
                    [5, 40, 80],
                    // silent
                    [5, 40, 80],
                    // phantom
                    [5, 40, 80],
                    // paralyze
                    [5, 40, 80],
                    // poison
                    [5, 40, 80],
                    // deadly-poison
                    [5, 40, 80],
                    // magical-poison
                    [5, 40, 80],
                    // sleep
                    [5, 40, 80],
                    // mp-doublecost
                    [5, 40, 80],
                    // vulnerable
                    [5, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [5],
                    // confuse+
                    [5],
                    // temptation+
                    [5],
                    // silent+
                    [5],
                    // phantom+
                    [5],
                    // paralyze+
                    [5],
                    // poison+
                    [5],
                    // deadly-poison+
                    [5],
                    // magical-poison+
                    [5],
                    // sleep+
                    [5],
                    // mp-doublecost+
                    [5],
                    // vulnerable+
                    [5],
                    // reduce-encounter
                    [10],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [10],
                    // double-preemptive
                    [15],
                    // double-gold
                    [60],
                    // double-drop
                    [30],
                    // trt+, trt-
                    [10, 20, 40],
                    [0, -40, -20],
                    // pha
                    [15, 150, 250],
                    // mp-save
                    [5, 25, 80],
                    // tpc+, tpc-
                    [10, -30, -20],
                    [5, 10, 20],
                    // fdm, exr
                    [10, 60, 100],
                    [0, 150, 250]
                ]
            },
            {
                id: 10,
                name: "ダイヤ",
                price: 10000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [5, 5, 10],
                    // agi-, agi--
                    [0, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [5, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [60, 5, 10],
                    [60, 5, 10],
                    [60, 5, 10],
                    // fire/ice/thunder
                    [15, 5, 10],
                    [30, 5, 10],
                    [5, 5, 10],
                    // water/earth/wind
                    [10, 5, 10],
                    [60, 5, 10],
                    [30, 5, 10],
                    // light/dark
                    [30, 5, 10],
                    [30, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // water+/earth+/wind+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // light+/dark+
                    [0, 15, 25],
                    [0, 15, 25],
                    // mhp-debuff
                    [20, 0, 50],
                    // mmp-debuff
                    [20, 0, 50],
                    // atk-debuff
                    [20, 0, 50],
                    // def-debuff
                    [20, 0, 50],
                    // mat-debuff
                    [20, 0, 50],
                    // mdf-debuff
                    [20, 0, 50],
                    // agi-debuff
                    [20, 0, 50],
                    // luk-debuff
                    [20, 0, 50],
                    // death
                    [10, 40, 80],
                    // berserk
                    [10, 40, 80],
                    // confuse
                    [10, 40, 80],
                    // temptation
                    [10, 40, 80],
                    // silent
                    [10, 40, 80],
                    // phantom
                    [10, 40, 80],
                    // paralyze
                    [10, 40, 80],
                    // poison
                    [10, 40, 80],
                    // deadly-poison
                    [10, 40, 80],
                    // magical-poison
                    [10, 40, 80],
                    // sleep
                    [10, 40, 80],
                    // mp-doublecost
                    [10, 40, 80],
                    // vulnerable
                    [10, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [10],
                    // confuse+
                    [10],
                    // temptation+
                    [10],
                    // silent+
                    [10],
                    // phantom+
                    [10],
                    // paralyze+
                    [10],
                    // poison+
                    [10],
                    // deadly-poison+
                    [10],
                    // magical-poison+
                    [10],
                    // sleep+
                    [10],
                    // mp-doublecost+
                    [10],
                    // vulnerable+
                    [10],
                    // reduce-encounter
                    [15],
                    // disable-encounter
                    [5],
                    // disable-ambush
                    [15],
                    // double-preemptive
                    [20],
                    // double-gold
                    [40],
                    // double-drop
                    [20],
                    // trt+, trt-
                    [15, 20, 40],
                    [5, -40, -20],
                    // pha
                    [20, 150, 250],
                    // mp-save
                    [10, 25, 80],
                    // tpc+, tpc-
                    [15, -30, -20],
                    [0, 10, 20],
                    // fdm, exr
                    [10, 60, 100],
                    [20, 150, 250]
                ]
            },
            {
                id: 11,
                name: "クリスタル",
                price: 20000,
                traits: [
                    // def+, def++
                    [15, 2, 5],
                    [10, 5, 10],
                    // mdf+, mdf++
                    [15, 2, 5],
                    [10, 5, 10],
                    // agi-, agi--
                    [0, -5, -2],
                    [0, -5, -2],
                    // luk+, luk-
                    [15, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mmp+, mmp-
                    [10, 2, 5],
                    [0, -5, -2],
                    // hrt+, hrt-
                    [15, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [15, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [15, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [15, 2, 5],
                    [0, -5, -2],
                    // additional
                    [15],
                    [0],
                    // slash/pen/bash
                    [60, 5, 10],
                    [60, 5, 10],
                    [60, 5, 10],
                    // fire/ice/thunder
                    [15, 5, 10],
                    [30, 5, 10],
                    [5, 5, 10],
                    // water/earth/wind
                    [10, 5, 10],
                    [60, 5, 10],
                    [30, 5, 10],
                    // light/dark
                    [30, 5, 10],
                    [30, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // water+/earth+/wind+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // light+/dark+
                    [0, 15, 25],
                    [0, 15, 25],
                    // mhp-debuff
                    [40, 0, 50],
                    // mmp-debuff
                    [40, 0, 50],
                    // atk-debuff
                    [40, 0, 50],
                    // def-debuff
                    [40, 0, 50],
                    // mat-debuff
                    [40, 0, 50],
                    // mdf-debuff
                    [40, 0, 50],
                    // agi-debuff
                    [40, 0, 50],
                    // luk-debuff
                    [40, 0, 50],
                    // death
                    [20, 40, 80],
                    // berserk
                    [20, 40, 80],
                    // confuse
                    [20, 40, 80],
                    // temptation
                    [20, 40, 80],
                    // silent
                    [20, 40, 80],
                    // phantom
                    [20, 40, 80],
                    // paralyze
                    [20, 40, 80],
                    // poison
                    [20, 40, 80],
                    // deadly-poison
                    [20, 40, 80],
                    // magical-poison
                    [20, 40, 80],
                    // sleep
                    [20, 40, 80],
                    // mp-doublecost
                    [20, 40, 80],
                    // vulnerable
                    [20, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [10],
                    // confuse+
                    [10],
                    // temptation+
                    [10],
                    // silent+
                    [10],
                    // phantom+
                    [10],
                    // paralyze+
                    [10],
                    // poison+
                    [10],
                    // deadly-poison+
                    [10],
                    // magical-poison+
                    [10],
                    // sleep+
                    [10],
                    // mp-doublecost+
                    [10],
                    // vulnerable+
                    [10],
                    // reduce-encounter
                    [20],
                    // disable-encounter
                    [10],
                    // disable-ambush
                    [20],
                    // double-preemptive
                    [25],
                    // double-gold
                    [20],
                    // double-drop
                    [10],
                    // trt+, trt-
                    [20, 20, 40],
                    [10, -40, -20],
                    // pha
                    [25, 150, 250],
                    // mp-save
                    [15, 25, 80],
                    // tpc+, tpc-
                    [20, -30, -20],
                    [0, 10, 20],
                    // fdm, exr
                    [10, 60, 100],
                    [10, 150, 250]
                ]
            },
        ]
    },
    {
        rank: 3,
        materials: [
            {
                id: 12,
                name: "炎",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [5, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 5, 10],
                    [50, 5, 10],
                    [50, 5, 10],
                    // fire/ice/thunder
                    [100, 5, 10],
                    [50, 5, 10],
                    [20, 5, 10],
                    // water/earth/wind
                    [0, 5, 10],
                    [20, 5, 10],
                    [20, 5, 10],
                    // light/dark
                    [20, 5, 10],
                    [20, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [100, 15, 25],
                    [50, 15, 25],
                    [20, 15, 25],
                    // water+/earth+/wind+
                    [0, 15, 25],
                    [20, 15, 25],
                    [20, 15, 25],
                    // light+/dark+
                    [20, 15, 25],
                    [20, 15, 25],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 40, 80],
                    // berserk
                    [15, 40, 80],
                    // confuse
                    [15, 40, 80],
                    // temptation
                    [15, 40, 80],
                    // silent
                    [15, 40, 80],
                    // phantom
                    [15, 40, 80],
                    // paralyze
                    [15, 40, 80],
                    // poison
                    [15, 40, 80],
                    // deadly-poison
                    [15, 40, 80],
                    // magical-poison
                    [15, 40, 80],
                    // sleep
                    [15, 40, 80],
                    // mp-doublecost
                    [15, 40, 80],
                    // vulnerable
                    [15, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [10],
                    // double-gold
                    [0],
                    // double-drop
                    [5],
                    // trt+, trt-
                    [5, 20, 40],
                    [0, -40, -20],
                    // pha
                    [10, 150, 250],
                    // mp-save
                    [10, 25, 80],
                    // tpc+, tpc-
                    [10, -30, -20],
                    [0, 10, 20],
                    // fdm, exr
                    [10, 60, 100],
                    [0, 150, 250]
                ]
            },
            {
                id: 13,
                name: "氷",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [5, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 5, 10],
                    [50, 5, 10],
                    [50, 5, 10],
                    // fire/ice/thunder
                    [0, 5, 10],
                    [100, 5, 10],
                    [20, 5, 10],
                    // water/earth/wind
                    [25, 5, 10],
                    [20, 5, 10],
                    [20, 5, 10],
                    // light/dark
                    [20, 5, 10],
                    [20, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [0, 15, 25],
                    [100, 15, 25],
                    [20, 15, 25],
                    // water+/earth+/wind+
                    [25, 15, 25],
                    [20, 15, 25],
                    [20, 15, 25],
                    // light+/dark+
                    [20, 15, 25],
                    [20, 15, 25],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 40, 80],
                    // berserk
                    [15, 40, 80],
                    // confuse
                    [15, 40, 80],
                    // temptation
                    [15, 40, 80],
                    // silent
                    [15, 40, 80],
                    // phantom
                    [15, 40, 80],
                    // paralyze
                    [15, 40, 80],
                    // poison
                    [15, 40, 80],
                    // deadly-poison
                    [15, 40, 80],
                    // magical-poison
                    [15, 40, 80],
                    // sleep
                    [15, 40, 80],
                    // mp-doublecost
                    [15, 40, 80],
                    // vulnerable
                    [15, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [10],
                    // double-gold
                    [0],
                    // double-drop
                    [5],
                    // trt+, trt-
                    [5, 20, 40],
                    [0, -40, -20],
                    // pha
                    [10, 150, 250],
                    // mp-save
                    [10, 25, 80],
                    // tpc+, tpc-
                    [10, -30, -20],
                    [0, 10, 20],
                    // fdm, exr
                    [10, 60, 100],
                    [0, 150, 250]
                ]
            },
            {
                id: 14,
                name: "雷",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [5, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 5, 10],
                    [50, 5, 10],
                    [50, 5, 10],
                    // fire/ice/thunder
                    [25, 5, 10],
                    [25, 5, 10],
                    [100, 5, 10],
                    // water/earth/wind
                    [25, 5, 10],
                    [20, 5, 10],
                    [20, 5, 10],
                    // light/dark
                    [20, 5, 10],
                    [20, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [25, 15, 25],
                    [25, 15, 25],
                    [100, 15, 25],
                    // water+/earth+/wind+
                    [25, 15, 25],
                    [20, 15, 25],
                    [20, 15, 25],
                    // light+/dark+
                    [20, 15, 25],
                    [20, 15, 25],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 40, 80],
                    // berserk
                    [15, 40, 80],
                    // confuse
                    [15, 40, 80],
                    // temptation
                    [15, 40, 80],
                    // silent
                    [15, 40, 80],
                    // phantom
                    [15, 40, 80],
                    // paralyze
                    [15, 40, 80],
                    // poison
                    [15, 40, 80],
                    // deadly-poison
                    [15, 40, 80],
                    // magical-poison
                    [15, 40, 80],
                    // sleep
                    [15, 40, 80],
                    // mp-doublecost
                    [15, 40, 80],
                    // vulnerable
                    [15, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [10],
                    // double-gold
                    [0],
                    // double-drop
                    [5],
                    // trt+, trt-
                    [5, 20, 40],
                    [0, -40, -20],
                    // pha
                    [10, 150, 250],
                    // mp-save
                    [10, 25, 80],
                    // tpc+, tpc-
                    [10, -30, -20],
                    [0, 10, 20],
                    // fdm, exr
                    [10, 60, 100],
                    [0, 150, 250]
                ]
            },
            {
                id: 15,
                name: "水",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [5, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 5, 10],
                    [50, 5, 10],
                    [50, 5, 10],
                    // fire/ice/thunder
                    [50, 5, 10],
                    [50, 5, 10],
                    [0, 5, 10],
                    // water/earth/wind
                    [100, 5, 10],
                    [20, 5, 10],
                    [20, 5, 10],
                    // light/dark
                    [20, 5, 10],
                    [20, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [50, 15, 25],
                    [50, 15, 25],
                    [0, 15, 25],
                    // water+/earth+/wind+
                    [100, 15, 25],
                    [20, 15, 25],
                    [20, 15, 25],
                    // light+/dark+
                    [20, 15, 25],
                    [20, 15, 25],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 40, 80],
                    // berserk
                    [15, 40, 80],
                    // confuse
                    [15, 40, 80],
                    // temptation
                    [15, 40, 80],
                    // silent
                    [15, 40, 80],
                    // phantom
                    [15, 40, 80],
                    // paralyze
                    [15, 40, 80],
                    // poison
                    [15, 40, 80],
                    // deadly-poison
                    [15, 40, 80],
                    // magical-poison
                    [15, 40, 80],
                    // sleep
                    [15, 40, 80],
                    // mp-doublecost
                    [15, 40, 80],
                    // vulnerable
                    [15, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [10],
                    // double-gold
                    [0],
                    // double-drop
                    [5],
                    // trt+, trt-
                    [5, 20, 40],
                    [0, -40, -20],
                    // pha
                    [10, 150, 250],
                    // mp-save
                    [10, 25, 80],
                    // tpc+, tpc-
                    [10, -30, -20],
                    [0, 10, 20],
                    // fdm, exr
                    [10, 60, 100],
                    [0, 150, 250]
                ]
            },
            {
                id: 16,
                name: "土",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [5, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 5, 10],
                    [50, 5, 10],
                    [50, 5, 10],
                    // fire/ice/thunder
                    [50, 5, 10],
                    [50, 5, 10],
                    [50, 5, 10],
                    // water/earth/wind
                    [25, 5, 10],
                    [25, 5, 10],
                    [100, 5, 10],
                    // light/dark
                    [20, 5, 10],
                    [20, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [25, 15, 25],
                    [25, 15, 25],
                    [25, 15, 25],
                    // water+/earth+/wind+
                    [25, 15, 25],
                    [100, 15, 25],
                    [0, 15, 25],
                    // light+/dark+
                    [20, 15, 25],
                    [20, 15, 25],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 40, 80],
                    // berserk
                    [15, 40, 80],
                    // confuse
                    [15, 40, 80],
                    // temptation
                    [15, 40, 80],
                    // silent
                    [15, 40, 80],
                    // phantom
                    [15, 40, 80],
                    // paralyze
                    [15, 40, 80],
                    // poison
                    [15, 40, 80],
                    // deadly-poison
                    [15, 40, 80],
                    // magical-poison
                    [15, 40, 80],
                    // sleep
                    [15, 40, 80],
                    // mp-doublecost
                    [15, 40, 80],
                    // vulnerable
                    [15, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [10],
                    // double-gold
                    [0],
                    // double-drop
                    [5],
                    // trt+, trt-
                    [5, 20, 40],
                    [0, -40, -20],
                    // pha
                    [10, 150, 250],
                    // mp-save
                    [10, 25, 80],
                    // tpc+, tpc-
                    [10, -30, -20],
                    [0, 10, 20],
                    // fdm, exr
                    [10, 60, 100],
                    [0, 150, 250]
                ]
            },
            {
                id: 17,
                name: "風",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [5, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 5, 10],
                    [50, 5, 10],
                    [50, 5, 10],
                    // fire/ice/thunder
                    [25, 5, 10],
                    [25, 5, 10],
                    [25, 5, 10],
                    // water/earth/wind
                    [25, 5, 10],
                    [0, 5, 10],
                    [100, 5, 10],
                    // light/dark
                    [20, 5, 10],
                    [20, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [25, 15, 25],
                    [25, 15, 25],
                    [25, 15, 25],
                    // water+/earth+/wind+
                    [25, 15, 25],
                    [0, 15, 25],
                    [100, 15, 25],
                    // light+/dark+
                    [20, 15, 25],
                    [20, 15, 25],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 40, 80],
                    // berserk
                    [15, 40, 80],
                    // confuse
                    [15, 40, 80],
                    // temptation
                    [15, 40, 80],
                    // silent
                    [15, 40, 80],
                    // phantom
                    [15, 40, 80],
                    // paralyze
                    [15, 40, 80],
                    // poison
                    [15, 40, 80],
                    // deadly-poison
                    [15, 40, 80],
                    // magical-poison
                    [15, 40, 80],
                    // sleep
                    [15, 40, 80],
                    // mp-doublecost
                    [15, 40, 80],
                    // vulnerable
                    [15, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [10],
                    // double-gold
                    [0],
                    // double-drop
                    [5],
                    // trt+, trt-
                    [5, 20, 40],
                    [0, -40, -20],
                    // pha
                    [10, 150, 250],
                    // mp-save
                    [10, 25, 80],
                    // tpc+, tpc-
                    [10, -30, -20],
                    [0, 10, 20],
                    // fdm, exr
                    [10, 60, 100],
                    [0, 150, 250]
                ]
            },
            {
                id: 18,
                name: "光",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [5, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 5, 10],
                    [50, 5, 10],
                    [50, 5, 10],
                    // fire/ice/thunder
                    [25, 5, 10],
                    [25, 5, 10],
                    [25, 5, 10],
                    // water/earth/wind
                    [25, 5, 10],
                    [25, 5, 10],
                    [25, 5, 10],
                    // light/dark
                    [100, 5, 10],
                    [0, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [25, 15, 25],
                    [25, 15, 25],
                    [25, 15, 25],
                    // water+/earth+/wind+
                    [25, 15, 25],
                    [25, 15, 25],
                    [25, 15, 25],
                    // light+/dark+
                    [100, 15, 25],
                    [0, 15, 25],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 40, 80],
                    // berserk
                    [15, 40, 80],
                    // confuse
                    [15, 40, 80],
                    // temptation
                    [15, 40, 80],
                    // silent
                    [15, 40, 80],
                    // phantom
                    [15, 40, 80],
                    // paralyze
                    [15, 40, 80],
                    // poison
                    [15, 40, 80],
                    // deadly-poison
                    [15, 40, 80],
                    // magical-poison
                    [15, 40, 80],
                    // sleep
                    [15, 40, 80],
                    // mp-doublecost
                    [15, 40, 80],
                    // vulnerable
                    [15, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [10],
                    // double-gold
                    [0],
                    // double-drop
                    [5],
                    // trt+, trt-
                    [5, 20, 40],
                    [0, -40, -20],
                    // pha
                    [10, 150, 250],
                    // mp-save
                    [10, 25, 80],
                    // tpc+, tpc-
                    [10, -30, -20],
                    [0, 10, 20],
                    // fdm, exr
                    [10, 60, 100],
                    [0, 150, 250]
                ]
            },
            {
                id: 19,
                name: "闇",
                price: 15000,
                traits: [
                    // def+, def++
                    [10, 2, 5],
                    [5, 5, 10],
                    // mdf+, mdf++
                    [10, 2, 5],
                    [5, 5, 10],
                    // agi-, agi--
                    [5, -5, -2],
                    [0, -10, -5],
                    // luk+, luk-
                    [10, 2, 5],
                    [10, -5, -2],
                    // mhp+, mhp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // mmp+, mmp-
                    [5, 2, 5],
                    [5, -5, -2],
                    // hrt+, hrt-
                    [10, 2, 5],
                    [0, -5, -2],
                    // evd+, evd-
                    [10, 2, 5],
                    [0, -5, -2],
                    // cri+, cri-
                    [10, 2, 5],
                    [0, -5, -2],
                    // ctr+, ctr-
                    [10, 2, 5],
                    [0, -5, -2],
                    // additional
                    [10],
                    [0],
                    // slash/pen/bash
                    [50, 5, 10],
                    [50, 5, 10],
                    [50, 5, 10],
                    // fire/ice/thunder
                    [25, 5, 10],
                    [25, 5, 10],
                    [25, 5, 10],
                    // water/earth/wind
                    [25, 5, 10],
                    [25, 5, 10],
                    [25, 5, 10],
                    // light/dark
                    [0, 5, 10],
                    [100, 5, 10],
                    // slash+/pen+/bash+
                    [0, 15, 25],
                    [0, 15, 25],
                    [0, 15, 25],
                    // fire+/ice+/thunder+
                    [25, 15, 25],
                    [25, 15, 25],
                    [25, 15, 25],
                    // water+/earth+/wind+
                    [25, 15, 25],
                    [25, 15, 25],
                    [25, 15, 25],
                    // light+/dark+
                    [0, 15, 25],
                    [100, 15, 25],
                    // mhp-debuff
                    [25, 0, 50],
                    // mmp-debuff
                    [25, 0, 50],
                    // atk-debuff
                    [25, 0, 50],
                    // def-debuff
                    [25, 0, 50],
                    // mat-debuff
                    [25, 0, 50],
                    // mdf-debuff
                    [25, 0, 50],
                    // agi-debuff
                    [25, 0, 50],
                    // luk-debuff
                    [25, 0, 50],
                    // death
                    [15, 40, 80],
                    // berserk
                    [15, 40, 80],
                    // confuse
                    [15, 40, 80],
                    // temptation
                    [15, 40, 80],
                    // silent
                    [15, 40, 80],
                    // phantom
                    [15, 40, 80],
                    // paralyze
                    [15, 40, 80],
                    // poison
                    [15, 40, 80],
                    // deadly-poison
                    [15, 40, 80],
                    // magical-poison
                    [15, 40, 80],
                    // sleep
                    [15, 40, 80],
                    // mp-doublecost
                    [15, 40, 80],
                    // vulnerable
                    [15, 40, 80],
                    // death+
                    [0],
                    // berserk+
                    [8],
                    // confuse+
                    [8],
                    // temptation+
                    [8],
                    // silent+
                    [8],
                    // phantom+
                    [8],
                    // paralyze+
                    [8],
                    // poison+
                    [8],
                    // deadly-poison+
                    [8],
                    // magical-poison+
                    [8],
                    // sleep+
                    [8],
                    // mp-doublecost+
                    [8],
                    // vulnerable+
                    [8],
                    // reduce-encounter
                    [5],
                    // disable-encounter
                    [0],
                    // disable-ambush
                    [5],
                    // double-preemptive
                    [10],
                    // double-gold
                    [0],
                    // double-drop
                    [5],
                    // trt+, trt-
                    [5, 20, 40],
                    [0, -40, -20],
                    // pha
                    [10, 150, 250],
                    // mp-save
                    [10, 25, 80],
                    // tpc+, tpc-
                    [10, -30, -20],
                    [0, 10, 20],
                    // fdm, exr
                    [10, 60, 100],
                    [0, 150, 250]
                ]
            },
        ]
    }
];

/**
 * アクターグラフィック定数
 */
const ACTOR_BCF = {
    "1m": {
        battlerName: "preset/Actor1_1",
        characterIndex: 0,
        characterName: "preset/Actor1",
        miniCharIndex: 0,
        miniCharName: "tf/minis_char1_3",
        faceIndex: 0,
        faceName: ""
    },
    "1f": {
        battlerName: "preset/Actor1_2",
        characterIndex: 1,
        characterName: "preset/Actor1",
        miniCharIndex: 0,
        miniCharName: "tf/minis_char1_3",
        faceIndex: 0,
        faceName: ""
    },
    "2m": {
        battlerName: "preset/Actor1_3",
        characterIndex: 2,
        characterName: "preset/Actor1",
        miniCharIndex: 2,
        miniCharName: "tf/minis_char6_3",
        faceIndex: 0,
        faceName: ""
    },
    "2f": {
        battlerName: "tf/3_1",
        characterIndex: 0,
        characterName: "tf/chara3",
        miniCharIndex: 2,
        miniCharName: "tf/minis_char6_3",
        faceIndex: 0,
        faceName: ""
    },
    "3m": {
        battlerName: "preset/Actor2_7",
        characterIndex: 6,
        characterName: "preset/Actor2",
        miniCharIndex: 4,
        miniCharName: "tf/minis_char7_3",
        faceIndex: 0,
        faceName: ""
    },
    "3f": {
        battlerName: "preset/Actor2_8",
        characterIndex: 7,
        characterName: "preset/Actor2",
        miniCharIndex: 4,
        miniCharName: "tf/minis_char7_3",
        faceIndex: 0,
        faceName: ""
    },
    "4m": {
        battlerName: "preset/Actor3_5",
        characterIndex: 4,
        characterName: "preset/Actor3",
        miniCharIndex: 2,
        miniCharName: "tf/minis_char2_3",
        faceIndex: 0,
        faceName: ""
    },
    "4f": {
        battlerName: "preset/Actor3_6",
        characterIndex: 5,
        characterName: "preset/Actor3",
        miniCharIndex: 5,
        miniCharName: "tf/minis_char3_3",
        faceIndex: 0,
        faceName: ""
    },
    "5m": {
        battlerName: "preset/Actor2_5",
        characterIndex: 4,
        characterName: "preset/Actor2",
        miniCharIndex: 0,
        miniCharName: "tf/minis_char6_3",
        faceIndex: 0,
        faceName: ""
    },
    "5f": {
        battlerName: "preset/Actor2_6",
        characterIndex: 5,
        characterName: "preset/Actor2",
        miniCharIndex: 1,
        miniCharName: "tf/minis_char6_3",
        faceIndex: 0,
        faceName: ""
    },
    "6m": {
        battlerName: "preset/Actor1_5",
        characterIndex: 4,
        characterName: "preset/Actor1",
        miniCharIndex: 2,
        miniCharName: "tf/minis_char4_3",
        faceIndex: 0,
        faceName: ""
    },
    "6f": {
        battlerName: "preset/Actor1_6",
        characterIndex: 5,
        characterName: "preset/Actor1",
        miniCharIndex: 5,
        miniCharName: "tf/minis_char1_3",
        faceIndex: 0,
        faceName: ""
    },
    "7m": {
        battlerName: "preset/Actor1_7",
        characterIndex: 6,
        characterName: "preset/Actor1",
        miniCharIndex: 6,
        miniCharName: "tf/minis_char1_3",
        faceIndex: 0,
        faceName: ""
    },
    "7f": {
        battlerName: "preset/Actor1_8",
        characterIndex: 7,
        characterName: "preset/Actor1",
        miniCharIndex: 7,
        miniCharName: "tf/minis_char1_3",
        faceIndex: 0,
        faceName: ""
    },
    "8m": {
        battlerName: "preset/Actor2_3",
        characterIndex: 2,
        characterName: "preset/Actor2",
        miniCharIndex: 1,
        miniCharName: "tf/minis_soldiers1_3",
        faceIndex: 0,
        faceName: ""
    },
    "8f": {
        battlerName: "preset/Actor2_4",
        characterIndex: 3,
        characterName: "preset/Actor2",
        miniCharIndex: 4,
        miniCharName: "tf/minis_char5_3",
        faceIndex: 0,
        faceName: ""
    },
    "9m": {
        battlerName: "preset/Actor3_8",
        characterIndex: 7,
        characterName: "preset/Actor3",
        miniCharIndex: 5,
        miniCharName: "tf/minis_char8_3",
        faceIndex: 0,
        faceName: ""
    },
    "9f": {
        battlerName: "preset/Actor3_8",
        characterIndex: 7,
        characterName: "preset/Actor3",
        miniCharIndex: 5,
        miniCharName: "tf/minis_char8_3",
        faceIndex: 0,
        faceName: ""
    },
    "10m": {
        battlerName: "preset/Actor2_1",
        characterIndex: 0,
        characterName: "preset/Actor2",
        miniCharIndex: 1,
        miniCharName: "tf/minis_soldiers1_3",
        faceIndex: 0,
        faceName: ""
    },
    "10f": {
        battlerName: "preset/Actor2_2",
        characterIndex: 1,
        characterName: "preset/Actor2",
        miniCharIndex: 6,
        miniCharName: "tf/minis_soldiers1_3",
        faceIndex: 0,
        faceName: ""
    },
    "11m": {
        battlerName: "cover/Package1_3",
        characterIndex: 2,
        characterName: "cover/Package1",
        miniCharIndex: 6,
        miniCharName: "tf/minis_char5_3",
        faceIndex: 0,
        faceName: ""
    },
    "11f": {
        battlerName: "cover/Package1_3",
        characterIndex: 2,
        characterName: "cover/Package1",
        miniCharIndex: 6,
        miniCharName: "tf/minis_char5_3",
        faceIndex: 0,
        faceName: ""
    },
    "12m": {
        battlerName: "cover/Package1_5",
        characterIndex: 4,
        characterName: "cover/Package1",
        miniCharIndex: 5,
        miniCharName: "tf/minis_char5_3",
        faceIndex: 0,
        faceName: ""
    },
    "12f": {
        battlerName: "cover/Package1_6",
        characterIndex: 5,
        characterName: "cover/Package1",
        miniCharIndex: 2,
        miniCharName: "tf/minis_char5_3",
        faceIndex: 0,
        faceName: ""
    },
    "13m": {
        battlerName: "preset/Actor3_3",
        characterIndex: 2,
        characterName: "preset/Actor3",
        miniCharIndex: 1,
        miniCharName: "tf/minis_char3_3",
        faceIndex: 0,
        faceName: ""
    },
    "13f": {
        battlerName: "preset/Actor3_4",
        characterIndex: 3,
        characterName: "preset/Actor3",
        miniCharIndex: 5,
        miniCharName: "tf/minis_char1_3",
        faceIndex: 0,
        faceName: ""
    },
    "14m": {
        battlerName: "cover/Package2_3",
        characterIndex: 2,
        characterName: "cover/Package2",
        miniCharIndex: 7,
        miniCharName: "tf/minis_char7_3",
        faceIndex: 0,
        faceName: ""
    },
    "14f": {
        battlerName: "cover/Package2_4",
        characterIndex: 3,
        characterName: "cover/Package2",
        miniCharIndex: 5,
        miniCharName: "tf/minis_char8_3",
        faceIndex: 0,
        faceName: ""
    },
    "15m": {
        battlerName: "cover/Package2_1",
        characterIndex: 0,
        characterName: "cover/Package2",
        miniCharIndex: 3,
        miniCharName: "tf/minis_char4_3",
        faceIndex: 0,
        faceName: ""
    },
    "15f": {
        battlerName: "cover/Package2_2",
        characterIndex: 1,
        characterName: "cover/Package2",
        miniCharIndex: 5,
        miniCharName: "tf/minis_char4_3",
        faceIndex: 0,
        faceName: ""
    }
};
