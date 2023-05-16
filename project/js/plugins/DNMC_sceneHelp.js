//=============================================================================
// RPG Maker MZ - DNMC_sceneHelp
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/05/17 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc ヘルプシーンのレイアウトカスタマイズです。
 * @author cursed_steven
 * @base CSVN_sceneHelp
 * @orderAfter CSVN_sceneHelp
 * 
 * @help DNMC_sceneHelp.js
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Scene_Map_createMapHUD = Scene_Map.prototype.createMapHUD;
    Scene_Help.prototype.createGoldWindow = Scene_Menu.prototype.createGoldWindow;
    Scene_Help.prototype.goldWindowRect = Scene_Menu.prototype.goldWindowRect;
    Scene_Help.prototype.mapHUDRect = Scene_Map.prototype.mapHUDRect;
    Scene_Help.prototype.HUDHeight = Scene_Map.prototype.HUDHeight;
    Scene_Help.prototype.createQuestHUD = Scene_Map.prototype.createQuestHUD;
    Scene_Help.prototype.questHUDRect = Scene_Map.prototype.questHUDRect;

    //-------------------------------------------------------------------------
    // Scene_Help

    const _Scene_Help_create = Scene_Help.prototype.create;
    Scene_Help.prototype.create = function () { 
        _Scene_Help_create.call(this);
        _Scene_Map_createMapHUD.call(this);
        this.createQuestHUD();
        this.createCommandWindow();
        this.createGoldWindow();
    };

    /**
     * クエストHUDの表示と更新を追加
     */
    Scene_Help.prototype.update = function () {
        Scene_ItemBase.prototype.update.call(this);
        this._questHUD.show();
        this._questHUD.refresh();
    };

    /**
     * 選択後のコマンドウィンドウ作成。
     */
    Scene_Help.prototype.createCommandWindow = function () {
        const rect = this.commandWindowRect();
        const commandWindow = new Window_MenuCommand(rect);
        this.addWindow(commandWindow);
        this._commandWindow = commandWindow;
        this._commandWindow.deactivate();
    };

    /**
     * 選択後のコマンドウィンドウ領域を返す。
     * @returns Rectangle
     */
    Scene_Help.prototype.commandWindowRect = function () {
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.calcWindowHeight(1, true) - 8;
        const wx = Graphics.boxWidth - ww - 160;
        const wy = this.calcWindowHeight(3, true);
        return new Rectangle(wx, wy, ww, wh);
    };

})();