/*=============================================================================
 CSVN_applyCriticalByFormula.js
----------------------------------------------------------------------------
 (C)2021 cursed_steven
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/06/24 初版
----------------------------------------------------------------------------
 [Twitter]: https://twitter.com/cursed_steven
=============================================================================*/

/*:ja
 * @target MZ
 * @plugindesc クリティカルがでたとき専用ダメージ計算式
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author ノロワレ
 * @url https://note.com/cursed_steven/n/n26a7b2096142
 *
 * @help CSVN_applyCriticalByFormula.js
 *
 * クリティカルがでたとき専用ダメージ計算式を適用します。
 * 計算式はスキルの計算式と同様のものに加え、入力されたダメージ値を
 * v として表現できます。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 *  が、使ったとか参考にしたとか伝えてもらえると喜びます。
 *
 * @param formula
 * @text 計算式
 * @type text
 * @default a.atk
 * @desc スキル編集の計算式部分と同様に設定できます
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const params = PluginManagerEx.createParameter(script);
    const formula = params.formula
    
    // 上書き
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        const item = this.item();
        const baseValue = this.evalDamageFormula(target);
        let value = baseValue * this.calcElementRate(target);
        if (this.isPhysical()) {
            value *= target.pdr;
        }
        if (this.isMagical()) {
            value *= target.mdr;
        }
        if (baseValue < 0) {
            value *= target.rec;
        }
        if (critical) {
            value = this.applyCritical(target, value);
        }
        value = this.applyVariance(value, item.damage.variance);
        value = this.applyGuard(value, target);
        value = Math.round(value);
        return value;
    };

    // 上書き
    Game_Action.prototype.applyCritical = function(target, damage) {

        const a = this.subject(); // eslint-disable-line no-unused-vars
        const b = target; // eslint-disable-line no-unused-vars
        const v = damage; // eslint-disable-line no-unused-vars

        let result = eval(formula);

        if (this.isPhysical()) {

            // 物理攻撃の場合は a.atk を採用
            result = Math.max(result, a.atk);            

        }

        return result;

    };

})();