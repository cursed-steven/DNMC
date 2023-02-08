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

const TRAITS = {
    ELEMENT_EFFECTIVENESS: {
        CODE: 11,
        note: "dataId = 属性ID"
    },
    DEBUFF_EFFECTIVENESS: {
        CODE: 12,
        note: "dataId = PARAM[i]"
    },
    STATE_EFFECTIVENESS: {
        CODE: 13,
        note: "dataId = ステートID"
    },
    STATE_NO_EFFECT: {
        CODE: 14,
        note: "dataId = ステートID, value = 1固定"
    },
    PARAM: {
        CODE: 21,
        note: "dataId = PARAM[i]"
    },
    ADDITIONAL_PARAM: {
        CODE: 22,
        note: "dataId = ADDITIONAL_PARAM[i]"
    },
    SPECIAL_PARAM: {
        CODE: 23,
        note: "dataId = SPECIAL_PARAM[i]"
    },
    ATTACK_ELEMENT: {
        CODE: 31,
        note: "dataId = 属性ID, value = 0固定"
    },
    ATTACK_ADDING_STATE: {
        CODE: 32,
        note: "dataId = ステートID"
    },
    ATTACK_SPEED_ADJUST: {
        CODE: 33,
        note: "dataId = 0固定"
    },
    ADDITIONAL_ATTACKS_COUNT: {
        CODE: 34,
        note: "dataId = 0固定"
    },
    ATTACKING_SKILL: {
        CODE: 35,
        note: "dataId = スキルID"
    },
    ADD_SKILL_TYPE: {
        CODE: 41,
        note: "dataId = スキルタイプ, value = 1固定"
    },
    SEAL_SKILL_TYPE: {
        CODE: 42,
        note: "dataId = スキルタイプ, value = 1固定"
    },
    ADD_SKILL: {
        CODE: 43,
        note: "dataId = スキルID, value = 1固定"
    },
    SEAL_SKILL: {
        CODE: 44,
        note: "dataId = スキルID, value = 1固定"
    },
    WEAPON_TYPE: {
        CODE: 51,
        note: "dataId = 武器タイプID, value = 1固定"
    },
    ARMOR_TYPE: {
        CODE: 52,
        note: "dataId = 防具タイプID, value = 1固定"
    },
    FIX_EQUIP_TYPE: {
        CODE: 53,
        note: "dataId = 装備タイプID, value = 1固定"
    },
    SEAL_EQUIP_TYPE: {
        CODE: 54,
        note: "dataId = 装備タイプID, value = 1固定"
    },
    SLOT_TYPE: {
        CODE: 55,
        note: "dataId = SLOT_TYPE[i], value = 1固定"
    },
    ADDITIONAL_ACTION_RATE: {
        CODE: 61,
        note: "dataId = 0固定"
    },
    SPECIAL_FLAG: {
        CODE: 62,
        note: "dataId = SPECIAL_FLAG[i], value = 1固定"
    },
    COLLAPSE_EFFECT: {
        CODE: 63,
        note: "dataId = COLLAPSE_EFFECT[i], value = 1固定"
    },
    PARTY_ABILITIES: {
        CODE: 64,
        note: "dataId = PARTY_ABILITY[i], value = 1固定"
    }
};

const EFFECTS = {
    HP_RECOVERY: {
        CODE: 11,
        note: "value1 = 回復率, value2 = 回復量"
    },
    MP_RECOVERY: {
        CODE: 12,
        note: "value1 = 回復率, value2 = 回復量"
    },
    TP_RECOVERY: {
        CODE: 13,
        note: "value1 = 回復率"
    },
    ADD_STATE: {
        CODE: 21,
        note: "dataId = ステートID, value1 = 確率"
    },
    REMOVE_STATE: {
        CODE: 22,
        note: "dataId = ステートID, value1 = 確率"
    },
    BUFF: {
        CODE: 31,
        note: "dataId = PARAM[i], value2 = ターン数"
    },
    DEBUFF: {
        CODE: 32,
        note: "dataId = PARAM[i], value2 = ターン数"
    },
    REMOVE_BUFF: {
        CODE: 33,
        note: "dataId = PARAM[i]"
    },
    REMOVE_DEBUFF: {
        CODE: 34,
        note: "dataId = PARAM[i]"
    },
    SPECIAL_EFFECT: {
        CODE: 41,
        note: "dataId = 0(逃げる)"
    },
    GROW: {
        CODE: 42,
        note: "dataId = PARAM[i], value2 =変化量"
    },
    ADD_SKILL: {
        CODE: 43,
        note: "dataId = スキルID"
    },
    COMMON_EVENT: {
        CODE: 44,
        note: "dataId = CEV_ID"
    }
};
