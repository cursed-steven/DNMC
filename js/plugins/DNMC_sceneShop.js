//=============================================================================
// RPG Maker MZ - DNMC_sceneShop
// ----------------------------------------------------------------------------
// (C)2022 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/01/24 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc ショップシーンのレイアウト変更等
 * @author cursed_twitch
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help DNMC_sceneShop.js
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // Scene_Shop

    const _Scene_Shop_create = Scene_Shop.prototype.create;
    const _Scene_Map_createMapHUD = Scene_Map.prototype.createMapHUD;
    const _Scene_Map_createButtonGuide = Scene_Map.prototype.createButtonGuide;
    Scene_Shop.prototype.mapHUDRect = Scene_Map.prototype.mapHUDRect;
    Scene_Shop.prototype.HUDHeight = Scene_Map.prototype.HUDHeight;
    Scene_Shop.prototype.buttonGuideRect = Scene_Map.prototype.buttonGuideRect;
    /**
     * ショップシーンにHUDを追加。
     */
    Scene_Shop.prototype.create = function () {
        _Scene_Shop_create.call(this);
        this.createDummyWindow2();
        _Scene_Map_createMapHUD.call(this);
        _Scene_Map_createButtonGuide.call(this);
        this._buttonGuide.refresh();
    };

    /**
     * ヘルプウィンドウ領域を返す
     * @returns Rectangle
     */
    Scene_Shop.prototype.helpWindowRect = function () {
        const wx = 0;
        const wy = this.helpAreaTop();
        const ww = Graphics.boxWidth - this.mapHUDRect().width - this.statusWidth();
        const wh = this.helpAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 所持金ウィンドウ領域を返す
     * @returns Rectangle
     */
    Scene_Shop.prototype.goldWindowRect = function () {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - this.mapHUDRect().width - ww;
        const wy = this.mapHUDRect().y;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * コマンドウィンドウを作成
     */
    Scene_Shop.prototype.createCommandWindow = function () {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_ShopCommand(rect);
        this._commandWindow.setPurchaseOnly(this._purchaseOnly);
        this._commandWindow.setHandler("buy", this.commandBuy.bind(this));
        this._commandWindow.setHandler("sell", this.commandSell.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    };

    /**
     * コマンドウィンドウ領域を返す
     * @returns Rectangle
     */
    Scene_Shop.prototype.commandWindowRect = function () {
        const wx = 0;
        const wy = this._goldWindow.y;
        const ww = this._goldWindow.x;
        const wh = this._goldWindow.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ダミーウィンドウ領域を返す
     * @returns Rectangle
     */
    Scene_Shop.prototype.dummyWindowRect = function () {
        const wx = 0;
        const wy = this._commandWindow.y + this._commandWindow.height;
        const ww = this._commandWindow.width
            + this._goldWindow.width
            - this.statusWidth();
        const wh = this.mainAreaHeight()
            - this._commandWindow.height
            - this._helpWindow.height - 8;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 数量指定ウィンドウ領域を返す
     * @returns Rectangle
     */
    Scene_Shop.prototype.numberWindowRect = function () {
        const wx = 0;
        const wy = this._dummyWindow.y;
        const ww = Graphics.boxWidth
            - this.statusWidth()
            - this.mapHUDRect().width;
        const wh = this._dummyWindow.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ステータスウィンドウ領域を返す
     * @returns Rectangle
     */
    Scene_Shop.prototype.statusWindowRect = function () {
        const ww = this.statusWidth();
        const wh = this._dummyWindow.height + this._helpWindow.height;
        const wx = Graphics.boxWidth - ww - this.mapHUDRect().width;
        const wy = this._dummyWindow.y;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_Shop.prototype.buyWindowRect = Scene_Shop.prototype.numberWindowRect;

    /**
     * アイテムカテゴリウィンドウ領域を返す
     * @returns Rectangle
     */
    Scene_Shop.prototype.categoryWindowRect = function () {
        const wx = 0;
        const wy = this._dummyWindow.y;
        const ww = Graphics.boxWidth - this.mapHUDRect().width;
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 売却ウィンドウ領域を返す
     * @returns Rectangle
     */
    Scene_Shop.prototype.sellWindowRect = function () {
        const wx = 0;
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const ww = this._categoryWindow.width;
        const wh = this.mainAreaHeight()
            - this._commandWindow.height
            - this._categoryWindow.height
            - this._helpWindow.height - 8;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_Shop.prototype.createDummyWindow2 = function () {
        const rect = this.statusWindowRect();
        this._dummyWindow2 = new Window_Base(rect);
        this.addWindow(this._dummyWindow2);
    };

    const _Scene_Shop_activateBuyWindow = Scene_Shop.prototype.activateBuyWindow;
    Scene_Shop.prototype.activateBuyWindow = function () {
        _Scene_Shop_activateBuyWindow.call(this);
        this._dummyWindow2.hide();
    };

    const _Scene_Shop_commandSell = Scene_Shop.prototype.commandSell;
    Scene_Shop.prototype.commandSell = function () {
        _Scene_Shop_commandSell.call(this);
        if (this._categoryWindow.needsSelection()) {
            this._dummyWindow2.show();
            this._dummyWindow2.height -= this._categoryWindow.height;
            this._dummyWindow2.y += this._categoryWindow.height;
        }
    };

    const _Scene_Shop_onBuyCancel = Scene_Shop.prototype.onBuyCancel;
    Scene_Shop.prototype.onBuyCancel = function () {
        _Scene_Shop_onBuyCancel.call(this);
        this._dummyWindow2.show();
    };

    const _Scene_Shop_onSellOk = Scene_Shop.prototype.onSellOk;
    Scene_Shop.prototype.onSellOk = function () {
        _Scene_Shop_onSellOk.call(this);
        this._dummyWindow2.hide();
        if (this._categoryWindow.needsSelection()) {
            this._dummyWindow2.height -= this._categoryWindow.height;
            this._dummyWindow2.y += this._categoryWindow.height;
        }
    };

    const _Scene_Shop_onCategoryCancel = Scene_Shop.prototype.onCategoryCancel;
    Scene_Shop.prototype.onCategoryCancel = function () {
        _Scene_Shop_onCategoryCancel.call(this);
        this._dummyWindow2.height += this._categoryWindow.height;
        this._dummyWindow2.y -= this._categoryWindow.height;
    };

})();