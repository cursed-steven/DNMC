//=============================================================================
// RPG Maker MZ - DNMC_questHUD
// ----------------------------------------------------------------------------
// (C)2023 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/02/xx 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 進行中クエストの内容を戦闘以外の画面に常駐表示します。
 * @author cursed_twitch
 * @base CSVN_base
 * @base QuestSystem
 * @orderAfter CSVN_base
 * @orderAfter QuestSystem
 * 
 * @help DNMC_questHUD.js
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // Scene_Map

    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function () {
        this.createQuestHUD();
        _Scene_Map_createAllWindows.call(this);
    };

    /**
     * クエストHUDを作成する
     */
    Scene_Map.prototype.createQuestHUD = function () {
        const rect = this.questHUDRect();
        this._questHUD = new Window_QuestHUD(rect);
        this.addWindow(this._questHUD);
    };

    /**
     * ボタンガイドの領域を返す
     * @returns Rectangle
     */
    Scene_Map.prototype.questHUDRect = function () {
        const ww = Graphics.boxWidth - 160;
        const wh = this.calcWindowHeight(2, true);
        const wx = 0;
        const wy = 48;
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        this._questHUD.show();
        this._questHUD.refresh();
    };

    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function () {
        this._questHUD.hide();
        _Scene_Map_terminate.call(this);
    };

    //-------------------------------------------------------------------------
    // Window_QuestHUD
    //
    // The window for displaying quest HUD on the map scene.

    function Window_QuestHUD() {
        this.initialize(...arguments);
    }

    Window_QuestHUD.prototype = Object.create(Window_Base.prototype);
    Window_QuestHUD.prototype.constructor = Window_QuestHUD;

    Window_QuestHUD.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.setBackgroundType(2);
    };

    Window_QuestHUD.prototype.refresh = function () {
        // TODO
        this.drawText(SceneManager._scene.constructor.name, 0, 0, this.width);
    };

})();