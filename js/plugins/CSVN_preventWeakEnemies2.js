/*=============================================================================
 CSVN_preventWeakEnemies2.js
----------------------------------------------------------------------------
 (C)2021 cursed_steven
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/08/07 初版
 1.1.0 2021/08/18 メタタグがない場合の挙動を設定可能に
 1.1.1 2021/08/18 メタタグがない場合の設定が空欄の場合落ちる問題の修正
 1.1.2 2021/08/18 あわててconsole.logを消し忘れてたので削除
 2.0.0 2022/07/23 メタタグを入れるのが面倒なので経験値で計算するように変更
 2.0.1 2022/11/18 レートのデフォルト値を追加
 2.1.0 2022/11/29 @base CSVN_base に変更
----------------------------------------------------------------------------
 [Twitter]: https://twitter.com/cursed_steven
=============================================================================*/

/*:
 * @target MZ
 * @plugindesc Prevent the appearance of weak enemies
 * @base CSVN_base
 * @orderAfter CSVN_base
 * @author cursed_steven
 * @url https://note.com/cursed_steven/n/nad70c5354179
 *
 * @help CSVN_preventWeakEnemies2.js
 *
 * Encounters with enemy groups below the average party level minus
 * the set value will be skipped while the specified switch is on.
 *
 * If you do not write a meta tag, it depends on the plugin settings.
 * In addition, since the encounter is judged by the average level of
 * the entire enemy group, even if the enemy character is sufficiently
 * lower than the party level, if there is an enemy character with
 * a higher level in the same group, it will appear together.
 *
 * v1.1.0 Thanks to: Mr. Sasuke Kannaduki
 *
 * Terms:
 *  No permission needed for change or re-distribute this plugin.
 *  But I will be glad to being informed you used or reffered this.
 *
 * @param switchId
 * @text switch ID
 * @desc Attempts to skip while this switch is ON.
 * @type switch
 *
 * @param rate
 * @text EXP rate
 * @desc Divide the total experience points of the enemies by this value to calculate the level of the enemy group.
 * @type number
 * @default 10
 *
 * @param lvDiff
 * @text Setting level difference
 * @desc Encounters with enemy groups below the average party level minus this value will be skipped while the specified switch is on.
 */

/*:ja
 * @target MZ
 * @plugindesc 弱い敵の出現を防ぐ。
 * @base CSVN_base
 * @orderAfter CSVN_base
 * @author ノロワレ
 * @url https://note.com/cursed_steven/n/nad70c5354179
 *
 * @help CSVN_preventWeakEnemies2.js
 *
 * 指定したスイッチが入っている間、パーティーのレベルの平均を
 * 設定値以上下回る敵グループとのエンカウントはスキップされます。
 *
 * メタタグを書いていない場合の挙動はプラグイン設定に依存します。
 * なお、敵グループ全体のレベルの平均でエンカウント要否を判断しますので、
 * パーティーのレベルより十分にレベルが低い敵キャラでも、同グループに
 * レベルの高い敵キャラがいる場合はいっしょに出てくることがあります。
 *
 * v1.1.0 Thanks to: 神無月サスケ=サン
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 *  が、使ったとか参考にしたとか伝えてもらえると喜びます。
 *
 * @param switchId
 * @text 有効判定スイッチID
 * @desc このスイッチがONの間スキップ試行します。
 * @type switch
 *
 * @param rate
 * @text 経験値レート
 * @desc 敵の経験値の合計をこの値で割って敵グループのレベルを算出します。
 * @type number
 * @default 10
 *
 * @param lvDiff
 * @text 設定レベル差
 * @desc 敵グループのLv平均がパーティのLv平均をこの設定値以上下回るとエンカウントがスキップされます。
 * @type number
 */

(() => {
    'use strict';
    const params = PluginManagerEx.createParameter(document.currentScript);

    const _Game_Player_executeEnounter = Game_Player.prototype.executeEncounter;
    Game_Player.prototype.executeEncounter = function () {
        if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
            if ($gameSwitches.value(params.switchId)) {
                const troopId = this.makeEncounterTroopId();
                const result = determineLvDiff(troopId);

                this.makeEncounterCount();
                if (!result) {
                    console.log(">> " + this.constructor.name + " Encounter cancelled.");
                    return false;
                } else {
                    BattleManager.setup(troopId, true, false);
                    BattleManager.onEncounter();
                    return true;
                }
            }
            return _Game_Player_executeEnounter.call(this);
        }
    };

    function determineLvDiff(troopId) {
        let partyLvAve = 0;
        let troopLvAve = 0;

        const dataTroop = $dataTroops[troopId];
        if (dataTroop) {
            console.group(">> CSVN_preventWeakEnemies2 determineLvDiff");

            BattleManager.setup(troopId, true, false);

            const enemies = $gameTroop.aliveMembers();
            let exps = 0;
            let dataEnemy;
            for (const enemy of enemies) {
                if ($dataEnemies[enemy._enemyId]) {
                    dataEnemy = $dataEnemies[enemy._enemyId];
                    //console.log(dataEnemy);
                    exps += dataEnemy.exp;
                }
            }
            troopLvAve = Math.floor(exps / params.rate);
            console.log('troops: ' + troopLvAve);

            const members = $gameParty.aliveMembers();
            let lvs = 0;
            for (const member of members) {
                lvs += Number(member._level);
            }
            partyLvAve = Math.floor(lvs / members.length);
            console.log('party: ' + partyLvAve);

            console.groupEnd(">> CSVN_preventWeakEnemies2 determineLvDiff");

            return partyLvAve - troopLvAve < params.lvDiff;
        } else {
            return false;
        }
    }
})();