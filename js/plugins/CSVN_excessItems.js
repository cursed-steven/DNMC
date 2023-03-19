//=============================================================================
// RPG Maker MZ - CSVN_excessItems.js
// ----------------------------------------------------------------------------
// (C)2022 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/11/26 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc アイテム入手で保持最大数を超えた場合の追加処理
 * @author cursed_steven
 * @base CSVN_base
 * @orderAfter CSVN_system3
 * 
 * @help CSVN_excessItems.js
 * 
 * ※このプラグインは特定のメソッドの破壊的改変を含みます
 * ＝ほかのプラグインで変更している部分が無効になる可能性がある
 * 
 * @param gainedAmount
 * @text 超過時に入手した数を入れる変数
 * @type variable
 * 
 * @param excessItemsContainer
 * @text 超過アイテムのコンテナ種別
 * @desc 0:アイテム/1:武器/2:防具のいずれかを入れる変数
 * @type variable
 * 
 * @param excessItemId
 * @text 超過したアイテムのID
 * @type variable
 * 
 * @param excessCount
 * @text 超過分を一時的に保持する変数
 * @type variable
 * 
 * @param cevId
 * @text 超過時に実行するCEV
 * @type common_event
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // Game_Party

    /**
     * アイテム入手改変／
     * アイテム最大保持数を超える場合は上限すり切りにせずCEVを予約する
     * @param {any} item 
     * @param {number} amount 
     * @param {boolean} includeEquip 
     * @returns 
     */
    Game_Party.prototype.gainItem = function (item, amount, includeEquip) {
        const container = this.itemContainer(item);
        if (container) {
            const lastNumber = this.numItems(item);
            const newNumber = lastNumber + amount;
            //container[item.id] = newNumber.clamp(0, this.maxItems(item));
            /**
             * 最大保持数を超える場合は超過分を変数に入れて、
             * CEVを予約して終了
             */
            if (newNumber > this.maxItems(item)) {
                $v.set(param.gainedAmount, amount);
                if (DataManager.isItem(item)) {
                    $v.set(param.excessItemsContainer, 0);
                } else if (DataManager.isWeapon(item)) {
                    $v.set(param.excessItemsContainer, 1);
                } else if (DataManager.isArmor(item)) {
                    $v.set(param.excessItemsContainer, 2);
                }
                $v.set(param.excessItemId, item.id);
                $v.set(param.excessCount, newNumber - this.maxItems(item));
                $gameTemp.reserveCommonEvent(param.cevId);
                return;
            } else {
                container[item.id] = newNumber;
            }
            if (container[item.id] === 0) {
                delete container[item.id];
            }
            if (includeEquip && newNumber < 0) {
                this.discardMembersEquip(item, -newNumber);
            }
            $gameMap.requestRefresh();
        }
    };

})();