//=============================================================================
// RPG Maker MZ - CSVN_gameEndWindow
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/02/21 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc ゲーム終了時のウィンドウの幅を設定
 * @author cursed_steven
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_gameEndWindow.js
 * 
 * @param width
 * @text ウィンドウの幅(px)
 * @type number
 * @default 160
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    const WIDTH = param.width > Graphics.boxWidth ? Graphics.boxWidth : param.width;

    /**
     * ウィンドウ領域を返す
     * @returns Rectangle
     */
    Scene_GameEnd.prototype.commandWindowRect = function () {
        const ww = WIDTH;
        const wh = this.calcWindowHeight(2, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

})();