//=============================================================================
// RPG Maker MZ - MessageWindowPopup_goldAddon
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/04/05 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc トリアコンタン様開発のフキダシウィンドウプラグイン使用時に所持金ウィンドウも連動させます。
 * @author cursed_steven
 * @base MessageWindowPopup
 * @orderAfter MessageWindowPopup
 * 
 * @help MessageWindowPopup_goldAddon.js
 * 
 * original author: トリアコンタン(triacontane)様
 * 
 * @param WindowLinkage
 * @text ウィンドウ連携
 * @desc 選択肢ウィンドウと数値入力ウィンドウをポップアップウィンドウに連動させます。(MessageWindowPopup.jsに設定を合わせること)
 * @default true
 * @type boolean
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-------------------------------------------------------------------------
    // Scene_Message

    const _Scene_Message_associateWindows = Scene_Message.prototype.associateWindows;
    /**
     * 所持金ウィンドウにもメッセージウィンドウの参照を持たせる
     */
    Scene_Message.prototype.associateWindows = function () {
        _Scene_Message_associateWindows.call(this);
        this._goldWindow.setMessageWindow(this._messageWindow);
    };

    //-------------------------------------------------------------------------
    // Window_Gold

    /**
     * メッセージウィンドウの参照をセットする
     * @param {Window_Message} messageWindow 
     */
    Window_Gold.prototype.setMessageWindow = function (messageWindow) {
        this._messageWindow = messageWindow;
    };

    /**
     * 所持金ウィンドウの位置調整(判断)
     */
    Window_Gold.prototype.updatePlacement = function () {
        if (this.isPopup()) {
            this.updatePlacementPopup();
        }
    };

    /**
     * 所持金ウィンドウの位置調整(実処理)
     */
    Window_Gold.prototype.updatePlacementPopup = function () {
        const x = this._messageWindow.x + this._messageWindow.width - this.width;
        const y = this._messageWindow.y - this.height;
        this.x = x;
        this.y = y;
    };

    //-------------------------------------------------------------------------
    // Window_Message

    const _Window_Message_updatePlacementPopup = Window_Message.prototype.updatePlacementPopup;
    /**
     * 所持金ウィンドウ分の処理も追記
     */
    Window_Message.prototype.updatePlacementPopup = function () {
        _Window_Message_updatePlacementPopup.call(this);

        this._goldWindow.updatePlacement();
    };

})();