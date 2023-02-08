//=============================================================================
// RPG Maker MZ - CSVN_encounterEx.js
// ----------------------------------------------------------------------------
// (C)2022 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/11/17 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 敵グループに出現条件をつける／歩数を変更する
 * @author cursed_twitch
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_encounterEx.js
 * 
 * プラグインパラメータで追加したい敵グループとその出現条件を設定すると、
 * マップにもともとある敵グループと出現条件を満たした敵グループの
 * 和集合から敵グループが選出されます。
 * 
 * また同様に、プラグインパラメータで敵出現歩数を変更したい条件を
 * 設定すると、その条件を満たした時点で敵出現歩数が再設定されます。
 * 
 * @param encounterConditions
 * @text エンカ発生条件
 * @desc マップ/リージョン/スイッチ/変数の条件を満たしたときに発生するエンカ設定
 * @type struct<EncounterCondition>[]
 * 
 * @param stepConditions
 * @text 敵出現歩数変更条件
 * @desc マップ/リージョン/スイッチ/変数の条件を満たしたときの敵出現歩数
 * @type struct<StepCondition>[]
 */

/*~struct~EncounterCondition:ja
 * 
 * @param mapId
 * @text マップID
 * @type number
 * 
 * @param regionSet
 * @text リージョンのリスト
 * @type number[]
 * @max 255
 * @min 0
 * 
 * @param troopId
 * @text 敵グループ
 * @type troop
 * 
 * @param weight
 * @text 重み
 * @type number
 * @max 100
 * @min 0
 * 
 * @param switchId
 * @text スイッチID
 * @type number
 * 
 * @param switchValue
 * @text スイッチの値
 * @type boolean
 * 
 * @param varId
 * @text 変数ID
 * @type number
 * 
 * @param varInequality
 * @text 変数の不等号
 * @type select
 * @option <
 * @option <=
 * @option ==
 * @option >=
 * @option >
 * 
 * @param varValue
 * @text 変数値
 * @type number
 */

