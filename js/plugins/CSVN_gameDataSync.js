//=============================================================================
// RPG Maker MZ - CSVN_gameDataSync.js
// ----------------------------------------------------------------------------
// (C)2022 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/11/16 初版
// 1.0.1  2022/12/02 戦闘テストが開始できない不具合の修正
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc ゲームデータを指定の変数に自動的に同期します。
 * @author cursed_steven
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_gameDataSync.js
 * 
 * @param lastUsedSkillId
 * @text 直前に使用したスキルのID
 * @desc 直前に使用したスキルのIDを格納する変数のID
 * @type variable
 * 
 * @param lastUsedSkillHPCost
 * @text 直前に使用したスキルのHPコスト
 * @desc 直前に使用したスキルのHPコストを格納する変数のID
 * @type variable
 * 
 * @param lastUsedSkillMPCost
 * @text 直前に使用したスキルのMPコスト
 * @desc 直前に使用したスキルのMPコストを格納する変数のID
 * @type variable
 * 
 * @param lastUsedSkillTPCost
 * @text 直前に使用したスキルのTPコスト
 * @desc 直前に使用したスキルのTPコストを格納する変数のID
 * @type variable
 *
 * @param lastUsedItemId
 * @text 直前に使用したアイテムのID
 * @desc 直前に使用したアイテムのIDを格納する変数のID
 * @type variable
 * 
 * @param lastSubjectActorId
 * @text 直前に行動したアクターのID
 * @desc 直前に行動したアクターのIDを格納する変数のID
 * @type variable
 * 
 * @param lastSubjectEnemyIndex
 * @text 直前に行動した敵のインデックス
 * @desc 直前に行動した敵のインデックスを格納する変数のID
 * @type variable
 * 
 * @param lastTargetActorId
 * @text 直前に対象となったアクターのID
 * @desc 直前に対象となったアクターのIDを格納する変数のID
 * @type variable
 * 
 * @param lastTargetEnenyIndex
 * @text 直前に対象となった敵のインデックス
 * @desc 直前に対象となった敵のインデックスを格納する変数のID
 * @type variable
 * 
 * @param mapId
 * @text マップID
 * @desc プレイヤーがいるマップIDを格納する変数のID
 * @type variable
 * 
 * @param x
 * @text X座標
 * @desc プレイヤーがいるマップ上のX座標を格納する変数のID
 * @type variable
 * 
 * @param y
 * @text Y座標
 * @desc プレイヤーがいるマップ上のY座標を格納する変数のID
 * @type variable
 * 
 * @param lastRegion
 * @text 直前のリージョン
 * @desc プレイヤーがいたリージョンを格納する変数のID
 * @type variable
 * 
 * @param region
 * @text リージョン
 * @desc プレイヤーがいるリージョンを格納する変数のID
 * @type variable
 * 
 * @param lastTerrain
 * @text 直前の地形タグ
 * @desc プレイヤーがいた地形タグを格納する変数のID
 * @type variable
 * 
 * @param terrain
 * @text 地形タグ
 * @desc プレイヤーがいる地形タグを格納する変数のID
 * @type variable
 * 
 * @param partySize
 * @text パーテイーの人数
 * @desc パーテイーの人数を格納する変数のID
 * @type variable
 * 
 * @param gold
 * @text 所持金
 * @desc 所持金を格納する変数のID
 * @type variable
 * 
 * @param steps
 * @text 歩数
 * @desc 歩数を格納する変数のID
 * @type variable
 * 
 * @param battleCount
 * @text 戦闘回数
 * @desc 戦闘回数を格納する変数のID
 * @type variable
 * 
 * @param winCount
 * @text 勝利回数
 * @desc 勝利回数を格納する変数のID
 * @type variable
 * 
 * @param escapeCount
 * @text 逃走回数
 * @desc 逃走回数を格納する変数のID
 * @type variable
 * 
 * @param exceptVarIds
 * @text リフレッシュを要求しない変数のリスト
 * @desc
 * @type variable[]
 * 
 * @command refundItem
 * @text 直前使用アイテムの返却
 * 
 * @command refundMP
 * @text 直前使用スキルのMPコスト返却
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * 直前使用アイテム返却
     */
    PluginManagerEx.registerCommand(script, "refundItem", args => {
        $gameParty.gainItem($dataItems[$v.get(param.lastUsedItemId)], 1);
    });

    /**
     * 直前使用スキルMPコスト返却
     */
    PluginManagerEx.registerCommand(script, "refundMP", args => {
        $gameParty.lastSubjectActor()._mp += $v.get(param.lastUsedSkillMPCost);
    });

    //-------------------------------------------------------------------------
    // Game_Temp

    const _Game_Temp_setLastUsedSkillId = Game_Temp.prototype.setLastUsedSkillId;
    Game_Temp.prototype.setLastUsedSkillId = function (skillID) {
        _Game_Temp_setLastUsedSkillId.call(this, skillID);

        if (!DataManager.isBattleTest()) {
            $v.set(param.lastUsedSkillId, skillID);
            $v.set(param.lastUsedSkillMPCost, $dataSkills[skillID].mpCost);
            $v.set(param.lastUsedSkillTPCost, $dataSkills[skillID].tpCost);
        }
    };

    const _Game_Temp_setLastUsedItemId = Game_Temp.prototype.setLastUsedItemId;
    Game_Temp.prototype.setLastUsedItemId = function (itemID) {
        _Game_Temp_setLastUsedItemId.call(this, itemID);
        $gameVariables.setValue(param.lastUsedItemId, itemID);
    };

    const _Game_Temp_setLastSubjectActorId = Game_Temp.prototype.setLastSubjectActorId;
    Game_Temp.prototype.setLastSubjectActorId = function (actorID) {
        _Game_Temp_setLastSubjectActorId.call(this, actorID);
        if (!DataManager.isBattleTest()) {
            $v.set(param.lastSubjectActorId, actorID);
        }
    };

    const _Game_Temp_setLastSubjectEnemyIndex = Game_Temp.prototype.setLastSubjectEnemyIndex;
    Game_Temp.prototype.setLastSubjectEnemyIndex = function (enemyIndex) {
        _Game_Temp_setLastSubjectEnemyIndex.call(this, enemyIndex);
        if (!DataManager.isBattleTest()) {
            $v.set(param.lastSubjectEnemyIndex, enemyIndex);
        }
    };

    const _Game_Temp_setLastTargetActorId = Game_Temp.prototype.setLastTargetActorId;
    Game_Temp.prototype.setLastTargetActorId = function (actorID) {
        _Game_Temp_setLastTargetActorId.call(this, actorID);
        if (!DataManager.isBattleTest()) {
            $v.set(param.lastTargetActorId, actorID);
        }
    };

    const _Game_Temp_setLastTargetEnemyIndex = Game_Temp.prototype.setLastTargetEnemyIndex;
    Game_Temp.prototype.setLastTargetEnemyIndex = function (enemyIndex) {
        _Game_Temp_setLastTargetEnemyIndex.call(this, enemyIndex);
        if (!DataManager.isBattleTest()) {
            $v.set(param.lastTargetEnemyIndex, enemyIndex);
        }
    };

    //-------------------------------------------------------------------------
    // Game_Map

    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function (mapId) {
        _Game_Map_setup.call(this, mapId);
        $gameVariables.setValue(param.mapId, mapId);
    };

    //-------------------------------------------------------------------------
    // Scene_Map

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);

        const x = $gamePlayer.x;
        const y = $gamePlayer.y;
        $v.set(param.x, x);
        $v.set(param.y, y);
        $v.set(param.lastRegion, $v.get(param.region));
        $v.set(param.region, $gameMap.regionId(x, y));
        $v.set(param.lastTerrain, $v.get(param.terrain));
        $v.set(param.terrain, $gameMap.terrainTag(x, y));
    };

    //-------------------------------------------------------------------------
    // Game_Party

    const _Game_Party_onPlayerWalk = Game_Party.prototype.onPlayerWalk;
    Game_Party.prototype.onPlayerWalk = function () {
        _Game_Party_onPlayerWalk.call(this);

        const x = $gamePlayer.x;
        const y = $gamePlayer.y;
        $v.set(param.x, x);
        $v.set(param.y, y);
        $v.set(param.lastRegion, $v.get(param.region));
        $v.set(param.region, $gameMap.regionId(x, y));
        $v.set(param.lastTerrain, $v.get(param.terrain));
        $v.set(param.terrain, $gameMap.terrainTag(x, y));
    };

    const _Game_Party_addActor = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function (actorId) {
        _Game_Party_addActor.call(this, actorId);

        if (!DataManager.isBattleTest()) {
            $v.set(param.partySize, this.size());
        }
    };

    const _Game_Party_removeActor = Game_Party.prototype.removeActor;
    Game_Party.prototype.removeActor = function (actorId) {
        _Game_Party_removeActor.call(this, actorId);
        if (!DataManager.isBattleTest()) {
            $v.set(param.partySize, this.size());
        }
    };

    const _Game_Party_gainGold = Game_Party.prototype.gainGold;
    Game_Party.prototype.gainGold = function (amount) {
        _Game_Party_gainGold.call(this, amount);
        if (!DataManager.isBattleTest()) {
            $v.set(param.gold, this.gold());
        }
    };

    const _Game_Party_increaseSteps = Game_Party.prototype.increaseSteps;
    Game_Party.prototype.increaseSteps = function () {
        _Game_Party_increaseSteps.call(this);
        $v.set(param.steps, this.steps());
    };

    /**
     * 直前に行動したアクターを返す
     * @returns Game_Actor
     */
    Game_Party.prototype.lastSubjectActor = function () {
        return $gameParty.members().find(e => {
            return e.actorId() === $v.get(param.lastSubjectActorId);
        });
    };

    //-------------------------------------------------------------------------
    // Game_System

    const _Game_System_onBattleStart = Game_System.prototype.onBattleStart;
    Game_System.prototype.onBattleStart = function () {
        _Game_System_onBattleStart.call(this);
        if (!DataManager.isBattleTest()) {
            $v.set(param.battleCount, this.battleCount());
        }
    };

    const _Game_System_onBattleWin = Game_System.prototype.onBattleWin;
    Game_System.prototype.onBattleWin = function () {
        _Game_System_onBattleWin.call(this);
        if (!DataManager.isBattleTest()) {
            $v.set(param.winCount, this.winCount());
        }
    };

    const _Game_System_onBattleEscape = Game_System.prototype.onBattleEscape;
    Game_System.prototype.onBattleEscape = function () {
        _Game_System_onBattleEscape.call(this);
        if (!DataManager.isBattleTest()) {
            $v.set(param.escapeCount, this.escapeCount());
        }
    };

    //-------------------------------------------------------------------------
    // Game_Variables

    const _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function (variableId, value) {
        if (variableId > 0 && variableId < $dataSystem.variables.length) {
            if (typeof value === "number") {
                value = Math.floor(value);
            }
            this._data[variableId] = value;

            /**
             * プラグインパラメータで除外していない変数の場合と、
             * リージョンが変化した場合はリフレッシュを要求
             */
            if (!param.exceptVarIds.includes(variableId)
                || $gameVariables.value(param.lastRegion) !== $gameVariables.value(param.region)) {
                this.onChange();
            }
        }
    };

})();