//=============================================================================
// RPG Maker MZ - DNMC_questHUD
// ----------------------------------------------------------------------------
// (C)2023 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/02/28 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 進行中クエストの内容を戦闘以外の画面に常駐表示します。
 * @author cursed_twitch
 * @base CSVN_base
 * @base QuestSystem
 * @orderAfter CSVN_base
 * @orderAfter QuestSystem
 * 
 * @help DNMC_questHUD.js
 * 
 * @param orderingStateText
 * @text 進行中表示テキスト
 * @desc QuestSystem.jsの表示テキスト/進行中に合わせるのがベター
 * @type string
 * @default 進行中
 * 
 * @param reportableStateText
 * @text 報告可表示テキスト
 * @desc QuestSystem.jsの表示テキスト/報告可に合わせるのがベター
 * @type string
 * @default 報告可
 * 
 * @param noQuestOngoing
 * @text 受注クエストがない場合の表示
 * @type string
 * @default 進行中のクエストはありません
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // Scene_Map

    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function () {
        this.createQuestHUD();
        _Scene_Map_createAllWindows.call(this);
    };

    /**
     * クエストHUDを作成する
     */
    Scene_Map.prototype.createQuestHUD = function () {
        const rect = this.questHUDRect();
        this._questHUD = new Window_QuestHUD(rect);
        this.addWindow(this._questHUD);
    };

    /**
     * クエストHUDの領域を返す
     * @returns Rectangle
     */
    Scene_Map.prototype.questHUDRect = function () {
        const ww = Graphics.boxWidth - 160;
        const wh = this.calcWindowHeight(2, true);
        const wx = 0;
        const wy = 48;
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    /**
     * クエストHUD表示と更新を追加
     */
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        this._questHUD.show();
        this._questHUD.refresh();
    };

    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    /**
     * クエストHUD非表示を追加
     */
    Scene_Map.prototype.terminate = function () {
        this._questHUD.hide();
        _Scene_Map_terminate.call(this);
    };

    //-------------------------------------------------------------------------
    // Window_QuestHUD
    //
    // The window for displaying quest HUD on the map scene.

    function Window_QuestHUD() {
        this.initialize(...arguments);
    }

    Window_QuestHUD.prototype = Object.create(Window_Base.prototype);
    Window_QuestHUD.prototype.constructor = Window_QuestHUD;

    /**
     * クエストHUD初期化
     * @param {Rectangle} rect 
     */
    Window_QuestHUD.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.setBackgroundType(2);

        this.fontSize = $gameSystem.mainFontSize() * 0.8;
    };

    /**
     * クエストHUD描画更新
     */
    Window_QuestHUD.prototype.refresh = function () {
        this.contents.clear();
        this.contents.fontSize = this.fontSize;
        const qs = this.filterAndSortOngoing();
        if (qs) {
            this.drawQuestInfo(qs[0]);
        } else {
            this.drawText(param.noQuestOngoing, 0, 0, this.width);
        }
        this.contents.fontSize = $gameSystem.mainFontSize();
    };

    /**
     * ゲーム内部で保持しているクエストデータのうち進行中/報告可なものを抽出し、優先度降順にソートして返す
     * @returns QuestData[]
     */
    Window_QuestHUD.prototype.filterAndSortOngoing = function () {
        const filtered = $dataQuests.filter(
            q => $v.get(q._variableId) === 2
                || $v.get(q._variableId) === 3
        );

        if (filtered.length === 0) {
            return null;
        }

        const sorted = filtered.sort(
            (a, b) => b._priority - a._priority
        );

        return sorted;
    };

    /**
     * クエスト情報の描画
     * @param {QuestData} q 
     */
    Window_QuestHUD.prototype.drawQuestInfo = function (q) {
        const fontSize = this.fontSize;
        const yOffset = 8;
        const stateText = this.stateText(q._variableId);
        const stateTextWidth = fontSize * 5.5;
        const iconWidth = 20 + fontSize;
        let width = 0;


        this.drawText("【" + stateText + "】", 0, yOffset, stateTextWidth);
        width += stateTextWidth;

        this.drawIcon(q._iconIndex, width, yOffset);
        width += iconWidth;

        this.drawText(q._title, width, yOffset, this.width - width);
    };

    /**
     * クエストの状態に合わせた状態表示テキストを返す
     * @param {number} variableId 
     * @returns string
     */
    Window_QuestHUD.prototype.stateText = function (variableId) {
        const state = $v.get(variableId);
        let result = "";

        switch (state) {
            case 2:
                result = param.orderingStateText;
                break;
            case 3:
                result = param.reportableStateText;
                break;
        }

        return result;
    }

})();