//=============================================================================
// RPG Maker MZ - DNMC_buttonGuide
// ----------------------------------------------------------------------------
// (C)2022 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/12/22 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc Donut Machine 専用ボタンガイド
 * @author cursed_twitch
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help DNMC_buttonGuide.js
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // Scene_Map

    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    /**
     * ボタンガイド作成処理を追加
     */
    Scene_Map.prototype.createAllWindows = function () {
        this.createButtonGuide();
        _Scene_Map_createAllWindows.call(this);
    };

    /**
     * ボタンガイドを作成する。
     */
    Scene_Map.prototype.createButtonGuide = function () {
        const rect = this.buttonGuideRect();
        this._buttonGuide = new Window_ButtonGuide(rect);
        this.addWindow(this._buttonGuide);
    };

    /**
     * ボタンガイドの領域を返す
     * @returns Rectangle
     */
    Scene_Map.prototype.buttonGuideRect = function () {
        const ww = 160;
        const wh = this.calcWindowHeight(2, true);
        const wx = Graphics.boxWidth - ww;
        const wy = 48;
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    /**
     * ボタンガイドの更新処理を追加
     */
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        this._buttonGuide.show();
        this._buttonGuide.refresh();
    };

    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    /**
     * ボタンガイド非表示化処理の追加
     */
    Scene_Map.prototype.terminate = function () {
        this._buttonGuide.hide();
        _Scene_Map_terminate.call(this);
    };

    //-------------------------------------------------------------------------
    // Window_ButtonGuide
    //
    // The window for displaying button guide on the map scene.

    function Window_ButtonGuide() {
        this.initialize(...arguments);
    }

    Window_ButtonGuide.prototype = Object.create(Window_Base.prototype);
    Window_ButtonGuide.prototype.constructor = Window_ButtonGuide;

    /**
     * ボタンガイド初期化
     * @param {Rectangle} rect 
     */
    Window_ButtonGuide.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.setBackgroundType(2);
        this.fontSize = $gameSystem.mainFontSize() * 0.8;
    };

    /**
     * ボタンガイド更新
     */
    Window_ButtonGuide.prototype.refresh = function () {
        this.contents.clear();
        this.contents.fontSize = this.fontSize;
        const sceneName = SceneManager._scene.constructor.name;
        switch (sceneName) {
            case "Scene_Map":
                this.drawSceneMapGuide();
                break;
            case "Scene_Menu":
                // this.drawSceneMenuGuide();
                break;
            case "Scene_Item":
                // this.drawSceneItemGuide();
                break;
            case "Scene_Skill":
                // this.drawSceneSkillGuide();
                break;
            case "Scene_EquipStatus":
                // this.drawSceneEquipStatus();
                break;
            case "Scene_Operation":
                // this.drawSceneOperationStatus();
                break;
            case "Scene_Battle":
                // this.drawSceneBattleGuide();
                break;
        }
        this.contents.fontSize = $gameSystem.mainFontSize();
    };

    /**
     * Scene_Mapのボタンガイド
     */
    Window_ButtonGuide.prototype.drawSceneMapGuide = function () {
        this.drawButton("X", "Xdesc", 0, 0);
        this.drawButton("Y", "Ydesc", 0, this.fontSize * 1.5);
    };

    /**
     * ボタンと説明を描画
     * @param {string} btn 
     * @param {string} desc 
     * @param {number} x 
     * @param {number} y 
     */
    Window_ButtonGuide.prototype.drawButton = function (btn, desc, x, y) {
        const btnWidth = this.fontSize / 2 * (btn.length + 3);
        let width = 0;
        this.drawText("[" + btn + "]", x, y, btnWidth);
        width += btnWidth;
        this.drawText(desc, x + width, y, this.width - width);
    };

})();