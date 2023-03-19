//=============================================================================
// RPG Maker MZ - DNMC_system3.js
// ----------------------------------------------------------------------------
// (C)2022 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/12/23 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc Donut Machine 専用追加システム設定
 * @author cursed_steven
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help DNMC_system3.js
 * 
 * @param originalCommandNames
 * @text コマンド名
 * @desc 0:装備/ステータス 1:作戦 2:比較 3:回復 4:戦闘専用
 * @type string[]
 * 
 * @param otherStrings
 * @text その他固定文字列
 * @type string[]
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // TextManager

    /**
     * PPで指定した専用コマンド名を返す
     * @param {number} commandId 
     * @returns string
     */
    TextManager.originalCommand = function (commandId) {
        return param.originalCommandNames[commandId];
    };

    /**
     * PPで指定したその他の文字列を返す。
     * @param {number} index 
     * @returns string
     */
    TextManager.others = function (index) {
        return param.otherStrings[index];
    }

})();