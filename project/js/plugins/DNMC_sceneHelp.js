//=============================================================================
// RPG Maker MZ - DNMC_sceneHelp
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/05/17 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc ヘルプシーンのレイアウトカスタマイズです。
 * @author cursed_steven
 * @base CSVN_sceneHelp
 * @orderAfter CSVN_sceneHelp
 * 
 * @help DNMC_sceneHelp.js
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Scene_Map_createMapHUD = Scene_Map.prototype.createMapHUD;
    const _Scene_Map_createButtonGuide = Scene_Map.prototype.createButtonGuide;
    Scene_Help.prototype.createGoldWindow = Scene_Menu.prototype.createGoldWindow;
    Scene_Help.prototype.goldWindowRect = Scene_Menu.prototype.goldWindowRect;
    Scene_Help.prototype.buttonGuideRect = Scene_Map.prototype.buttonGuideRect;
    Scene_Help.prototype.mapHUDRect = Scene_Map.prototype.mapHUDRect;
    Scene_Help.prototype.HUDHeight = Scene_Map.prototype.HUDHeight;
    Scene_Help.prototype.createQuestHUD = Scene_Map.prototype.createQuestHUD;
    Scene_Help.prototype.questHUDRect = Scene_Map.prototype.questHUDRect;

    //-------------------------------------------------------------------------
    // Scene_Help

    const _Scene_Help_create = Scene_Help.prototype.create;
    Scene_Help.prototype.create = function () {
        _Scene_Help_create.call(this);
        _Scene_Map_createMapHUD.call(this);
        _Scene_Map_createButtonGuide.call(this);
        this.createQuestHUD();
        this.createCommandWindow();
        this.createGoldWindow();
    };

    /**
     * クエストHUDの表示と更新を追加
     */
    Scene_Help.prototype.update = function () {
        Scene_ItemBase.prototype.update.call(this);
        this._questHUD.show();
        this._questHUD.refresh();
    };

    /**
     * 選択後のコマンドウィンドウ作成。
     */
    Scene_Help.prototype.createCommandWindow = function () {
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
    Scene_Help.prototype.commandWindowRect = function () {
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.calcWindowHeight(1, true) - 8;
        const wx = Graphics.boxWidth - ww - 160;
        const wy = this.calcWindowHeight(3, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Help_onArticleOk = Scene_Help.prototype.onArticleOk;
    Scene_Help.prototype.onArticleOk = function () {
        _Scene_Help_onArticleOk.call(this);
        this._buttonGuide.setActiveWindow('Window_HelpButton');
        this._buttonGuide.refresh();
    };

    const _Scene_Help_onChildCancel = Scene_Help.prototype.onChildCancel;
    Scene_Help.prototype.onChildCancel = function () {
        _Scene_Help_onChildCancel.call(this);
        this._buttonGuide.setActiveWindow('Window_HelpArticle');
        this._buttonGuide.refresh();
    };

    //-------------------------------------------------------------------------
    // Window_HelpChild

    Window_HelpChild.prototype.drawDesc = function () {
        const rect = this.baseTextRect();
        const tyo = 4;
        const iconOffset = 4;
        let currentX = rect.x;
        let currentY = rect.y + tyo;
        const lines = this.getArticleChild().desc.split("\n");
        let partsA = null;
        let partsB = null;
        let parsed = null;
        lines.forEach(line => {
            partsA = line.split('<Icon:');
            partsA.forEach(partA => {
                if (partA !== '') {
                    partsB = partA.split('>');
                    parsed = parseInt(partsB[0]);
                    if (parsed.toString() !== 'NaN') {
                        partsB[0] = parsed;
                    }
                    if (typeof partsB[0] === 'number') {
                        currentX += iconOffset;
                        this.drawIcon(partsB[0], currentX, currentY);
                        currentX += ImageManager.iconWidth + iconOffset;
                        this.drawText(partsB[1], currentX, currentY, rect.width);
                        currentX += this.textWidth(partsB[1]);
                    } else {
                        if (partsB[0] !== '') {
                            this.drawText(partsB[0], rect.x, currentY, rect.width);
                            currentX += this.textWidth(partsB[0]);
                        }
                    }
                }
            });
            currentX = rect.x;
            currentY += this.lineHeight();
        });

        return currentY;
    };


})();