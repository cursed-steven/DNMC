//=============================================================================
// RPG Maker MZ - DNMC_fastTravel2
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/05/06 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc CSVN_fastTravel2 のカスタマイズ部分です。
 * @author cursed_steven
 * @base CSVN_fastTravel2
 * @orderAfter CSVN_fastTravel2
 * 
 * @help DNMC_fastTravel2.js
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // Scene_FastTravelSkill

    const _Scene_Map_createMapHUD = Scene_Map.prototype.createMapHUD;
    Scene_FastTravelSkill.prototype.mapHUDRect = Scene_Map.prototype.mapHUDRect;
    Scene_FastTravelSkill.prototype.HUDHeight = Scene_Map.prototype.HUDHeight;
    Scene_FastTravelSkill.prototype.createGoldWindow = Scene_Menu.prototype.createGoldWindow;
    Scene_FastTravelSkill.prototype.goldWindowRect = Scene_Menu.prototype.goldWindowRect;
    Scene_FastTravelSkill.prototype.createQuestHUD = Scene_Map.prototype.createQuestHUD;
    Scene_FastTravelSkill.prototype.questHUDRect = Scene_Map.prototype.questHUDRect;
    Scene_FastTravelSkill.prototype.createCommandWindow = Scene_Item.prototype.createCommandWindow;
    Scene_FastTravelSkill.prototype.commandWindowRect = Scene_Item.prototype.commandWindowRect;
    Scene_FastTravelSkill.prototype.categoryWindowRect = Scene_Item.prototype.categoryWindowRect;
    Scene_FastTravelSkill.prototype.itemWindowRect = Scene_Item.prototype.itemWindowRect;

    /**
     * 追加ウィンドウ用にリライト
     */
    Scene_FastTravelSkill.prototype.create = function () {
        Scene_ItemBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createCategoryWindow();
        this.createItemWindow();
        _Scene_Map_createMapHUD.call(this);
        this.createCommandWindow();
        this.createGoldWindow();
        this.createQuestHUD();
    };

    /**
     * 表示専用カテゴリウィンドウ
     */
    Scene_FastTravelSkill.prototype.createCategoryWindow = function () {
        const rect = this.categoryWindowRect();
        this._categoryWindow = new Window_ItemCategory(rect);
        this._categoryWindow.forceSelect(1);
        this._categoryWindow.deactivate();
        this.addWindow(this._categoryWindow);
    };

    //-----------------------------------------------------------------------------
    // Window_Destinations

    /**
     * 項目の列数
     * @returns number
     */
    Window_Destinations.prototype.maxCols = function () {
        return 3;
    };

})();