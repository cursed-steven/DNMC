//=============================================================================
// RPG Maker MZ - CSVN_battleResult
// ----------------------------------------------------------------------------
// (C)2023 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/02/xx 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 戦闘結果表示
 * @author cursed_twitch
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_battleResult.js
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // Scene_Battle

    const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    /**
     * 結果ウィンドウ用処理追加
     */
    Scene_Battle.prototype.createAllWindows = function () {
        this.createResultWindow();
        _Scene_Battle_createAllWindows.call(this);
    };

    /**
     * 結果ウィンドウ作成
     */
    Scene_Battle.prototype.createResultWindow = function () {
        const rect = this.resultWindowRect();
        this._resultWindow = new Window_BattleResult(rect);
        this.addWindow(this._resultWindow);
    };

    Scene_Battle.prototype.resultWindowRect = function () {
        // TODO
    };

    const _Scene_Battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
    /**
     * 結果ウィンドウ用処理追加
     */
    Scene_Battle.prototype.createDisplayObjects = function () {
        _Scene_Battle_createDisplayObjects.call(this);
        BattleManager.setResultWindow(this._resultWindow);
        this._resultWindow.setSpriteset(this._spriteset);
    };

    //-----------------------------------------------------------------------------
    // BattleManager

    /**
     * 表示形式を変更
     */
    BattleManager.displayRewards = function () {
        // TODO
    };

})();