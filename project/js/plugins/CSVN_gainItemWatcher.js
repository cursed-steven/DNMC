//=============================================================================
// RPG Maker MZ - CSVN_gainItemWatcher.js
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/04/01 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc アイテムの増減があったときにコモンイベントを実行
 * @author cursed_steven
 * @base CSVN_base
 * @base CSVN_conditionChecker
 * @orderAfter CSVN_base
 * @orderAfter CSVN_excessItems
 * 
 * @help CSVN_gainItemWatcher.js
 * 
 * @param swId
 * @text 戦闘後の実行に使うスイッチ
 * @type switch
 * 
 * @param varId
 * @text 戦闘後の実行に使う変数
 * @type variable
 * 
 * @param cevs
 * @text コモンイベントと実行条件
 * @desc それぞれに設定されているスイッチと変数両方の条件が満たされるとイベントが実行(予約)されます。
 * @type struct<CommonEvent>[]
 */

/*~struct~CommonEvent:ja
 * 
 * @param id
 * @text コモンイベント
 * @type common_event
 * 
 * @param swId
 * @text スイッチ
 * @desc このスイッチがswValueである場合
 * @type switch
 * 
 * @param swValue
 * @parent swId
 * @text スイッチのON/OFF
 * @type boolean
 * 
 * @param varId
 * @text 変数
 * @desc この変数の値が varIneq や varValue をあわせた条件を満たす場合
 * @type variable
 * 
 * @param varIneq
 * @parent varId
 * @text 不等号
 * @type select
 * @option 変数値 < 条件値
 * @value <
 * @option 変数値 <= 条件値
 * @value <=
 * @option 変数値 = 条件値
 * @value ==
 * @option 条件値 <= 変数値
 * @value <=
 * @option 条件値 < 変数値
 * @value <
 * 
 * @param varValue
 * @parent varId
 * @text 条件値
 * @type number
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-------------------------------------------------------------------------
    // Game_Party

    const _Game_Party_gainItem = Game_Party.prototype.gainItem;
    /**
     * アイテム増減後に条件判断を行い、合致したら所定のCEV実行を予約する
     * @param {any} item 
     * @param {number} amount 
     * @param {boolean} includeEquip 
     */
    Game_Party.prototype.gainItem = function (item, amount, includeEquip) {
        _Game_Party_gainItem.call(this, item, amount, includeEquip);

        if (param.cevs) {
            let cevIds = [];
            const cevs = param.cevs.filter(c => {
                return CSVN_conditionChecker.checkCondition(
                    0,
                    0,
                    c.swId,
                    c.swValue,
                    c.varId,
                    c.varIneq,
                    c.varValue
                );
            });

            if ($gameParty.inBattle()) {
                // 戦闘終了後はCEV予約はクリアされてしまうため予約内容を退避
                for (const cev of cevs) {
                    cevIds.push(cev.id);
                }
                $v.set(param.varId, cevIds.join(","));
                $s.on(param.swId);
            } else {
                for (const cev of cevs) {
                    console.log(`> CEV reserved by gainItemWatcher > ${cev.id}`);
                    $gameTemp.reserveCommonEvent(cev.id);
                }
            }
        }
    };

    //-------------------------------------------------------------------------
    // BattleManager

    const _BattleManager_endBattle = BattleManager.endBattle;
    /**
     * ドロップアイテムの処理中に退避したCEVがあれば改めて予約する
     * @param {number} result 
     */
    BattleManager.endBattle = function (result) {
        _BattleManager_endBattle.call(this, result);

        // 退避されているCEVがあれば改めて予約
        if ($s.get(param.swId)) {
            const cevIds = $v.get(param.varId).split(",");
            for (const cevId of cevIds) {
                console.log(`> CEV reserved by gainItemWatcher > ${cevId}`);
                $gameTemp.reserveCommonEvent(cevId);
            }
            $s.off(param.swId);
            $v.set(param.varId, 0);
        }
    };

    /**
     * つぶしておく
     */
    Scene_ItemBase.prototype.checkCommonEvent = function () {
        // 
    };

})();