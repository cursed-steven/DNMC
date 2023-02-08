//=============================================================================
// RPG Maker MZ - CSVN_DevHUD.js
// ----------------------------------------------------------------------------
// (C)2022 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/11/16 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 開発用HUD
 * @author cursed_twitch
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_DevHUD.js
 * 
 * @param mapId
 * @text マップID
 * @desc プレイヤーがいるマップIDを格納する変数のID
 * @type variable
 * 
 * @param x
 * @text X座標
 * @desc プレイヤーがいるマップ上のX座標を格納する変数のID
 * @type variable
 * 
 * @param y
 * @text Y座標
 * @desc プレイヤーがいるマップ上のY座標を格納する変数のID
 * @type variable
 * 
 * @param region
 * @text リージョン
 * @desc プレイヤーがいるリージョンを格納する変数のID
 * @type variable
 * 
 * @param terrain
 * @text 地形タグ
 * @desc プレイヤーがいる地形タグを格納する変数のID
 * @type variable
 * 
 * @param xTextOffset
 * @text テキストX座標オフセット
 * @desc テキスト位置の微調整(X座標)
 * @type number
 * 
 * @param yTextOffset
 * @text テキストY座標オフセット
 * @desc テキスト位置の微調整(Y座標)
 * @type number
 * 
 * @param debugModeSwId
 * @text DEBUG MODE スイッチのID
 * @desc 
 * @default 1
 * @type switch
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const xOffset = param.xTextOffset ? param.xTextOffset : 0;
    const yOffset = param.yTextOffset ? param.yTextOffset : 0;

    //-------------------------------------------------------------------------
    // Scene_Map

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);

        if ($s.get(param.debugModeSwId)) this.createHudWindow();
    };

    Scene_Map.prototype.createHudWindow = function () {
        const rect = this.hudWindowRect();
        this._hudWindow = new Window_HUD(rect);
        this.addWindow(this._hudWindow);
    };

    Scene_Map.prototype.hudWindowRect = function () {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth - this._menuButton.width - 8;
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);

        if ($s.get(param.debugModeSwId)) this.updateHUD();
    };

    Scene_Map.prototype.updateHUD = function () {
        this._hudWindow.refresh();
    };

    //-------------------------------------------------------------------------
    // Window_HUD
    //
    // The window class for HUD for DEBUG MODE.

    function Window_HUD() {
        this.initialize(...arguments);
    }

    Window_HUD.prototype = Object.create(Window_Base.prototype);
    Window_HUD.prototype.constructor = Window_HUD;

    Window_HUD.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._mapContent = "";
        this._xContent = "";
        this._yContent = "";
        this._regionContent = "";
        this._terrainContent = "";
        this.setBackgroundType(2);
    };

    Window_HUD.prototype.setContent = function () {
        this.setMapContent();
        this.setXContent();
        this.setYContent();
        this.setRegionContent();
        this.setTerrainContent();
    };

    Window_HUD.prototype.setMapContent = function () {
        this._mapContent = "Map ID: " + $v.get(param.mapId);
    };

    Window_HUD.prototype.setXContent = function () {
        this._xContent = " X: " + $v.get(param.x);
    };

    Window_HUD.prototype.setYContent = function () {
        this._yContent = " Y: " + $v.get(param.y);
    };

    Window_HUD.prototype.setRegionContent = function () {
        this._regionContent = " Region: " + $v.get(param.region);
    };

    Window_HUD.prototype.setTerrainContent = function () {
        this._terrainContent = " Terrain: " + $v.get(param.terrain);
    };

    Window_HUD.prototype.mapTextRect = function () {
        const baseTextRect = this.baseTextRect();
        const wx = 0;
        const wy = 0;
        const ww = baseTextRect.width / 5;
        const wh = baseTextRect.height;
        return new Rectangle(wx + xOffset, wy + yOffset, ww, wh);
    };

    Window_HUD.prototype.xTextRect = function () {
        const baseTextRect = this.baseTextRect();
        const wx = baseTextRect.width / 5;
        const wy = 0;
        const ww = baseTextRect.width / 5;
        const wh = baseTextRect.height;
        return new Rectangle(wx + xOffset, wy + yOffset, ww, wh);
    };

    Window_HUD.prototype.yTextRect = function () {
        const baseTextRect = this.baseTextRect();
        const wx = baseTextRect.width / 5 * 2;
        const wy = 0;
        const ww = baseTextRect.width / 5;
        const wh = baseTextRect.height;
        return new Rectangle(wx + xOffset, wy + yOffset, ww, wh);
    };

    Window_HUD.prototype.regionTextRect = function () {
        const baseTextRect = this.baseTextRect();
        const wx = baseTextRect.width / 5 * 3;
        const wy = 0;
        const ww = baseTextRect.width / 5;
        const wh = baseTextRect.height;
        return new Rectangle(wx + xOffset, wy + yOffset, ww, wh);
    };

    Window_HUD.prototype.terrainTextRect = function () {
        const baseTextRect = this.baseTextRect();
        const wx = baseTextRect.width / 5 * 4;
        const wy = 0;
        const ww = baseTextRect.width / 5;
        const wh = baseTextRect.height;
        return new Rectangle(wx + xOffset, wy + yOffset, ww, wh);
    };

    Window_HUD.prototype.refresh = function () {
        this.setContent();
        const mapTextRect = this.mapTextRect();
        const regionTextRect = this.regionTextRect();
        const terrainTextRext = this.terrainTextRect();
        const xTextRect = this.xTextRect();
        const yTextRect = this.yTextRect();
        this.contents.clear();
        this.drawTextEx(this._mapContent, mapTextRect.x, mapTextRect.y, mapTextRect.width);
        this.drawTextEx(this._regionContent, regionTextRect.x, regionTextRect.y, regionTextRect.width);
        this.drawTextEx(this._terrainContent, terrainTextRext.x, terrainTextRext.y, terrainTextRext.width);
        this.drawTextEx(this._xContent, xTextRect.x, xTextRect.y, xTextRect.width);
        this.drawTextEx(this._yContent, yTextRect.x, yTextRect.y, yTextRect.width);
    };

})();