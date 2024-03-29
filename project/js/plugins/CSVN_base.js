//=============================================================================
// RPG Maker MZ - CSVN_base.js
// ----------------------------------------------------------------------------
// (C)2022 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/11/13 初版
// 1.1.0  2022/12/24 定数とクラスの定義をCSVN_staticsに分離
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc CSVN系列の公開プラグインや自作プラグインの基盤にする関数群
 * @author cursed_steven
 * @base CSVN_statics
 * @orderAfter CSVN_statics
 * 
 * @help CSVN_base.js
 * 
 * ＊ショートハンド
 * プラグインの中でよく使う記述について以下のようなショートハンドを実装します。
 * $gameSwitches.value(id)          > $s.get(id)
 * $gameSwitches.setValue(id, val)  > $s.set(id, val)
 * $gameVariables.value(id)         > $v.get(id)
 * $gameVariables.setValue(id, val) > $v.set(id, val)
 * 
 * ＊DevToolsMange連動スイッチ
 * DevToolsManageをONにすると、プラグインパラメータで指定したスイッチがONの
 * 状態で起動します。
 * 
 * ＊DEBUG MODE スイッチのID
 * DevToolsManage のON/OFFに連動するスイッチを設定します。
 * 
 * @param debugModeSwId
 * @text DEBUG MODE スイッチのID
 * @desc 
 * @default 1
 * @type switch
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // $gameSwitches と $gameVariables のショートハンド定義の準備

    let swList;
    window['$s'] = {};
    swList = window['$s'];

    let varList;
    window['$v'] = {};
    varList = window['$v'];

    //-----------------------------------------------------------------------------
    // Array

    /**
     * 配列のXばんめとYばんめを入れ替えたものを返す
     * @param {number} x 
     * @param {number} y  
     * @returns Array
     */
    Array.prototype.swap = function (x, y) {
        this[x] = [this[y], this[y] = this[x]][0];

        return this;
    }

    Object.defineProperty(Array.prototype, "swap", {
        enumerable: false
    });

    //-----------------------------------------------------------------------------
    // Math

    /**
     * 基本値に分散を適用した値を返す
     * @param {number} value 
     * @param {number} variance 
     * @returns number 
     */
    Math.applyVariance = function (value, variance) {
        const amp = Math.floor(Math.max((Math.abs(value) * variance) / 100, 0));
        const v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;
        return value >= 0 ? value + v : value - v;
    };

    /**
     * 指定した確率(%)でtrueを返す
     * @param {number} rate 
     * @returns boolean
     */
    Math.trueByRate = function (rate) {
        const rv = Math.randomInt(100);
        return rv <= rate;
    };

    /**
     * aからbの間のランダムな整数値を返す
     * @param {number} a 
     * @param {number} b 
     * @returns number
     */
    Math.randomRangeInt = function (a, b) {
        let r = Math.randomInt(Math.abs(a - b));
        return r + a;
    };

    //-----------------------------------------------------------------------------
    // DataManager

    /**
     * 種別とIDを指定してデータオブジェクトを取得する
     * @param {number} type 
     * @param {number} id 
     * @returns any
     */
    DataManager.getData = function (type, id) {
        let data = null;
        switch (type) {
            case 0:
                data = $dataItems[id];
                break;
            case 1:
                data = $dataWeapons[id];
                break;
            case 2:
                data = $dataArmors[id];
                break;
        }

        return data;
    };

    /**
     * 隠しアイテムA/Bならtrue
     * @param {any} item 
     * @returns boolean
     */
    DataManager.isHiddenItem = function (item) {
        if (!this.isItem(item)) return false;

        return (item.itypeId === ITYPE.HIDDEN_A
            || item.itypeId === ITYPE.HIDDEN_B);
    };

    /**
     * 回復アイテムならtrue
     * @param {any} item 
     * @returns boolean
     */
    DataManager.isItemForRecovery = function (item) {
        if (!this.isItem(item)) return false;

        return (item.damage.type === DAMAGE_TYPE.HP_RECOVERY
            || item.damage.type === DAMAGE_TYPE.MP_RECOVERY
            || DataManager.isItemForRemoveState(item))
            && item.occasion !== OCCASION.BATTLE
            && item.itypeId === ITYPE.NORMAL;
    }

    /**
     * 回復以外のアイテムならtrue
     * @param {any} item 
     * @returns boolean
     */
    DataManager.isItemNotForRecovery = function (item) {
        if (!this.isItem(item)) return false;

        return item.damage.type !== DAMAGE_TYPE.HP_RECOVERY
            && item.damage.type !== DAMAGE_TYPE.MP_RECOVERY
            && !DataManager.isItemForRemoveState(item)
            && item.occasion !== OCCASION.BATTLE
            && item.itypeId === ITYPE.NORMAL;
    }

    /**
     * ステート解除アイテムならtrue
     * @param {any} item 
     * @returns boolean
     */
    DataManager.isItemForRemoveState = function (item) {
        if (!this.isItem(item)) return false;

        return item.effects.some(effect => {
            return effect.code === EFFECTS.REMOVE_STATE;
        });
    }

    /**
     * 戦闘専用アイテムならtrue
     * @param {any} item 
     * @returns boolean
     */
    DataManager.isItemOnlyForBattle = function (item) {
        if (!this.isItem(item)) return false;

        return item.occasion === OCCASION.BATTLE;
    }

    /**
     * 回復スキルならtrue
     * @param {any} skill 
     * @returns boolean
     */
    DataManager.isSkillForRecovery = function (skill) {
        if (!this.isSkill(skill)) return false;

        return (skill.damage.type === DAMAGE_TYPE.HP_RECOVERY
            || skill.damage.type === DAMAGE_TYPE.MP_RECOVERY
            || DataManager.isSkillForRemoveState(skill))
            && skill.occasion !== OCCASION.BATTLE;
    };

    /**
     * 回復以外のスキルならtrue
     * @param {any} skill 
     * @returns boolean
     */
    DataManager.isSkillNotForRecovery = function (skill) {
        if (!this.isSkill(skill)) return false;

        return skill.damage.type !== DAMAGE_TYPE.HP_RECOVERY
            && skill.damage.type !== DAMAGE_TYPE.MP_RECOVERY
            && !DataManager.isSkillForRemoveState(skill)
            && skill.occasion !== OCCASION.BATTLE;
    };

    /**
     * ステート解除スキルならtrue
     * @param {any} skill 
     * @returns boolean
     */
    DataManager.isSkillForRemoveState = function (skill) {
        if (!this.isSkill(skill)) return false;

        return skill.effects.some(effect => {
            return effect.code === EFFECTS.REMOVE_STATE;
        });
    };

    /**
     * 戦闘専用スキルならtrue
     * @param {any} skill 
     * @returns boolean
     */
    DataManager.isSkillOnlyForBattle = function (skill) {
        if (!this.isSkill(skill)) return false;

        return skill.occasion === OCCASION.BATTLE;
    };

    //-----------------------------------------------------------------------------
    // ImageManager

    ImageManager.preloadAllFacesAndChars = function () {
        for (const da of $dataActors) {
            if (da) {
                if (da.faceName) {
                    this.loadFace(da.faceName);
                }
                if (da.characterName) {
                    this.loadCharacter(da.characterName);
                }
            }
        };
    }

    ImageManager.preloadEnemyImages = function () {
        for (const de of $dataEnemies) {
            if (de && de.battlerName) {
                this.loadEnemy(de.battlerName);
            }
        }
    };

    //-----------------------------------------------------------------------------
    // TextManager

    /**
     * 追加能力値の名前を返す
     * @param {number} paramId 
     * @returns string
     */
    TextManager.additionalParam = function (paramId) {
        let text = "";
        switch (paramId) {
            case ADDITIONAL_PARAM.HIT_RATE:
                text = "命中率";
                break;
            case ADDITIONAL_PARAM.EVADE_RATE:
                text = "回避率";
                break;
            case ADDITIONAL_PARAM.CRITICAL_RATE:
                text = "会心率";
                break;
            case ADDITIONAL_PARAM.EVADE_CRITICAL_RATE:
                text = "会心回避率";
                break;
            case ADDITIONAL_PARAM.MAGIC_EVADE_RATE:
                text = "魔法回避率";
                break;
            case ADDITIONAL_PARAM.MAGIC_REFLECT_RATE:
                text = "魔法反射率";
                break;
            case ADDITIONAL_PARAM.STRIKE_BACK_RATE:
                text = "反撃率";
                break;
            case ADDITIONAL_PARAM.HP_REGENERATE_RATE:
                text = "HP再生率";
                break;
            case ADDITIONAL_PARAM.MP_REGENERATE_RATE:
                text = "MP再生率";
                break;
            case ADDITIONAL_PARAM.TP_REGENERATE_RATE:
                text = "TP再生率";
                break;
        }

        return text;
    }

    /**
     * 特徴の名称を返す
     * @param {number} code 
     * @param {number} i 
     * @returns string
     */
    TextManager.trait = function (code, i) {
        let text = "";
        switch (code) {
            case Game_BattlerBase.TRAIT_ATTACK_ELEMENT:
                text = "攻撃属性";
                break;
            case Game_BattlerBase.TRAIT_ATTACK_TIMES:
                text = "追加攻撃";
                break;
            case Game_BattlerBase.TRAIT_ACTION_PLUS:
                text = "追加行動";
                break;
            case Game_BattlerBase.TRAIT_PARTY_ABILITY:
                const partyAbilitiesNames = [
                    "遭遇半減",
                    "遭遇無効",
                    "奇襲無効",
                    "先制率UP",
                    "Rg倍化",
                    "EXP倍化"
                ];
                text = partyAbilitiesNames[i];
                break;
            case Game_BattlerBase.TRAIT_SPARAM:
                const specialParamNames = [
                    "狙われ",
                    "防御効果率",
                    "回復効果率",
                    "薬識",
                    "MP消費",
                    "TPダメージ率",
                    "物理ダメージ率",
                    "魔法ダメージ率",
                    "床ダメージ率",
                    "EXP取得率"
                ];
                text = specialParamNames[i];
                break;
        }

        return text;
    }

    //-------------------------------------------------------------------------
    // Game_Interpreter

    /**
     * 予約済みCEVのセットアップ時、CEVの名前とIDを自動的にログ出力する
     * @returns boolean
     */
    Game_Interpreter.prototype.setupReservedCommonEvent = function () {
        if ($gameTemp.isCommonEventReserved()) {
            const commonEvent = $gameTemp.retrieveCommonEvent();
            if (commonEvent) {
                if (commonEvent.trigger == 0) {
                    // 並列処理・自動回復は数が多くなりそうなので回避
                    console.log(">>>> " + commonEvent.name + "(CEV:" + commonEvent.id + ")");
                }
                this.setup(commonEvent.list);
                return true;
            }
        }
        return false;
    };

    /**
     * CEVの呼び出し時、CEVの名前とIDを自動的にログ出力する
     * @param {any} params 
     * @returns boolean
     */
    Game_Interpreter.prototype.command117 = function (params) {
        const commonEvent = $dataCommonEvents[params[0]];
        if (commonEvent) {
            if (commonEvent.trigger === 0) {
                // 並列処理・自動回復は数が多くなりそうなので回避
                console.log(">>>> " + commonEvent.name + "(CEV:" + commonEvent.id + ")");
            }
            const eventId = this.isOnCurrentMap() ? this._eventId : 0;
            this.setupChild(commonEvent.list, eventId);
        }
        return true;
    };

    //-------------------------------------------------------------------------
    // Scene_Map

    const _Scene_Map_create = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function () {
        _Scene_Map_create.call(this);
        ImageManager.preloadEnemyImages();
        ImageManager.preloadAllFacesAndChars();
    };

    const _Scene_Map_start = Scene_Map.prototype.start;
    /**
     * マップシーンの開始時に追加処理
     */
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);

        /*
         * $gameSwitchesのショートハンド定義
         */
        if (swList) {
            swList.get = function (id) {
                return $gameSwitches.value(id);
            };
            swList.set = function (id, value) {
                $gameSwitches.setValue(id, value);
            };
            swList.on = function (id) {
                $gameSwitches.setValue(id, true);
            };
            swList.off = function (id) {
                $gameSwitches.setValue(id, false);
            };
        }

        /*
         * $gameVariablesのショートハンド定義
         */
        if (varList) {
            varList.get = function (id) {
                return $gameVariables.value(id);
            };
            varList.set = function (id, value) {
                $gameVariables.setValue(id, value);
            }
        }

        /*
         * 起動時のdebugオプションのON/OFFと指定スイッチのON/OFFを連動させる。
         */
        if (Utils.isOptionValid('debug')) {
            $gameSwitches.setValue(param.debugModeSwId, true);
        } else {
            $gameSwitches.setValue(param.debugModeSwId, false);
        }
    };

})();

//-------------------------------------------------------------------------
// CSVN_base
//
// The static class that contains basic functions for CSVN_* plugins.

function CSVN_base() {
    throw new Error("This is a static class");
}

/**
 * Donut Machine と競合しないかの確認用、trueだと競合の可能性が高い。
 * もしくは Donut Machine 独自仕様の実行に分岐する際の確認に使用。
 * @returns boolean
 */
CSVN_base.isDNMCActive = function () {
    let result = false;
    try {
        const test = new DataActor();
        // console.log(`DataActor?: ${typeof test}`);
        if (typeof test === "object") {
            result = true;
        }
    } catch (e) {
        console.log("Donut Machine not activated, do not mind.");
    }

    return result;
};
