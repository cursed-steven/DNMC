//=============================================================================
// RPG Maker MZ - CSVN_statics.js
// ----------------------------------------------------------------------------
// (C)2022 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/12/24 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 定数の再定義、クラスの定義
 * @author cursed_twitch
 * @orderAfter PluginCommonBase
 * 
 * @help CSVN_statics.js
 */

/*
 * 定数の再定義
 */
const ITYPE = {
    NORMAL: 1,
    KEY: 2,
    HIDDEN_A: 3,
    HIDDEN_B: 4
};

const DAMAGE_TYPE = {
    NONE: 0,
    HP_DAMAGE: 1,
    MP_DAMAGE: 2,
    HP_RECOVERY: 3,
    MP_RECOVERY: 4,
    HP_DRAIN: 5,
    MP_DRAIN: 6
};

const OCCASION = {
    ALWAYS: 0,
    BATTLE: 1,
    MENU: 2,
    NONE: 3
};

const PARAM = {
    MHP: 0,
    MMP: 1,
    ATK: 2,
    DEF: 3,
    MAT: 4,
    MDF: 5,
    AGI: 6,
    LUK: 7
};

const PARAM_NAMES = [
    "mhp",
    "mmp",
    "atk",
    "def",
    "mat",
    "mdf",
    "agi",
    "luk"
];

const ADDITIONAL_PARAM = {
    HIT_RATE: 0,
    EVADE_RATE: 1,
    CRITICAL_RATE: 2,
    EVADE_CRITICAL_RATE: 3,
    MAGIC_EVADE_RATE: 4,
    MAGIC_REFLECT_RATE: 5,
    STRIKE_BACK_RATE: 6,
    HP_REGENERATE_RATE: 7,
    MP_REGENERATE_RATE: 8,
    TP_REGENERATE_RATE: 9
};

const SPECIAL_PARAM = {
    TARGETTED_RATE: 0,
    DEF_EFFECTIVENESS: 1,
    RESTORE_EFFECTIVENESS: 2,
    PHARMACY: 3,
    MP_COST_RATE: 4,
    TP_CHARGE_RATE: 5,
    PHYSICAL_DAMAGE_RATE: 6,
    MAGICAL_DAMAGE_RATE: 7,
    FLOOR_DAMAGE_RATE: 8,
    EXP_GET_RATE: 9
};

const SLOT_TYPE = {
    NORMAL: 0,
    BOTH: 1
};

const SPECIAL_FLAG = {
    AUTO_BATTLE: 0,
    DEFENCE: 1,
    SCAPEGOAT: 2,
    TP_CARRYOVER: 3
};

const PARTY_ABILITIY = {
    REDUCE_ENCOUNTER: 0,
    NO_ENCOUNTER: 1,
    NO_AMBUSH: 2,
    MORE_PREEMPTIVE: 3,
    DOUBLE_GOLD: 4,
    DOUBLE_DROPS: 5
};

const COLLAPSE_EFFECT = {
    NORMAL: 0,
    BOSS: 1,
    INSTANT: 2,
    NO_EFFECT: 3
};

const EFFECTS = {
    HP_RECOVERY: 11,
    MP_RECOVERY: 12,
    TP_RECOVERY: 13,
    ADD_STATE: 21,
    REMOVE_STATE: 22,
    BUFF: 31,
    DEBUFF: 32,
    REMOVE_BUFF: 33,
    REMOVE_DEBUFF: 34,
    SPECIAL_EFFECT: 41,
    GROW: 42,
    ADD_SKILL: 43,
    COMMON_EVENT: 44,
};

const NUMBER_KEY_MAP = {
    NINTENDO: {
        0: "B",
        1: "A",
        2: "Y",
        3: "X",
        4: "L1",
        5: "R1",
        12: "↑",
        13: "↓",
        14: "←",
        15: "→"
    },
    PLAYSTATION: {
        0: "×",
        1: "○",
        2: "□",
        3: "△",
        4: "L1",
        5: "R1",
        12: "↑",
        13: "↓",
        14: "←",
        15: "→"
    },
    XBOX: {
        0: "A",
        1: "B",
        2: "Y",
        3: "X",
        4: "L1",
        5: "R1",
        12: "↑",
        13: "↓",
        14: "←",
        15: "→"
    },
    KEYBOARD: {
        8: "bsp",
        9: "tab",
        13: "ent",
        16: "sh",
        27: "esc",
        32: "sp",
        33: "pgu",
        34: "pgd",
        35: "pgd",
        36: "hme",
        37: "←",
        38: "↑",
        39: "→",
        40: "↓",
        44: "psc",
        46: "del",
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        65: "A",
        66: "B",
        67: "C",
        68: "D",
        69: "E",
        70: "F",
        71: "G",
        72: "H",
        73: "I",
        74: "J",
        75: "K",
        76: "L",
        77: "M",
        78: "N",
        79: "O",
        80: "P",
        81: "Q",
        82: "R",
        83: "S",
        84: "T",
        85: "U",
        86: "V",
        87: "W",
        88: "X",
        89: "Y",
        90: "Z",
        96: "tk0",
        97: "tk1",
        98: "tk2",
        99: "tk3",
        100: "tk4",
        101: "tk5",
        102: "tk6",
        103: "tk7",
        104: "tk8",
        105: "tk9",
        106: "tk*",
        107: "tk+",
        109: "tk-",
        111: "tk/",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12"
    }
};

const PADS = ["NINTENDO", "PLAYSTATION", "XBOX", "KEYBOARD"];
