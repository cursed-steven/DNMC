//=============================================================================
// RPG Maker MZ - CSVN_debugWindowValueLonger
// ----------------------------------------------------------------------------
// (C)2023 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/03/18 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc デバッグウィンドウの値部分の幅を広げます。
 * @author cursed_twitch
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_debugWindowValueLonger.js
 * 
 * @param valueWidth
 * @text 値部分長さ
 * @desc 半角文字でこれくらい長くしたい、というのを入れます。フォントにもよるけど30字くらいが限界。
 * @type string
 * @default xxxxxxxxx
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    Window_DebugEdit.prototype.drawItem = function (index) {
        const dataId = this._topId + index;
        const idText = dataId.padZero(4) + ": ";
        const idWidth = this.textWidth(idText);
        const statusWidth = this.textWidth(param.valueWidth.toString());
        const name = this.itemName(dataId);
        const status = this.itemStatus(dataId);
        const rect = this.itemLineRect(index);
        this.resetTextColor();
        this.drawText(idText, rect.x, rect.y, idWidth);
        this.drawText(name, rect.x + idWidth, rect.y, 400);
        this.drawText(status, rect.x + idWidth + 400, rect.y, statusWidth, "right");
    };

})();