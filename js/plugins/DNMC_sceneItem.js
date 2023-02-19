//=============================================================================
// RPG Maker MZ - DNMC_sceneItem
// ----------------------------------------------------------------------------
// (C)2022 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/12/24 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc Donut Machine 専用アイテムコマンド
 * @author cursed_twitch
 * @base DNMC_sceneMenu
 * @orderAfter DNMC_sceneMenu
 * 
 * @help DNMC_sceneItem.js
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // Scene_Item

    const _Scene_Item_create = Scene_Item.prototype.create;
    const _Scene_Map_createMapHUD = Scene_Map.prototype.createMapHUD;
    const _Scene_Map_createButtonGuide = Scene_Map.prototype.createButtonGuide;
    Scene_Item.prototype.mapHUDRect = Scene_Map.prototype.mapHUDRect;
    Scene_Item.prototype.HUDHeight = Scene_Map.prototype.HUDHeight;
    Scene_Item.prototype.buttonGuideRect = Scene_Map.prototype.buttonGuideRect;
    Scene_Item.prototype.createGoldWindow = Scene_Menu.prototype.createGoldWindow;
    Scene_Item.prototype.goldWindowRect = Scene_Menu.prototype.goldWindowRect;
    /**
     * アイテムシーン作成(ウィンドウの追加)。
     */
    Scene_Item.prototype.create = function () {
        _Scene_Item_create.call(this);
        _Scene_Map_createMapHUD.call(this);
        _Scene_Map_createButtonGuide.call(this);
        this._buttonGuide.refresh();
        this.createCommandWindow();
        this.createGoldWindow();
    };

    /**
     * 選択後のコマンドウィンドウ作成。
     */
    Scene_Item.prototype.createCommandWindow = function () {
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
    Scene_Item.prototype.commandWindowRect = function () {
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.calcWindowHeight(1, true) - 8;
        const wx = Graphics.boxWidth - ww - 160;
        const wy = this.calcWindowHeight(3, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * カテゴリウィンドウ領域を返す。
     * @returns Rectangle
     */
    Scene_Item.prototype.categoryWindowRect = function () {
        const wx = 0;
        const wy = this.calcWindowHeight(3, true);
        const ww = Graphics.boxWidth - this.mainCommandWidth() - 160;
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * アイテムウィンドウ領域を返す。
     * @returns Rectangle
     */
    Scene_Item.prototype.itemWindowRect = function () {
        const wx = 0;
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const ww = this._categoryWindow.width;
        const wh = this.mainAreaBottom() - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    //-----------------------------------------------------------------------------
    // Window_ItemCategory

    /**
     * カテゴリウィンドウの列数を返す。
     * @returns number
     */
    Window_ItemCategory.prototype.maxCols = function () {
        return 6;
    };

    const _Window_ItemCategory_makeCommandList = Window_ItemCategory.prototype.makeCommandList;
    /**
     * カテゴリウィンドウのコマンドリスト追加。
     */
    Window_ItemCategory.prototype.makeCommandList = function () {
        this.addCommand(TextManager.originalCommand(3), "recovery");
        _Window_ItemCategory_makeCommandList.call(this);
        this.addCommand(TextManager.originalCommand(4), "battleOnly");
    };

    //-----------------------------------------------------------------------------
    // Window_ItemList

    const _Window_ItemList_includes = Window_ItemList.prototype.includes;
    /**
     * 追加したカテゴリに対応したリストに含まれるかどうかを判別して返す。
     * @param {any} item 
     * @returns boolean
     */
    Window_ItemList.prototype.includes = function (item) {
        switch (this._category) {
            case "recovery":
                return DataManager.isItemForRecovery(item);
                break;
            case "item":
                return DataManager.isItemNotForRecovery(item);
                break;
            case "battleOnly":
                return DataManager.isItemOnlyForBattle(item);
                break;
        }
        return _Window_ItemList_includes.call(this, item);
    };

})();