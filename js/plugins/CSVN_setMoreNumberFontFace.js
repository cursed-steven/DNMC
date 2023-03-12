/*=============================================================================
 CSVN_setMoreNumberFontFace.js
----------------------------------------------------------------------------
 (C)2021 cursed_steven
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/10/25 初版
 1.1.0 2023/03/06 CustomSkillCostDisplay含めて数字以外の半角英字にも対応
----------------------------------------------------------------------------
 [Twitter]: https://twitter.com/cursed_steven
=============================================================================*/

/*:
 * @target MZ
 * @plugindesc Switch number font to number font.
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author cursed_steven
 * @url
 *
 * @help CSVN_setMoreNumberFontFace.js
 *
 * Switches the character drawing part in each window
 * that consists only of numbers to the number font.
 *
 * Terms:
 *  No permission needed for change or re-distribute this plugin.
 *  But I will be glad to being informed you used or reffered this.
 */

/*:ja
 * @target MZ
 * @plugindesc 数字のフォントを数字フォントに切り替える
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author ノロワレ
 * @url
 *
 * @help CSVN_setMoreNumberFontFace.js
 *
 * 各ウィンドウ中の文字描画箇所のうち数字のみで構成されているところを
 * 数字フォントに切り替えます。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 *  が、使ったとか参考にしたとか伝えてもらえると喜びます。
 */

(() => {
    'use strict';
    //const params = PluginManagerEx.createParameter(document.currentScript);
    const regex = /\w{1,}.?|\d?[ :↓←→↑\%]{1,}\d{1,}|(\\CCS\[\d{1}\]\d{1,}.?)+/g;

    const _Window_Base_drawText = Window_Base.prototype.drawText;
    Window_Base.prototype.drawText = function (text, x, y, maxWidth, align) {
        // 描画したい内容が数値なら数字用フォントを設定
        if (regex.test(text)) {
            this.contents.fontFace = $gameSystem.numberFontFace();
        }

        _Window_Base_drawText.call(this, text, x, y, maxWidth, align);

        // 描画後にフォント設定を戻す
        if (regex.test(text)) {
            this.contents.fontFace = $gameSystem.mainFontFace();
        }
    };

    Window_Base.prototype.drawTextEx = function (text, x, y, width) {
        // this.resetFontSettings();
        if (regex.test(text)) {
            this.contents.fontFace = $gameSystem.numberFontFace();
        }
        const textState = this.createTextState(text, x, y, width);
        this.processAllText(textState);

        return textState.outputWidth;
    };
})();