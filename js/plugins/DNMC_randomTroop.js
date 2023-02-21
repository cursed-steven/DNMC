//=============================================================================
// RPG Maker MZ - DNMC_randomTroop
// ----------------------------------------------------------------------------
// (C)2023 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/02/05 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc バイオームごとに敵グループをランダム生成します
 * @author cursed_twitch
 * @base DNMC_statics
 * @orderAfter DNMC_statics
 * 
 * @help DNMC_randomTroop.js
 * 
 * @param terrain
 * @text 地形タグ
 * @desc プレイヤーがいる地形タグを格納する変数のID
 * @type variable
 * 
 * @param stateInterested
 * @text 興味が出たステート
 * @desc 興味がないを出さなくなるステート
 * @type state
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    const BOX_WIDTH = Graphics.boxWidth ? Graphics.boxWidth : 816;
    const BOX_HEIGHT = Graphics.boxHeight ? Graphics.boxHeight : 624;
    const MAX_NG_COUNT = 10;

    const EXP_RATE = 20;
    const LV_DIFF = 3;
    const STATE_IDS = {
        INTERESTED: param.stateInterested
    };

    /**
     * 指定した地形タグに生息する敵のリストを取得して返す
     * @param {number} terrain 
     */
    function getEnemiesOnTerrain(terrain) {
        const biomeName = BIOME_NAMES[terrain];
        const enemies = $dataEnemies.filter(e => {
            return e && e.meta.biome.split(",").includes(biomeName);
        });

        return enemies;
    }

    /**
     * 敵画像の幅を取得して返す
     * @param {any} dEnemy 
     * @returns number
     */
    function enemyWidth(dEnemy) {
        if (!dEnemy) return 0;
        return Number(ImageManager.loadEnemy(dEnemy.battlerName).width);
    }

    /**
     * 敵画像の高さを取得して返す
     * @param {any} dEnemy 
     * @returns number
     */
    function enemyHeight(dEnemy) {
        if (!dEnemy) return 0;
        return Number(ImageManager.loadEnemy(dEnemy.battlerName).height);
    }

    /**
     * 敵画像の幅を考慮してほどほどな範囲のランダムX座標を返す
     * @param {any} dEnemy 
     * @returns number
     */
    function getRandomX(dEnemy) {
        // 戦闘画面左半分で画像がはみ出さない範囲でランダム
        const randX = Math.max(0, Math.randomInt(BOX_WIDTH / 2 - enemyWidth(dEnemy))) + enemyWidth(dEnemy);
        // 補正
        return randX + 48;
    }

    /**
     * 敵画像の高さを考慮してほどほどな範囲のランダムY座標を返す
     * @param {any} dEnemy 
     * @returns number
     */
    function getRandomY(dEnemy) {
        // ステータスウィンドウより上、戦闘背景1より下でかつはみ出さない範囲でランダム
        const bswh = Window_Selectable.prototype.fittingHeight(4);
        const randY = Math.max(bswh, Math.randomInt(BOX_HEIGHT - bswh - enemyHeight(dEnemy))) + enemyHeight(dEnemy);
        // 補正
        return randY + 180;
    }

    //-----------------------------------------------------------------------------
    // DataManager

    /**
     * 共通スキルかどうかを返す
     * @param {any} skill 
     * @returns boolean
     */
    DataManager.isCommonSkill = function (skill) {
        return Object.keys(COMMON_SKILL_IDS).some(s => {
            return COMMON_SKILL_IDS[s] === skill.id;
        });
    };

    //-----------------------------------------------------------------------------
    // Game_Player

    /**
     * 同じグループの中身を動的に決めるのでIDは常に1でよい
     * @returns number
     */
    Game_Player.prototype.makeEncounterTroopId = function () {
        return 1;
    };

    /**
     * エンカ実行
     * ※適切なバイオームではなかった場合はキャンセル
     * @returns boolean
     */
    Game_Player.prototype.executeEncounter = function () {
        if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
            this.makeEncounterCount();
            const troopId = this.makeEncounterTroopId();
            if ($dataTroops[troopId]) {
                BattleManager.setup(troopId, true, false);
                if ($gameTroop._enemies.length === 0) return false;

                BattleManager.onEncounter();
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    //-----------------------------------------------------------------------------
    // Game_BattlerBase

    const _Game_BattlerBase_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
        if (DataManager.isCommonSkill(skill)) return true;

        return _Game_BattlerBase_canPaySkillCost.call(this, skill);
    }

    //-----------------------------------------------------------------------------
    // Game_Enemy

    const _Game_Enemy_enemy = Game_Enemy.prototype.enemy;
    /**
     * パーティーの最高LVのメンバーよりn以上離れていたら
     * スキル「興味がない」を行動リストに追加
     * @returns Game_Enemy
     */
    Game_Enemy.prototype.enemy = function () {
        let enemy = _Game_Enemy_enemy.call(this);
        const uninterested = {
            "conditionParam1": 0,
            "conditionParam2": 0,
            "conditionType": 0,
            "rating": 9,
            "skillId": COMMON_SKILL_IDS.UNINTERESTED
        };

        if (!this._lvJudged && this.isVeryHighLevel()) enemy.actions.push(uninterested);
        this._lvJudged = true

        return enemy;
    };

    /**
     * 自身がパーティーの最高LVよりも設定値以上高いかどうか
     * @returns boolean
     */
    Game_Enemy.prototype.isVeryHighLevel = function () {
        const enemyLv = $dataEnemies[this._enemyId].exp / EXP_RATE;
        const partyLv = $gameParty.highestLevel();
        CSVN_base.log(`enemyLv: ${enemyLv} - partyLv: ${partyLv}`);

        return enemyLv - partyLv > LV_DIFF;
    };

    //-----------------------------------------------------------------------------
    // Game_Troop

    /**
     * バイオームに対応した敵をランダム選定して返す
     * @returns any[]
     */
    Game_Troop.prototype.troop = function () {
        let troop = $dataTroops[this._troopId];

        if (this._enemies.length > 0) {
            return troop;
        }

        const terrain = DataManager.isBattleTest()
            ? Math.randomInt(7) + 1
            : $gameVariables.value(param.terrain);

        let inBiome = getEnemiesOnTerrain(terrain);

        if (inBiome.length === 0) {
            return troop;
        }

        const enemyCount = Math.randomInt(5);
        let indexes = [];
        let ix = -1;
        while (indexes.length < enemyCount) {
            ix = Math.randomInt(inBiome.length);
            if (!indexes.includes(ix)) {
                indexes.push(ix);
            }
        }

        this._members = [];
        let member = {};
        let xy = {};
        for (const ix of indexes) {
            xy = this.getCheckedRandomXY(inBiome[ix]);
            member = {
                "enemyId": inBiome[ix].id,
                "x": xy.x,
                "y": xy.y,
                "hidden": false
            };
            this._members.push(member);
        }
        troop.members = this._members;

        return troop;

    };

    /**
     * ある程度妥当な値か確認済みのXY座標を返す
     * @param {any} dEnemy 
     * @returns any
     */
    Game_Troop.prototype.getCheckedRandomXY = function (dEnemy) {
        let ngCount = 0;
        let xy = {
            x: getRandomX(dEnemy),
            y: getRandomY(dEnemy),
        };

        if (this.checkRandomXY(xy)) {
            // OKならそのまま返す
            // CSVN_base.log('OK');
            return xy;
        } else {
            // NGなら再抽選して返す
            // CSVN_base.log('NG');
            ngCount++;
            if (ngCount === MAX_NG_COUNT) {
                return xy;
            } else {
                return this.getCheckedRandomXY(dEnemy);
            }
        }
    }

    /**
     * XY座標が妥当かどうか返す
     * @param {any} xy 
     * @returns boolean
     */
    Game_Troop.prototype.checkRandomXY = function (xy) {
        let enemy = null;
        for (const member of this._members) {
            enemy = $dataEnemies[member.enemyId];
            const minX = member.x - enemyWidth(enemy) / 2;
            const minY = member.y - enemyHeight(enemy) / 2;
            const maxX = member.x + enemyWidth(enemy) / 2;
            const maxY = member.y + enemyHeight(enemy) / 2;

            // CSVN_base.log(`minX: ${minX} <= x: ${xy.x} <= maxX: ${maxX}`);
            // CSVN_base.log(`minY: ${minY} <= y: ${xy.y} <= maxY: ${maxY}`);

            if (minX <= xy.x && xy.x <= maxX
                && minY <= xy.y && xy.y <= maxY) {
                return false;
            }
        }

        return true;
    }

    //-----------------------------------------------------------------------------
    // Game_Action

    const _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    /**
     * HPが7割を切ったら「興味がない」行動を封印→行動するようになる
     * @param {Game_Battler} target 
     * @param {number} value 
     */
    Game_Action.prototype.executeHpDamage = function (target, value) {
        _Game_Action_executeHpDamage.call(this, target, value);

        if (target.hp / target.mhp < 0.7) {
            target.addState(STATE_IDS.INTERESTED);
        }
    };

})();