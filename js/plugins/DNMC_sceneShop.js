//=============================================================================
// RPG Maker MZ - DNMC_sceneShop
// ----------------------------------------------------------------------------
// (C)2022 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/01/24 初版
// 1.0.1  2023/03/17 クエストHUD対応
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc ショップシーンのレイアウト変更等
 * @author cursed_steven
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
    Scene_Shop.prototype.createQuestHUD = Scene_Map.prototype.createQuestHUD;
    Scene_Shop.prototype.questHUDRect = Scene_Map.prototype.questHUDRect;

    /**
     * ショップシーンにHUDを追加。
     */
    Scene_Shop.prototype.create = function () {
        _Scene_Shop_create.call(this);
        this.createDummyWindow2();
        _Scene_Map_createMapHUD.call(this);
        _Scene_Map_createButtonGuide.call(this);
        this._buttonGuide.refresh();
        this.createQuestHUD();
    };

    const _Scene_Shop_update = Scene_Shop.prototype.update;
    /**
     * クエストHUD表示を追加
     */
    Scene_Shop.prototype.update = function () {
        _Scene_Shop_update.call(this);
        this._questHUD.show();
        this._questHUD.refresh();
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
        const wy = this.calcWindowHeight(3, true);
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
     * ダミーウィンドウ(=店の売り物 or パーティーの売り物が並ぶ部分)領域を返す
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
        const ww = this._categoryWindow.width - this._statusWindow.width;
        const wh = this.mainAreaHeight()
            - this._commandWindow.height
            - this._categoryWindow.height
            - this._helpWindow.height - 8;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ダミーウィンドウ２(=ステータスウィンドウ領域にあたる)の領域を返す
     */
    Scene_Shop.prototype.createDummyWindow2 = function () {
        const rect = this.statusWindowRect();
        this._dummyWindow2 = new Window_Base(rect);
        this.addWindow(this._dummyWindow2);
    };

    const _Scene_Shop_activateBuyWindow = Scene_Shop.prototype.activateBuyWindow;
    /**
     * 買い物ウィンドウの有効化
     */
    Scene_Shop.prototype.activateBuyWindow = function () {
        _Scene_Shop_activateBuyWindow.call(this);
        this._dummyWindow2.hide();
    };

    const _Scene_Shop_commandSell = Scene_Shop.prototype.commandSell;
    /**
     * 売り物ウィンドウの有効化
     */
    Scene_Shop.prototype.commandSell = function () {
        _Scene_Shop_commandSell.call(this);
        if (this._categoryWindow.needsSelection()) {
            this._dummyWindow2.show();
            this._dummyWindow2.height -= this._categoryWindow.height;
            this._dummyWindow2.y += this._categoryWindow.height;
        }
    };

    const _Scene_Shop_onBuyCancel = Scene_Shop.prototype.onBuyCancel;
    /**
     * 買い物ウィンドウでキャンセルしたときの処理
     */
    Scene_Shop.prototype.onBuyCancel = function () {
        _Scene_Shop_onBuyCancel.call(this);
        this._dummyWindow2.show();
    };

    const _Scene_Shop_onSellOk = Scene_Shop.prototype.onSellOk;
    /**
     * 売り物ウィンドウでOKしたときの処理
     */
    Scene_Shop.prototype.onSellOk = function () {
        _Scene_Shop_onSellOk.call(this);
        this._dummyWindow2.hide();
        if (this._categoryWindow.needsSelection()) {
            // 売り物のカテゴリウィンドウの分ダミー２の高さを削ってY座標を下げる
            this._dummyWindow2.height -= this._categoryWindow.height;
            this._dummyWindow2.y += this._categoryWindow.height;
        }
    };

    const _Scene_Shop_onNumberOk = Scene_Shop.prototype.onNumberOk;
    /**
     * 売り買いで数量を決めてOKしたときの処理
     */
    Scene_Shop.prototype.onNumberOk = function () {
        _Scene_Shop_onNumberOk.call(this);
        switch (this._commandWindow.currentSymbol()) {
            case "buy":
                // 
                break;
            case "sell":
                this._dummyWindow2.show();
                if (this._categoryWindow.needsSelection()) {
                    // 売り物のカテゴリウィンドウの分ダミー２の高さを増やしてY座標をあげる
                    this._dummyWindow2.height += this._categoryWindow.height;
                    this._dummyWindow2.y -= this._categoryWindow.height;
                }
                break;
        }
    };

    const _Scene_Shop_onNumberCancel = Scene_Shop.prototype.onNumberCancel;
    /**
     * 売却数量選択でキャンセルした時の処理
     */
    Scene_Shop.prototype.onNumberCancel = function () {
        _Scene_Shop_onNumberCancel.call(this);
        this._dummyWindow2.show();
        if (this._categoryWindow.needsSelection()) {
            // 売り物のカテゴリウィンドウの分ダミー２の高さを増やしてY座標をあげる
            this._dummyWindow2.height += this._categoryWindow.height;
            this._dummyWindow2.y -= this._categoryWindow.height;
        }
    };

    const _Scene_Shop_onCategoryCancel = Scene_Shop.prototype.onCategoryCancel;
    /**
     * 売り物のカテゴリ選択時にキャンセルした時の処理
     */
    Scene_Shop.prototype.onCategoryCancel = function () {
        _Scene_Shop_onCategoryCancel.call(this);
        this._dummyWindow2.height += this._categoryWindow.height;
        this._dummyWindow2.y -= this._categoryWindow.height;
    };

    //-----------------------------------------------------------------------------
    // Window_ShopSell

    /**
     * 列数変更
     * @returns number
     */
    Window_ShopSell.prototype.maxCols = function () {
        return 1;
    };

})();