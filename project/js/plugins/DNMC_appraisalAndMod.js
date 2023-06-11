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

    const ITEM_PADDING = 8;

    PluginManagerEx.registerCommand(script, 'start', () => {
        SceneManager.push(Scene_AppMod);
    });

    //-------------------------------------------------------------------------
    // Scene_AppMod
    //
    // The scene class of the appraisal shop scene.

    const _Scene_Map_createMapHUD = Scene_Map.prototype.createMapHUD;
    const _Scene_Map_createButtonGuide = Scene_Map.prototype.createButtonGuide;

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
        this.createDummyWindow2();
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

    Scene_AppMod.prototype.buttonGuideRect = function () { 
        return Scene_Map.prototype.buttonGuideRect.call(this);
    };

    Scene_AppMod.prototype.createQuestHUD = function () { 
        Scene_Map.prototype.createQuestHUD.call(this);
    };

    Scene_AppMod.prototype.questHUDRect = function () { 
        return Scene_Map.prototype.questHUDRect.call(this);
    };

    Scene_AppMod.prototype.mapHUDRect = function () {
        const ww = 160;
        const wh = this.HUDHeight();
        const wx = Graphics.boxWidth - ww;
        const wy = this.calcWindowHeight(3, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_AppMod.prototype.HUDHeight = function () {
        return this.calcWindowHeight(3 * $gameParty.size(), true);
    };

    /**
     * ボタンガイドとクエストHUDの描画更新
     */
    Scene_AppMod.prototype.update = function () { 
        Scene_MenuBase.prototype.update.call(this);
        this._buttonGuide.refresh();
        this._questHUD.show();
        this._questHUD.refresh();
        this._statusWindow.setEnableChangeActor(true);
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
    Scene_AppMod.prototype.createDummyWindow2 = Scene_Shop.prototype.createDummyWindow2;
    Scene_AppMod.prototype.statusWindowRect = Scene_Shop.prototype.statusWindowRect;

    /**
     * 鑑定結果ウィンドウにハンドラ追加
     */
    Scene_AppMod.prototype.createStatusWindow = function () { 
        Scene_Shop.prototype.createStatusWindow.call(this);
        this._statusWindow.setHandler('ok', this.onAppraisalCancel.bind(this));
        this._statusWindow.setHandler('cancel', this.onAppraisalCancel.bind(this));
    };

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
        return this.dummyWindowRect();
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
        this._modDelWindow.setHelpWindow(this._helpWindow);
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

    /**
     * 改造結果表示ウィンドウの作成
     */
    Scene_AppMod.prototype.createModResultWindow = function () { 
        const rect = this.modResultWindowRect();
        this._modResultWindow = new Window_ModResult(rect);
        this._modResultWindow.setHelpWindow(this._helpWindow);
        this._modResultWindow.hide();
        this._modResultWindow.setHandler('ok', this.onModResultOk.bind(this));
        this._modResultWindow.setHandler('cancel', this.onModResultCancel.bind(this));
        this.addWindow(this._modResultWindow);
    };

    /**
     * 改造結果表示ウィンドウの領域を返す
     */
    Scene_AppMod.prototype.modResultWindowRect = function () { 
        const ww = this._statusWindow.width * 3 + ITEM_PADDING * 2;
        const wh = this._statusWindow.height;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - this._commandWindow.y - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_AppMod.prototype.statusWidth = Scene_Shop.prototype.statusWidth;

    /**
     * 鑑定コマンド選択時の処理
     */
    Scene_AppMod.prototype.commandAppraisal = function () {
        this._dummyWindow.hide();
        // this._appraisalWindow.setMoney(this.money());
        this._appraisalWindow.refresh();
        this._appraisalWindow.show();
        this._appraisalWindow.activate();
        this._appraisalWindow.forceSelect(0);
        this._commandWindow.deactivate();
    };
    
    /**
     * 改造コマンド選択時の処理
     */
    Scene_AppMod.prototype.commandMod = function () {
        this._dummyWindow.hide();
        this._modWindow.setMoney(this.money());
        this._modWindow.setHelpWindow(this._helpWindow);
        this._modWindow.show();
        this._modWindow.activate();
        this._modWindow.selectLast();
        this._commandWindow.deactivate();
    };

    /**
     * 鑑定対象を選択してOKしたときの処理
     */
    Scene_AppMod.prototype.onAppraisalOk = function () {
        this._appraisalWindow.contents.clear();
        this.execAppraisal();
    };

    /**
     * 鑑定対象の選択をキャンセルしたときの処理
     */
    Scene_AppMod.prototype.onAppraisalCancel = function () {
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._dummyWindow2.show();
        this._appraisalWindow.hide();
        this._statusWindow.hide();
        this._helpWindow.clear();
    };

    /**
     * 鑑定実行
     */
    Scene_AppMod.prototype.execAppraisal = function () {
        // 鑑定対象
        const item = this._appraisalWindow.item();
        const rank = parseInt(item.meta.rank);
        const slot = parseInt(item.meta.slot);
        // 鑑定費用
        const appPrice = this._appraisalWindow.itemAppPrice(item);

        if ($gameParty.gold() < appPrice) {
            // 資金不足
            SoundManager.playBuzzer();
            return;
        }

        // ランクに応じた職業決定
        const classId = DNMC_base.randomClass(rank);
        let appraised = null;
        if (slot === 1) {
            // 武器
            appraised = DNMC_randomWeapons.randomWeapon(rank, classId);
        } else {
            // 防具
            appraised = DNMC_randomArmors.randomArmor(rank, classId, slot);
        }

        // SE
        SoundManager.playAppraisal();

        // 鑑定結果の表示
        this.showAppraisalResult();

        // 鑑定料徴収
        $gameParty.loseGold(appPrice);
        this._goldWindow.refresh();
    };

    /**
     * 鑑定結果の表示
     */
    Scene_AppMod.prototype.showAppraisalResult = function () { 
        const gainingItem = $gameTemp.getLatestGenerated()[0];
        const losingItem = this._appraisalWindow.item();

        this._dummyWindow2.hide();
        this._appraisalWindow.setHelpWindowItem(gainingItem);
        this._statusWindow.setItem(gainingItem);
        this._appraisalWindow.refresh();
        this._statusWindow.setEnableChangeActor(true);
        this._statusWindow.show();
        this._statusWindow.activate();
        this._appraisalWindow.deactivate();

        // 鑑定後のアイテムの増減の実処理はここ
        $gameParty.gainItem(gainingItem, 1);
        $gameParty.loseItem(losingItem, 1);

    };

    /**
     * 改造対象を選択してOKしたときの処理
     */
    Scene_AppMod.prototype.onModOk = function () {
        this._modWindow.hide();
        this._modCommandWindow.show();
        this._modCommandWindow.activate();
        this._modDelWindow.setItem(this._modWindow.item());
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
     * 追加改造実行
     */
    Scene_AppMod.prototype.execModAdd = function () { 
        // TODO this._modWindow.item() が改造対象
        //      this._modMatWindow.item() が改造材料
        // TODO 改造対象についてる特徴の数を確認
        //          6個ついていたらbuzzer出してキャンセル
        // TODO 改造材料に対応する特徴とランクを導出
        // TODO 導出した特徴が改造対象についているか確認
        //          ついている場合、上書き可能か確認
        //              上書き可能なら上書きして実行
        //              上書き不可ならbuzzer出して終了
        //          ついていない場合実行
        // TODO 改造対象のDataXXXのレコードはそのまま更新せずに
        //      コピーして新しいIDを採番し、それをインベントリに加える
        //          そうしないと改造品がいきなり店に並ぶ可能性がある
        //      改造品にはそれとわかる印を何かつけておく
        // TODO もともと改造対象であった武具は失う
        // TODO 改造材料にしたアイテムも失う
        // TODO 改造対象選択画面に戻る
    };

    /**
     * 追加改造の材料を選択でキャンセルしたときの処理
     */
    Scene_AppMod.prototype.onModMatCancel = function () { 
        this._modMatWindow.hide();
        this._modCommandWindow.show();
        this._modCommandWindow.activate();
        this._modMatWindow.deactivate();
    };

    /**
     * 削除改造ウィンドウで対象を選択してOKしたときの処理
     */
    Scene_AppMod.prototype.onModDelOk = function () { 
        this._modDelWindow.hide();
        this.execModDel();
    };

    /**
     * 削除改造実行
     */
    Scene_AppMod.prototype.execModDel = function () { 
        // TODO this._modWindow.item() が改造対象
        //      this._modDelWindow.item() が削除対象
        // TODO 改造対象についてる特徴の数を確認
        //          0個だったらbuzzer出してキャンセル
        // TODO 削除する特徴とそのランクに合わせて排出されるアイテムを決定
        // TODO 特徴削除実行
        //      改造対象のDataXXXのレコードはそのまま更新せずに
        //      コピーして新しいIDを採番し、それをインベントリに加える
        //          そうしないと改造品がいきなり店に並ぶ可能性がある
        //      改造品にはそれとわかる印を何かつけておく
        // TODO もともと改造対象であった武具は失う
        // TODO 削除で発生した削りかす的なアイテムをインベントリに追加する
        // TODO 改造対象選択画面に戻る
    };

    /**
     * 削除改造ウィンドウでキャンセルしたときの処理
     */
    Scene_AppMod.prototype.onModDelCancel = function () { 
        this._modDelWindow.hide();
        this._modCommandWindow.show();
        this._modCommandWindow.activate();
        this._modMatWindow.deactivate();
    };

    /**
     * 改造結果表示でOKしたときの処理
     */
    Scene_AppMod.prototype.onModResultOk = function () { 
        // TODO
    };

    /**
     * 改造結果表示でキャンセルしたときの処理
     */
    Scene_AppMod.prototype.onModResultCancel = function () { 
        this.onModResultOk();
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
        const appCommandName = TextManager.originalCommand(8);
        const modCommandName = TextManager.originalCommand(9);
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

    /**
     * 列数を返す
     * @returns number
     */
    Window_Appraisal.prototype.maxCols = function () { 
        return 2;
    };

    /**
     * 選択中アイテムで決定が可能か
     * @returns boolean
     */
    Window_Appraisal.prototype.isCurrentItemEnabled = function () { 
        return true;
    };

    /**
     * 指定したアイテムがリストに含まれるべきかどうかを返す
     * @param {any} item 
     * @returns boolean
     */
    Window_Appraisal.prototype.includes = function (item) {
        if (!DataManager.isItem(item)) return false;
        if (START_IX_ITEM_FOR_APP <= item.id
            && item.id <= END_IX_ITEM_FOR_APP) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 指定したアイテムで決定可能かどうかを返す
     * @param {any} item 
     * @returns boolean
     */
    Window_Appraisal.prototype.isEnabled = function (item) { 
        return true;
    };

    /**
     * 強制的に1項目めを選択する
     */
    Window_Appraisal.prototype.selectLast = function () { 
        this.forceSelect(0);
    };

    /**
     * 項目の描画
     * @param {number} index 
     */
    Window_Appraisal.prototype.drawItem = function (index) { 
        const item = this.itemAt(index);
        if (item) {
            const priceWidth = this.priceWidth();
            const rect = this.itemLineRect(index);
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
            this.drawItemPrice(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };

    /**
     * 鑑定価格表示に使う幅
     * @returns number
     */
    Window_Appraisal.prototype.priceWidth = function () { 
        return this.textWidth('000000');
    };

    /**
     * 鑑定費用の描画
     * @param {any} item 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     */
    Window_Appraisal.prototype.drawItemPrice = function(item, x, y, width){
        this.drawText(': '+this.itemAppPrice(item), x, y, width, 'right');
    }

    /**
     * 鑑定費用の算出
     * @param {any} item 
     * @returns number
     */
    Window_Appraisal.prototype.itemAppPrice = function (item) {
        const rank = item.meta.rank;
        let priceByRank = 0;
        switch (parseInt(rank)) {
            case 0:
                priceByRank = 100;
                break;
            case 1:
                priceByRank = 500;
                break;
            case 2:
                priceByRank = 1000;
                break;
            case 3:
                priceByRank = 5000;
                break;
        }

        const slot = item.meta.slot;
        let priceBySlot = 0;
        switch (parseInt(slot)) {
            case 1:
                priceBySlot = 100;
                break;
            case 2:
                priceBySlot = 100;
                break;
            case 3:
                priceBySlot = 200;
                break;
            case 4:
                priceBySlot = 500;
                break;
            case 5:
                priceBySlot = 1000;
                break;
        }

        return priceByRank + priceBySlot;
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

    /**
     * 選択中アイテムで決定が可能か
     * @returns boolean
     */
    Window_Mod.prototype.isCurrentItemEnabled = function () { 
        return true;
    };

    /**
     * 指定したアイテムで決定可能かどうかを返す
     * @param {any} item 
     * @returns boolean
     */
    Window_Mod.prototype.includes = function (item) { 
        return DataManager.isWeapon(item) || DataManager.isArmor(item);
    };

    /**
     * 指定したアイテムで決定可能かどうかを返す
     * @param {any} item 
     * @returns boolean
     */
    Window_Mod.prototype.isEnabled = function (item) { 
        return true;
    };

    /**
     * 強制的に1項目めを選択する
     */
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

    /**
     * 初期化
     * @param {Rectangle} rect 
     */
    Window_ModCommand.prototype.initialize = function (rect) { 
        Window_HorzCommand.prototype.initialize.call(this, rect);
    };

    /**
     * 列数を返す
     * @returns number
     */
    Window_ModCommand.prototype.maxCols = function () { 
        return 3;
    };

    /**
     * 改造対象選択後の追加/削除選択コマンド
     */
    Window_ModCommand.prototype.makeCommandList = function () { 
        const addCommandName = TextManager.originalCommand(10);
        const delCommandName = TextManager.originalCommand(11);
        this.addCommand(addCommandName ? addCommandName : 'ModAdd', 'modadd');
        this.addCommand(delCommandName ? delCommandName : 'ModDel', 'moddel');
        this.addCommand(TextManager.cancel, 'cancel');
    };

    //-----------------------------------------------------------------------------
    // Window_ModMat
    //
    // The window for selecting item to be used as mod mat on the appmod shop screen.

    function Window_ModMat() { 
        this.initialize(...arguments);
    }

    Window_ModMat.prototype = Object.create(Window_ItemList.prototype);
    Window_ModMat.prototype.constructor = Window_ModMat;

    /**
     * 列数を返す
     * @returns number
     */
    Window_ModMat.prototype.maxCols = function () {
        return 2;
    };

    /**
     * 選択中アイテムで決定が可能か
     * @returns boolean
     */
    Window_ModMat.prototype.isCurrentItemEnabled = function () { 
        return true;
    };

    /**
     * 指定したアイテムがリストに含まれるべきかどうかを返す
     * @param {any} item 
     * @returns boolean
     */
    Window_ModMat.prototype.includes = function (item) { 
        if (!DataManager.isItem(item)) return false;
        if (START_IX_ITEM_FOR_MODMAT <= item.id
            && item.id <= END_IX_ITEM_FOR_MODMAT) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * 指定したアイテムで決定可能か
     * @param {any} item 
     * @returns boolean
     */
    Window_ModMat.prototype.isEnabled = function (item) { 
        return true;
    };

    /**
     * 強制的に1項目めを選択する
     */
    Window_ModMat.prototype.selectLast = function () { 
        this.forceSelect(0);
    };

    //-----------------------------------------------------------------------------
    // Window_ModDel
    //
    // The window for mod menu to select trait to be deleted on the appmod shop screen.

    function Window_ModDel() { 
        this.initialize(...arguments);
    }

    Window_ModDel.prototype = Object.create(Window_ItemList.prototype);
    Window_ModDel.prototype.constructor = Window_ModDel;

    /**
     * 改造対象ウィンドウで選択した項目をセットする
     * @param {any} item 
     */
    Window_ModDel.prototype.setModItem = function (item) { 
        this._modItem = item;
    };

    /**
     * 列数を返す
     * @returns number
     */
    Window_ModDel.prototype.maxCols = function () { 
        return 1;
    };

    /**
     * 一度に画面に出す行数
     * @returns number
     */
    Window_ModDel.prototype.numVisibleRows = function () { 
        return 6;
    };

    /**
     * 選択中の特徴で決定が可能か
     * @returns boolean
     */
    Window_ModDel.prototype.isCurrentItemEnabled = function () { 
        return true;
    };

    /**
     * 指定した特徴で決定可能かどうか
     * @param {any} item 
     * @returns boolean
     */
    Window_ModDel.prototype.isEnabled = function (item) {
        return true;
    }

    /**
     * 改造対象ウィンドウで選択した武具についている特徴全て
     */
    Window_ModDel.prototype.makeItemList = function () { 
        this._data = this.traits;
    };

    /**
     * 強制的に1項目めを選択する
     */
    Window_ModDel.prototype.selectLast = function () { 
        this.forceSelect(0);
    };

    /**
     * 項目の描画
     * @param {number} index 
     */
    Window_ModDel.prototype.drawItem = function (index) {
        const item = this.itemAt(index);
        if (item) {
            const rect = this.itemLineRect(index);
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
        }
    }

    /**
     * 項目名の描画
     * @param {any} item 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     */
    Window_ModDel.prototype.drawItemName = function (item, x, y, width) { 
        if (item) {
            this.resetTextColor();
            const text = DNMC_randomArmors.traitToDesc(item);
            this.drawText(text, x, y, width);
        }
    };

    //-----------------------------------------------------------------------------
    // Window_ModResult
    //
    // The window for mod result on the appmod shop screen.

    function Window_ModResult() {
        this.initialize(...arguments);
    }

    Window_ModResult.prototype = Object.create(Window_MenuStatus.prototype);
    Window_ModResult.prototype.constructor = Window_ModResult;

    Window_ModResult.prototype.initialize = function (rect) {
        Window_MenuStatus.prototype.initialize.call(this, rect);
    }

    /**
     * 列数を返す
     * @returns number
     */
    Window_ModResult.prototype.maxCols = function () { 
        return 3;
    };

    /**
     * 表示行数を返す
     * @returns number
     */
    Window_ModResult.prototype.numVisibleRows = function () { 
        return 1;
    };

    /**
     * 最大項目数
     * @returns number
     */
    Window_ModResult.prototype.maxItems = function () { 
        return 3;
    }

    /**
     * 各項目の描画
     */
    Window_ModResult.prototype.drawItem = function () { 
        this.drawModTarget();
        this.drawModMat();
        this.drawModResult();
    };

    /**
     * 改造対象を描画する
     */
    Window_ModResult.prototype.drawModTarget = function () { 
        // TODO
    };

    /**
     * 改造材料を描画する
     */
    Window_ModResult.prototype.drawModMat = function () { 
        // TODO
    };

    /**
     * 改造結果を描画する
     */
    Window_ModResult.prototype.drawModResult = function () { 
        // TODO
    };

    //-----------------------------------------------------------------------------
    // SoundManager

    /**
     * 鑑定完了SE
     */
    SoundManager.playAppraisal = function () { 
        AudioManager.playStaticSe({
            name: 'retro/echo/Fire_Magic_Spell_01', 
            volume: 45, 
            pitch: 150, 
            pan: 0
        });
    };

    /**
     * 追加改造SE
     */
    SoundManager.playModdAdd = function () { 
        AudioManager.playStaticSe({
            name: 'retro/echo/HP_Mana_Up_03', 
            volume: 45, 
            pitch: 150, 
            pan: 0
        });
    };

    /**
     * 削除改造SE
     */
    SoundManager.playModDel = function () { 
        AudioManager.playStaticSe({
            name: 'retro/echo/HP_Mana_Down_03', 
            volume: 45, 
            pitch: 150, 
            pan: 0
        });
    };
})();