//=============================================================================
// RPG Maker MZ - DNMC_sceneOperation
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/01/23 初版(DNMC_scene_Menuから分離)
// 1.0.1  2023/03/06 setMoreNumberFontFace.jsの改造に伴ってカスタマイズ
// 1.0.2  2023/03/17 クエストHUD対応
// 1.1.0  2023/03/22 L側R側の移動をカーソルキーでできるように修正
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 作戦画面
 * @author cursed_steven
 * @base DNMC_sceneMenu
 * @orderAfter DNMC_sceneMenu
 * 
 * @help DNMC_sceneOperation.js
 * 
 * @param actorsMaxLength
 * @text アクター最大人数
 * @desc これを超えると除籍が必要になる人数
 * @type number
 * @min 2
 * @default 16
 * 
 * @param setSkillVarIndex
 * @text セット中スキル変数開始
 * @desc この変数の次から16変数に各部アクターのセット中スキルを入れる
 * @type variable
 * 
 * @param lastCurrentSide
 * @text LRどちら側か
 * @desc 最後にLRどちら側をさわってたか
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
};

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * セット中スキルの書き込み先変数番号を取得する
     */
    function getVarNumForRegisterSkill(actorId) { 
        const ssvi = parseInt(param.setSkillVarIndex);
        const maxActorCount = parseInt(param.actorsMaxLength);
        let vi = ssvi + 1;
        let actorIdInVar = 0;
        let viFound = false;

        // 新式でまずさがす
        for (let i = 0; i < maxActorCount; i++) {
            actorIdInVar = $v.get(vi + i).toString().split(',').length > 0
                ? $v.get(vi + i).toString().split(',')[0]
                : 0;
            if (parseInt(actorIdInVar) === parseInt(actorId)) {
                vi += i;
                viFound = true;
                break
            };
        }
        if (viFound) {
            console.log(`vi found [new]: ${vi}`);
            return vi;
        }

        // 新式にいなければ旧式を使う
        vi = ssvi + parseInt(actorId);
        if (vi > ssvi + maxActorCount) {
            vi = ssvi + 1;
            while ($v.get(vi) !== 0) {
                vi++;
            }
        }
        console.log(`vi [old]: ${vi}`);

        return vi;
    };

    const _Scene_Map_createMapHUD = Scene_Map.prototype.createMapHUD;
    const _Scene_Map_createButtonGuide = Scene_Map.prototype.createButtonGuide;
    Scene_Operation.prototype.mapHUDRect = Scene_Map.prototype.mapHUDRect;
    Scene_Operation.prototype.HUDHeight = Scene_Map.prototype.HUDHeight;
    Scene_Operation.prototype.buttonGuideRect = Scene_Map.prototype.buttonGuideRect;
    Scene_Operation.prototype.createGoldWindow = Scene_Menu.prototype.createGoldWindow;
    Scene_Operation.prototype.goldWindowRect = Scene_Menu.prototype.goldWindowRect;
    Scene_Operation.prototype.createQuestHUD = Scene_Map.prototype.createQuestHUD;
    Scene_Operation.prototype.questHUDRect = Scene_Map.prototype.questHUDRect;

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
        this.createHelpWindow();
        this.createCtlrLWindow();
        this.createCtlrRWindow();
        this.createSkillTypeWindow();
        this.createSkillCategoryWindow();
        this.createItemWindow();
        this.createQuestHUD();

        this._helpWindow.hide();

        this._ctlrLWindow.setRightSideWindow(this._ctlrRWindow);
        this._ctlrLWindow.setSkillTypeWindow(this._skillTypeWindow);
        this._ctlrLWindow.setCategoryWindow(this._categoryWindow);
        this._ctlrRWindow.setLeftSideWindow(this._ctlrLWindow);
        this._ctlrRWindow.setSkillTypeWindow(this._skillTypeWindow);
        this._ctlrRWindow.setCategoryWindow(this._categoryWindow);
        this._ctlrRWindow.deselect();

        this._buttonGuide.show();
        this._buttonGuide.refresh();

        this.goBackToLeftSide();
        this.setCurrentSide(0);
    };

    const _Scene_Operation_update = Scene_Operation.prototype.update;
    /**
     * クエストHUD表示を追加
     */
    Scene_Operation.prototype.update = function () {
        _Scene_Operation_update.call(this);
        this._buttonGuide.show();
        this._buttonGuide.refresh();
        this._questHUD.show();
        this._questHUD.refresh();
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
        this._skillTypeWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._skillTypeWindow.setHandler("pageup", this.previousActor.bind(this));
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
     * スキルリストウィンドウ領域を返す
     * @returns Rectangle
     */
    Scene_Operation.prototype.itemWindowRect = function () {
        const wx = 0;
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const ww = this._skillTypeWindow.width;
        const wh = Graphics.boxHeight - wy;
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
        this._ctlrLWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._ctlrLWindow.setHandler("pageup", this.previousActor.bind(this));
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
        this._ctlrRWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._ctlrRWindow.setHandler("pageup", this.previousActor.bind(this));
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
     * いまLRどちら側かを返す
     * @returns number
     */
    Scene_Operation.prototype.getCurrentSide = function () {
        return $v.get(param.lastCurrentSide);
    };

    /**
     * いまアクティヴなのがLRどちらなのか確定させる。
     */
    Scene_Operation.prototype.setCurrentSide = function (side) {
        $v.set(param.lastCurrentSide, side);
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
        this._menuStatusWindow.select(actor.index());
        this._ctlrRWindow.deselect();
    };

    /**
     * +LサイドウィンドウでOKしたときの処理
     */
    Scene_Operation.prototype.onCtrlLOk = function () {
        this._ctlrLWindow.setLastIndex();
        this._ctlrLWindow.deactivate();
        this._skillTypeWindow.activate();
        this._buttonGuide.setActiveWindow("Window_SkillCategory");
        this.setCurrentSide(0);
    };

    /**
     * Rサイドウィンドウのスキル選択等して戻る時の処理
     */
    Scene_Operation.prototype.goBackToRightSide = function () {
        this._skillTypeWindow.deactivate();
        this._categoryWindow.deactivate();
        this._ctlrLWindow.deactivate();
        this._ctlrRWindow.activate();
        this._ctlrRWindow.selectLast();
        this._buttonGuide.setActiveWindow("Window_CtlrR");
    };

    /**
     * RサイドウィンドウでOKしたときの処理
     */
    Scene_Operation.prototype.onCtrlROk = function () {
        this._ctlrRWindow.setLastIndex();
        this._ctlrRWindow.deactivate();
        this._skillTypeWindow.activate();
        this._buttonGuide.setActiveWindow("Window_SkillCategory");
        this.setCurrentSide(1);
    };

    /**
     * Lサイドウィンドウのスキル選択等して戻る時の処理
     */
    Scene_Operation.prototype.goBackToLeftSide = function () {
        this._skillTypeWindow.deactivate();
        this._categoryWindow.deactivate();
        this._ctlrRWindow.deactivate();
        this._ctlrLWindow.activate();
        this._ctlrLWindow.selectLast();
        this._buttonGuide.setActiveWindow("Window_CtlrL");
    };

    /**
     * スキルカテゴリ選択時の処理。
     */
    Scene_Operation.prototype.onCategoryOk = function () {
        this._itemWindow.activate();
        this._itemWindow.forceSelect(0);
        this._buttonGuide.setActiveWindow("Window_SkillList");
        this.expandItemWindow();
    };

    /**
     * スキルリストウィンドウを広げる
     */
    Scene_Operation.prototype.expandItemWindow = function () {
        const stwr = this.skillTypeWindowRect();
        const wy = stwr.y;
        const wh = this.mainAreaBottom() - stwr.y;
        this._itemWindow.y = wy;
        this._itemWindow.height = wh;
        this._itemWindow.createContents();
        this._itemWindow.refresh();
        this._helpWindow.show();
    };

    /**
     * スキルリストウィンドウを縮める
     */
    Scene_Operation.prototype.shrinkItemWindow = function () {
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const wh = Graphics.boxHeight - wy;
        this._itemWindow.y = wy;
        this._itemWindow.height = wh;
        this._itemWindow.createContents();
        this._itemWindow.refresh();
        this._helpWindow.hide();
    };

    /**
     * スキルタイプウィンドウでキャンセルしたときの処理。
     */
    Scene_Operation.prototype.onSkillTypeCancel = function () {
        switch (this.getCurrentSide()) {
            case 0:
                // L
                this.goBackToLeftSide();
                break;
            case 1:
                // R
                this.goBackToRightSide();
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
        switch (this.getCurrentSide()) {
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
        // セット中スキルデータ先頭にはアクターIDを入れるので
        index++;

        const actorId = this.actor().actorId();
        const vi = getVarNumForRegisterSkill(actorId);
        let values = $v.get(vi).toString().split(",");
        // 8件以下の旧式データの場合、先頭にアクターIDを入れる
        if (values.length < 9) {
            values.unshift(actorId);
        }

        // 必ず9件必要なので、足りなければうめる
        while (values.length < 9) {
            values.push("");
        }
        //console.log(currentItem);
        //console.log(item);        
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

        switch (this.getCurrentSide()) {
            case 0:
                // L
                this.goBackToLeftSide();
                this._ctlrLWindow.refresh();
                break;
            case 1:
                // R
                this.goBackToRightSide();
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
        this._buttonGuide.setActiveWindow("Window_SkillCategory");
    };

    /**
     * アクター変更時のウィンドウ等の処理
     */
    Scene_Operation.prototype.onActorChange = function () {
        Scene_MenuBase.prototype.onActorChange.call(this);
        this.refreshActor();
        this.goBackToLeftSide();
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
        this._rightSideWindow = null;
    };

    /**
     * R側ウィンドウの参照を持つ
     * @param {Window_CtlrR} rightSideWindow 
     */
    Window_CtlrL.prototype.setRightSideWindow = function (rightSideWindow) {
        this._rightSideWindow = rightSideWindow;
    };

    /**
     * スキルタイプウィンドウの参照を保持する
     * @param {Window_SkillType} skillTypeWindow 
     */
    Window_CtlrL.prototype.setSkillTypeWindow = function (skillTypeWindow) {
        this._skillTypeWindow = skillTypeWindow;
    };

    /**
     * スキルカテゴリウィンドウの参照を保持する
     * @param {Window_SkillCategory} categoryWindow 
     */
    Window_CtlrL.prototype.setCategoryWindow = function (categoryWindow) {
        this._categoryWindow = categoryWindow;
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
        const vi = getVarNumForRegisterSkill(this._actor.actorId());
        const ss = $v.get(vi).toString().split(",");

        if (ss.length < 9) {
            // 旧式データ
            this._data = [
                $dataSkills[ss[0]] ? $dataSkills[ss[0]] : null,
                $dataSkills[ss[1]] ? $dataSkills[ss[1]] : null,
                $dataSkills[ss[2]] ? $dataSkills[ss[2]] : null,
                $dataSkills[ss[3]] ? $dataSkills[ss[3]] : null,
            ];
        } else if (ss.length === 9) {
            // 新式データ
            this._data = [
                $dataSkills[ss[1]] ? $dataSkills[ss[1]] : null,
                $dataSkills[ss[2]] ? $dataSkills[ss[2]] : null,
                $dataSkills[ss[3]] ? $dataSkills[ss[3]] : null,
                $dataSkills[ss[4]] ? $dataSkills[ss[4]] : null,
            ];
        }

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
                this._actor.actorId(),
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
        const itemNameWidth = 156;
        const costWidth = this.width * 0.5;
        const keysWidth = 48;
        this.resetTextColor();
        if (skill) {
            this.changePaintOpacity(this.isEnabled(skill));
            this.drawText(keys, rect.x, rect.y, keysWidth);
            this.drawItemName(
                skill,
                rect.x + keysWidth,
                rect.y,
                itemNameWidth
            );
            this.drawDetailedSkillCost(
                skill,
                this._actor,
                rect.x + this.width - costWidth,
                rect.y,
                costWidth
            );
            this.changePaintOpacity(1);
        } else {
            this.drawText(keys, rect.x, rect.y, keysWidth);
        }
    };

    /**
     * スキルコストの詳細表示
     * @param {any} skill 
     * @param {Game_Actor} actor 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     */
    Window_CtlrL.prototype.drawDetailedSkillCost = function (skill, actor, x, y, width) {
        if (skill.mpCost) {
            const mpCostHeader = TextManager.mpA + ": ";
            const mpCost = actor ? actor.skillMpCost(skill) : skill.mpCost;
            this.changeTextColor(ColorManager.mpCostColor());
            this.drawText(
                mpCostHeader + mpCost,
                x,
                y,
                width / 3
            );
        }

        if (skill.tpCost) {
            const tpLimitHeader = TextManager.tpA + ": ";
            const tpLimit = actor ? actor.skillTpCost(skill) : skill.tpCost;
            const tpLimitFooter = "以下";
            this.changeTextColor(ColorManager.tpCostColor());
            if (tpLimit < 100) {
                this.drawText(
                    tpLimitHeader + tpLimit + tpLimitFooter,
                    x + width / 3,
                    y,
                    width / 3 * 2
                );
            }
        }
        this.resetTextColor();
    };

    /**
     * キー名
     * @param {number} index 
     * @returns string
     */
    Window_CtlrL.prototype.keysName = function (index) {
        const padConfig = ConfigManager["gamepads"] ? ConfigManager["gamepads"] : 0;
        const pad = PADS[padConfig];
        const LKEY = pad === "KEYBOARD" ? this.keyboardKeysName("pageup") : this.gamePadBtn("pageup");
        const keys = [
            pad === "KEYBOARD" ? this.keyboardKeysName("ok") : this.gamePadBtn("ok"),
            pad === "KEYBOARD" ? this.keyboardKeysName("cancel") : this.gamePadBtn("cancel"),
            pad === "KEYBOARD" ? '' : this.gamePadBtn("menu"),
            pad === "KEYBOARD" ? this.keyboardKeysName("shift") : this.gamePadBtn("shift")
        ];
        const keyName = keys[index] ? keys[index] : '';

        return keyName ? LKEY + "+" + keyName : '';
    };

    Window_CtlrL.prototype.gamePadBtn = Window_ButtonGuide.prototype.gamePadBtn;
    Window_CtlrL.prototype.keyboardKeysName = Window_ButtonGuide.prototype.keyName;

    /**
     * L側ウィンドウで右を押したときの処理
     */
    Window_CtlrL.prototype.cursorRight = function () {
        this._skillTypeWindow.deactivate();
        this._categoryWindow.deactivate();
        this._rightSideWindow.activate();
        const row = this.index();
        this._rightSideWindow.select(row);
        this.deactivate();
        this.deselect();
        $v.set(param.lastCurrentSide, 1);

        Window_Selectable.prototype.cursorRight.call(this);
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
        this._leftSideWindow = null;
    };

    Window_CtlrR.prototype.maxCols = Window_CtlrL.prototype.maxCols;
    Window_CtlrR.prototype.maxItems = Window_CtlrL.prototype.maxItems;

    /**
     * L側ウィンドウの参照を保持する
     * @param {Window_ctlrL} leftSideWindow 
     */
    Window_CtlrR.prototype.setLeftSideWindow = function (leftSideWindow) {
        this._leftSideWindow = leftSideWindow;
    };

    /**
     * スキルタイプウィンドウの参照を保持する
     * @param {Window_SkillType} skillTypeWindow 
     */
    Window_CtlrR.prototype.setSkillTypeWindow = function (skillTypeWindow) {
        this._skillTypeWindow = skillTypeWindow;
    };

    /**
     * スキルカテゴリウィンドウの参照を保持する
     * @param {Window_SkillCategory} categoryWindow 
     */
    Window_CtlrR.prototype.setCategoryWindow = function (categoryWindow) {
        this._categoryWindow = categoryWindow;
    };

    /**
     * Rサイドウィンドウの内容をセットする。
     */
    Window_CtlrR.prototype.makeItemList = function () {
        const vi = getVarNumForRegisterSkill(this._actor.actorId());
        const ss = $v.get(vi).toString().split(",");

        if (ss.length < 9) {
            // 旧式データ
            this._data = [
                $dataSkills[ss[4]] ? $dataSkills[ss[4]] : null,
                $dataSkills[ss[5]] ? $dataSkills[ss[5]] : null,
                $dataSkills[ss[6]] ? $dataSkills[ss[6]] : null,
                $dataSkills[ss[7]] ? $dataSkills[ss[7]] : null,
            ];
        } else if (ss.length === 9) {
            // 新式データ
            this._data = [
                $dataSkills[ss[5]] ? $dataSkills[ss[5]] : null,
                $dataSkills[ss[6]] ? $dataSkills[ss[6]] : null,
                $dataSkills[ss[7]] ? $dataSkills[ss[7]] : null,
                $dataSkills[ss[8]] ? $dataSkills[ss[8]] : null,
            ];
        }
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
     * スキルコスト詳細描画
     * @param {any} skill 
     * @param {Game_Actor} actor 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     */
    Window_CtlrR.prototype.drawDetailedSkillCost = function (skill, actor, x, y, width) {
        Window_CtlrL.prototype.drawDetailedSkillCost.call(this, skill, actor, x, y, width);
    };

    /**
     * キー名
     * @param {number} index 
     * @returns string
     */
    Window_CtlrR.prototype.keysName = function (index) {
        const padConfig = ConfigManager["gamepads"] ? ConfigManager["gamepads"] : 0;
        const pad = PADS[padConfig];
        const RKEY = pad === "KEYBOARD" ? this.keyboardKeysName("pagedown") : this.gamePadBtn("pagedown");
        const keys = [
            pad === "KEYBOARD" ? this.keyboardKeysName("ok") : this.gamePadBtn("ok"),
            pad === "KEYBOARD" ? this.keyboardKeysName("cancel") : this.gamePadBtn("cancel"),
            pad === "KEYBOARD" ? '' : this.gamePadBtn("menu"),
            pad === "KEYBOARD" ? this.keyboardKeysName("shift") : this.gamePadBtn("shift")
        ];
        const keyName = keys[index] ? keys[index] : '';

        return keyName ? RKEY + "+" + keyName : '';
    };

    Window_CtlrR.prototype.gamePadBtn = Window_ButtonGuide.prototype.gamePadBtn;
    Window_CtlrR.prototype.keyboardKeysName = Window_CtlrL.prototype.keyboardKeysName;

    /**
     * R側ウィンドウで左を押した時の処理
     */
    Window_CtlrR.prototype.cursorLeft = function () {
        this._skillTypeWindow.deactivate();
        this._categoryWindow.deactivate();
        this._leftSideWindow.activate();
        const row = this.index();
        this._leftSideWindow.select(row);
        this.deactivate();
        this.deselect()
        $v.set(param.lastCurrentSide, 0);

        Window_Selectable.prototype.cursorUp.call(this, false);
    };

})();