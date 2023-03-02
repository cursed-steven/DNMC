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
        for (const current of $gameParty.members()) {
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
        CSVN_base.log(this._data);
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
        return this.maxItems();
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

        if (actor && ba0) {
            this.drawActorNameClass(index);
            if (this.isLvUP(ba0)) this.changeTextColor("#FFFF00");
            this.drawText("Lv: " + ba0.before.lv + " > " + ba0.after.lv, rect.width / 2, 8, rect.width / 2);
            this.resetTextColor();
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

    Window_DropItems.prototype = Object.create(Window_MenuStatus.prototype);
    Window_DropItems.prototype.constructor = Window_DropItems;

    /**
     * 比較ウィンドウ初期化
     * @param {Rentangle} rect 
     */
    Window_DropItems.prototype.initialize = function (rect) {
        Window_MenuStatus.prototype.initialize.call(this, rect);
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
        return this.maxItems();
    };

    /**
     * 1件分の描画
     * @param number
     */
    Window_DropItems.prototype.drawItem = function (index) {
        // TODO
        this.drawText("Window_DropItems", 0, 0, this.width);
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
        return this.maxItems();
    };

    /**
     * 1件分の描画
     * @param number
     */
    Window_LearnedSkills.prototype.drawItem = function (index) {
        // TODO
        this.drawText("Window_LearnedSkills", 0, 0, this.width);
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
        // TODO
        this.drawText("Window_BattleGold", 0, 0, this.width);
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
        return 24;
    };

    /**
     * 表示可能な行数
     * @returns number
     */
    Window_Exp.prototype.numVisibleRows = function () {
        return this.maxItems();
    };

    /**
     * 1件分の描画
     * @param number
     */
    Window_Exp.prototype.drawItem = function (index) {
        // TODO
        this.drawText("Window_Exp", 0, 0, this.width);
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
        // TODO
        this._expWindow.refresh();
        this._expWindow.show();
    };

    BattleManager.displayGold = function () {
        // TODO
        this._battleGoldWindow.refresh();
        this._battleGoldWindow.show();
    };

    BattleManager.displayDropItems = function () {
        // TODO
        this._dropItemsWindow.refresh();
        this._dropItemsWindow.show();
    };

    BattleManager.displayLVUP = function () {
        console.log(this._rewards);
        // TODO
        this._lvUPWindow.refresh();
        this._lvUPWindow.show();
    };

    BattleManager.displayLearnedSkills = function () {
        // TODO
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