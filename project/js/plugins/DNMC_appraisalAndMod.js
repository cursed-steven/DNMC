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
 * 
 * @param startIxItemForApp
 * @text 鑑定対象となるアイテムID開始
 * @type item
 * @default 382
 * 
 * @param endIxItemForApp
 * @text 鑑定対象となるアイテムID終了
 * @type item
 * @default 401
 * 
 * @param startIxItemForModMat
 * @text 改造材料となるアイテムID開始
 * @type item
 * @default 452
 * 
 * @param endIxItemForModMat
 * @text 改造材料となるアイテムID終了
 * @type item
 * @default 523
 * 
 * @command start
 * @text シーン開始
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const START_IX_ITEM_FOR_APP = param.startIxItemForApp ? param.startIxItemForApp : 382;
    const END_IX_ITEM_FOR_APP = param.endIxItemForApp ? param.endIxItemForApp : 401;
    const START_IX_ITEM_FOR_MODMAT = param.startIxItemForModMat ? param.startIxItemForModMat : 452;
    const END_IX_ITEM_FOR_MODMAT = param.endIxItemForModMat ? param.endIxItemForModMat : 523;

    PluginManagerEx.registerCommand(script, 'start', () => {
        SceneManager.push(Scene_AppMod);
    });

    //-------------------------------------------------------------------------
    // Scene_AppMod
    //
    // The scene class of the appraisal shop scene.

    const _Scene_Map_createMapHUD = Scene_Map.prototype.createMapHUD;
    const _Scene_Map_createButtonGuide = Scene_Map.prototype.createButtonGuide;
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
        this.createModCommandWindow();
        this.createModMatWindow();
        this.createModDelWindow();
        this.createModResultWindow();
        _Scene_Map_createMapHUD.call(this);
        _Scene_Map_createButtonGuide.call(this);
        this._buttonGuide.refresh();
        this.createQuestHUD();
    };

    Scene_AppMod.prototype.helpWindowRect = Scene_Shop.prototype.helpWindowRect;
    Scene_AppMod.prototype.createGoldWindow = Scene_Shop.prototype.createGoldWindow;
    Scene_AppMod.prototype.goldWindowRect = Scene_Shop.prototype.goldWindowRect;

    /**
     * HUDの領域を返す。
     * @returns Rectangle
     */
    Scene_AppMod.prototype.mapHUDRect = function () {
        const ww = 160;
        const wh = this.HUDHeight();
        const wx = Graphics.boxWidth - ww;
        const wy = this.calcWindowHeight(3, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * HUDの高さを返す
     * @returns number
     */
    Scene_AppMod.prototype.HUDHeight = function () {
        return this.calcWindowHeight(3 * $gameParty.size(), true);
    };

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
     * 追加改造/削除改造の選択ウィンドウの作成
     */
    Scene_AppMod.prototype.createModCommandWindow = function () { 
        const rect = this.modCommandWindowRect();
        this._modCommandWindow = new Window_ModCommand(rect);
        this._modCommandWindow.hide();
        this._modCommandWindow.setHandler('modadd', this.commandModAdd.bind(this));
        this._modCommandWindow.setHandler('moddel', this.commandModDel.bind(this));
        this._modCommandWindow.setHandler('cancel', this.onModComCancel.bind(this));
        this.addWindow(this._modCommandWindow);
    };

    /**
     * 追加改造/削除改造の選択ウィンドウの領域を返す
     */
    Scene_AppMod.prototype.modCommandWindowRect = function () { 
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(3, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - this._commandWindow.y - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 改造材料ウィンドウの作成
     */
    Scene_AppMod.prototype.createModMatWindow = function () {
        const rect = this.modMatWindowRect();
        this._modMatWindow = new Window_ModMat(rect);
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
        return this.dummyWindowRect();
    };

    /**
     * 削除対象とする特徴の選択ウィンドウの作成
     */
    Scene_AppMod.prototype.createModDelWindow = function () { 
        const rect = this.dummyWindowRect();
        this._modDelWindow = new Window_ModDel(rect);
        this._modDelWindow.hide();
        this._modDelWindow.setHandler('ok', this.onModDelOk.bind(this));
        this._modDelWindow.setHandler('cancel', this.onModDelCancel.bind(this));
        this.addWindow(this._modDelWindow);
    };

    /**
     * 削除対象とする特徴の選択ウィンドウの領域を返す
     */
    Scene_AppMod.prototype.modDelWindowRect = function () { 
        return this.dummyWindowRect();
    };

    Scene_AppMod.prototype.statusWidth = Scene_Shop.prototype.statusWidth;

    /**
     * 鑑定コマンド選択時の処理
     */
    Scene_AppMod.prototype.commandAppraisal = function () {
        this._dummyWindow.hide();
        this._appraisalWindow.setMoney(this.money());
        this._appraisalWindow.show();
        this._appraisalWindow.activate();
        this._commandWindow.deactivate();
    };
    
    /**
     * 改造コマンド選択時の処理
     */
    Scene_AppMod.prototype.commandMod = function () {
        this._dummyWindow.hide();
        this._modWindow.setMoney(this.money());
        this._modWindow.show();
        this._modWindow.activate();
        this._modWindow.selectLast();
        this._statusWindow.show();
        this._commandWindow.deactivate();
    };

    /**
     * 鑑定対象を選択してOKしたときの処理
     */
    Scene_AppMod.prototype.onAppraisalOk = function () {
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
        this._helpWindow.clear();
    };

    /**
     * 鑑定実行
     */
    Scene_AppMod.prototype.execAppraisal = function () {
        // TODO this._appraisalWindow.item() から鑑定結果の
        //      ランク(meta)
        //      スロット(meta)
        // TODO ランクごとに鑑定料を提示
        // TODO ランクから対象職業をランダム決定
        // TODO 武器(=スロット1)の場合 DNMC_randomWeapons で生成
        // TODO 防具(=スロット2-5)の場合 DNMC_randomArmors で生成
        //      ※武器タイプ・防具タイプは職業からランダム決定されるので手で決めなくてよい
        // TODO アニメーションか何かで演出
        // TODO 生成したものをインベントリに追加して鑑定対象アイテムを減らす
        // TODO 鑑定結果の表示
        // TODO 鑑定料徴収
    };

    /**
     * 改造対象を選択してOKしたときの処理
     */
    Scene_AppMod.prototype.onModOk = function () {
        this._modWindow.hide();
        this._modCommandWindow.show();
        this._modCommandWindow.activate();
        this._modWindow.deactivate();
    };

    /**
     * 改造対象の選択をキャンセルした時の処理
     */
    Scene_AppMod.prototype.onModCancel = function () {
        this._modMatWindow.deselect();
        this._modMatWindow.deactivate();
        this._modMatWindow.hide();
        this._modWindow.show();
        this._modWindow.activate();
        this._helpWindow.clear();
    };

    /**
     * 追加改造/削除改造の選択ウィンドウで追加改造を選んだときの処理
     */
    Scene_AppMod.prototype.commandModAdd = function () {
        this._modCommandWindow.hide();
        this._modMatWindow.show();
        this._modMatWindow.activate();
        this._modCommandWindow.deactivate();
    };

    /**
     * 追加改造/削除改造の選択ウィンドウで削除改造を選んだときの処理
     */
    Scene_AppMod.prototype.commandModDel = function () { 
        this._modCommandWindow.hide();
        this._modDelWindow.show();
        this._modDelWindow.activate();
        this._modCommandWindow.deactivate();
    };

    /**
     * 追加改造/削除改造の選択ウィンドウでキャンセルを選んだときの処理
     */
    Scene_AppMod.prototype.onModComCancel = function () { 
        this._modCommandWindow.hide();
        this._modWindow.activate();
        this._modCommandWindow.deactivate();
    };

    /**
     * 追加改造の材料を選択してOKしたときの処理
     */
    Scene_AppMod.prototype.onModMatOk = function () { 
        this._modMatWindow.hide();
        this.execModAdd();
    };

    /**
     * 追加改造の材料を選択でキャンセルしたときの処理
     */
    Scene_AppMod.prototype.onModMatCancel = function () { 
        // TODO
    };

    /**
     * 削除改造ウィンドウで対象を選択してOKしたときの処理
     */
    Scene_AppMod.prototype.onModDelOk = function () { 
        // TODO
    };

    /**
     * 削除改造ウィンドウでキャンセルしたときの処理
     */
    Scene_AppMod.prototype.onModDelCancel = function () { 
        // TODO
    };

    //-----------------------------------------------------------------------------
    // Window_AppModCommand
    //
    // The window for selecting appraisal/mod on the appmod shop screen.

    function Window_AppModCommand() {
        this.initialize(...arguments);
    }

    Window_AppModCommand.prototype = Object.create(Window_HorzCommand.prototype);
    Window_AppModCommand.prototype.constructor = Window_AppModCommand;

    /**
     * 初期化
     * @param {Rectangle} rect 
     */
    Window_AppModCommand.prototype.initialize = function (rect) {
        Window_HorzCommand.prototype.initialize.call(this, rect);
    };

    /**
     * 列数を返す
     * @returns number
     */
    Window_AppModCommand.prototype.maxCols = function () {
        return 3;
    };

    /**
     * コマンドリスト作成
     */
    Window_AppModCommand.prototype.makeCommandList = function () {
        const appCommandName = TextManager.originalCommand[8];
        const modCommandName = TextManager.originalCommand[9];
        this.addCommand(appCommandName ? appCommandName : 'Appraisal', 'appraisal');
        this.addCommand(modCommandName ? modCommandName : 'Mod', 'mod');
        this.addCommand(TextManager.cancel, 'cancel');
    };

    //-----------------------------------------------------------------------------
    // Window_Appraisal
    //
    // The window for selecting item to be appraised on the appmod shop screen.

    function Window_Appraisal() {
        this.initialize(...arguments);
    }

    Window_Appraisal.prototype = Object.create(Window_ItemList.prototype);
    Window_Appraisal.prototype.constructor = Window_Appraisal;

    Window_Appraisal.prototype.isCurrentItemEnabled = function () { 
        return true;
    };

    Window_Appraisal.prototype.includes = function (item) {
        if (!DataManager.isItem(item)) return false;
        if (START_IX_ITEM_FOR_APP <= item.id
            && item.id <= END_IX_ITEM_FOR_APP) {
            return true;
        } else {
            return false;
        }
    }

    Window_Appraisal.prototype.isEnabled = function (item) { 
        return true;
    };

    Window_Appraisal.prototype.selectLast = function () { 
        this.forceSelect(0);
    };

    //-----------------------------------------------------------------------------
    // Window_Mod
    //
    // The window for selecting item to be modded on the appmod shop screen.

    function Window_Mod() { 
        this.initialize(...arguments);
    }

    Window_Mod.prototype = Object.create(Window_ItemList.prototype);
    Window_Mod.prototype.constructor = Window_Mod;

    Window_Mod.prototype.isCurrentItemEnabled = function () { 
        return true;
    };

    Window_Mod.prototype.includes = function (item) { 
        return DataManager.isWeapon(item) || DataManager.isArmor(item);
    };

    Window_Mod.prototype.isEnabled = function (item) { 
        return true;
    };

    Window_Mod.prototype.selectLast = function () { 
        this.forceSelect(0);
    };

    //-----------------------------------------------------------------------------
    // Window_ModCommand
    //
    // The window for mod menu commands to select add/del on the appmod shop screen.

    function Window_ModCommand() {
        this.initialize(...arguments);
    }

    Window_ModCommand.prototype = Object.create(Window_HorzCommand.prototype);
    Window_ModCommand.prototype.constructor = Window_ModCommand;

    // TODO

    //-----------------------------------------------------------------------------
    // Window_ModMat
    //
    // The window for selecting item to be used as mod mat on the appmod shop screen.

    function Window_ModMat() { 
        this.initialize(...arguments);
    }

    Window_ModMat.prototype = Object.create(Window_ItemList.prototype);
    Window_ModMat.prototype.constructor = Window_ModMat;

    Window_ModMat.prototype.maxCols = function () {
        return 2;
    };

    Window_ModMat.prototype.isCurrentItemEnabled = function () { 
        return true;
    };

    Window_ModMat.prototype.includes = function (item) { 
        if (!DataManager.isItem(item)) return false;
        if (START_IX_ITEM_FOR_MODMAT <= item.id
            && item.id <= END_IX_ITEM_FOR_MODMAT) {
            return true;
        } else {
            return false;
        }
    };

    Window_ModMat.prototype.isEnabled = function (item) { 
        return true;
    };

    Window_ModMat.prototype.selectLast = function () { 
        this.forceSelect(0);
    };

    //-----------------------------------------------------------------------------
    // Window_ModDel
    //
    // The window for mod menu commands to select add/del on the appmod shop screen.

    function Window_ModDel() { 
        this.initialize(...arguments);
    }

    Window_ModDel.prototype = Object.create(Window_ItemList.prototype);
    Window_ModDel.prototype.constructor = Window_ModDel;

    // TODO

})();