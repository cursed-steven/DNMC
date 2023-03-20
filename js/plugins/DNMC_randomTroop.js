//=============================================================================
// RPG Maker MZ - DNMC_randomTroop
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/02/05 初版
// 1.1.0  2023/02/26 座標決定ロジック見直し
// 1.2.0  2023/03/06 一時バイオーム対応
// 1.3.0  2023/03/20 特定条件を満たすとランダムでないエンカ発生
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc バイオームごとに敵グループをランダム生成します
 * @author cursed_steven
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
 * @param tmpBiomeVarId
 * @text 一時バイオーム変数
 * @desc イベント・模擬戦用バイオームインデックスを入れる変数
 * @type variable
 * 
 * @param turnCountVarId
 * @text ターン数変数
 * @desc 直近の戦闘の経過ターン数を入れる変数
 * @type variable
 * 
 * @param stateInterested
 * @text 興味が出たステート
 * @desc 興味がないを出さなくなるステート
 * @type state
 * 
 * @param Exceptionals
 * @text 例外的にランダムグルーピングをしない条件
 * @type struct<Exceptional>[]
 */

/*~struct~Exceptional:ja
 *
 * @param condName
 * @text 条件名
 * @desc 動作には関係ない、条件識別用の名称
 * @type string
 * 
 * @param troopId
 * @text 敵グループID
 * @type troop
 * 
 * @param terrain
 * @text 地形タグ
 * @type number
 * @max 7
 * @min 0
 * 
 * @param sw
 * @text スイッチ
 * @desc このスイッチがONだと例外判定になる可能性がある。
 * @type switch
 * 
 * @param var
 * @text 変数
 * @desc この変数が設定条件を満たしていると例外判定になる可能性がある。
 * @type variable
 * 
 * @param ineq
 * @parent var
 * @text 等号・不等号
 * @type select
 * @option 実際値 < 設定値
 * @value <
 * @option 実際値 <= 設定値
 * @value <=
 * @option 実際値 = 設定値
 * @value ==
 * @option 実際値 >= 設定値
 * @value >=
 * @option 実際値 > 設定値
 * @value >
 * 
 * @param value
 * @parent var
 * @text 変数と比較する設定値
 * @type number
 * 
 * @param rate
 * @text 上記条件をすべて満たしたうえでこの確率で出現する
 * @type number
 * @max 100
 * @min 0
 * 
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    const BOX_WIDTH = Graphics.boxWidth ? Graphics.boxWidth : 816;
    const BOX_HEIGHT = Graphics.boxHeight ? Graphics.boxHeight : 624;
    const MAX_NG_COUNT = 99;

    const EXP_RATE = 20;
    const LV_DIFF = 3;
    const STATE_IDS = {
        INTERESTED: param.stateInterested
    };

    const TMP_BIOME_NAMES = [
        "event",
        "training1",
        "training2",
        "training3"
    ];
    let tmpBiomeName = "";

    /**
     * 指定した地形タグに生息する敵のリストを取得して返す
     * @param {number} terrain 
     */
    function getEnemiesOnTerrain(terrain) {
        let biomeName = BIOME_NAMES[terrain];
        if (!biomeName) {
            // バイオーム名が決まらない場合はイベントか模擬戦。
            biomeName = TMP_BIOME_NAMES[$v.get(param.tmpBiomeVarId)];
            tmpBiomeName = biomeName;
        }

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
    // Game_System

    const _Game_System_onBattleWin = Game_System.prototype.onBattleWin;
    /**
     * 直近の戦闘のターン数を指定の変数に入れる
     */
    Game_System.prototype.onBattleWin = function () {
        _Game_System_onBattleWin.call(this);
        $v.set(param.turnCountVarId, $gameParty.leader().turnCount());
    };

    const _Game_System_onBattleEscape = Game_System.prototype.onBattleEscape;
    /**
     * 直近の戦闘のターン数を指定の変数に入れる
     */
    Game_System.prototype.onBattleEscape = function () {
        _Game_System_onBattleEscape.call(this);
        // 逃走した場合は負数にしておく
        $v.set(param.turnCountVarId, $gameParty.leader().turnCount() * -1);
    };

    //-----------------------------------------------------------------------------
    // Game_Player

    /**
     * 例外条件を全部潜り抜ければ敵グループIDは常に1
     * @returns number
     */
    Game_Player.prototype.makeEncounterTroopId = function () {
        // 例外条件の評価(先勝ち)
        const ex = param.Exceptionals.find(e => {
            return CSVN_conditionChecker.checkCondition(
                0,
                0,
                e.sw,
                true,
                e.var,
                e.ineq,
                e.value
            );
        });
        CSVN_base.logGroup("makeEncounterTroopId");
        CSVN_base.log(ex);

        if (ex) {
            // 例外条件に合致するものがあった場合、条件のrateの確率でそれを返す
            if (Math.trueByRate(ex.rate)) {
                CSVN_base.log("HIT!");
                CSVN_base.logGroupEnd("makeEncounterTroopId");
                return ex.troopId;
            } else {
                CSVN_base.logGroupEnd("makeEncounterTroopId");
                return 1;
            }
        } else {
            CSVN_base.logGroupEnd("makeEncounterTroopId");
            return 1;
        }

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

        if (this._enemies.length > 0 || this._troopId != 1) {
            return troop;
        }

        const terrain = DataManager.isBattleTest()
            ? Math.randomInt(7) + 1
            : $gameVariables.value(param.terrain);

        let inBiome = getEnemiesOnTerrain(terrain);
        CSVN_base.log(`biome: ${tmpBiomeName}`);

        if (inBiome.length === 0) {
            return troop;
        }

        let enemyCount = Math.randomInt(8) + 1;
        let indexes = [];
        let ix = -1;

        // 模擬戦の場合は人数をこちらのパーティーに合わせる
        if (tmpBiomeName.includes("training")) enemyCount = $gameParty.battleMembers().length;
        CSVN_base.log(`enemyCount: ${enemyCount}`);

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
            y: getRandomY(dEnemy)
        };

        while (!this.checkRandomXY(xy)) {
            ngCount++;
            // CSVN_base.log(`ng: ${ngCount}`)
            if (ngCount === MAX_NG_COUNT) {
                break;
            } else {
                xy = {
                    x: getRandomX(dEnemy),
                    y: getRandomY(dEnemy)
                };
            }
        }
        return xy;
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
     * HPが7割を切るか、模擬戦の場合は「興味がない」行動を封印→行動するようになる
     * @param {Game_Battler} target 
     * @param {number} value 
     */
    Game_Action.prototype.executeHpDamage = function (target, value) {
        _Game_Action_executeHpDamage.call(this, target, value);

        if (target.hp / target.mhp < 0.7) {
            target.addState(STATE_IDS.INTERESTED);
        }

        if (tmpBiomeName) {
            target.addState(STATE_IDS.INTERESTED);
        }
    };

})();