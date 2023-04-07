//=============================================================================
// RPG Maker MZ - DNMC_sceneEquipStatus
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/01/23 初版(DNMC_sceneMenuから分離)
// 1.0.1  2023/03/18 クエストHUD対応
// 1.1.0  2023/03/25 1280x720対応
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 装備/ステータス画面
 * @author cursed_steven
 * @base DNMC_sceneMenu
 * @orderAfter DNMC_sceneMenu
 * 
 * @help DNMC_sceneEquipStatus.js
 */

//-----------------------------------------------------------------------------
// Scene_EquipStatus
//
// The scene class of the equipment/status screen.

function Scene_EquipStatus() {
    this.initialize(...arguments);
}

/**
 * 装備/ステータスシーンの初期化。
 */
Scene_EquipStatus.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_EquipStatus.prototype = Object.create(Scene_MenuBase.prototype);
Scene_EquipStatus.prototype.constructor = Scene_EquipStatus;

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Scene_Map_createMapHUD = Scene_Map.prototype.createMapHUD;
    const _Scene_Map_createButtonGuide = Scene_Map.prototype.createButtonGuide;
    Scene_EquipStatus.prototype.mapHUDRect = Scene_Map.prototype.mapHUDRect;
    Scene_EquipStatus.prototype.HUDHeight = Scene_Map.prototype.HUDHeight;
    Scene_EquipStatus.prototype.buttonGuideRect = Scene_Map.prototype.buttonGuideRect;
    Scene_EquipStatus.prototype.createGoldWindow = Scene_Menu.prototype.createGoldWindow;
    Scene_EquipStatus.prototype.goldWindowRect = Scene_Menu.prototype.goldWindowRect;
    Scene_EquipStatus.prototype.createQuestHUD = Scene_Map.prototype.createQuestHUD;
    Scene_EquipStatus.prototype.questHUDRect = Scene_Map.prototype.questHUDRect;

    /**
     * 装備/ステータスシーンの作成。
     */
    Scene_EquipStatus.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createMenuCommandWindow();
        this.createGoldWindow();
        this.createMenuStatusWindow();
        _Scene_Map_createMapHUD.call(this);
        _Scene_Map_createButtonGuide.call(this);
        this._buttonGuide.show();
        this._buttonGuide.refresh();
        this.createQuestHUD();
        this.createHelpWindow();
        this.createCommandWindow();
        this.createSlotWindow();
        this.createStatusWindow();
        this.createItemWindow();
        this.createEquipDetailWindow();
        this.refreshActor();
    };

    /**
     * 選択後コマンドウィンドウの作成。
     */
    Scene_EquipStatus.prototype.createMenuCommandWindow = function () {
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
    Scene_EquipStatus.prototype.menuCommandWindowRect = function () {
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.calcWindowHeight(1, true) - 8;
        const wx = Graphics.boxWidth - ww - 160;
        const wy = this.calcWindowHeight(3, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 選択後の対象者ウィンドウを作成する。
     */
    Scene_EquipStatus.prototype.createMenuStatusWindow = function () {
        const rect = this.menuStatusWindowRect();
        this._menuStatusWindow = new Window_MenuStatus(rect);
        this._menuStatusWindow.select(this.actor().index());
        this.addWindow(this._menuStatusWindow);
    };

    Scene_EquipStatus.prototype.menuStatusWindowRect = Scene_Menu.prototype.statusWindowRect;

    /**
     * 選択中のアクターのステータスウィンドウを作成する。
     */
    Scene_EquipStatus.prototype.createStatusWindow = function () {
        Scene_Equip.prototype.createStatusWindow.call(this);
    };

    /**
     * 選択中のアクターのステータスウィンドウの領域を返す。
     * @returns Rectangle
     */
    Scene_EquipStatus.prototype.statusWindowRect = function () {
        const itemWindowRect = this.itemWindowRect();
        const wx = itemWindowRect.x + itemWindowRect.width;
        const wy = itemWindowRect.y;
        const ww = this.menuCommandWindowRect().x - wx;
        const wh = itemWindowRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ステータスウィンドウの幅を返す。
     * @returns number
     */
    Scene_EquipStatus.prototype.statusWidth = function () {
        return Graphics.boxWidth - this.commandWindowRect().width - this.mapHUDRect().width - this.slotWindowRect().width;
    };

    /**
     * 装備コマンドウィンドウを作成する。
     */
    Scene_EquipStatus.prototype.createCommandWindow = function () {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_EquipCommand(rect);
        this._commandWindow.setHelpWindow(this._helpWindow);
        this._commandWindow.setHandler("equip", this.commandEquip.bind(this));
        this._commandWindow.setHandler("optimize", this.commandOptimize.bind(this));
        this._commandWindow.setHandler("clear", this.commandClear.bind(this));
        this._commandWindow.setHandler("detail", this.commandDetail.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this._commandWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._commandWindow.setHandler("pageup", this.previousActor.bind(this));
        this.addWindow(this._commandWindow);
    };

    /**
     * 装備コマンドウィンドウの領域を返す。
     * @returns Rectangle
     */
    Scene_EquipStatus.prototype.commandWindowRect = function () {
        return Scene_Skill.prototype.skillTypeWindowRect.call(this);
    };

    /**
     * 装備スロットウィンドウを作成する。
     */
    Scene_EquipStatus.prototype.createSlotWindow = function () {
        Scene_Equip.prototype.createSlotWindow.call(this);
    };

    /**
     * 装備スロットウィンドウの領域を返す。
     * @returns Rectangle
     */
    Scene_EquipStatus.prototype.slotWindowRect = function () {
        const commandWindowRect = this.commandWindowRect();
        const wx = 0;
        const wy = commandWindowRect.y + commandWindowRect.height;
        const ww = 300;
        const wh = this.mainAreaBottom() - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 装備品ウィンドウを作成する。
     */
    Scene_EquipStatus.prototype.createItemWindow = function () {
        Scene_Equip.prototype.createItemWindow.call(this);
        this._itemWindow.setStatusWindow(this._statusWindow);
        this._itemWindow.show();
    };

    /**
     * 装備品ウィンドウの領域を返す。
     * @returns Rectangle
     */
    Scene_EquipStatus.prototype.itemWindowRect = function () {
        const slotWindowRect = this.slotWindowRect();
        const wx = slotWindowRect.x + slotWindowRect.width;
        const wy = slotWindowRect.y;
        const ww = slotWindowRect.width - 24;
        const wh = slotWindowRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 装備詳細ウィンドウの作成
     */
    Scene_EquipStatus.prototype.createEquipDetailWindow = function () {
        const rect = this.equipDetailWindowRect();
        this._detailWindow = new Window_EquipDetail(rect, this.actor());
        this._detailWindow.setHandler("ok", this.onDetailOk.bind(this));
        this._detailWindow.setHandler("cancel", this.onDetailOk.bind(this));
        this._detailWindow.setHandler("pagedown", this.nextActorsDetail.bind(this));
        this._detailWindow.setHandler("pageup", this.previousActorsDetail.bind(this));
        this._detailWindow.hide();
        this.addWindow(this._detailWindow);
    };

    /**
     * 装備詳細ウィンドウの領域を返す
     * @returns Rectangle
     */
    Scene_EquipStatus.prototype.equipDetailWindowRect = function () {
        const commandWindowRect = this.commandWindowRect();
        const wx = commandWindowRect.x;
        const wy = commandWindowRect.y;
        const ww = commandWindowRect.width + this.mainCommandWidth();
        const wh = Graphics.boxHeight - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 装備詳細を選択したときの処理
     */
    Scene_EquipStatus.prototype.commandDetail = function () {
        this._detailWindow.show();
        this._detailWindow.refresh();
        this._detailWindow.activate();
        this._itemWindow.hide();
        this._slotWindow.y = Graphics.boxHeight - this._slotWindow.height;
        this._buttonGuide.setActiveWindow("Window_EquipDetail");
    };

    /**
     * 装備詳細表示中にOKしたときの処理
     */
    Scene_EquipStatus.prototype.onDetailOk = function () {
        this._detailWindow.deactivate();
        this._commandWindow.activate();
        this._detailWindow.hide();
        this._itemWindow.show();
        const commandWindowRect = this.commandWindowRect();
        this._slotWindow.y = commandWindowRect.y + commandWindowRect.height;
        this._buttonGuide.setActiveWindow("Window_EquipCommand");
    };

    /**
     * 装備詳細表示中にキャラ変えしたときの処理(next)
     */
    Scene_EquipStatus.prototype.nextActorsDetail = function () {
        this.nextActor();
        this._detailWindow.refresh();
    };

    /**
     * 装備詳細表示中にキャラ変えしたときの処理(prev)
     */
    Scene_EquipStatus.prototype.previousActorsDetail = function () {
        this.previousActor();
        this._detailWindow.refresh();
    };

    /**
     * スロット選択時の処理。
     */
    Scene_EquipStatus.prototype.onSlotOk = function () {
        this._itemWindow.show();
        this._itemWindow.activate();
        this._itemWindow.select(0);
        this._buttonGuide.setActiveWindow("Window_EquipItem");
    };

    /**
     * 装備品選択時の処理。
     */
    Scene_EquipStatus.prototype.onItemOk = function () {
        SoundManager.playEquip();
        this.executeEquipChange();
        this.hideItemWindow();
        this._slotWindow.refresh();
        this._itemWindow.refresh();
        this._statusWindow.refresh();
        this._detailWindow.refresh();
    };

    /**
     * 対象者変更時の処理。
     */
    Scene_EquipStatus.prototype.onActorChange = function () {
        Scene_MenuBase.prototype.onActorChange.call(this);
        this.refreshActor();
        this.hideItemWindow();
        this._slotWindow.deselect();
        this._slotWindow.deactivate();
        this._commandWindow.activate();
        this._menuStatusWindow.select(this.actor().index());
    };

    /**
     * 装備品選択から抜ける処理。
     */
    Scene_EquipStatus.prototype.hideItemWindow = function () {
        this._slotWindow.activate();
        this._itemWindow.deselect();
    };

    const _Scene_EquipStatus_update = Scene_EquipStatus.prototype.update;
    /**
     * クエストHUD表示と更新を追加
     */
    Scene_EquipStatus.prototype.update = function () {
        _Scene_EquipStatus_update.call(this);
        this._buttonGuide.show();
        this._buttonGuide.refresh();
        this._questHUD.show();
        this._questHUD.refresh();
    };

    /**
     * アクター変更
     */
    Scene_EquipStatus.prototype.refreshActor = function () {
        Scene_Equip.prototype.refreshActor.call(this);
        this._detailWindow.setActor(this.actor());
    };

    Scene_EquipStatus.prototype.commandEquip = Scene_Equip.prototype.commandEquip;
    Scene_EquipStatus.prototype.commandOptimize = Scene_Equip.prototype.commandOptimize;
    Scene_EquipStatus.prototype.commandClear = Scene_Equip.prototype.commandClear;
    Scene_EquipStatus.prototype.onSlotCancel = Scene_Equip.prototype.onSlotCancel;
    Scene_EquipStatus.prototype.executeEquipChange = Scene_Equip.prototype.executeEquipChange;
    Scene_EquipStatus.prototype.onItemCancel = Scene_Equip.prototype.onItemCancel;

    //-----------------------------------------------------------------------------
    // Window_MenuCommand

    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    /**
     * 専用コマンド追加。
     */
    Window_MenuCommand.prototype.addOriginalCommands = function () {
        this.addCommand(TextManager.originalCommand(0), "equipStatus", true);
        _Window_MenuCommand_addOriginalCommands.call(this);
    };

    //-----------------------------------------------------------------------------
    // Window_EquipCommand

    const _Window_EquipCommand_maxCols = Window_EquipCommand.prototype.maxCols;
    Window_EquipCommand.prototype.maxCols = function () {
        return _Window_EquipCommand_maxCols.call(this) + 1;
    };

    const _Window_EquipCommand_makeCommandList = Window_EquipCommand.prototype.makeCommandList;
    Window_EquipCommand.prototype.makeCommandList = function () {
        _Window_EquipCommand_makeCommandList.call(this);
        this.addCommand(TextManager.originalCommand(6), "detail");
    };

    //-----------------------------------------------------------------------------
    // Window_EquipSlot

    const _Window_EquipSlot_itemRect = Window_EquipSlot.prototype.itemRect;
    Window_EquipSlot.prototype.itemRect = function (index) {
        const orgRect = _Window_EquipSlot_itemRect.call(this, index);
        const offset = 104;
        return new Rectangle(orgRect.x, orgRect.y + offset, orgRect.width, orgRect.height);
    };

    const _Window_EquipSlot_drawItem = Window_EquipSlot.prototype.drawItem;
    Window_EquipSlot.prototype.drawItem = function (index) {
        if (this._actor) {
            this.drawActorCharacter(
                this._actor,
                CHARACTER_IMAGE.WIDTH_OFFSET - 8,
                CHARACTER_IMAGE.HEIGHT_OFFSET
            );
            this.drawActorNameClass();
            this.drawActorLevel();
        }
        _Window_EquipSlot_drawItem.call(this, index);
    };

    /**
     * アクターの名前と職業を描画
     */
    Window_EquipSlot.prototype.drawActorNameClass = function () {
        const x = 88;
        const y = 8;
        const width = 256;
        this.changeTextColor(ColorManager.hpColor(this._actor));
        this.drawText(this._actor.name() + "(" + this._actor.currentClass().name + ")", x, y, width);
    };

    /**
     * アクターのレベルを描画
     */
    Window_EquipSlot.prototype.drawActorLevel = function () {
        const x = 88;
        const y = this.lineHeight() + 16;

        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        this.drawText(this._actor.level, x + this.textWidth("000"), y, 36, "right");
    };

    /**
     * 装備スロット名の幅を算出する
     * @returns number
     */
    Window_EquipSlot.prototype.slotNameWidth = function () {
        let slotNameWidths = [];
        for (let i = 0; i < this._actor.equips().length; i++) {
            slotNameWidths.push(this.textWidth(this.actorSlotName(this._actor, i)));
        }

        return Math.max.apply(null, slotNameWidths) + this.itemPadding() * 2;
    };

    const _Window_EquipSlot_lineHeight = Window_EquipSlot.prototype.lineHeight;
    Window_EquipSlot.prototype.lineHeight = function () {
        const org = _Window_EquipSlot_lineHeight.call(this);
        return Math.floor(org * 0.75);
    };

    //-----------------------------------------------------------------------------
    // Window_EquipItem

    const _Window_EquipItem_lineHeight = Window_EquipItem.prototype.lineHeight;
    Window_EquipItem.prototype.lineHeight = function () {
        const org = _Window_EquipItem_lineHeight.call(this);
        return Math.floor(org * 0.75);
    };

    //-----------------------------------------------------------------------------
    // Window_EquipStatus

    /**
     * ステータスウィンドウの更新(パラメータのみに変更)。
     */
    Window_EquipStatus.prototype.refresh = function () {
        this.contents.clear();
        if (this._actor) {
            this.drawExpInfo();
            this.drawAllParams();
        }
    };

    const _Window_EquipStatus_drawItem = Window_EquipStatus.prototype.drawItem;
    /**
     * 装備/ステータスシーンにおいて、装備前後のステータス値に加えて、
     * 装備が占める数値の装備前後を描画する。
     * @param {number} x 
     * @param {number} y 
     * @param {number} paramId 
     */
    Window_EquipStatus.prototype.drawItem = function (x, y, paramId) {
        _Window_EquipStatus_drawItem.call(this, x, y, paramId);
        const paramX = this.paramX();
        const paramWidth = this.paramWidth();
        const rightArrowWidth = this.rightArrowWidth();
        if (this._actor) {
            this.drawCurrentDiff(paramX + paramWidth * 3 + rightArrowWidth, y, paramId);
        }
        this.drawRightArrow(paramX + paramWidth * 5, y);
        if (this._tempActor) {
            this.drawNewDiff(paramX + paramWidth * 5 + rightArrowWidth, y, paramId);
        }
    };

    /**
     * アクターの経験値情報を描画する。
     */
    Window_EquipStatus.prototype.drawExpInfo = function () {
        const lineHeight = this.lineHeight();
        const x = this.itemPadding();
        const y = this.itemPadding();

        const expTotal = TextManager.expTotal.format(TextManager.exp);
        const expNext = TextManager.expNext.format(TextManager.level);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(expTotal, x, y, this.textWidth(expNext));
        this.drawText(expNext, x + this.width / 2, y, this.textWidth(expNext));
        this.resetTextColor();
        this.drawText(this.expTotalValue(), x + this.textWidth(expNext), y, this.textWidth("0000000000"), "right");
        this.drawText(this.expNextValue(), x + this.width / 2 + this.textWidth(expNext), y, this.textWidth("0000000000"), "right");
    };
    Window_EquipStatus.prototype.expTotalValue = Window_Status.prototype.expTotalValue;
    Window_EquipStatus.prototype.expNextValue = Window_Status.prototype.expNextValue;

    /**
     * ステータスウィンドウの内容描画(0-7全部に変更)。
     */
    Window_EquipStatus.prototype.drawAllParams = function () {
        for (let i = 0; i < 8; i++) {
            const x = this.itemPadding();
            const y = this.paramY(i);
            this.drawItem(x, y, i);
        }
    };

    /**
     * 装備/ステータスシーンにおいて、装備による変化分(各スロット分の合計)を描画する。
     * @param {number} x 
     * @param {number} y 
     * @param {number} paramId 
     */
    Window_EquipStatus.prototype.drawCurrentDiff = function (x, y, paramId) {
        const value = this._actor.param(paramId) - this._actor.paramBase(paramId);
        this.drawText(value, x, y, this.paramWidth(), "right");
    };

    /**
     * 装備/ステータスシーンにおいて、新しい装備による変化分(各スロット分の合計)を描画する。
     * @param {number} x 
     * @param {number} y 
     * @param {number} paramId 
     */
    Window_EquipStatus.prototype.drawNewDiff = function (x, y, paramId) {
        const value = this._tempActor
            ? this._tempActor.param(paramId) - this._actor.paramBase(paramId)
            : 0;

        this.drawText(value, x, y, this.paramWidth(), "right");
    };

    /**
     * 装備/ステータスシーンにおいて、ステータスウィンドウのパラメータ名のうち
     * 幅が最大のもの(とパディング)を返す。
     * @returns number
     */
    Window_EquipStatus.prototype.paramX = function () {
        let paramNameWidths = [];
        for (let i = 0; i < 8; i++) {
            paramNameWidths.push(this.textWidth(TextManager.param(i)));
        }
        return Math.max.apply(null, paramNameWidths) + this.textWidth("00") + this.itemPadding();
    };

    /**
     * 装備/ステータスシーンにおいて、ステータスウィンドウの行の高さを返す。
     * @param {number} index 
     * @returns number
     */
    Window_EquipStatus.prototype.paramY = function (index) {
        return Math.floor(this.lineHeight() * (index + 2));
    }

    /**
     * パラメータ表示の幅
     * @returns number
     */
    Window_EquipStatus.prototype.paramWidth = function () {
        return this.textWidth("0000");
    };

    const _Window_EquipStatus_lineHeight = Window_EquipStatus.prototype.lineHeight;
    Window_EquipStatus.prototype.lineHeight = function () {
        return Math.floor(_Window_EquipStatus_lineHeight.call(this) * 0.82);
    };

    //-------------------------------------------------------------------------
    // Window_EqiupDetail
    //
    // The window for displaying buffs/debuffs caused by equips.

    function Window_EquipDetail() {
        this.initialize(...arguments);
    }

    Window_EquipDetail.prototype = Object.create(Window_Selectable.prototype);
    Window_EquipDetail.prototype.constructor = Window_EquipDetail;

    /**
     * 装備詳細ウィンドウの初期化。
     * @param {Rectangle} rect 
     * @param {Game_Actor} actor 
     */
    Window_EquipDetail.prototype.initialize = function (rect, actor) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this.contents.fontSize = 12;
        this._actor = actor;
        this.clearAllTraits();
    };

    /**
     * 設定アクターの変更
     * @param {Game_Actor} actor 
     */
    Window_EquipDetail.prototype.setActor = function (actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    /**
     * 更新
     */
    Window_EquipDetail.prototype.refresh = function () {
        this.contents.clear();
        this.clearAllTraits();
        this.drawHeader();
        this.drawSlotNames();

        for (let i = 0; i < 5; i++) {
            this.drawEquipTraits(i);
        }

        this.drawAllTraits();
    };

    /**
     * ヘッダ描画
     */
    Window_EquipDetail.prototype.drawHeader = function () {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.originalCommand(6), 0, 0);
        this.resetTextColor();
    };

    /**
     * スロット名描画
     */
    Window_EquipDetail.prototype.drawSlotNames = function () {
        this.changeTextColor(ColorManager.systemColor());
        let slotName = "";
        for (let i = 1; i <= 5; i++) {
            slotName = $dataSystem.equipTypes[this._actor.equipSlots()[i - 1]];
            this.drawText(slotName, this.itemWidth() * (i - 1), this.lineHeight() * 1);
        }
        this.drawText(TextManager.others(1), this.itemWidth() * 5, this.lineHeight() * 1);

        this.resetTextColor();
    };

    /**
     * 装備による特徴の描画
     * @param {number} slot 
     * @returns void
     */
    Window_EquipDetail.prototype.drawEquipTraits = function (slot) {
        const STATES = [
            STATE.DEAD,
            STATE.BERSERK,
            STATE.CONFUSE,
            STATE.TEMPTATION,
            STATE.SILENCE,
            STATE.PHANTOM,
            STATE.PARALYZE,
            STATE.POISON,
            STATE.DEADLY_POISON,
            STATE.MAGICAL_POISON,
            STATE.SLEEP,
            STATE.MP_DOUBLECOST,
            STATE.VULNERABLE
        ];
        const equip = this._actor.equips()[slot];
        if (!equip) return;
        let paramValues = [[], [], [], [], [], [], [], []];
        let addParamValues = [[], [], [], [], [], [], [], [], [], []];
        let addAttacks = 0;
        let addActions = 0;
        let elementValues = [[], [], [], [], [], [], [], [], [], [], []];
        let debuffValues = [[], [], [], [], [], [], [], []];
        let ix = -1;
        let stateParams = [[], [], [], [], [], [], [], [], [], [], [], [], []];
        let stateNos = [[], [], [], [], [], [], [], [], [], [], [], [], []];
        let specialParams = [[], [], [], [], [], [], [], [], [], []];
        let parties = [0, 0, 0, 0, 0, 0];
        for (const trait of equip.traits) {
            ix = -1;
            if (!trait) continue;

            switch (trait.code) {
                case Game_BattlerBase.TRAIT_PARAM:
                    paramValues[trait.dataId].push(trait);
                    break;
                case Game_BattlerBase.TRAIT_XPARAM:
                    addParamValues[trait.dataId].push(trait);
                    break;
                case Game_BattlerBase.TRAIT_ATTACK_TIMES:
                    addAttacks++;
                    break;
                case Game_BattlerBase.TRAIT_ACTION_PLUS:
                    addActions++;
                case Game_BattlerBase.TRAIT_DEBUFF_RATE:
                    debuffValues[trait.dataId].push(trait);
                    break;
                case Game_BattlerBase.TRAIT_ELEMENT_RATE:
                    if (elementValues[trait.dataId - 1]) {
                        elementValues[trait.dataId - 1].push(trait);
                    }
                    break;
                case Game_BattlerBase.TRAIT_STATE_RATE:
                    ix = STATES.indexOf(trait.dataId);
                    if (ix != -1) stateParams[ix].push(trait);
                    break;
                case Game_BattlerBase.TRAIT_STATE_RESIST:
                    ix = STATES.indexOf(trait.dataId);
                    if (ix != -1) stateNos[ix].push(trait);
                    break;
                case Game_BattlerBase.TRAIT_PARTY_ABILITY:
                    parties[trait.dataId]++;
                    break;
                case Game_BattlerBase.TRAIT_SPARAM:
                    specialParams[trait.dataId].push(trait);
                    break;
            }
        }

        let sa = [];
        let ctr = 2;
        let trait = {};
        let value = 0;

        sa = paramValues;
        ctr = this.drawTraitMultiply(sa, slot, ctr, "params");

        sa = addParamValues;
        ctr = this.drawTraitAddSub(sa, slot, ctr, "addParams");

        if (addAttacks > 0) {
            ctr = this.drawTraitCount(
                Game_BattlerBase.TRAIT_ATTACK_TIMES,
                addAttacks,
                slot,
                ctr,
                "addAttacks"
            );
        }

        if (addActions > 0) {
            ctr = this.drawTraitCount(
                Game_BattlerBase.TRAIT_ACTION_PLUS,
                addActions,
                slot,
                ctr,
                "addActions"
            );
        }

        sa = elementValues;
        ctr = this.drawTraitMultiply(sa, slot, ctr, "elements");

        sa = stateParams;
        ctr = this.drawTraitMultiply(sa, slot, ctr, "states");

        for (let i = 0; i < 13; i++) {
            if (stateNos[i] && stateNos[i][0]) {
                trait = {
                    code: stateNos[i][0].code,
                    dataId: stateNos[i][0].dataId
                };
                this.drawText(
                    traitToDesc(trait),
                    this.itemWidth() * slot,
                    this.lineHeight() * ctr
                );
                this._allTraits.stateNos[i].push(trait);
                ctr++;
            }
        }

        sa = debuffValues;
        ctr = this.drawTraitMultiply(sa, slot, ctr, "debuffs");

        for (let i = 0; i < 6; i++) {
            if (parties[i] > 0) {
                trait = {
                    code: Game_BattlerBase.TRAIT_PARTY_ABILITY,
                    dataId: i
                };
                this.drawText(
                    traitToDesc(trait),
                    this.itemWidth() * slot,
                    this.lineHeight() * ctr
                );
                this._allTraits.parties[i]++;
                ctr++;
            }
        }

        sa = specialParams;
        ctr = this.drawTraitMultiply(sa, slot, ctr, "specials");

        // CSVN_base.log(this._allTraits);
    };

    /**
     * スロットごとの特徴をまとめた内容を描画する。
     */
    Window_EquipDetail.prototype.drawAllTraits = function () {
        let ctr = 2;
        let value = 0;
        let trait = {};
        let sa = [];
        const offsetY = this.lineHeight() - this.lineHeight2();
        const maxCount = 25;

        sa = this._allTraits.params;
        ctr = this.drawTraitMultiply(sa, 5, ctr);
        // 表示件数上限
        if (ctr >= maxCount) {
            this.drawDash(ctr);
            return;
        }

        sa = this._allTraits.addParams;
        ctr = this.drawTraitAddSub(sa, 5, ctr);
        // 表示件数上限
        if (ctr >= maxCount) {
            this.drawDash(ctr);
            return;
        }

        sa = this._allTraits.addAttacks;
        value = sa.reduce((v, e) => v += e.value, 0);
        if (sa[0]) {
            ctr = this.drawTraitCount(sa[0].code, value, 5, ctr);
        }
        // 表示件数上限
        if (ctr >= maxCount) {
            this.drawDash(ctr);
            return;
        }

        sa = this._allTraits.addActions;
        value = sa.reduce((v, e) => v += e.value, 0);
        if (sa[0]) {
            ctr = this.drawTraitCount(sa[0].code, value, 5, ctr);
        }
        // 表示件数上限
        if (ctr >= maxCount) {
            this.drawDash(ctr);
            return;
        }

        sa = this._allTraits.elements;
        ctr = this.drawTraitMultiply(sa, 5, ctr);
        // 表示件数上限
        if (ctr >= maxCount) {
            this.drawDash(ctr);
            return;
        }

        sa = this._allTraits.debuffs;
        ctr = this.drawTraitMultiply(sa, 5, ctr);
        // 表示件数上限
        if (ctr >= maxCount) {
            this.drawDash(ctr);
            return;
        }

        sa = this._allTraits.states;
        for (let i = 0; i < sa.length; i++) {
            value = sa[i].reduce((v, e) => v *= e.value, 1);
            if (sa[i][0] && value != 1) {
                trait = {
                    code: sa[i][0].code,
                    dataId: sa[i][0].dataId,
                    value: value
                };
                this.drawText(
                    traitToDesc(trait),
                    this.itemWidth() * 5,
                    this.lineHeight2() * ctr + offsetY
                );
                ctr++;
            }
        }
        // 表示件数上限
        if (ctr >= maxCount) {
            this.drawDash(ctr);
            return;
        }

        sa = this._allTraits.stateNos;
        for (let i = 0; i < sa.length; i++) {
            if (sa[i][0]) {
                trait = {
                    code: sa[i][0].code,
                    dataId: sa[i][0].dataId
                };
                this.drawText(
                    traitToDesc(trait),
                    this.itemWidth() * 5,
                    this.lineHeight2() * ctr + offsetY
                );
                ctr++;
            }
        }
        // 表示件数上限
        if (ctr >= maxCount) {
            this.drawDash(ctr);
            return;
        }

        sa = this._allTraits.parties;
        for (let i = 0; i < sa.length; i++) {
            if (sa[i] > 0) {
                trait = {
                    code: Game_BattlerBase.TRAIT_PARTY_ABILITY,
                    dataId: i
                };
                this.drawText(
                    traitToDesc(trait),
                    this.itemWidth() * 5,
                    this.lineHeight2() * ctr + offsetY
                );
                ctr++;
            }
        }
        // 表示件数上限
        if (ctr >= maxCount) {
            this.drawDash(ctr);
            return;
        }

        sa = this._allTraits.specials;
        ctr = this.drawTraitMultiply(sa, 5, ctr);
        // 表示件数上限
        if (ctr >= maxCount) {
            this.drawDash(ctr);
            return;
        }
    }

    /**
     * 倍率型特徴を描画して行位置を返す。
     * @param {array} sa 
     * @param {number} slot 
     * @param {number} ctr 
     * @param {string} pushKey 
     * @returns number
     */
    Window_EquipDetail.prototype.drawTraitMultiply = function (sa, slot, ctr, pushKey) {
        let trait = {};
        let value = 0;
        let lineHeight = 0;
        const offsetY = this.lineHeight() - this.lineHeight2();
        for (let i = 0; i < sa.length; i++) {
            value = sa[i].reduce((v, e) => v *= e.value, 1);
            if (value != 1) {
                trait = {
                    code: sa[i][0].code,
                    dataId: sa[i][0].dataId,
                    value: value
                };
                if (pushKey) {
                    lineHeight = this.lineHeight() * ctr;
                    this._allTraits[pushKey][i].push(trait);
                } else {
                    lineHeight = this.lineHeight2() * ctr + offsetY;
                }
                this.drawText(
                    traitToDesc(trait),
                    this.itemWidth() * slot,
                    lineHeight
                );
                ctr++;
            }
        }

        return ctr;
    }

    /**
     * 加算型特徴を描画して行位置を返す。
     * @param {array} sa 
     * @param {number} slot 
     * @param {number} ctr 
     * @param {string} pushKey 
     * @returns number
     */
    Window_EquipDetail.prototype.drawTraitAddSub = function (sa, slot, ctr, pushKey) {
        let trait = {};
        let value = 0;
        let lineHeight = 0;
        const offsetY = this.lineHeight() - this.lineHeight2();
        for (let i = 0; i < sa.length; i++) {
            value = sa[i].reduce((v, e) => v += e.value, 0);
            if (value != 0) {
                trait = {
                    code: sa[i][0].code,
                    dataId: sa[i][0].dataId,
                    value: value
                };
                if (pushKey) {
                    lineHeight = this.lineHeight() * ctr;
                    this._allTraits[pushKey][i].push(trait);
                } else {
                    lineHeight = this.lineHeight2() * ctr + offsetY;
                }
                this.drawText(
                    traitToDesc(trait),
                    this.itemWidth() * slot,
                    lineHeight
                );
                ctr++;
            }
        }

        return ctr;
    }

    /**
     * 回数型特徴を描画して行位置を返す。
     * @param {number} code 
     * @param {number} value 
     * @param {number} slot 
     * @param {number} ctr 
     * @param {string} pushKey 
     * @returns 
     */
    Window_EquipDetail.prototype.drawTraitCount = function (code, value, slot, ctr, pushKey) {
        const trait = {
            code: code,
            dataId: 0,
            value: value
        };
        let lineHeight = 0;
        const offsetY = this.lineHeight() - this.lineHeight2();
        if (pushKey) {
            lineHeight = this.lineHeight() * ctr;
            this._allTraits[pushKey].push(trait);
        } else {
            lineHeight = this.lineHeight2() * ctr + offsetY;
        }
        this.drawText(
            traitToDesc(trait),
            this.itemWidth() * slot,
            lineHeight
        );
        ctr++;

        return ctr;
    };

    /**
     * "..."表示
     * @param {number} ctr 
     */
    Window_EquipDetail.prototype.drawDash = function (ctr) {
        const offsetY = this.lineHeight() - this.lineHeight2();
        this.drawText(
            "...",
            this.itemWidth() * 5,
            this.lineHeight2() * ctr + offsetY
        );
    };

    /**
     * まとめ用特徴のクリア
     */
    Window_EquipDetail.prototype.clearAllTraits = function () {
        this._allTraits = {
            params: [[], [], [], [], [], [], [], []],
            addParams: [[], [], [], [], [], [], [], [], [], []],
            addAttacks: [],
            addActions: [],
            elements: [[], [], [], [], [], [], [], [], [], [], []],
            debuffs: [[], [], [], [], [], [], [], []],
            states: [[], [], [], [], [], [], [], [], [], [], [], [], []],
            stateNos: [[], [], [], [], [], [], [], [], [], [], [], [], []],
            parties: [0, 0, 0, 0, 0, 0],
            specials: [[], [], [], [], [], [], [], [], [], []]
        };
    };

    /**
     * 特徴の内容から説明文を出力する。
     * @param {Trait_Effect} trait 
     * @returns string
     */
    function traitToDesc(trait) {
        const tmplParam = "{{param}}{{value}}";
        const tmplElement = "対{{element}}{{value}}";
        const tmplState = "{{state}}やられ{{value}}";
        const tmplDebuff = "{{param}}弱体{{value}}";
        let param = null;
        let elementState = null;
        let value = null;

        switch (trait.code) {
            case Game_BattlerBase.TRAIT_PARAM:
                param = TextManager.param(trait.dataId);
                value = valueStringMultiply(trait.value);
                break;
            case Game_BattlerBase.TRAIT_XPARAM:
                param = TextManager.additionalParam(trait.dataId);
                value = valueStringAddSub(trait.value);
                break;
            case Game_BattlerBase.TRAIT_ATTACK_ELEMENT:
                return "攻撃属性: " + $dataSystem.elements[trait.dataId];
                break;
            case Game_BattlerBase.TRAIT_ATTACK_TIMES:
                return TextManager.trait(trait.code) + trait.value;
                break;
            case Game_BattlerBase.TRAIT_ACTION_PLUS:
                return TextManager.trait(trait.code) + trait.value;
                break;
            case Game_BattlerBase.TRAIT_ELEMENT_RATE:
                elementState = $dataSystem.elements[trait.dataId];
                value = valueStringMultiply(trait.value);
                return value ? tmplElement.replace("{{element}}", elementState).replace("{{value}}", value) : "";
                break;
            case Game_BattlerBase.TRAIT_DEBUFF_RATE:
                param = TextManager.param(trait.dataId);
                value = valueStringMultiply(trait.value);
                return value ? tmplDebuff.replace("{{param}}", param).replace("{{value}}", value) : "";
                break;
            case Game_BattlerBase.TRAIT_STATE_RATE:
                elementState = $dataStates[trait.dataId].name;
                value = valueStringMultiply(trait.value);
                return value ? tmplState.replace("{{state}}", elementState).replace("{{value}}", value) : "";
                break;
            case Game_BattlerBase.TRAIT_STATE_RESIST:
                elementState = $dataStates[trait.dataId].name;
                return elementState + "無効";
                break;
            case Game_BattlerBase.TRAIT_PARTY_ABILITY:
                return TextManager.trait(trait.code, trait.dataId);
                break;
            case Game_BattlerBase.TRAIT_SPARAM:
                param = TextManager.trait(trait.code, trait.dataId);
                value = valueStringMultiply(trait.value);
                break;
        }

        return value ? tmplParam.replace("{{param}}", param).replace("{{value}}", value) : "";
    }

    /**
     * 数値から説明文パーツを組み立てて返す(倍率の場合)
     * @param {number} tvalue 
     * @returns string
     */
    function valueStringMultiply(tvalue) {
        let value = "";
        if (tvalue > 1) {
            value = (Math.floor((tvalue - 1) * 100)).toString() + "%↑";
        } else if (tvalue === 1) {
            return "";
        } else if (tvalue < 1) {
            value = Math.floor(tvalue * 100 - 100).toString().replace("-", "") + "%↓";
        }

        return value;
    }

    /**
     * 数値から説明文パーツを組み立てて返す(確率加算の場合)
     * @param {number} tvalue 
     * @returns string
     */
    function valueStringAddSub(tvalue) {
        let value = "";
        if (tvalue > 0) {
            value = (Math.floor(tvalue * 100)).toString() + "%↑";
        } else if (tvalue === 0) {
            return "";
        } else if (tvalue < 0) {
            value = (Math.floor(tvalue * 100)).toString().replace("-", "") + "%↓";
        }

        return value;
    }

    /**
     * このウィンドウ専用の行の高さ
     * @returns number
     */
    Window_EquipDetail.prototype.lineHeight = function () {
        return 24;
    };

    /**
     * 合計列描画用の行の高さ
     * @returns number
     */
    Window_EquipDetail.prototype.lineHeight2 = function () {
        return Math.floor(this.lineHeight() * 0.8);
    };

    /**
     * 項目の幅を返す
     * @returns number
     */
    Window_EquipDetail.prototype.itemWidth = function () {
        return Math.floor((this.width - this.itemPadding() * 5) / 6);
    };

})();