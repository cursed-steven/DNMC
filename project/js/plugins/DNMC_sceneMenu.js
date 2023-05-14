//=============================================================================
// RPG Maker MZ - DNMC_sceneMenu
// ----------------------------------------------------------------------------
// (C)2022 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/12/24 初版
// 1.1.0  2023/01/23 Scene_EquipStatus を分離
// 1.1.1  2023/03/17 クエストHUD対応
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc Donut Machine 専用メニューコマンド
 * @author cursed_steven
 * @base DNMC_sceneMenu
 * @orderAfter DNMC_sceneMenu
 * 
 * @help DNMC_sceneMenu.js
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // Window_Selectable

    /**
     * 選択ウィンドウの背景描画を止める。
     * @param {Rectangle} rect 
     */
    Window_Selectable.prototype.drawBackgroundRect = function (rect) {
        //
    };

    //-----------------------------------------------------------------------------
    // Scene_Base

    /**
     * メインコマンドの幅を返す。
     * @returns number
     */
    Scene_Base.prototype.mainCommandWidth = function () {
        return 160;
    };

    //-----------------------------------------------------------------------------
    // Scene_MenuBase

    /**
     * ヘルプウィンドウの領域を返す。
     * @returns Rectangle
     */
    Scene_MenuBase.prototype.helpWindowRect = function () {
        const wx = 0;
        const wy = this.helpAreaTop();
        const ww = Graphics.boxWidth - this.mainCommandWidth() - 160;
        const wh = this.helpAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    //-----------------------------------------------------------------------------
    // Scene_Menu

    const _Scene_Menu_create = Scene_Menu.prototype.create;
    const _Scene_Map_createMapHUD = Scene_Map.prototype.createMapHUD;
    const _Scene_Map_createButtonGuide = Scene_Map.prototype.createButtonGuide;
    Scene_Menu.prototype.mapHUDRect = Scene_Map.prototype.mapHUDRect;
    Scene_Menu.prototype.HUDHeight = Scene_Map.prototype.HUDHeight;
    Scene_Menu.prototype.buttonGuideRect = Scene_Map.prototype.buttonGuideRect;
    Scene_Menu.prototype.createQuestHUD = Scene_Map.prototype.createQuestHUD;
    Scene_Menu.prototype.questHUDRect = Scene_Map.prototype.questHUDRect;

    /**
     * メニューシーンにHUDを追加。
     */
    Scene_Menu.prototype.create = function () {
        _Scene_Menu_create.call(this);
        _Scene_Map_createMapHUD.call(this);
        _Scene_Map_createButtonGuide.call(this);
        this._buttonGuide.refresh();
        this.createQuestHUD();
    };

    const _Scene_Menu_update = Scene_Menu.prototype.update;
    /**
     * クエストHUDの表示を追加
     */
    Scene_Menu.prototype.update = function () {
        _Scene_Menu_update.call(this);
        this._questHUD.show();
        this._questHUD.refresh();
    };

    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    /**
     * 専用コマンドウィンドウを作成。
     */
    Scene_Menu.prototype.createCommandWindow = function () {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler("equipStatus", this.commandPersonal.bind(this));
        this._commandWindow.setHandler("operation", this.commandPersonal.bind(this));
        this._commandWindow.setHandler("comparison", this.commandComparison.bind(this));
    };

    /**
     * コマンドウィンドウ領域を返す。
     * @returns Rectangle
     */
    Scene_Menu.prototype.commandWindowRect = function () {
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.calcWindowHeight(3, true) - 16;
        const wx = Graphics.boxWidth - ww - 160;
        const wy = this.calcWindowHeight(3, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 所持金ウインドウ領域を返す。
     * @returns Rectangle
     */
    Scene_Menu.prototype.goldWindowRect = function () {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = this._commandWindow.x;
        const wy = this._commandWindow.height + this.calcWindowHeight(3, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Menu_crateStatusWindow = Scene_Menu.prototype.createStatusWindow;
    /**
     * 対象者選択ウィンドウを作成しつつ非表示にする。
     */
    Scene_Menu.prototype.createStatusWindow = function () {
        _Scene_Menu_crateStatusWindow.call(this);
        this._statusWindow.hide();
    };

    /**
     * 対象者選択ウィンドウ領域を返す。
     * @returns Rectangle
     */
    Scene_Menu.prototype.statusWindowRect = function () {
        const wx = 0;
        const wy = this.calcWindowHeight(3, true);
        const ww = Graphics.boxWidth - this.mainCommandWidth() - 160;
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Menu_commandPersonal = Scene_Menu.prototype.commandPersonal;
    /**
     * 対象者選択ウィンドウを表示する。
     */
    Scene_Menu.prototype.commandPersonal = function () {
        _Scene_Menu_commandPersonal.call(this);
        this._statusWindow.show();
    };

    /**
     * 比較シーンに移行する。
     */
    Scene_Menu.prototype.commandComparison = function () {
        SceneManager.push(Scene_Comparison);
    };

    const _Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
    /**
     * 対象者選択後、それぞれのシーンに移行する。
     */
    Scene_Menu.prototype.onPersonalOk = function () {
        _Scene_Menu_onPersonalOk.call(this);

        switch (this._commandWindow.currentSymbol()) {
            case "equipStatus":
                SceneManager.push(Scene_EquipStatus);
                break;
            case "operation":
                SceneManager.push(Scene_Operation);
                break;
        }
    };

    //-----------------------------------------------------------------------------
    // Scene_Options

    const _Scene_Options_maxCommands = Scene_Options.prototype.maxCommands;
    /**
     * オプションのコマンド数に1追加
     * @returns number
     */
    Scene_Options.prototype.maxCommands = function () {
        return _Scene_Options_maxCommands.call(this) + 1;
    };

    //-----------------------------------------------------------------------------
    // Window_Command

    /**
     * コマンドウィンドウのテキスト揃えを左に変更。
     * @returns string
     */
    Window_Command.prototype.itemTextAlign = function () {
        return "left";
    };

    //-----------------------------------------------------------------------------
    // Window_HorzCommand

    /**
     * 水平コマンドウィンドウのテキスト揃えを左に変更。
     * @returns string
     */
    Window_HorzCommand.prototype.itemTextAlign = function () {
        return "left";
    };

    //-----------------------------------------------------------------------------
    // Window_MenuCommand

    /**
     * メニューコマンドウィンドウの順番を変更。
     */
    Window_MenuCommand.prototype.makeCommandList = function () {
        this.addMainCommands();
        this.addOriginalCommands();
        this.addFormationCommand();
        this.addOptionsCommand();
        this.addSaveCommand();
    };

    /**
     * コマンド再編に伴いメイン部分を削減。
     */
    Window_MenuCommand.prototype.addMainCommands = function () {
        const enabled = this.areMainCommandsEnabled();
        if (this.needsCommand("item")) {
            this.addCommand(TextManager.item, "item", enabled);
        }
        if (this.needsCommand("skill")) {
            this.addCommand(TextManager.skill, "skill", enabled);
        }
    };

    /**
     * 専用コマンド追加。
     */
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function () {
        this.addCommand(TextManager.originalCommand(1), "operation", true);
        this.addCommand(TextManager.originalCommand(2), "comparison", true);
        _Window_MenuCommand_addOriginalCommands.call(this);
    };

    //-----------------------------------------------------------------------------
    // Window_MenuStatus

    /**
     * 対象者選択ウィンドウの列数を返す。
     * @returns number
     */
    Window_MenuStatus.prototype.maxCols = function () {
        return 4;
    };

    /**
     * 対象者選択ウィンドウの行数を返す。
     * @returns number
     */
    Window_MenuStatus.prototype.numVisibleRows = function () {
        return 1;
    };

    /**
     * 対象者選択ウィンドウの1人分を描画する(名前のみ)。
     * @param {number} index 
     */
    Window_MenuStatus.prototype.drawItem = function (index) {
        this.drawPendingItemBackground(index);
        this.drawItemStatus(index);
    }

    /**
     * 対象者選択ウィンドウ中のアクター名を描画する。
     * @param {number} index 
     */
    Window_MenuStatus.prototype.drawItemStatus = function (index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const x = rect.x;
        const y = rect.y;
        this.drawActorName(actor, x + 16, y);
    };

    //-----------------------------------------------------------------------------
    // Window_MenuActor

    /**
     * アイテム/スキル使用対象ウィンドウの列数を返す。
     * @returns number
     */
    Window_MenuActor.prototype.maxCols = function () {
        return 1;
    };

    /**
     * アイテム/スキル使用対象ウィンドウの行数を返す。
     * @returns number
     */
    Window_MenuActor.prototype.numVisibleRows = function () {
        return $gameParty.size() < 4 ? $gameParty.size() : 4;
    };

    //-----------------------------------------------------------------------------
    // Window_Option

    const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.addGameEndCommand = Window_MenuCommand.prototype.addGameEndCommand;
    Window_Options.prototype.isGameEndEnabled = Window_MenuCommand.prototype.isGameEndEnabled;
    /**
     * 「ゲーム終了」を追加
     */
    Window_Options.prototype.makeCommandList = function () {
        _Window_Options_makeCommandList.call(this);
        this.addGameEndCommand();
    };

    /**
     * 「ゲーム終了」のための分岐を追加
     * @param {number} index 
     */
    Window_Options.prototype.drawItem = function (index) {
        const title = this.commandName(index);
        const status = this.statusText(index);
        const rect = this.itemLineRect(index);
        const statusWidth = this.statusWidth();
        const titleWidth = rect.width - statusWidth;
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(title, rect.x, rect.y, titleWidth, "left");
        if (index < this.maxItems() - 1) {
            this.drawText(status, rect.x + titleWidth, rect.y, statusWidth, "right");
        }
    };

    const _Window_Options_processOk = Window_Options.prototype.processOk;
    /**
     * OK時の処理に使用ゲームパッドの変更を追加
     */
    Window_Options.prototype.processOk = function () {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === 'gameEnd') {
            this.playOkSound();
            SceneManager.push(Scene_GameEnd);
        } else {
            _Window_Options_processOk.call(this);
        }
    };

    //-----------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function (paramId) {
        let value = _Game_Actor_paramPlus.call(this, paramId);
        const baseValue = this.paramBase(paramId);
        let traits = [];

        for (const item of this.equips()) {
            if (item) {
                for (const trait of item.traits) {
                    if (trait && trait.code === Game_BattlerBase.TRAIT_PARAM
                        && trait.dataId === paramId) {
                        traits.push(trait);
                    }
                }
            }
        }

        let multitude = 1;
        for (const trait of traits) {
            multitude *= trait.value;
        }
        value += baseValue * (multitude - 1);

        return value;
    };

    const _Game_Actor_meetsSkillConditions = Game_Actor.prototype.meetsSkillConditions;
    /**
     * スキルの指定可否を返す
     * @param {any} skill 
     * @returns boolean
     */
    Game_Actor.prototype.meetsSkillConditions = function (skill) {
        if (SceneManager.isCurrentScene(Scene_Operation)) {
            return skill.occasion === OCCASION.ALWAYS
                || skill.occasion === OCCASION.BATTLE;
        } else {
            return _Game_Actor_meetsSkillConditions.call(this, skill);
        }
    }

    //-----------------------------------------------------------------------------
    // Scene_ItemBase

    /**
     * アイテム/スキルシーン共通のアイテム/スキル使用対象ウィンドウの領域を返す。
     * @returns Rectangle
     */
    Scene_ItemBase.prototype.actorWindowRect = function () {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight($gameParty.size(), true);
        const wx = this._itemWindow.x + this._itemWindow.width - ww;
        const wy = this._itemWindow.y;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * アイテム/スキルシーン共通のアイテム/スキル使用対象ウィンドウを適切な位置に表示する。
     */
    Scene_ItemBase.prototype.showActorWindow = function () {
        if (this.isCursorLeft()) {
            this._actorWindow.x = this._itemWindow.width / 2;
        } else {
            this._actorWindow.x = this._itemWindow.width / 2 - this.mainCommandWidth();
        }
        this._actorWindow.show();
        this._actorWindow.activate();
    };

    const _Scene_ItemBase_useItem = Scene_ItemBase.prototype.useItem;
    /**
     * アイテム/スキルシーン共通で、アイテム/スキル使用時にHUDを更新する。
     */
    Scene_ItemBase.prototype.useItem = function () {
        _Scene_ItemBase_useItem.call(this);
        this._mapHUD.refresh();
    };


})();