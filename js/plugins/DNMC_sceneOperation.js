//=============================================================================
// RPG Maker MZ - DNMC_sceneOperation
// ----------------------------------------------------------------------------
// (C)2023 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/01/23 初版(DNMC_scene_Menuから分離)
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 作戦画面
 * @author cursed_twitch
 * @base DNMC_sceneMenu
 * @orderAfter DNMC_sceneMenu
 * 
 * @help DNMC_sceneOperation.js
 * 
 * @param setSkillVarIndex
 * @text セット中スキル変数開始
 * @desc この変数の次から14変数に各部アクターのセット中スキルを入れる
 * @type variable
 */

//-------------------------------------------------------------------------
// Scene_Operation
//
// The scene class of opetation screen.

function Scene_Operation() {
    this.initialize(...arguments);
}

Scene_Operation.prototype = Object.create(Scene_Skill.prototype);
Scene_Operation.prototype.constructor = Scene_Operation;

/**
 * 作戦シーンの初期化
 */
Scene_Operation.prototype.initialize = function () {
    Scene_Skill.prototype.initialize.call(this);
    // 0->Lサイド 1->Rサイド
    this._currentSide = -1;
};

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Scene_Map_createMapHUD = Scene_Map.prototype.createMapHUD;
    const _Scene_Map_createButtonGuide = Scene_Map.prototype.createButtonGuide;
    Scene_Operation.prototype.mapHUDRect = Scene_Map.prototype.mapHUDRect;
    Scene_Operation.prototype.HUDHeight = Scene_Map.prototype.HUDHeight;
    Scene_Operation.prototype.buttonGuideRect = Scene_Map.prototype.buttonGuideRect;
    Scene_Operation.prototype.createGoldWindow = Scene_Menu.prototype.createGoldWindow;
    Scene_Operation.prototype.goldWindowRect = Scene_Menu.prototype.goldWindowRect;

    /**
     * 作戦シーンの作成。
     */
    Scene_Operation.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createMenuCommandWindow();
        this.createGoldWindow();
        this.createMenuStatusWindow();
        _Scene_Map_createMapHUD.call(this);
        _Scene_Map_createButtonGuide.call(this);
        this._buttonGuide.refresh();
        this.createHelpWindow();
        this.createCtlrLWindow();
        this.createCtlrRWindow();
        this.createSkillTypeWindow();
        this.createSkillCategoryWindow();
        this.createItemWindow();

        this.onCtlrRChange();
        this._ctlrLWindow.forceSelect(0);
        this._currentSide = 0;
    };

    /**
     * 選択後コマンドウィンドウの作成。
     */
    Scene_Operation.prototype.createMenuCommandWindow = function () {
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
    Scene_Operation.prototype.menuCommandWindowRect = function () {
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.calcWindowHeight(1, true) - 8;
        const wx = Graphics.boxWidth - ww - 160;
        const wy = this.calcWindowHeight(3, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 選択後の対象者ウィンドウを作成する。
     */
    Scene_Operation.prototype.createMenuStatusWindow = function () {
        const rect = this.menuStatusWindowRect();
        this._menuStatusWindow = new Window_MenuStatus(rect);
        this._menuStatusWindow.select(this.actor().index());
        this.addWindow(this._menuStatusWindow);
    };

    Scene_Operation.prototype.menuStatusWindowRect = Scene_Menu.prototype.statusWindowRect;

    /**
     * スキルタイプウィンドウを作成する(タイプ選択時の処理変更)。
     */
    Scene_Operation.prototype.createSkillTypeWindow = function () {
        const rect = this.skillTypeWindowRect();
        this._skillTypeWindow = new Window_SkillType(rect);
        this._skillTypeWindow.setHelpWindow(this._helpWindow);
        this._skillTypeWindow.setHandler("ok", this.commandCategory.bind(this));
        this._skillTypeWindow.setHandler("cancel", this.onSkillTypeCancel.bind(this));
        this._skillTypeWindow.setHandler("pagedown", this.onCtlrLChange.bind(this));
        this._skillTypeWindow.setHandler("pageup", this.onCtlrRChange.bind(this));
        this.addWindow(this._skillTypeWindow);
    };

    /**
     * スキルタイプウィンドウ領域を返す。
     * @returns Rectangle
     */
    Scene_Operation.prototype.skillTypeWindowRect = function () {
        const wx = 0;
        const wy = this.calcWindowHeight(8, true) + 48;
        const ww = Graphics.boxWidth - this.mainCommandWidth() - 160;
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * Lサイドウィンドウの作成
     */
    Scene_Operation.prototype.createCtlrLWindow = function () {
        const rect = this.ctlrLWindowRect();
        this._ctlrLWindow = new Window_CtlrL(rect);
        this._ctlrLWindow.setActor(this.actor());
        this._ctlrLWindow.setHandler("ok", this.onCtrlLOk.bind(this));
        this._ctlrLWindow.setHandler("cancel", this.popScene.bind(this));
        this._ctlrLWindow.setHandler("pagedown", this.onCtlrLChange.bind(this));
        this.addWindow(this._ctlrLWindow);
    };

    /**
     * Lサイドウィンドウの領域を返す
     * @returns Rectangle
     */
    Scene_Operation.prototype.ctlrLWindowRect = function () {
        const msRect = this.menuStatusWindowRect();
        const comRect = this.menuCommandWindowRect();
        const wx = 0;
        const wy = msRect.y + msRect.height;
        const ww = comRect.x / 2;
        const wh = this.calcWindowHeight(4, true);;

        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * Rサイドウィンドウの作成
     */
    Scene_Operation.prototype.createCtlrRWindow = function () {
        const rect = this.ctlrRWindowRect();
        this._ctlrRWindow = new Window_CtlrR(rect);
        this._ctlrRWindow.setActor(this.actor());
        this._ctlrRWindow.setHandler("ok", this.onCtrlROk.bind(this));
        this._ctlrRWindow.setHandler("cancel", this.popScene.bind(this));
        this._ctlrRWindow.setHandler("pageup", this.onCtlrRChange.bind(this));
        this.addWindow(this._ctlrRWindow);
    };

    /**
     * Rサイドウィンドウの領域を返す
     * @returns Rectangle
     */
    Scene_Operation.prototype.ctlrRWindowRect = function () {
        const msRect = this.menuStatusWindowRect();
        const comRect = this.menuCommandWindowRect();
        const ww = comRect.x / 2;
        const wh = this.calcWindowHeight(4, true);
        const wx = comRect.x - ww;
        const wy = msRect.y + msRect.height;

        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * セットされているアクターを更新する
     */
    Scene_Operation.prototype.refreshActor = function () {
        const actor = this.actor();
        this._ctlrLWindow.setActor(actor);
        this._ctlrRWindow.setActor(actor);
        this._skillTypeWindow.setActor(actor);
        this._itemWindow.setActor(actor);
    };

    /**
     * +LサイドウィンドウでOKしたときの処理
     */
    Scene_Operation.prototype.onCtrlLOk = function () {
        this._ctlrLWindow.setLastIndex();
        this._ctlrLWindow.deactivate();
        this._skillTypeWindow.activate();
    };

    /**
     * Lサイドウィンドウで R したときの処理
     */
    Scene_Operation.prototype.onCtlrLChange = function () {
        this._skillTypeWindow.deactivate();
        this._categoryWindow.deactivate();
        this._ctlrLWindow.deactivate();
        this._ctlrRWindow.activate();
        this._ctlrRWindow.selectLast();
        this._currentSide = 1;
    };

    /**
     * RサイドウィンドウでOKしたときの処理
     */
    Scene_Operation.prototype.onCtrlROk = function () {
        this._ctlrRWindow.setLastIndex();
        this._ctlrRWindow.deactivate();
        this._skillTypeWindow.activate();
    };

    /**
     * Rサイドウィンドウで L したときの処理
     */
    Scene_Operation.prototype.onCtlrRChange = function () {
        this._skillTypeWindow.deactivate();
        this._categoryWindow.deactivate();
        this._ctlrRWindow.deactivate();
        this._ctlrLWindow.activate();
        this._ctlrLWindow.selectLast();
        this._currentSide = 0;
    };

    /**
     * スキルカテゴリ選択時の処理。
     */
    Scene_Operation.prototype.onCategoryOk = function () {
        this._itemWindow.activate();
        this._itemWindow.forceSelect(0);
        this.expandItemWindow();
    };

    /**
     * スキルリストウィンドウを広げる
     */
    Scene_Operation.prototype.expandItemWindow = function () {
        const stwr = this.skillTypeWindowRect();
        const wy = stwr.y;
        const wh = this.mainAreaBottom() - stwr.y
        this._itemWindow.y = wy;
        this._itemWindow.height = wh;
    };

    /**
     * スキルリストウィンドウを縮める
     */
    Scene_Operation.prototype.shrinkItemWindow = function () {
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const wh = this.mainAreaBottom() - wy;
        this._itemWindow.y = wy;
        this._itemWindow.height = wh;
    };

    /**
     * スキルタイプウィンドウでキャンセルしたときの処理。
     */
    Scene_Operation.prototype.onSkillTypeCancel = function () {
        switch (this._currentSide) {
            case 0:
                // L
                this.onCtlrRChange();
                break;
            case 1:
                // R
                this.onCtlrLChange();
                break;
        }
    };

    /**
     * スキルを選択したOKしたときの処理
     */
    Scene_Operation.prototype.onItemOk = function () {
        let index = -1;
        let currentItem = null;
        const item = this._itemWindow.item();
        switch (this._currentSide) {
            case 0:
                // L
                index = this._ctlrLWindow.index();
                currentItem = this._ctlrLWindow.item();
                break;
            case 1:
                // R
                index = 4 + this._ctlrRWindow.index();
                currentItem = this._ctlrRWindow.item();
                break;
        }

        const vi = param.setSkillVarIndex + this.actor().actorId();
        let values = $v.get(vi).toString().split(",");
        // 必ず8件必要なので、足りなければうめる
        while (values.length < 8) {
            values.push("");
        }
        //CSVN_base.log(currentItem);
        //CSVN_base.log(item);        
        if (currentItem) {
            // 空白でない場所へのセット
            if (item) {
                if (currentItem.id === item.id) {
                    values[index] = "";
                } else {
                    values[index] = item.id;
                }
            } else {
                values[index] = "";
            }
        } else {
            // 空白へのセット
            values[index] = item ? item.id : "";
        }

        $v.set(vi, values.join(","));

        this.shrinkItemWindow();

        switch (this._currentSide) {
            case 0:
                // L
                this.onCtlrRChange();
                this._ctlrLWindow.refresh();
                break;
            case 1:
                // R
                this.onCtlrLChange();
                this._ctlrRWindow.refresh();
                break;
        }
    };

    /**
     * スキル選択をキャンセルした時の処理
     */
    Scene_Operation.prototype.onItemCancel = function () {
        this._itemWindow.deselect();
        this._categoryWindow.activate();
        this.shrinkItemWindow();
    };

    //-------------------------------------------------------------------------
    // Window_CtlrL
    //
    // The window for selecting skill for L-side.

    function Window_CtlrL() {
        this.initialize(...arguments);
    }

    Window_CtlrL.prototype = Object.create(Window_SkillList.prototype);
    Window_CtlrL.prototype.constructor = Window_CtlrL;

    /**
     * Lサイドウィンドウの初期化
     * @param {Rectangle} rect 
     */
    Window_CtlrL.prototype.initialize = function (rect) {
        Window_SkillList.prototype.initialize.call(this, rect);
        this._lastIndex = 0;
    };

    /**
     * 列数
     * @returns number
     */
    Window_CtlrL.prototype.maxCols = function () {
        return 1;
    };

    /**
     * 項目の最大数
     * @returns number
     */
    Window_CtlrL.prototype.maxItems = function () {
        return 4;
    };

    /**
     * Lサイドウィンドウの内容をセットする。
     */
    Window_CtlrL.prototype.makeItemList = function () {
        const vi = param.setSkillVarIndex + this._actor.actorId();
        const ss = $v.get(vi).toString().split(",");
        this._data = [
            $dataSkills[ss[0]] ? $dataSkills[ss[0]] : null,
            $dataSkills[ss[1]] ? $dataSkills[ss[1]] : null,
            $dataSkills[ss[2]] ? $dataSkills[ss[2]] : null,
            $dataSkills[ss[3]] ? $dataSkills[ss[3]] : null,
        ];

        const notNullElement = this._data.some(e => {
            return e;
        });

        if (!notNullElement) {
            this._data = [
                $dataSkills[COMMON_SKILL_IDS.ATTACK],
                $dataSkills[COMMON_SKILL_IDS.DEFEND],
                $dataSkills[COMMON_SKILL_IDS.ESCAPE],
                $dataSkills[COMMON_SKILL_IDS.ITEM]
            ];
            // デフォルトの内容で一旦保存してしまう
            $v.set(vi, [
                COMMON_SKILL_IDS.ATTACK,
                COMMON_SKILL_IDS.DEFEND,
                COMMON_SKILL_IDS.ESCAPE,
                COMMON_SKILL_IDS.ITEM,
                "",
                "",
                "",
                ""
            ].join(","));
        }
    };

    /**
     * 最後に選択していたインデックスを保持
     */
    Window_CtlrL.prototype.setLastIndex = function () {
        this._lastIndex = this.index();
    };

    /**
     * 最後に選択していた項目を再選択
     */
    Window_CtlrL.prototype.selectLast = function () {
        this.select(this._lastIndex);
    };

    /**
     * LRサイドウインドウの項目はいつもすべて有効
     * @returns boolean
     */
    Window_CtlrL.prototype.isCurrentItemEnabled = function () {
        return true;
    };

    /**
     * キー＋スキル名描画
     * @param {number} index 
     */
    Window_CtlrL.prototype.drawItem = function (index) {
        const skill = this.itemAt(index);
        const keys = this.keysName(index);
        const rect = this.itemLineRect(index);
        const costWidth = this.costWidth();
        const keysWidth = this.textWidth("0000");
        this.resetTextColor();
        if (skill) {
            this.changePaintOpacity(this.isEnabled(skill));
            this.drawText(keys, rect.x, rect.y, keysWidth);
            this.drawItemName(skill, rect.x + keysWidth, rect.y, rect.width - costWidth - keysWidth);
            this.drawSkillCost(
                skill,
                rect.x + keysWidth - costWidth - this.itemPadding(),
                rect.y,
                rect.width
            );
            this.changePaintOpacity(1);
        } else {
            this.drawText(keys, rect.x, rect.y, keysWidth);
        }
    };

    /**
     * キー名
     * @param {number} index 
     * @returns string
     */
    Window_CtlrL.prototype.keysName = function (index) {
        const LKEY = "L";
        const keys = ["A", "B", "X", "Y"];

        return LKEY + "+" + keys[index];
    };

    //-------------------------------------------------------------------------
    // Window_CtlrR
    //
    // The window for selecting skill for R-side.

    function Window_CtlrR() {
        this.initialize(...arguments);
    }

    Window_CtlrR.prototype = Object.create(Window_SkillList.prototype);
    Window_CtlrR.prototype.constructor = Window_CtlrR;

    /**
     * Rサイドウィンドウの初期化
     * @param {Rectangle} rect 
     */
    Window_CtlrR.prototype.initialize = function (rect) {
        Window_SkillList.prototype.initialize.call(this, rect);
        this._lastIndex = 0;
    };

    Window_CtlrR.prototype.maxCols = Window_CtlrL.prototype.maxCols;
    Window_CtlrR.prototype.maxItems = Window_CtlrL.prototype.maxItems;

    /**
     * Rサイドウィンドウの内容をセットする。
     */
    Window_CtlrR.prototype.makeItemList = function () {
        const vi = param.setSkillVarIndex + this._actor.actorId();
        const ss = $v.get(vi).toString().split(",");
        this._data = [
            $dataSkills[ss[4]] ? $dataSkills[ss[4]] : null,
            $dataSkills[ss[5]] ? $dataSkills[ss[5]] : null,
            $dataSkills[ss[6]] ? $dataSkills[ss[6]] : null,
            $dataSkills[ss[7]] ? $dataSkills[ss[7]] : null,
        ];
    };

    /**
     * 最後に選択していたインデックスを保持
     */
    Window_CtlrR.prototype.setLastIndex = function () {
        this._lastIndex = this.index();
    };

    /**
     * 最後に選択していた項目を再選択
     */
    Window_CtlrR.prototype.selectLast = function () {
        this.select(this._lastIndex);
    };

    /**
     * LRサイドウインドウの項目はいつもすべて有効
     * @returns boolean
     */
    Window_CtlrR.prototype.isCurrentItemEnabled = function () {
        return true;
    };

    /**
     * キー＋スキル名描画
     * @param {number} index 
     */
    Window_CtlrR.prototype.drawItem = function (index) {
        Window_CtlrL.prototype.drawItem.call(this, index);
    };

    /**
     * キー名
     * @param {number} index 
     * @returns string
     */
    Window_CtlrR.prototype.keysName = function (index) {
        const RKEY = "R";
        const keys = ["A", "B", "X", "Y"];

        return RKEY + "+" + keys[index];
    };

})();