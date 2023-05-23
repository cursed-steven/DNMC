//=============================================================================
// RPG Maker MZ - DNMC_MapHUD
// ----------------------------------------------------------------------------
// (C)2022 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/12/22 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc Donut Machine 専用HUD
 * @author cursed_steven
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help DNMC_MapHUD.js
 */

//-----------------------------------------------------------------------------
// Window_MapHUD
//
// The window for displaying party member status on the map scene.

function Window_MapHUD() {
    this.initialize(...arguments);
}

Window_MapHUD.prototype = Object.create(Window_MenuStatus.prototype);
Window_MapHUD.prototype.constructor = Window_MapHUD;

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // Scene_Map

    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function () {
        this.createMapHUD();
        _Scene_Map_createAllWindows.call(this);
    };

    /**
     * HUDを作成する。
     */
    Scene_Map.prototype.createMapHUD = function () {
        const rect = this.mapHUDRect();
        this._mapHUD = new Window_MapHUD(rect);
        this.addWindow(this._mapHUD);
    };

    /**
     * HUDの領域を返す。
     * @returns Rectangle
     */
    Scene_Map.prototype.mapHUDRect = function () {
        const ww = 160;
        const wh = this.HUDHeight();
        const wx = Graphics.boxWidth - ww;
        const wy = this.calcWindowHeight(3, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    /**
     * HUD用処理追加
     */
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        this._mapHUD.height = this.HUDHeight();
        this._mapHUD.show();
        this._mapHUD.refresh();
    };

    /**
     * HUDの高さを返す
     * @returns number
     */
    Scene_Map.prototype.HUDHeight = function () {
        return this.calcWindowHeight(3 * $gameParty.size(), true);
    };

    const _Scene_Menu_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function () {
        this._mapHUD.hide();
        _Scene_Menu_terminate.call(this);
    };

    /**
     * HUDを初期化する。
     * @param {Rectangle} rect 
     */
    Window_MapHUD.prototype.initialize = function (rect) {
        Window_MenuStatus.prototype.initialize.call(this, rect);
        this.setBackgroundType(2);
    };

    /**
     * HUDの列数を返す。
     * @returns number
     */
    Window_MapHUD.prototype.maxCols = function () {
        return 1;
    };

    /**
     * HUDの行数を返す。
     * @returns number
     */
    Window_MapHUD.prototype.numVisibleRows = function () {
        return $gameParty.size() < 4 ? $gameParty.size() : 4;
    };

    /**
     * HUDの1人分を描画する。
     * @param {number} index 
     */
    Window_MapHUD.prototype.drawItem = function (index) {
        // For credit screen.
        if (DNMC_base.isMapForCredit()) return;

        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const x = rect.x;
        const y = rect.y;
        const lineHeight = this.lineHeight();
        this.drawActorName(actor, x, y);
        this.placeSimpleGauges(actor, x, y + lineHeight);
        this.drawActorIcons(actor, x, y + lineHeight + this.gaugeLineHeight() * 2 + this.itemPadding());
    };

    /**
     * HP/MPのみのゲージを描画する。
     * @param {Game_Actor} actor 
     * @param {number} x 
     * @param {number} y 
     */
    Window_MapHUD.prototype.placeSimpleGauges = function (actor, x, y) {
        this.placeGauge(actor, "hp", x, y);
        this.placeGauge(actor, "mp", x, y + this.gaugeLineHeight());
    };

})();