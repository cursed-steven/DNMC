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
