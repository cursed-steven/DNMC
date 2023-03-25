//=============================================================================
// RPG Maker MZ - CSVN_saveLoadOnLandscape
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/03/25 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 横長画面向けのセーブ／ロード画面
 * @author cursed_steven
 * @base CSVN_base
 * @base DarkPlasma_MapNameOnSave
 * @orderAfter CSVN_base
 * @orderAfter DarkPlasma_MapNameOnSave
 * 
 * @help CSVN_saveLoadOnLandscape.js
 * 
 * @param maxSaveFiles
 * @text セーブファイル最大数
 * @type number
 * @min 1
 * @default 20
 * 
 * @param characterWidth
 * @text プレイヤーキャラのサイズ(幅)
 * @type number
 * @default 48
 * 
 * @param characterHeight
 * @text プレイヤーキャラのサイズ(高さ)
 * @type number
 * @default 48
 *
 * @param bottomOffset
 * @text 下側余白
 * @type number
 * @default 0
 *
 * @param leftOffset
 * @text 左側余白
 * @type number
 * @default 0
 *
 * @param rightOffset
 * @text 右側余白
 * @type number
 * @default 0
 *
 * @param topOffset
 * @text 上側余白
 * @type number
 * @default 0
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    const MAX_SAVE_FILES = param.maxSaveFiles ? param.maxSaveFiles : 20;
    const CHAR_WIDTH = param.chararcterWidth ? param.chararcterWidth : 48;
    const CHAR_HEIGHT = param.characterHeight ? param.characterHeight : 48;

    //-----------------------------------------------------------------------------
    // DataManager

    /**
     * セーブファイル最大数はプラグインパラメータから
     * @returns number
     */
    DataManager.maxSaveFiles = function () {
        return MAX_SAVE_FILES;
    };

    const _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
    /**
     * パーティーの状態をセーブファイルに書き込む処理を追加
     * @returns any
     */
    DataManager.makeSavefileInfo = function () {
        const info = _DataManager_makeSavefileInfo.call(this);
        info.members = $gameParty.members();
        return info;
    };

    //-----------------------------------------------------------------------------
    // Scene_File

    const _Scene_File_listWindowRect = Scene_File.prototype.listWindowRect;
    /**
     * プラグインパラメータの上下左右の余白を反映
     * @returns Rectangle
     */
    Scene_File.prototype.listWindowRect = function () {
        const orgRect = _Scene_File_listWindowRect.call(this);
        return new Rectangle(
            orgRect.x + param.leftOffset,
            orgRect.y + param.topOffset,
            orgRect.width - param.leftOffset - param.rightOffset,
            orgRect.height - param.topOffset - param.bottomOffset
        );
    };

    //-----------------------------------------------------------------------------
    // Window_SavefileList

    /**
     * 列数変更
     * @returns number
     */
    Window_SavefileList.prototype.maxCols = function () {
        return 2;
    };

    /**
     * 画面縦幅を割り切れそうな数で
     * @returns number
     */
    Window_SavefileList.prototype.numVisibleRows = function () {
        return 3;
    };

    const _Window_SavefileList_drawContents = Window_SavefileList.prototype.drawContents;
    Window_SavefileList.prototype.drawContents = function (info, rect) {
        _Window_SavefileList_drawContents.call(this, info, rect);

        const bottom = rect.y + rect.height;
        const fontSize = $gameSystem.mainFontSize() / 2;
        if (rect.width >= 420) {
            this.drawActorNames(
                info,
                rect.x + 220,
                bottom - CHAR_HEIGHT - 32
            );
        }
    };

    /**
     * アクター名描画
     * @param {any} info 
     * @param {number} x 
     * @param {number} y 
     */
    Window_SavefileList.prototype.drawActorNames = function (info, x, y) {
        if (info.members) {
            this.contents.fontSize = $gameSystem.mainFontSize() / 2;
            let charX = x - CHAR_WIDTH / 2;
            for (const actor of info.members) {
                if (!actor) continue;
                this.drawText(
                    actor.name(),
                    charX,
                    y,
                    CHAR_WIDTH,
                    "center"
                );
                charX += CHAR_WIDTH;
            }
            this.contents.fontSize = $gameSystem.mainFontSize();
        }
    };

})();