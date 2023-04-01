//=============================================================================
// RPG Maker MZ - CSVN_conditionChecker.js
// ----------------------------------------------------------------------------
// (C)2022 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/11/13 初版
// 1.0.1  2022/11/14 もろもろ追記・修正
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc マップID、リージョン、スイッチ、変数の条件との合致有無を判定する。
 * @author cursed_steven
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_conditionChecker.js
 * 
 * マップID、リージョン、スイッチ、変数で指定した条件との合致有無のを
 * 判定し、この結果(合致(true)/合致せず(false))を、
 * プラグインパラメータで指定したスイッチにセットします。
 * 
 * プラグインコマンドとしてその判定をすることができます。
 * $gameSystem.setConditionMatched()をコールしてスクリプト中から
 * 同じ判定を行うこともできます。
 * 
 * @param switchId
 * @text 結果格納先スイッチ
 * @desc チェック結果を格納するスイッチ
 * @type switch
 * 
 * @command setConditionMatched
 * @text チェック
 * 
 * @arg mapId
 * @text マップID
 * @type number
 * 
 * @arg region
 * @text リージョン
 * @type number
 * 
 * @arg switchId
 * @text スイッチ
 * @type switch
 * 
 * @arg switchValue
 * @text スイッチの値
 * @type boolean
 * 
 * @arg varId
 * @text 変数ID
 * @type variable
 * 
 * @arg varInequality
 * @text 変数の不等号
 * @type string
 * 
 * @arg varValue
 * @text 変数値
 * @type number
 */


(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, "setConditionMatched", args => {
        $gameSystem.setConditionMatched(
            args.mapId,
            args.region,
            args.switchId,
            args.switchValue,
            args.varId,
            args.varInequality,
            args.varValue
        );
    });

    //-------------------------------------------------------------------------
    // Scene_Map

    const _Scene_Map_start = Scene_Map.prototype.start;
    /**
     * マップ読み込みから処理開始のあたりで行う追加的な初期処理
     */
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);

        /*
         * マップのリフレッシュを要求しないスイッチ(必須)
         */
        if (!param.switchId) {
            throw new Error("Plugin parameter switchId REQUIRED.");
        }
        $gameSystem.setConditionCheckerSwId(param.switchId);
    };

})();


//-------------------------------------------------------------------------
// CSVN_conditionChecker
//
// The static class that provides common condition checker.

function CSVN_conditionChecker() {
    throw new Error("This is a static class");
}

/**
 * マップID, リージョン, スイッチ, 変数の条件を渡して合致を判断する。
 * @param {number} mapId 
 * @param {number} region 
 * @param {number} switchId 
 * @param {boolean} switchValue 
 * @param {number} varId 
 * @param {string} varInequality 
 * @param {number} varValue 
 * @returns boolean
 */
CSVN_conditionChecker.checkCondition = function (
    mapId,
    region,
    switchId,
    switchValue,
    varId,
    varInequality,
    varValue
) {
    if (!mapId) mapId = 0;
    if (!region) region = 0;
    if (!switchId) switchId = 0;
    if (!varId) varId = 0;

    // CSVN_base.logGroup(this.constructor.name);

    // CSVN_base.log($gameMap.mapId() + " | arg(mapId): " + mapId);
    if (mapId !== 0 && $gameMap.mapId() !== mapId) {
        CSVN_base.log("mapId unmatch.");
        return false;
    }

    // CSVN_base.log($gamePlayer.regionId() + " | arg(region): " + region);
    if (region !== 0 && $gamePlayer.regionId() !== region) {
        CSVN_base.log("region unmatch.");
        return false;
    }

    // CSVN_base.log($s.get(switchId) + " | arg(switchValue): " + switchValue);
    if (switchId !== 0 && $s.get(switchId) !== switchValue) {
        CSVN_base.log("switch unmatch.");
        return false;
    }

    const toBeEval = "$v.get(" + varId + ") " + varInequality + " " + varValue;
    // CSVN_base.log("toBeEval: " + toBeEval + " | $v.get(" + varId + ") == " + $v.get(varId));
    let result;
    if (varId !== 0) {
        if (!eval(toBeEval)) {
            CSVN_base.log("var unmatch.");
            return false;
        }
    }

    // CSVN_base.logGroupEnd(this.constructor.name);

    return true;
}

//-------------------------------------------------------------------------
// Game_System

const _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);

    // 条件確認結果の格納先スイッチID
    this._conditionCheckerSwId = 0;
};

/**
 * 条件確認結果の格納先スイッチIDを返却する。
 * @returns number
 */
Game_System.prototype.conditionCheckerSwId = function () {
    return this._conditionCheckerSwId;
};

/**
 * 条件確認結果の格納先スイッチIDを設定する。
 * @param {number} id 
 */
Game_System.prototype.setConditionCheckerSwId = function (id) {
    CSVN_base.log(">>" + this.constructor.name + " sw ID: " + id);
    this._conditionCheckerSwId = id;
};

/**
 * 指定した条件の合致をチェックして所定のスイッチに結果を入れる。
 * @param {number} mapId 
 * @param {number} region 
 * @param {number} switchId 
 * @param {boolean} switchValue 
 * @param {number} varId 
 * @param {string} varInequality 
 * @param {number} varValue 
 */
Game_System.prototype.setConditionMatched = function (
    mapId,
    region,
    switchId,
    switchValue,
    varId,
    varInequality,
    varValue
) {
    $s.set(
        this.conditionCheckerSwId(),
        CSVN_conditionChecker.checkCondition(
            mapId,
            region,
            switchId,
            switchValue,
            varId,
            varInequality,
            varValue
        )
    );
};

/**
 * 直近の判定結果を返す。
 * @returns boolean
 */
Game_System.prototype.getConditionMatched = function () {
    CSVN_base.log(">> " + this.constructor.name + " getConditionMatched");
    CSVN_base.log("swId: " + this.conditionCheckerSwId());
    CSVN_base.log("conditionMatched: " + $s.get(this.conditionCheckerSwId()));
    return $s.get(this.conditionCheckerSwId());
};

//-------------------------------------------------------------------------
// Game_Switches

const _Game_Switches_setValue = Game_Switches.prototype.setValue;
Game_Switches.prototype.setValue = function (switchId, value) {
    if (switchId > 0 && switchId < $dataSystem.switches.length) {
        this._data[switchId] = value;

        // 条件判断の結果を入れるスイッチの場合はリフレッシュ要求を行わない
        if (switchId !== $gameSystem.conditionCheckerSwId()) {
            this.onChange();
        }
    }
};