/*~struct~StepCondition:ja
 * 
 * @param mapId
 * @text マップID
 * @type number
 * 
 * @param steps
 * @text 敵出現歩数
 * @type number
 * @default 30
 * @max 999
 * @min 1
 * 
 * @param region
 * @text リージョン
 * @type number
 * @max 255
 * @min 0
 * 
 * @param switchId
 * @text スイッチID
 * @type number
 * 
 * @param switchValue
 * @text スイッチの値
 * @type boolean
 * 
 * @param varId
 * @text 変数ID
 * @type number
 * 
 * @param varInequality
 * @text 変数の不等号
 * @type select
 * @option <
 * @option <=
 * @option ==
 * @option >=
 * @option >
 * 
 * @param varValue
 * @text 変数値
 * @type number
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-------------------------------------------------------------------------
    // Game_Map

    const _Game_Map_initialize = Game_Map.prototype.initialize;
    /**
     * 初期化時に追加プロパティを用意する。
     */
    Game_Map.prototype.initialize = function () {
        _Game_Map_initialize.call(this);

        // 追加情報の格納先
        this._ael = [];
        this._stepConditions = [];
    };

    const _Game_Map_setup = Game_Map.prototype.setup;
    /**
     * PPに設定されている追加敵グループ、歩数変更条件のうち、
     * マップIDが合致するものを取得し、専用プロパティに保持する。
     */
    Game_Map.prototype.setup = function (mapId) {
        _Game_Map_setup.call(this, mapId);

        CSVN_base.logGroup(">>>> " + this.constructor.name + " setup");

        this.setupAEL(mapId);
        CSVN_base.log("Additional Encounter List: ");
        CSVN_base.log(this._ael);

        this.setupStepConditions(mapId);
        CSVN_base.log("Step Conditions: ");
        CSVN_base.log(this._stepConditions);
        CSVN_base.logGroupEnd(">>>> " + this.constructor.name + " setup");
    };

    const _Game_Map_refresh = Game_Map.prototype.refresh;
    /**
     * リージョン/スイッチ/変数の変化があった場合エンカ歩数を作り直す
     */
    Game_Map.prototype.refresh = function () {
        CSVN_base.log(">>>> " + this.constructor.name + " refresh");

        $gamePlayer.makeEncounterCount();
        _Game_Map_refresh.call(this);
    };

    /**
     * マップ初期化時に、そのマップに該当する追加敵グループを
     * PPから抽出して保持する。
     * @param {number} mapId 
     */
    Game_Map.prototype.setupAEL = function (mapId) {
        if (!param.encounterConditions) return;

        const list = param.encounterConditions.filter(e => {
            const mapMatch = !e.mapId || e.mapId === mapId;
            //CSVN_base.log(mapMatch);

            return mapMatch;

        });

        this._ael = list;
    };

    /**
     * マップ初期化時に、そのマップに該当する敵出現歩数条件を
     * PPから抽出して保持する。
     * @param {number} mapId 
     */
    Game_Map.prototype.setupStepConditions = function (mapId) {
        if (!param.stepConditions) return;

        const list = param.stepConditions.filter(e => {
            const mapMatch = !e.mapId || e.mapId === mapId;
            //CSVN_base.log(mapMatch);

            return mapMatch;
        });

        this._stepConditions = list;
    };

    const _Game_Map_encounterList = Game_Map.prototype.encounterList;
    /**
     * マップに設定されている通常の敵グループに
     * PPから抽出した追加的グループを追加して返却する。
     */
    Game_Map.prototype.encounterList = function () {
        let list = _Game_Map_encounterList.call(this);

        CSVN_base.logGroup(">> " + this.constructor.name + " encounterList");
        CSVN_base.log("Original Encounter List: ");
        CSVN_base.log(list);

        const listToAdd = this.findAEL();
        let tailored = [];
        for (const c of listToAdd) {
            tailored.push({
                regionSet: c.regionSet,
                troopId: c.troopId,
                weight: c.weight
            });
        }

        CSVN_base.log(list.concat(tailored));
        CSVN_base.logGroupEnd(">> " + this.constructor.name + " encounterList");

        return list.concat(tailored);
    };

    /**
     * 現在の条件に合う敵グループを返却する。
     * @returns any[]
     */
    Game_Map.prototype.findAEL = function () {
        CSVN_base.log(">> " + this.constructor.name + " findAEL");
        const list = this._ael.filter(e => {
            const regionMatch = e.regionSet && e.regionSet.includes($gamePlayer.regionId());
            const switchMatch = !e.switch || $s.get(e.switchId) === e.switchValue;
            const varMatch = !e.varId || eval("$v.get(" + e.varId + ") " + e.varInequality + " " + e.varValue)
            //CSVN_base.log(regionMatch + "|" + switchMatch + "|" + varMatch);

            return regionMatch && switchMatch && varMatch;

        });

        return list;
    };

    /**
     * 現在の条件に合う敵出現歩数変更条件を返却する(最初に見つかったもの)。
     * @returns any[]
     */
    Game_Map.prototype.findStepCondition = function () {
        CSVN_base.log(">> " + this.constructor.name + " findStepCondition");
        const list = this._stepConditions.find(e => {
            const regionMatch = !e.region || e.region === $gamePlayer.regionId();
            const switchMatch = !e.switch || $s.get(e.switchId) === e.switchValue;
            const varMatch = !e.varId || eval("$v.get(" + e.varId + ") " + e.varInequality + " " + e.varValue)
            //CSVN_base.log(regionMatch + "|" + switchMatch + "|" + varMatch);

            return regionMatch && switchMatch && varMatch;
        });

        return list;
    };

    //-------------------------------------------------------------------------
    // Game_Player

    const _Game_Player_makeEncounterCount = Game_Player.prototype.makeEncounterCount;
    /**
     * 敵出現歩数変更条件に該当するものがあった場合、生成した歩数を上書きする。
     */
    Game_Player.prototype.makeEncounterCount = function () {
        _Game_Player_makeEncounterCount.call(this);
        CSVN_base.logGroup(">> " + this.constructor.name + " makeEncounterCount");
        CSVN_base.log("Original steps: " + this._encounterCount);

        const stepsForUpdate = this.getStepsForUpdate();
        if (stepsForUpdate) {
            CSVN_base.log("Steps for update: " + stepsForUpdate);
            this._encounterCount = stepsForUpdate;
        }

        CSVN_base.logGroupEnd(">> " + this.constructor.name + " makeEncounterCount");
    };

    /**
     * 敵出現歩数変更条件を検索して、そこから歩数を生成して返却する。
     * @returns number
     */
    Game_Player.prototype.getStepsForUpdate = function () {
        CSVN_base.log(">> " + this.constructor.name + " getStepsForUpdate");

        const con = $gameMap.findStepCondition();
        CSVN_base.log("Step condition: ");
        CSVN_base.log(con);
        if (!con) return 0;

        const n = con.steps;
        return Math.randomInt(n) + Math.randomInt(n) + 1;
    };

})();