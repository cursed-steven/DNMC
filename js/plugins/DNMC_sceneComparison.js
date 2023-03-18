//=============================================================================
// RPG Maker MZ - DNMC_sceneComparison
// ----------------------------------------------------------------------------
// (C)2023 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/01/23 初版(DNMC_sceneMenuから分離)
// 1.0.1  2023/03/17 クエストHUD対応
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 比較画面
 * @author cursed_twitch
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help DNMC_sceneComparison.js
 */

//-------------------------------------------------------------------------
// Scene_Comparison
//
// The scene class of comparison screen.

function Scene_Comparison() {
    this.initialize(...arguments);
}

Scene_Comparison.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Comparison.prototype.constructor = Scene_Comparison;

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Scene_Map_createMapHUD = Scene_Map.prototype.createMapHUD;
    const _Scene_Map_createButtonGuide = Scene_Map.prototype.createButtonGuide;
    Scene_Comparison.prototype.mapHUDRect = Scene_Map.prototype.mapHUDRect;
    Scene_Comparison.prototype.HUDHeight = Scene_Map.prototype.HUDHeight;
    Scene_Comparison.prototype.buttonGuideRect = Scene_Map.prototype.buttonGuideRect;
    Scene_Comparison.prototype.createGoldWindow = Scene_Menu.prototype.createGoldWindow;
    Scene_Comparison.prototype.goldWindowRect = Scene_Menu.prototype.goldWindowRect;
    Scene_Comparison.prototype.menuStatusWindowRect = Scene_Menu.prototype.statusWindowRect;
    Scene_Comparison.prototype.createQuestHUD = Scene_Map.prototype.createQuestHUD;
    Scene_Comparison.prototype.questHUDRect = Scene_Map.prototype.questHUDRect;

    /**
     * 選択後コマンドウィンドウの作成。
     */
    Scene_Comparison.prototype.createMenuCommandWindow = function () {
        const rect = this.menuCommandWindowRect();
        const commandWindow = new Window_MenuCommand(rect);
        this.addWindow(commandWindow);
        this._commandWindow = commandWindow;
        this._commandWindow.deactivate();
    };

    /**
     * 選択後のコマンドウィンドウ領域を返す。
     * @returns Rectangle
     */
    Scene_Comparison.prototype.menuCommandWindowRect = function () {
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.calcWindowHeight(1, true) - 8;
        const wx = Graphics.boxWidth - ww - 160;
        const wy = this.calcWindowHeight(3, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 選択後の対象者ウィンドウを作成する。
     */
    Scene_Comparison.prototype.createMenuStatusWindow = function () {
        const rect = this.menuStatusWindowRect();
        this._menuStatusWindow = new Window_MenuStatus(rect);
        this._menuStatusWindow.select(this.actor().index());
        this.addWindow(this._menuStatusWindow);
    };

    /**
     * 初期化
     */
    Scene_Comparison.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    /**
     * シーン作成
     */
    Scene_Comparison.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createMenuCommandWindow();
        this.createGoldWindow();
        _Scene_Map_createMapHUD.call(this);
        _Scene_Map_createButtonGuide.call(this);
        this._buttonGuide.refresh();
        this.createQuestHUD();
        this.createComparisonWindow();
    };

    /**
     * シーン開始
     */
    Scene_Comparison.prototype.start = function () {
        Scene_MenuBase.prototype.start.call(this);
        this._comparisonWindow.refresh();
        this._comparisonWindow.activate();
    };

    const _Scene_Comparison_update = Scene_Comparison.prototype.update;
    /**
     * クエストHUD表示と更新を追加
     */
    Scene_Comparison.prototype.update = function () {
        _Scene_Comparison_update.call(this);
        this._questHUD.show();
        this._questHUD.refresh();
    };

    /**
     * 比較ウィンドウ作成
     */
    Scene_Comparison.prototype.createComparisonWindow = function () {
        const rect = this.comparisonWindowRect();
        const comparisonWindow = new Window_ActorComparison(rect);
        comparisonWindow.setHandler("ok", this.onPersonalOk.bind(this));
        comparisonWindow.setHandler("cancel", this.onPersonalCancel.bind(this));
        comparisonWindow.setHandler("pagedown", this.toggleMode.bind(this));
        comparisonWindow.setHandler("pageup", this.toggleMode.bind(this));
        this.addWindow(comparisonWindow);
        this._comparisonWindow = comparisonWindow;
    };

    /**
     * 比較ウィンドウ領域
     * @returns Rectangle
     */
    Scene_Comparison.prototype.comparisonWindowRect = function () {
        const mswr = this.menuStatusWindowRect();
        const wx = 0;
        const wy = mswr.y;
        const ww = Graphics.boxWidth - this.mainCommandWidth() - 160;
        const wh = Graphics.boxHeight - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 比較ウィンドウでアクターを選択したときの動作
     */
    Scene_Comparison.prototype.onPersonalOk = function () {
        SceneManager.push(Scene_EquipStatus);
    };

    /**
     * 比較ウィンドウでキャンセルしたときの動作
     */
    Scene_Comparison.prototype.onPersonalCancel = function () {
        this.popScene();
    };

    /**
     * LRをおしたときの動作
     */
    Scene_Comparison.prototype.toggleMode = function () {
        this._comparisonWindow.toggleMode();
        this._comparisonWindow.activate();
    };

    //-----------------------------------------------------------------------------
    // Window_ActorComparison
    //
    // The window for selecting an item on the actor comparison screen.

    function Window_ActorComparison() {
        this.initialize(...arguments);
    }

    Window_ActorComparison.prototype = Object.create(Window_MenuStatus.prototype);
    Window_ActorComparison.prototype.constructor = Window_ActorComparison;

    /**
     * 比較ウィンドウ初期化
     * @param {Rentangle} rect 
     */
    Window_ActorComparison.prototype.initialize = function (rect) {
        Window_MenuStatus.prototype.initialize.call(this, rect);
        this._mode = "param";
    };

    /**
     * 最大列数
     * @returns number
     */
    Window_ActorComparison.prototype.maxCols = function () {
        return 2;
    };

    /**
     * 表示行数を返す
     * @returns number
     */
    Window_ActorComparison.prototype.numVisibleRows = function () {
        return 2;
    };

    /**
     * 最大項目数
     * @returns number
     */
    Window_ActorComparison.prototype.maxItems = function () {
        return $gameParty.members().length;
    };

    /**
     * モードを切り替える
     */
    Window_ActorComparison.prototype.toggleMode = function () {
        if (this._mode === "param") {
            this._mode = "equip";
        } else {
            this._mode = "param";
        }
        this.contents.clear();
        this.refresh();
    };

    /**
     * アクターごとの中身の描画
     * @param {number} index 
     */
    Window_ActorComparison.prototype.drawItem = function (index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        this.drawPendingItemBackground(index);

        if (actor) {
            this.drawActorCharacter(
                actor,
                rect.x + CHARACTER_IMAGE.WIDTH_OFFSET,
                rect.y + CHARACTER_IMAGE.HEIGHT_OFFSET
            );
            this.drawActorNameClass(index);

            if (this._mode === "param") {
                this.drawActorLevel(index);
                this.drawAllParams(index);
            } else {
                this.drawEquips(index);
            }
        }
        this.forceSelect(0);
    }

    /**
     * 名前と職業の描画
     * @param {number} index 
     */
    Window_ActorComparison.prototype.drawActorNameClass = function (index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const x = 104;
        const y = 8;
        const width = 256;
        this.changeTextColor(ColorManager.hpColor(actor));
        this.drawText(
            actor.name() + "(" + actor.currentClass().name + ")",
            rect.x + x,
            rect.y + y,
            width
        );
    };

    /**
     * レベルの描画
     * @param {number} index 
     */
    Window_ActorComparison.prototype.drawActorLevel = function (index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const x = 104;
        const y = this.lineHeight() + 16;

        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.levelA, rect.x + x, rect.y + y, 48);
        this.resetTextColor();
        this.drawText(
            actor.level,
            rect.x + x + this.textWidth("000"),
            rect.y + y,
            36,
            "right"
        );
    };

    /**
     * パラメータの名前と値を描画する。
     * @param {number} index 
     */
    Window_ActorComparison.prototype.drawAllParams = function (index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);

        for (let i = 0; i < 8; i++) {
            const x = i < 4
                ? rect.x + this.itemPadding() * 2
                : rect.x + rect.width / 2 + this.itemPadding() * 2;
            const y = i < 4
                ? rect.y + this.paramY(i)
                : rect.y + this.paramY(i - 4);

            this.drawParamName(x, y, i);
            this.drawCurrentParam(actor, x + this.paramNameX(), y, i);
        }
    };

    /**
     * パラメータ名を描画する
     * @param {number} x 
     * @param {number} y 
     * @param {number} paramId 
     */
    Window_ActorComparison.prototype.drawParamName = function (x, y, paramId) {
        const width = this.paramNameX() - this.itemPadding() * 2;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.param(paramId), x, y, width);
    };

    /**
     * 現在のパラメータの値の描画
     * @param {Game_Actor} actor 
     * @param {number} x 
     * @param {number} y 
     * @param {number} paramId 
     */
    Window_ActorComparison.prototype.drawCurrentParam = function (actor, x, y, paramId) {
        const paramWidth = this.paramWidth();
        this.resetTextColor();
        this.drawText(actor.param(paramId), x, y, paramWidth, "right");
    };

    /**
     * パラメータ名のいちばん長いものを基準にした描画位置Xを返す。
     * @returns number
     */
    Window_ActorComparison.prototype.paramNameX = function () {
        let paramNameWidths = [];
        for (let i = 0; i < 8; i++) {
            paramNameWidths.push(this.textWidth(TextManager.param(i)));
        }
        return Math.max.apply(null, paramNameWidths) + this.textWidth("00") + this.itemPadding();
    };

    /**
     * パラメータごとのY座標を返す
     * @param {number} index 
     * @returns number
     */
    Window_ActorComparison.prototype.paramY = function (index) {
        return this.lineHeight() * (index + 3) + this.itemPadding();
    }

    /**
     * パラメータ表示の幅
     * @returns number
     */
    Window_ActorComparison.prototype.paramWidth = function () {
        return this.textWidth("0000");
    };

    /**
     * 装備の描画
     * @param {number} index 
     */
    Window_ActorComparison.prototype.drawEquips = function (index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const x = 100;
        const y = CHARACTER_IMAGE.HEIGHT;

        let equip = null;
        for (let i = 0; i < 5; i++) {
            equip = actor.equips()[i];
            this.drawItemName(
                equip,
                rect.x + x,
                rect.y + y + this.lineHeight() * 0.9 * i,
                rect.width
            );
        }
    };

})();