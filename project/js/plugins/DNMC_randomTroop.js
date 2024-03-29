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
// 1.5.0  2023/03/27 地形タグではなくリージョンを使う実装に方向転換
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
 * @param regionVarId
 * @text リージョン
 * @desc プレイヤーがいるリージョンを格納する変数のID
 * @type variable
 * 
 * @param tmpBiomeVarId
 * @text 一時バイオーム変数
 * @desc イベント・模擬戦用バイオームインデックスを入れる変数
 * @type variable
 * 
 * @param svActorX
 * @text SVアクターのX座標
 * @desc SVACtorPositionMz.jsを使っている場合はその先頭の値
 * @type number
 * @default 600
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
 * @param region
 * @text リージョン
 * @type number
 * @max 255
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
    const SV_ACTOR_X = param.svActorX ? param.svActorX : 600;

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
     * 指定したリージョンに生息する敵のリストを取得して返す
     * @param {number} region 
     */
    function getEnemiesOnRegion(region) {
        let biomeName = getBiomeName(region);
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
     * リージョンからバイオーム名を返す
     * ※GenerateWorld対応込み
     * @param {number} region 
     * @returns string
     */
    function getBiomeName(region) {
        let biomeName = "";
        // GenerateWorld.js対応
        const key = Object.keys(BIOMES_ON_FIELD).find(k => {
            return k.toString() === region.toString();
        });
        if (key) biomeName = BIOMES_ON_FIELD[key];
        if (!biomeName) biomeName = BIOME_NAMES[region];

        return biomeName;
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
     * Y座標はランダムで決まるのでX座標は自分の幅の分右に出すだけ
     * @param {any} dEnemy 
     * @param {number} pw 
     * @returns number
     */
    function getNextX(dEnemy, pw) {
        return pw + enemyWidth(dEnemy);
    }

    /**
     * 敵画像の高さを考慮してほどほどな範囲のランダムY座標を返す
     * @param {any} dEnemy 
     * @returns number
     */
    function getRandomY(dEnemy) {
        // ステータスウィンドウより上、戦闘背景1より下でかつはみ出さない範囲でランダム
        const bswh = Window_Selectable.prototype.fittingHeight(4);
        const randY = Math.min(bswh, Math.randomInt(BOX_HEIGHT - bswh - enemyHeight(dEnemy))) + enemyHeight(dEnemy);
        // 補正
        return randY + 240;
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
                e.region,
                e.sw,
                true,
                e.var,
                e.ineq,
                e.value
            );
        });
        console.group("makeEncounterTroopId");
        console.log(ex);

        if (ex) {
            // 例外条件に合致するものがあった場合、条件のrateの確率でそれを返す
            if (Math.trueByRate(ex.rate)) {
                console.log("HIT!");
                console.groupEnd("makeEncounterTroopId");
                return ex.troopId;
            } else {
                console.groupEnd("makeEncounterTroopId");
                return 1;
            }
        } else {
            console.groupEnd("makeEncounterTroopId");
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
        console.log(`enemyLv: ${enemyLv} - partyLv: ${partyLv}`);

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

        // (主にテスト用)出現数
        const allCount = 5;

        // ひとつ前に選出したエネミーのX座標
        this._prevX = 0;

        const region = DataManager.isBattleTest()
            ? Math.randomInt(BIOME_NAMES.length)
            : $gameVariables.value(param.regionVarId);

        let inBiome = getEnemiesOnRegion(region);
        console.log(`biome: ${tmpBiomeName}`);

        if (inBiome.length === 0) {
            return troop;
        }

        let enemyCount = Math.randomInt(allCount) + 1;
        let indexes = [];
        let ix = -1;

        // 模擬戦の場合は人数をこちらのパーティーに合わせる
        if (tmpBiomeName.includes("training")) enemyCount = $gameParty.battleMembers().length;
        console.log(`enemyCount: ${enemyCount}`);

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
            this._prevX = xy.x;
            member = {
                "enemyId": inBiome[ix].id,
                "x": xy.x,
                "y": xy.y,
                "hidden": false
            };
            // 自キャラの側にまで入り込んでしまうのは防ぎたい
            if (this._prevX <= SV_ACTOR_X - 48) {
                this._members.push(member);
            }
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
            x: getNextX(dEnemy, this._prevX),
            y: getRandomY(dEnemy)
        };
        return xy;
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