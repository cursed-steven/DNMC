//=============================================================================
// RPG Maker MZ - DNMC_sceneSkill
// ----------------------------------------------------------------------------
// (C)2022 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/12/25 初版
// 1.0.1  2023/03/17 クエストHUD対応
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc Donut Machine 専用スキルコマンド
 * @author cursed_steven
 * @base DNMC_sceneMenu
 * @orderAfter DNMC_sceneMenu
 * 
 * @help DNMC_sceneSkill.js
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // Scene_Skill

    const _Scene_Map_createMapHUD = Scene_Map.prototype.createMapHUD;
    const _Scene_Map_createButtonGuide = Scene_Map.prototype.createButtonGuide;
    Scene_Skill.prototype.mapHUDRect = Scene_Map.prototype.mapHUDRect;
    Scene_Skill.prototype.HUDHeight = Scene_Map.prototype.HUDHeight;
    Scene_Skill.prototype.buttonGuideRect = Scene_Map.prototype.buttonGuideRect;
    Scene_Skill.prototype.createGoldWindow = Scene_Menu.prototype.createGoldWindow;
    Scene_Skill.prototype.goldWindowRect = Scene_Menu.prototype.goldWindowRect;
    Scene_Skill.prototype.menuStatusWindowRect = Scene_Menu.prototype.statusWindowRect;
    Scene_Skill.prototype.createQuestHUD = Scene_Map.prototype.createQuestHUD;
    Scene_Skill.prototype.questHUDRect = Scene_Map.prototype.questHUDRect;

    /**
     * スキルシーンを作成する(ウィンドウ追加)。
     */
    Scene_Skill.prototype.create = function () {
        Scene_ItemBase.prototype.create.call(this);
        this.createCommandWindow();
        this.createGoldWindow();
        this.createMenuStatusWindow();
        _Scene_Map_createMapHUD.call(this);
        _Scene_Map_createButtonGuide.call(this);
        this._buttonGuide.setActiveWindow("Window_SkillType");
        this._buttonGuide.refresh();
        this.createHelpWindow();
        this.createSkillTypeWindow();
        this.createStatusWindow();
        this.createSkillCategoryWindow();
        this.createItemWindow();
        this.createActorWindow();
        this.createQuestHUD();
    };

    /**
     * 選択後のメニューコマンドウィンドウを作成。
     */
    Scene_Skill.prototype.createCommandWindow = function () {
        const rect = this.commandWindowRect();
        const commandWindow = new Window_MenuCommand(rect);
        this.addWindow(commandWindow);
        this._commandWindow = commandWindow;
        this._commandWindow.deactivate();
    };

    /**
     * 選択後のメニューコマンドウィンドウ領域を返す。
     * @returns Rectangle
     */
    Scene_Skill.prototype.commandWindowRect = function () {
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.calcWindowHeight(1, true) - 8;
        const wx = Graphics.boxWidth - ww - 160;
        const wy = this.calcWindowHeight(3, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 選択後のスキル使用者ウィンドウを作成する。
     */
    Scene_Skill.prototype.createMenuStatusWindow = function () {
        const rect = this.menuStatusWindowRect();
        this._menuStatusWindow = new Window_MenuStatus(rect);
        this._menuStatusWindow.select(this.user().index());
        this.addWindow(this._menuStatusWindow);
    };

    const _Scene_Skill_createStatusWindow = Scene_Skill.prototype.createStatusWindow;
    /**
     * スキル使用者のステータスウィンドウを作成して非表示にする。
     */
    Scene_Skill.prototype.createStatusWindow = function () {
        _Scene_Skill_createStatusWindow.call(this);
        this._statusWindow.hide();
    };

    /**
     * スキルタイプウィンドウを作成する(タイプ選択時の処理変更)。
     */
    Scene_Skill.prototype.createSkillTypeWindow = function () {
        const rect = this.skillTypeWindowRect();
        this._skillTypeWindow = new Window_SkillType(rect);
        this._skillTypeWindow.setHelpWindow(this._helpWindow);
        this._skillTypeWindow.setHandler("ok", this.commandCategory.bind(this));
        this._skillTypeWindow.setHandler("cancel", this.popScene.bind(this));
        this._skillTypeWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._skillTypeWindow.setHandler("pageup", this.previousActor.bind(this));
        this.addWindow(this._skillTypeWindow);
    };

    /**
     * スキルタイプウィンドウ領域を返す。
     * @returns Rectangle
     */
    Scene_Skill.prototype.skillTypeWindowRect = function () {
        const wx = 0;
        const wy = this.calcWindowHeight(4, true) + 24;
        const ww = Graphics.boxWidth - this.mainCommandWidth() - 160;
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * スキルカテゴリウィンドウを作成する。
     */
    Scene_Skill.prototype.createSkillCategoryWindow = function () {
        const rect = this.categoryWindowRect();
        this._categoryWindow = new Window_SkillCategory(rect);
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.onCategoryCancel.bind(this));
        this._skillTypeWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._skillTypeWindow.setHandler("pageup", this.previousActor.bind(this));
        this.addWindow(this._categoryWindow);
        this._categoryWindow.deactivate();
    };

    /**
     * スキルカテゴリウィンドウ領域を返す。
     * @returns Rectangle
     */
    Scene_Skill.prototype.categoryWindowRect = function () {
        const wx = 0;
        const wy = this._skillTypeWindow.y + this._skillTypeWindow.height;
        const ww = this._skillTypeWindow.width;
        const wh = this._skillTypeWindow.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Skill_createItemWindow = Scene_Skill.prototype.createItemWindow;
    /**
     * スキルリストウィンドウを作成する。
     */
    Scene_Skill.prototype.createItemWindow = function () {
        _Scene_Skill_createItemWindow.call(this);
        this._categoryWindow.setItemWindow(this._itemWindow);
    };

    /**
     * スキルリストウィンドウ領域を返す。
     * @returns Rectangle
     */
    Scene_Skill.prototype.itemWindowRect = function () {
        const wx = 0;
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const ww = this._categoryWindow.width;
        const wh = this.mainAreaBottom() - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * スキルタイプ選択時の処理。
     */
    Scene_Skill.prototype.commandCategory = function () {
        this._categoryWindow.activate();
        this._categoryWindow.forceSelect(0);
        this._buttonGuide.setActiveWindow("Window_SkillCategory");
    };

    /**
     * スキルカテゴリ選択時の処理。
     */
    Scene_Skill.prototype.onCategoryOk = function () {
        this._itemWindow.activate();
        this._itemWindow.forceSelect(0);
        this._buttonGuide.setActiveWindow("Window_SkillList");
    };

    /**
     * スキルカテゴリ選択をキャンセルしたときの処理。
     */
    Scene_Skill.prototype.onCategoryCancel = function () {
        this._skillTypeWindow.activate();
        this._skillTypeWindow.selectLast();
        this._buttonGuide.setActiveWindow("Window_SkillType");
    };

    /**
     * スキル選択をキャンセルしたときの処理。
     */
    Scene_Skill.prototype.onItemCancel = function () {
        this._itemWindow.deselect();
        this._categoryWindow.activate();
        this._buttonGuide.setActiveWindow("Window_SkillCategory");
    };

    const _Scene_Skill_onActorChange = Scene_Skill.prototype.onActorChange;
    /**
     * アクター変更時の処理。
     */
    Scene_Skill.prototype.onActorChange = function () {
        _Scene_Skill_onActorChange.call(this);
        this._menuStatusWindow.select(this.user().index());
    };

    const _Scene_Skill_update = Scene_Skill.prototype.update;
    /**
     * ボタンガイドとクエストHUDの描画更新処理を追加
     */
    Scene_Skill.prototype.update = function () {
        _Scene_Skill_update.call(this);
        this._buttonGuide.refresh();
        this._questHUD.show();
        this._questHUD.refresh();
    };

    //-----------------------------------------------------------------------------
    // Window_SkillType

    /**
     * スキルタイプウィンドウの列数を返す。
     * @returns number
     */
    Window_SkillType.prototype.maxCols = function () {
        return 7;
    };

    const _Window_SkillType_makeCommandList = Window_SkillType.prototype.makeCommandList;
    /**
     * スキルタイプに通常行動を追加する
     */
    Window_SkillType.prototype.makeCommandList = function () {
        _Window_SkillType_makeCommandList.call(this);
        if (this._actor) {
            this.addCommand(TextManager.originalCommand(7), "skill", true, 0);
        }
    };

    /**
     * スキルタイプウィンドウの更新。
     */
    Window_SkillType.prototype.update = function () {
        Window_HorzCommand.prototype.update.call(this);
        if (this._skillWindow) {
            this._skillWindow.setStypeId(this.currentExt());
            this._skillWindow.setCategory("recovery");
        }
    };

    //-----------------------------------------------------------------------------
    // Window_SkillCategory
    //
    // The window for selecting a category of skills on the skill screen.

    function Window_SkillCategory() {
        this.initialize(...arguments);
    }

    Window_SkillCategory.prototype = Object.create(Window_HorzCommand.prototype);
    Window_SkillCategory.prototype.constructor = Window_SkillCategory;

    /**
     * スキルカテゴリウィンドウの作成
     * @param {Rectangle} rect 
     */
    Window_SkillCategory.prototype.initialize = function (rect) {
        Window_HorzCommand.prototype.initialize.call(this, rect);
    };

    /**
     * スキルカテゴリウィンドウの列数を返す。
     * @returns number
     */
    Window_SkillCategory.prototype.maxCols = function () {
        return 4;
    };

    /**
     * スキルカテゴリウィンドウの更新。
     */
    Window_SkillCategory.prototype.update = function () {
        Window_HorzCommand.prototype.update.call(this);
        if (this._itemWindow) {
            this._itemWindow.setCategory(this.currentSymbol());
        }
    };

    /**
     * スキルカテゴリウィンドウのコマンドリスト作成。
     */
    Window_SkillCategory.prototype.makeCommandList = function () {
        this.addCommand(TextManager.originalCommand(3), "recovery");
        this.addCommand(TextManager.originalCommand(5), "menu");
        this.addCommand(TextManager.originalCommand(4), "battleOnly");
    };

    /**
     * スキルリストウィンドウをセットする。
     * @param {Window_SkillList} itemWindow 
     */
    Window_SkillCategory.prototype.setItemWindow = function (itemWindow) {
        this._itemWindow = itemWindow;
    };

    /**
     * 選択が必要かどうかを返す。
     * @returns boolean
     */
    Window_SkillCategory.prototype.needsSelection = function () {
        return this.maxItems() >= 2;
    };

    //-----------------------------------------------------------------------------
    // Window_SkillList

    const _Window_SkillList_initialize = Window_SkillList.prototype.initialize;
    /**
     * スキルリストウインドウ作成(カテゴリープロパティ追加)。
     * @param {Rectangle} rect 
     */
    Window_SkillList.prototype.initialize = function (rect) {
        _Window_SkillList_initialize.call(this, rect);
        this._category = 0;
    };

    /**
     * カテゴリの設定。
     * @param {string} category 
     */
    Window_SkillList.prototype.setCategory = function (category) {
        if (this._category !== category) {
            this._category = category;
            this.refresh();
        }
    }

    const _Window_SkillList_includes = Window_SkillList.prototype.includes;
    /**
     * スキルタイプ・スキルカテゴリ両方に該当するかどうかの判定を返す。
     * @param {any} item 
     * @returns 
     */
    Window_SkillList.prototype.includes = function (item) {
        let result = _Window_SkillList_includes.call(this, item);

        switch (this._category) {
            case "recovery":
                return result && DataManager.isSkillForRecovery(item);
                break;
            case "menu":
                return result && DataManager.isSkillNotForRecovery(item);
                break;
            case "battleOnly":
                return result && DataManager.isSkillOnlyForBattle(item);
                break;
            default:
                break;
        }
        return result;
    };

    const _Window_SkillList_update = Window_SkillList.prototype.update;
    /**
     * スキルリストウインドウの更新(ヘルプウィンドウの更新を追加で呼ぶ)。
     */
    Window_SkillList.prototype.update = function () {
        _Window_SkillList_update.call(this);
        this.callUpdateHelp();
    };

})();