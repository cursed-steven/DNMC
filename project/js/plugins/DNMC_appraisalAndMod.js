//=============================================================================
// RPG Maker MZ - DNMC_appraisalAnd改造
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/06/xx 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 鑑定・改造屋のメニューUIと内部処理。
 * @author cursed_steven
 * @base DNMC_sceneShop
 * @orderAfter DNMC_sceneShop
 * 
 * @help DNMC_appraisalAndMod.js
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-------------------------------------------------------------------------
    // Scene_AppMod
    //
    // The scene class of the appraisal shop scene.

    const _Scene_Map_createMapHUD = Scene_Map.prototype.createMapHUD;
    const _Scene_Map_createButtonGuide = Scene_Map.prototype.createButtonGuide;
    Scene_AppMod.prototype.mapHUDRect = Scene_Map.prototype.mapHUDRect;
    Scene_AppMod.prototype.HUDHeight = Scene_Map.prototype.HUDHeight;
    Scene_AppMod.prototype.buttonGuideRect = Scene_Map.prototype.buttonGuideRect;
    Scene_AppMod.prototype.createQuestHUD = Scene_Map.prototype.createQuestHUD;
    Scene_AppMod.prototype.questHUDRect = Scene_Map.prototype.questHUDRect;

    function Scene_AppMod() {
        this.initialize(...arguments);
    }

    Scene_AppMod.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_AppMod.prototype.constructor = Scene_AppMod;

    Scene_AppMod.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_AppMod.prototype.prepare = function () {
        this._item = null;
    };

    /**
     * 鑑定・改造屋シーン開始
     */
    Scene_AppMod.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createGoldWindow();
        this.createCommandWindow();
        this.createDummyWindow();
        this.createStatusWindow();
        this.createAppraisalWindow();
        this.createModWindow();
        this.createModMatWindow();
        _Scene_Map_createMapHUD.call(this);
        _Scene_Map_createButtonGuide.call(this);
        this._buttonGuide.refresh();
        this.createQuestHUD();
    };

    Scene_AppMod.prototype.helpWindowRect = Scene_Shop.prototype.helpWindowRect;
    Scene_AppMod.prototype.createGoldWindow = Scene_Shop.prototype.createGoldWindow;
    Scene_AppMod.prototype.goldWindowRect = Scene_Shop.prototype.goldWindowRect;

    /**
     * コマンドウィンドウを作成
     */
    Scene_AppMod.prototype.createCommandWindow = function () {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_AppModCommand(rect);
        this._commandWindow.setHandler('appraisal', this.commandAppraisal.bind(this));
        this._commandWindow.setHandler('mod', this.commandMod.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    };

    Scene_AppMod.prototype.commandWindowRect = Scene_Shop.prototype.commandWindowRect;
    Scene_AppMod.prototype.createDummyWindow = Scene_Shop.prototype.createDummyWindow;
    Scene_AppMod.prototype.dummyWindowRect = Scene_Shop.prototype.dummyWindowRect;
    Scene_AppMod.prototype.createStatusWindow = Scene_Shop.prototype.createStatusWindow;
    Scene_AppMod.prototype.statusWindowRect = Scene_Shop.prototype.statusWindowRect;

    /**
     * 鑑定対象選択ウィンドウの作成
     */
    Scene_AppMod.prototype.createAppraisalWindow = function () {
        const rect = this.appraisalaWindowRect();
        this._appraisalWindow = new Window_Appraisal(rect);
        this._appraisalWindow.setupItems();
        this._appraisalWindow.setHelpWindow(this._helpWindow);
        this._appraisalWindow.hide();
        this._appraisalWindow.setHandler('ok', this.onAppraisalOk.bind(this));
        this._appraisalWindow.setHandler('cancel', this.onAppraisalCancel.bind(this));
        this.addWindow(this._appraisalWindow);
    };

    /**
     * 鑑定対象選択ウィンドウの領域を返す
     * @returns Rectangle
     */
    Scene_AppMod.prototype.appraisalaWindowRect = function () {
        const wx = 0;
        const wy = this._commandWindow.y + this._commandWindow.height;
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaHeight() - this._commandWindow.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 改造対象選択ウィンドウの作成
     */
    Scene_AppMod.prototype.createModWindow = function () {
        const rect = this.modWindowRect();
        this._modWindow = new Window_Mod(rect);
        this._modWindow.setupItems();
        this._modWindow.setHelpWindow(this._helpWindow);
        this._modWindow.hide();
        this._modWindow.setHandler('ok', this.onModOk.bind(this));
        this._modWindow.setHandler('cancel', this.onModCancel.bind(this));
        this.addWindow(this._modWindow);
    };

    /**
     * 改造対象選択ウィンドウの領域
     * @returns Rectangle
     */
    Scene_AppMod.prototype.modWindowRect = function () {
        return this.appraisalaWindowRect();
    };

    /**
     * 改造材料ウィンドウの作成
     */
    Scene_AppMod.prototype.createModMatWindow = function () {
        const rect = this.modMatWindowRect();
        this._modMatWindow = new Window_ModMat(rect);
        this._modMatWindow.setupItems();
        this._modMatWindow.setHelpWindow(this._helpWindow);
        this._modMatWindow.hide();
        this._modMatWindow.setHandler('ok', this.onModMatOk.bind(this));
        this._modMatWindow.setHandler('cancel', this.onModMatCancel.bind(this));
        this.addWindow(this._modMatWindow);
    };

    /**
     * 改造材料ウィンドウの領域を返す
     * @returns Rectangle
     */
    Scene_AppMod.prototype.modMatWindowRect = function () {
        return this.modWindowRect();
    };

    Scene_AppMod.prototype.statusWidth = Scene_Shop.prototype.statusWidth;

    /**
     * 鑑定対象の選択に移行
     */
    Scene_AppMod.prototype.activateAppraisalWindow = function () {
        this._appraisalWindow.setMoney(this.money());
        this._appraisalWindow.show();
        this._appraisalWindow.activate();
        this._statusWindow.show();
    };

    /**
     * 改造対象の選択に移行
     */
    Scene_AppMod.prototype.activateModWindow = function () {
        this._modWindow.setMoney(this.money());
        this._modWindow.show();
        this._modWindow.activate();
        this._statusWindow.show();
    };

    /**
     * 鑑定コマンド選択時の処理
     */
    Scene_AppMod.prototype.commandAppraisal = function () {
        this._dummyWindow.hide();
        this.activateAppraisalWindow();
    };

    /**
     * 改造コマンド選択時の処理
     */
    Scene_AppMod.prototype.commandMod = function () {
        this._dummyWindow.hide();
        this.activateModWindow();
    };

    /**
     * 鑑定対象を選択してOKしたときの処理
     */
    Scene_AppMod.prototype.onAppraisalOk = function () {
        this._item = this._appraisalWindow.item();
        this._appraisalWindow.hide();
        this.execAppraisal();
    };

    /**
     * 鑑定対象の選択をキャンセルしたときの処理
     */
    Scene_AppMod.prototype.onAppraisalCancel = function () {
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._appraisalWindow.hide();
        this._statusWindow.hide();
        this._statusWindow.setItem(null);
        this._helpWindow.clear();
    };

    /**
     * 改造対象を選択してOKしたときの処理
     */
    Scene_AppMod.prototype.onModOk = function () {
        this._item = this._modWindow.item();
        this._modWindow.hide();
        this.startSelectModMats();
    };

    /**
     * 改造対象の選択をキャンセルした時の処理
     */
    Scene_AppMod.prototype.onModCancel = function () {
        this._modWindow.deselect();
        this._statusWindow.setItem(null);
        this._helpWindow.clear();
    };

    /**
     * 鑑定実行
     */
    Scene_AppMod.prototype.execAppraisal = function () {
        // TODO
    };

    /**
     * 改造材料の選択を開始
     */
    Scene_AppMod.prototype.startSelectModMats = function () {
        // TODO
    };
})();