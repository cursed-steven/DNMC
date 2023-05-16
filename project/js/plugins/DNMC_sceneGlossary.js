//=============================================================================
// RPG Maker MZ - DNMC_sceneGlossary
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/05/15 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc SceneGlossary のカスタマイズ
 * @author cursed_steven
 * @base SceneGlossary
 * @orderAfter SceneGlossary
 * 
 * @help DNMC_sceneGlossary.js
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-------------------------------------------------------------------------
    // Scene_Glossary

    const _Scene_Map_createMapHUD = Scene_Map.prototype.createMapHUD;
    Scene_Glossary.prototype.createGoldWindow = Scene_Menu.prototype.createGoldWindow;
    Scene_Glossary.prototype.goldWindowRect = Scene_Menu.prototype.goldWindowRect;
    Scene_Glossary.prototype.mapHUDRect = Scene_Map.prototype.mapHUDRect;
    Scene_Glossary.prototype.HUDHeight = Scene_Map.prototype.HUDHeight;
    Scene_Glossary.prototype.createQuestHUD = Scene_Map.prototype.createQuestHUD;
    Scene_Glossary.prototype.questHUDRect = Scene_Map.prototype.questHUDRect;

    Scene_Glossary.prototype.create = function () {
        Scene_ItemBase.prototype.create.call(this);
        // [begin] layout customize by cursed_steven 2023/04/19
        _Scene_Map_createMapHUD.call(this);
        this.createQuestHUD();
        this.createCommandWindow();
        this.createGoldWindow();
        // [end] layout customize by cursed_steven 2023/04/19
        this.createHelpWindow();
        this.createGlossaryWindow();
        this.createGlossaryListWindow();
        this.createGlossaryCategoryWindow();
        this.createGlossaryCompleteWindow();
        this.createConfirmWindow();
        this.createActorWindow();
        this.setInitActivateWindow();
    };

    /**
     * クエストHUDの表示と更新を追加
     */
    Scene_Glossary.prototype.update = function () {
        Scene_ItemBase.prototype.update.call(this);
        this._questHUD.show();
        this._questHUD.refresh();
    };

    /**
     * 選択後のコマンドウィンドウ作成。
     */
    Scene_Glossary.prototype.createCommandWindow = function () {
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
    Scene_Glossary.prototype.commandWindowRect = function () {
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.calcWindowHeight(1, true) - 8;
        const wx = Graphics.boxWidth - ww - 160;
        const wy = this.calcWindowHeight(3, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_Glossary.prototype.createGlossaryWindow = function () {
        const y = this.calcWindowHeight(3, true);
        this._glossaryWindow = new Window_Glossary($gameParty.getGlossaryListWidth(), y, this._helpWindow);
        this.addWindow(this._glossaryWindow);
    };

    //-------------------------------------------------------------------------
    // Window_Glossary

    Window_Glossary.prototype.initialize = function (x, y, helpWindow) {
        var height = Graphics.boxHeight - y - (param.BottomHelpMode ? helpWindow.height : 0);
        // layout customize by cursed_steven 2023/04/19
        var width = Graphics.boxWidth - x - 160 * 2;
        this._maxPages = 1;
        this._itemData = null;
        this._pageIndex = 0;
        this._enemy = null;
        Window_Base.prototype.initialize.call(this, new Rectangle(x, y, width, height));
        this.setGlossaryWindowSkin();
        this.setFramelessDesign();
    };

    Window_Glossary.prototype.drawItemText = function (text, y) {
        if (typeof TranslationManager !== 'undefined') {
            TranslationManager.getTranslatePromise(text).then(function (translatedText) {
                // layout customize by cursed_steven 2023/04/19
                this.drawTextEx(translatedText, 18, y + 18);
            }.bind(this));
        } else {
            // layout customize by cursed_steven 2023/04/19
            this.drawTextEx(text, 18, y + 18);
        }
    };

    //-------------------------------------------------------------------------
    // Window_GlossaryCategory

    Window_GlossaryCategory.prototype.drawItem = function (index) {
        var text = this._data[index];
        if (text) {
            var rect = this.itemRect(index);
            this.drawTextExIfNeed(text, rect.x + this.itemPadding() + 18, rect.y, rect.width - this.itemPadding());
        }
    };

})();