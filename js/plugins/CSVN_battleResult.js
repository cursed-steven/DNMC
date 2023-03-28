//=============================================================================
// RPG Maker MZ - CSVN_battleResult
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/02/xx 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 戦闘結果表示
 * @author cursed_steven
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
    // Game_Temp

    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * 戦闘開始前のパーティーの状態を一時保存する場所の追加
     */
    Game_Temp.prototype.initialize = function () {
        _Game_Temp_initialize.call(this);
        this._actorsBeforeBattle = [];
        this._actorsAfterBattle = [];
    };

    //-----------------------------------------------------------------------------
    // Scene_Battle

    const _Scene_Battle_create = Scene_Battle.prototype.create;
    /**
     * 戦闘開始時点のパーティーの状態を一時保存する処理の追加
     */
    Scene_Battle.prototype.create = function () {
        _Scene_Battle_create.call(this);
        $gameTemp._actorsBeforeBattle = [];
        this.parseBeforeActorsData();
    };

    /**
     * 戦闘開始時点での各アクターのLV/経験値/習得スキルを一時保存
     */
    Scene_Battle.prototype.parseBeforeActorsData = function () {
        const members = JsonEx.makeDeepCopy($gameParty.members());
        for (const current of members) {
            const classId = current._classId;
            $gameTemp._actorsBeforeBattle.push({
                actorId: current._actorId,
                classId: classId,
                before: {
                    lv: current._level,
                    exp: current._exp[classId],
                    skills: current._skills
                },
                after: {
                    lv: current._level,
                    exp: current._exp[classId],
                    skills: current._skills
                }
            });
        }
        CSVN_base.log(">>>> " + this.constructor.name + " parseBeforeActorsData");
        CSVN_base.log($gameTemp._actorsBeforeBattle);
    };

    const _Scene_Battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
    /**
     * マネージャに持たせるウィンドウの追加
     */
    Scene_Battle.prototype.createDisplayObjects = function () {
        _Scene_Battle_createDisplayObjects.call(this);
        BattleManager.setLvUPWindow(this._lvUPWindow);
        BattleManager.setDropItemsWindow(this._dropItemsWindow);
        BattleManager.setLearnedSkillsWindow(this._learnedSkillsWindow);
        BattleManager.setGoldWindow(this._battleGoldWindow);
        BattleManager.setExpWindow(this._expWindow);
    };

    const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    /**
     * 結果表示用のウィンドウ追加
     */
    Scene_Battle.prototype.createAllWindows = function () {
        // -- 順序入れ替え不可ここから
        this.createLvUPWindow();
        this.createDropItemsWindow();
        this.createLearnedSkillsWindow();
        this.createBattleGoldWindow()
        this.createExpWindow();
        // -- 順序入れ替え不可ここまで
        _Scene_Battle_createAllWindows.call(this);
    };

    /**
     * メインエリア高さを返す
     * @returns number
     */
    Scene_Battle.prototype.mainAreaHeight = function () {
        return Graphics.boxHeight - this.buttonAreaHeight();
    };

    /**
     * 結果ウィンドウ表示の邪魔になるので領域変更
     * @returns Rectangle
     */
    Scene_Battle.prototype.logWindowRect = function () {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(1, false);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * メッセージウィンドウ領域変更
     * @returns Rectangle
     */
    Scene_Battle.prototype.messageWindowRect = function () {
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(1, false) + 8;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = this.mainAreaHeight() / 2 - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * LVUPウィンドウの作成
     */
    Scene_Battle.prototype.createLvUPWindow = function () {
        const rect = this.lvUPWindowRect();
        this._lvUPWindow = new Window_LvUP(rect);
        this.addWindow(this._lvUPWindow);
        this._lvUPWindow.hide();
    };

    /**
     * LVUPウィンドウの領域
     */
    Scene_Battle.prototype.lvUPWindowRect = function () {
        const ww = Graphics.boxWidth / 2;
        const wh = (Graphics.boxHeight - this.calcWindowHeight(3, true) - this.messageWindowRect().height) / 2;
        const wx = ww;
        const wy = this.calcWindowHeight(3, true);
        // console.log("> lvUPWindowRect");
        // console.log(new Rectangle(wx, wy, ww, wh));
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ドロップアイテムウィンドウの作成
     */
    Scene_Battle.prototype.createDropItemsWindow = function () {
        const rect = this.dropItemsWindowRect();
        this._dropItemsWindow = new Window_DropItems(rect);
        this.addWindow(this._dropItemsWindow);
        this._dropItemsWindow.hide();
    };

    /**
     * ドロップアイテムウィンドウの領域を返す
     * @returns Rectangle
     */
    Scene_Battle.prototype.dropItemsWindowRect = function () {
        const lvUPRect = this.lvUPWindowRect();
        const ww = lvUPRect.width;
        const wh = lvUPRect.height;
        const wx = 0;
        const wy = lvUPRect.y + lvUPRect.height;
        // console.log("> dropItemsWindowRect");
        // console.log(new Rectangle(wx, wy, ww, wh));
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 習得スキルウィンドウを作成
     */
    Scene_Battle.prototype.createLearnedSkillsWindow = function () {
        const rect = this.learnedSkillsWindowRect();
        this._learnedSkillsWindow = new Window_LearnedSkills(rect);
        this.addWindow(this._learnedSkillsWindow);
        this._learnedSkillsWindow.hide();
    };

    /**
     * 習得スキルウィンドウ領域を返す
     * @returns Rectangle
     */
    Scene_Battle.prototype.learnedSkillsWindowRect = function () {
        const lvUPRect = this.lvUPWindowRect();
        const ww = lvUPRect.width;
        const wh = lvUPRect.height;
        const wx = lvUPRect.x;
        const wy = this.dropItemsWindowRect().y;
        // console.log("> learnedSkillsWindowRect");
        // console.log(new Rectangle(wx, wy, ww, wh));
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 金額ウィンドウの作成
     */
    Scene_Battle.prototype.createBattleGoldWindow = function () {
        const rect = this.goldWindowRect();
        this._battleGoldWindow = new Window_BattleGold(rect);
        this.addWindow(this._battleGoldWindow);
        this._battleGoldWindow.hide();
    };

    /**
     * 金額ウィンドウ領域を返す
     * @returns Rectangle
     */
    Scene_Battle.prototype.goldWindowRect = function () {
        const lvUPRect = this.lvUPWindowRect();
        const ww = lvUPRect.width;
        const wh = this.calcWindowHeight(1, true);
        const wx = 0;
        const wy = this.dropItemsWindowRect().y - wh;
        // console.log("> goldWindowRect");
        // console.log(new Rectangle(wx, wy, ww, wh));
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 経験値ウィンドウの作成
     */
    Scene_Battle.prototype.createExpWindow = function () {
        const rect = this.expWindowRect();
        this._expWindow = new Window_Exp(rect);
        this.addWindow(this._expWindow);
        this._expWindow.hide();
    };

    /**
     * 経験値ウィンドウ領域を返す
     * @returns Rectangle
     */
    Scene_Battle.prototype.expWindowRect = function () {
        const lvUPRect = this.lvUPWindowRect();
        const ww = lvUPRect.width;
        const wh = lvUPRect.height - this.goldWindowRect().height;
        const wx = 0;
        const wy = this.calcWindowHeight(3, true);
        // console.log("> expWindowRect");
        // console.log(new Rectangle(wx, wy, ww, wh));
        return new Rectangle(wx, wy, ww, wh);
    };

    //-----------------------------------------------------------------------------
    // Window_LvUP
    //
    // The window for LvUP info on the battle end screen.

    function Window_LvUP() {
        this.initialize(...arguments);
    }

    Window_LvUP.prototype = Object.create(Window_MenuStatus.prototype);
    Window_LvUP.prototype.constructor = Window_LvUP;

    /**
     * 比較ウィンドウ初期化
     * @param {Rentangle} rect 
     */
    Window_LvUP.prototype.initialize = function (rect) {
        Window_MenuStatus.prototype.initialize.call(this, rect);
        this._data = $gameTemp._actorsAfterBattle;

    };

    /**
     * 最大列数
     * @returns number
     */
    Window_LvUP.prototype.maxCols = function () {
        return 1;
    };

    /**
     * 最大項目数
     * @returns number
     */
    Window_LvUP.prototype.maxItems = function () {
        return $gameParty.members().length;
    };

    /**
     * 表示可能な行数
     * @returns number
     */
    Window_LvUP.prototype.numVisibleRows = function () {
        return 2;
    };

    /**
     * 一人分の描画
     * @param number
     */
    Window_LvUP.prototype.drawItem = function (index) {
        const actor = this.actor(index);
        const ba = $gameTemp._actorsAfterBattle.filter(a => a.actorId === actor._actorId);
        const ba0 = ba[0] ? ba[0] : null;
        const rect = this.itemRect(index);
        this.drawPendingItemBackground(index);

        if (actor && ba0 && this.isLvUP(ba0)) {
            this.drawActorNameClass(index);
            this.drawLv(rect, ba0, index);
            this.drawParams(actor, rect, ba0);
        }
    };

    /**
     * アクター名と職業を描画
     * @param {number} index 
     */
    Window_LvUP.prototype.drawActorNameClass = function (index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const x = 8;
        const y = 8;
        const width = rect.width / 2;
        this.changeTextColor(ColorManager.hpColor(actor));
        this.drawText(
            actor.name() + "(" + actor.currentClass().name + ")",
            rect.x + x,
            rect.y + y,
            width
        );
        this.resetTextColor();
    };

    /**
     * レベルの変化前後を描画
     * @param {Rectangle} rect 
     * @param {any} ba 
     * @param {number} index
     */
    Window_LvUP.prototype.drawLv = function (rect, ba, index) {
        this.changeTextColor("#FFFF00");
        this.drawText(
            TextManager.levelA + ": " + ba.before.lv + " > " + ba.after.lv,
            rect.width / 2,
            rect.y + 8,
            rect.width / 2
        );
        this.resetTextColor();
    };

    Window_LvUP.prototype.drawParams = function (actor, rect, ba) {
        let before = 0;
        let after = 0;
        let paramX = 0;
        let paramY = 0;
        this.contents.fontSize = $gameSystem.mainFontSize() * 0.7;
        for (let i = 0; i < 8; i++) {
            if (!this.isLvUP(ba)) {
                before = actor.paramBase(i);
                after = before;
            } else {
                before = actor.currentClass().params[i][ba.before.lv];
                after = actor.paramBase(i);
            }
            paramX = this.paramX(rect, i);
            paramY = this.paramY(rect, i);
            this.drawParamName(paramX, paramY, i);
            this.drawBeforeParam(before, paramX, paramY);
            this.drawRightArrow(paramX + 64, paramY);
            this.drawAfterParam(before, after, paramX + 8, paramY);
        }
        this.contents.fontSize = $gameSystem.mainFontSize();
    }

    Window_LvUP.prototype.drawParamName = function (paramX, paramY, i) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.param(i), paramX, paramY, this.paramWidth());
        this.resetTextColor();

    };

    Window_LvUP.prototype.drawBeforeParam = function (before, paramX, paramY) {
        this.drawText(
            before,
            paramX + this.paramWidth() + this.itemPadding() * 0.5,
            paramY,
            this.textWidth("0000"),
            "right"
        );
    }

    Window_LvUP.prototype.drawAfterParam = function (before, after, paramX, paramY) {
        if (after > before) this.changeTextColor("#FFFF00");
        this.drawText(
            after,
            paramX + this.paramWidth() + this.itemPadding() * 2 + this.rightArrowWidth(),
            paramY,
            this.textWidth("0000"),
            "right"
        );
        this.resetTextColor();
    };

    Window_LvUP.prototype.rightArrowWidth = function () {
        return 25;
    };

    Window_LvUP.prototype.paramWidth = function () {
        return 36;
    };

    Window_LvUP.prototype.paramX = function (rect, paramId) {
        return rect.width / 4 * (paramId % 4) + 8;
    };

    Window_LvUP.prototype.paramY = function (rect, paramId) {
        return rect.y + this.lineHeight() * 0.8 * (1.3 + Math.floor(paramId / 4));
    }

    Window_LvUP.prototype.drawRightArrow = function (x, y) {
        const rightArrowWidth = this.rightArrowWidth();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("\u2192", x, y, rightArrowWidth, "center");
        this.resetTextColor();
    };

    /**
     * 戦闘開始前と比べてレベルが上がっていたらtrue
     * @param {any} ba 
     * @returns boolean
     */
    Window_LvUP.prototype.isLvUP = function (ba) {
        return ba && ba.before.lv < ba.after.lv;
    }

    //-----------------------------------------------------------------------------
    // Window_DropItems
    //
    // The window for drop items info on the battle end screen.

    function Window_DropItems() {
        this.initialize(...arguments);
    }

    Window_DropItems.prototype = Object.create(Window_ItemList.prototype);
    Window_DropItems.prototype.constructor = Window_DropItems;

    /**
     * 比較ウィンドウ初期化
     * @param {Rentangle} rect 
     */
    Window_DropItems.prototype.initialize = function (rect) {
        Window_ItemList.prototype.initialize.call(this, rect);
    };

    /**
     * 最大列数
     * @returns number
     */
    Window_DropItems.prototype.maxCols = function () {
        return 1;
    };

    /**
     * 最大項目数
     * @returns number
     */
    Window_DropItems.prototype.maxItems = function () {
        return 24;
    };

    /**
     * 表示可能な行数
     * @returns number
     */
    Window_DropItems.prototype.numVisibleRows = function () {
        return 4;
    };

    /**
     * 常に可能表示にする
     * @param {any} item 
     * @returns boolean
     */
    Window_DropItems.prototype.isEnabled = function (item) {
        return true;
    };

    /**
     * リスト作成
     */
    Window_DropItems.prototype.makeItemList = function () {
        this._data = BattleManager._rewards.items;
        if (this.includes(null)) {
            this._data.push(null);
        }
    };

    //-----------------------------------------------------------------------------
    // Window_LearnedSkills
    //
    // The window for learned skills info on the battle end screen.

    function Window_LearnedSkills() {
        this.initialize(...arguments);
    }

    Window_LearnedSkills.prototype = Object.create(Window_MenuStatus.prototype);
    Window_LearnedSkills.prototype.constructor = Window_LearnedSkills;

    /**
     * 比較ウィンドウ初期化
     * @param {Rentangle} rect 
     */
    Window_LearnedSkills.prototype.initialize = function (rect) {
        Window_MenuStatus.prototype.initialize.call(this, rect);
    };

    /**
     * 最大列数
     * @returns number
     */
    Window_LearnedSkills.prototype.maxCols = function () {
        return 1;
    };

    /**
     * 最大項目数
     * @returns number
     */
    Window_LearnedSkills.prototype.maxItems = function () {
        return 24;
    };

    /**
     * 表示可能な行数
     * @returns number
     */
    Window_LearnedSkills.prototype.numVisibleRows = function () {
        return 2;
    };

    /**
     * 1件分の描画
     * @param number
     */
    Window_LearnedSkills.prototype.drawItem = function (index) {
        const actor = this.actor(index);
        const ba = $gameTemp._actorsAfterBattle.filter(a => actor && a.actorId === actor._actorId);
        const ba0 = ba[0] ? ba[0] : null;
        const rect = this.itemRect(index);
        this.drawPendingItemBackground(index);

        if (actor) {
            if (ba0) {
                const diff = ba0.after.skills.filter(s => !ba0.before.skills.includes(s));
                if (diff.length > 0) {
                    this.drawActorName(index);
                    this.drawNewSkills(rect, diff);
                } else {
                    this.drawActorName(index);
                    this.drawText("(特になし)", rect.x, rect.y + 8, rect.width, "right");
                }
            }
        }
    };

    /**
     * アクター名の描画
     * @param {number} index 
     */
    Window_LearnedSkills.prototype.drawActorName = function (index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const x = 8;
        const y = 8;
        this.changeTextColor(ColorManager.hpColor(actor));
        this.drawText(
            actor.name() + "が新たに習得したスキル",
            rect.x + x,
            rect.y + y,
            rect.width
        );
        this.resetTextColor();
    }

    /**
     * スキル全体の描画
     * @param {Rectan} rect 
     * @param {number[]} diff 
     */
    Window_LearnedSkills.prototype.drawNewSkills = function (rect, diff) {
        if (diff.length > 3) {
            for (let i = 0; i < 2; i++) {
                this.drawSkill(rect, diff[i], i);
            }
            this.drawText("etc.", rect.x, rect.y, rect.width, "right");
        } else {
            for (let i = 0; i < diff.length; i++) {
                this.drawSkill(rect, diff[i], i);
            }
        }
    };

    /**
     * 個々のスキルの描画
     * @param {Rectangl} rect 
     * @param {number} skillId 
     * @param {number} i 
     */
    Window_LearnedSkills.prototype.drawSkill = function (rect, skillId, i) {
        const skill = $dataSkills[skillId];
        this.drawIcon(
            skill.iconIndex,
            rect.x + 8 + rect.width / 3 * (i % 3),
            rect.y + this.lineHeight() * (Math.floor(i / 3) + 1) + this.itemPadding()
        );
        this.drawText(
            skill.name,
            rect.x + 8 + rect.width / 3 * (i % 3) + 40,
            rect.y + this.lineHeight() * (Math.floor(i / 3) + 1) + this.itemPadding()
        );
    };

    //-----------------------------------------------------------------------------
    // Window_BattleGold
    //
    // The window for gold info on the battle end screen.

    function Window_BattleGold() {
        this.initialize(...arguments);
    }

    Window_BattleGold.prototype = Object.create(Window_Base.prototype);
    Window_BattleGold.prototype.constructor = Window_BattleGold;

    /**
     * 比較ウィンドウ初期化
     * @param {Rentangle} rect 
     */
    Window_BattleGold.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
    };

    /**
     * 1件分の描画
     * @param number
     */
    Window_BattleGold.prototype.refresh = function () {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.currencyUnit + ": ", 12, 4, this.width / 2 - 8);
        this.resetTextColor();
        this.drawText($gameParty.gold(), this.width / 2 - 12, 4, this.width / 2 - 8 - this.textWidth("000"), "right");
    };

    //-----------------------------------------------------------------------------
    // Window_Exp
    //
    // The window for exp info on the battle end screen.

    function Window_Exp() {
        this.initialize(...arguments);
    }

    Window_Exp.prototype = Object.create(Window_MenuStatus.prototype);
    Window_Exp.prototype.constructor = Window_Exp;

    /**
     * 比較ウィンドウ初期化
     * @param {Rentangle} rect 
     */
    Window_Exp.prototype.initialize = function (rect) {
        Window_MenuStatus.prototype.initialize.call(this, rect);
    };

    /**
     * 最大列数
     * @returns number
     */
    Window_Exp.prototype.maxCols = function () {
        return 1;
    };

    /**
     * 最大項目数
     * @returns number
     */
    Window_Exp.prototype.maxItems = function () {
        return $gameParty.members().length;
    };

    /**
     * 表示可能な行数
     * @returns number
     */
    Window_Exp.prototype.numVisibleRows = function () {
        return 4;
    };

    /**
     * 1件分の描画
     * @param number
     */
    Window_Exp.prototype.drawItem = function (index) {
        const actor = this.actor(index);
        const ba = $gameTemp._actorsAfterBattle.filter(a => a.actorId === actor._actorId);
        const ba0 = ba[0] ? ba[0] : null;
        const rect = this.itemRect(index);
        this.drawPendingItemBackground(index);

        this.contents.fontSize = $gameSystem.mainFontSize() * 0.8;
        if (actor && ba0) {
            this.drawActorName(index);
            this.drawLv(ba0, index);
            this.drawExp(ba0, index);
        }
        this.contents.fontSize = $gameSystem.mainFontSize();
    };

    /**
     * アクター名描画
     * @param {number} index 
     */
    Window_Exp.prototype.drawActorName = function (index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const x = 8;
        const y = 0;
        const width = rect.width / 5;
        this.changeTextColor(ColorManager.hpColor(actor));
        this.drawText(
            actor.name(),
            rect.x + x,
            rect.y + y,
            width
        );
        this.resetTextColor();
    };

    /**
     * LVパラメータ名描画
     * @param {any} ba0 
     * @param {number} index
     */
    Window_Exp.prototype.drawLv = function (ba0, index) {
        let rect = this.itemRect(index);
        rect.y -= 12;

        this.drawText(
            TextManager.levelA + ": ",
            rect.width / 5 + this.itemPadding() * 4,
            rect.y + 10,
            this.textWidth("Lv: ")
        );
        this.drawText(
            ba0.after.lv,
            rect.width / 5 + this.itemPadding() * 4 + this.textWidth("Lv: "),
            rect.y + 10,
            this.textWidth("00"),
            "right"
        );
    };

    /**
     * 経験値描画
     * @param {any} ba0 
     * @param {number} index
     */
    Window_Exp.prototype.drawExp = function (ba0, index) {
        const actor = this.actor(index);
        let rect = this.itemRect(index);
        const current = ba0.after.exp;
        const next = actor.expForLevel(actor._level + 1);
        const diff = next - current;
        const earned = BattleManager._rewards.exp;
        let tmpX = 0;

        rect.y -= 12;

        this.drawExpParamName(rect, index);
        tmpX = rect.width / 10 * 3 + this.itemPadding() * 4 + this.textWidth("Lv: 00 ");

        this.drawExpValue(current, tmpX, rect.y, actor.isMaxLevel());
        tmpX += this.textWidth("0000000");

        this.drawText(" + ", tmpX, rect.y + 10, this.textWidth("000"), "center");
        tmpX += this.textWidth("000");

        this.drawExpValue(earned, tmpX, rect.y);
        tmpX += this.textWidth("0000000 ");

        this.drawText("→ Left: ", tmpX, rect.y + 10, this.textWidth("→ Left: "));
        tmpX += this.textWidth("→ Left: ");

        this.drawExpValue(diff, tmpX, rect.y, actor.isMaxLevel());
        tmpX += this.textWidth("0000000");
    };

    /**
     * 経験値パラメータ名描画
     * @param {number} index
     */
    Window_Exp.prototype.drawExpParamName = function (index) {
        const rect = this.itemRect(index);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(
            TextManager.expA + ": ",
            rect.width / 10 * 3 + this.itemPadding() * 5,
            rect.y + 10,
            this.textWidth("Lv: ")
        );
        this.resetTextColor();
    };

    /**
     * 経験値の値描画
     * @param {number} value 
     * @param {number} x 
     * @param {number} y 
     * @param {boolean} isMaxLevel
     * @param {number} index
     */
    Window_Exp.prototype.drawExpValue = function (value, x, y, isMaxLevel) {
        if (isMaxLevel) value = "-------";
        this.drawText(
            value,
            x,
            y + 10,
            this.textWidth("0000000"),
            "right"
        );
    };

    //-----------------------------------------------------------------------------
    // BattleManager

    /**
     * マネージャに結果表示用ウィンドウを持たせる(Window_LvUP)
     * @param {Window_LvUP} lvUPWindow 
     */
    BattleManager.setLvUPWindow = function (lvUPWindow) {
        this._lvUPWindow = lvUPWindow;
    };

    /**
     * マネージャに結果表示用ウィンドウを持たせる(Window_DropItems)

     * @param {Window_DropItems} dropItemsWindow 
     */
    BattleManager.setDropItemsWindow = function (dropItemsWindow) {
        this._dropItemsWindow = dropItemsWindow;
    };

    /**
     * マネージャに結果表示用ウィンドウを持たせる(Window_LearnedSkills)
     * @param {Window_LearnedSkills} learnedSkillsWindow 
     */
    BattleManager.setLearnedSkillsWindow = function (learnedSkillsWindow) {
        this._learnedSkillsWindow = learnedSkillsWindow;
    };

    /**
     * マネージャに結果表示用ウィンドウを持たせる(Window_BattleGold)
     * @param {Window_BattleGold} goldWindow 
     */
    BattleManager.setGoldWindow = function (goldWindow) {
        this._battleGoldWindow = goldWindow;
    };

    /**
     * マネージャに結果表示用ウィンドウを持たせる(Window_Exp)
     * @param {Window_Exp} expWindow 
     */
    BattleManager.setExpWindow = function (expWindow) {
        this._expWindow = expWindow;
    };

    /**
     * 表示と加算の順序を入れ替え
     */
    BattleManager.processVictory = function () {
        $gameParty.removeBattleStates();
        $gameParty.performVictory();
        this.playVictoryMe();
        this.replayBgmAndBgs();
        this.makeRewards();
        this.displayVictoryMessage();
        // 表示と加算の順序を入れ替え
        this.gainRewards();
        this.displayRewards();
        // --
        this.endBattle(0);
    };

    const _BattleManager_displayRewards = BattleManager.displayRewards;
    /**
     * LVUP表示と習得スキルの表示を追加
     */
    BattleManager.displayRewards = function () {
        this.parseAfterActorsData();
        _BattleManager_displayRewards.call(this);
        this.displayLVUP();
        this.displayLearnedSkills();
    };

    /**
     * 戦闘前後のLV/経験値/習得スキルの比較データを一時的に持つ
     */
    BattleManager.parseAfterActorsData = function () {
        const before = $gameTemp._actorsBeforeBattle;
        let ps = [];
        let after1 = null;

        for (const member of $gameParty.members()) {
            const before1 = before.filter(b => b.actorId === member._actorId);
            const b = before1[0];
            const data = {
                lv: member._level,
                exp: member._exp[b.classId],
                skills: member._skills
            };
            after1 = {
                actorId: member._actorId,
                classId: member._classId,
                before: b.before,
                after: data
            };
            ps.push(after1);
        }
        $gameTemp._actorsAfterBattle = ps;
    };

    BattleManager.displayExp = function () {
        this._expWindow.refresh();
        this._expWindow.show();
    };

    BattleManager.displayGold = function () {
        this._battleGoldWindow.refresh();
        this._battleGoldWindow.show();
    };

    BattleManager.displayDropItems = function () {
        this._dropItemsWindow.refresh();
        this._dropItemsWindow.show();
    };

    BattleManager.displayLVUP = function () {
        this._lvUPWindow.refresh();
        this._lvUPWindow.show();
    };

    BattleManager.displayLearnedSkills = function () {
        this._learnedSkillsWindow.refresh();
        this._learnedSkillsWindow.show();
    };

    //-----------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_displayLevelUp = Game_Actor.prototype.displayLevelUp;
    /**
     * 戦闘中はレベルアップ表示なし
     * @param {any[]} newSkills 
     * @returns 
     */
    Game_Actor.prototype.displayLevelUp = function (newSkills) {
        if ($gameParty.inBattle()) return;
        _Game_Actor_displayLevelUp.call(this, newSkills);
    };
})();