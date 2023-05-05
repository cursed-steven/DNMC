//=============================================================================
// RPG Maker MZ - DNMC_battleCommandUI.js
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/02/09 初版
// 1.0.1  2023/03/17 逃走禁止スイッチ対応
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc Donut Machine 専用戦闘コマンドUI
 * @author cursed_steven
 * @base DNMC_sceneOperation
 * @base DNMC_sceneBattle
 * @base SimpleMsgSideViewMZ
 * @orderAfter DNMC_sceneOperation
 * @orderAfter DNMC_sceneBattle
 * 
 * @help DNMC_battleCommandUI.js
 * 
 * @param noEscapeSwId
 * @text 逃走禁止スイッチ
 * @type switch
 * 
 * @param setSkillVarIndex
 * @text セット中スキル変数開始
 * @desc この変数の次から14変数に各部アクターのセット中スキルを入れる
 * @type variable
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    const FRAMES_TO_BE_SUSPENDED = 10;

    //-----------------------------------------------------------------------------
    // Game_BattlerBase

    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    /**
     * スキル使用不可理由を入れる場所を作る
     */
    Game_BattlerBase.prototype.initMembers = function () {
        _Game_BattlerBase_initMembers.call(this);
        this._skillNgReason = "";
    };

    /**
     * スキルが封印されている場合に理由追記
     * @param {number} skillId 
     * @returns boolean
     */
    Game_BattlerBase.prototype.isSkillSealed = function (skillId) {
        const result = this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).includes(skillId);
        if (!result) this._skillNgReason = "skillSealed";

        return result;
    };

    /**
     * スキルタイプが封印されている場合に理由追記
     * @param {number} stypeId 
     * @returns boolean
     */
    Game_BattlerBase.prototype.isSkillTypeSealed = function (stypeId) {
        const result = this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).includes(stypeId);
        if (!result) this._skillNgReason = "stypeSealed";

        return result;
    };

    //-----------------------------------------------------------------------------
    // Game_Actor

    /**
     * 武器タイプ判定でNGの場合理由を追記
     * @param {any} skill 
     * @returns boolean
     */
    Game_Actor.prototype.isSkillWtypeOk = function (skill) {
        const wtypeId1 = skill.requiredWtypeId1;
        const wtypeId2 = skill.requiredWtypeId2;
        if (
            (wtypeId1 === 0 && wtypeId2 === 0) ||
            (wtypeId1 > 0 && this.isWtypeEquipped(wtypeId1)) ||
            (wtypeId2 > 0 && this.isWtypeEquipped(wtypeId2))
        ) {
            return true;
        } else {
            this._skillNgReason = "wtypeNg";
            return false;
        }
    };

    //-----------------------------------------------------------------------------
    // BattleManager

    const _BattleManager_setup = BattleManager.setup;
    /**
     * コマンド受付停止中かどうかを入れる場所を追加
     * @param {number} troopId 
     * @param {boolean} canEscape 
     * @param {boolean} canLose 
     */
    BattleManager.setup = function (troopId, canEscape, canLose) {
        _BattleManager_setup.call(this, troopId, canEscape, canLose);

        this._cmdSuspended = false;
    };

    const _BattleManager_startAction = BattleManager.startAction;
    /**
     * 行動開始(コマンド入力禁止開始を追加)
     */
    BattleManager.startAction = function () {
        _BattleManager_startAction.call(this);
        this._cmdSuspended = true;
    };

    const _BattleManager_endAction = BattleManager.endAction;
    /**
     * 行動終了(コマンド入力禁止終了を追加)
     */
    BattleManager.endAction = function () {
        _BattleManager_endAction.call(this);
        this._cmdSuspended = false;
    };

    //-------------------------------------------------------------------------
    // Scene_Battle

    const _Scene_Battle_create = Scene_Battle.prototype.create;
    /**
     * 連続入力抑止のための残フレームを入れる場所を追加
     */
    Scene_Battle.prototype.create = function () {
        _Scene_Battle_create.call(this);
        this._suspendedFrames = 0;
    };

    /**
     * アクターコマンドを完全に置換する
     */
    Scene_Battle.prototype.createActorCommandWindow = function () {
        const rect = this.customActorCommandWindowRect();
        const commandWindow = new Window_CustomActorCommand(rect);
        commandWindow.y = Graphics.boxHeight - commandWindow.height;

        this.addWindow(commandWindow);
        this._actorCommandWindow = commandWindow;
    };

    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        _Scene_Battle_update.call(this);

        // 入力受付可否の判定
        if (!BattleManager._inputting) {
            return;
        }

        // アクターのコマンド決定後、所定のフレーム経過までの間
        // 次のコマンド決定を受け付けない
        // ※複数人が同時に入力可能になった場合、
        // 　次の人にまで同じコマンドが入ってしまう問題の対処
        if (this._suspendedFrames > 0) {
            // console.log(`cmd suspended. ${this._suspendedFrames} frames left.`);
            this._suspendedFrames--;
            return;
        }

        // 敵行動などでコマンド入力を受け付けていない場合
        if (BattleManager._cmdSuspended) {
            //console.log("cmd suspended by enemy action.");
            //this._actorCommandWindow.hide();
            return;
        }

        this._actorCommandWindow.show();

        if (Input.isPressed("pageup")) {
            // L1を押しながらの処理
            this.onL1();
        } else if (Input.isPressed("pagedown")) {
            // R1を押しながらの処理
            this.onR1();
        } else {
            if (Input.isPressed("ok")) {
                // 決定
                this.startAction(this._actorCommandWindow.index());
                this.resetSuspendedFrames();
            } else if (Input.isPressed("cancel")) {
                // キャンセル
                this.commandCancel();
                this.resetSuspendedFrames();
            } else {
                if (TouchInput.isClicked()) {
                    // タッチUIにも対応
                    this.startAction(this._actorCommandWindow.hitIndex());
                } else {
                    // タッチ入力もないし
                    // L1R1どちらも押していないならコマンドは入力されない
                    this.disableAllActorCommands();
                }
            }
        }
    };

    /**
     * L1を押しているときの処理
     */
    Scene_Battle.prototype.onL1 = function () {
        [0, 2, 4, 6].map(i => {
            this._actorCommandWindow.itemAt(i).enabled = false;
        });

        // L1を押している間にさらにABXYを押したときの処理
        if (Input.isPressed("ok")) {
            console.log("LA");
            this.startAction(0);
        } else if (Input.isPressed("cancel")) {
            console.log("LB");
            this.startAction(2);
        } else if (Input.isPressed("menu")) {
            console.log("LX");
            this.startAction(4);
        } else if (Input.isPressed("shift")) {
            console.log("LY");
            this.startAction(6);
        }
    };

    /**
     * R1を押しているときの処理
     */
    Scene_Battle.prototype.onR1 = function () {
        [1, 3, 5, 7].map(i => {
            this._actorCommandWindow.itemAt(i).enabled = false;
        });
        // R1を押している間にさらにABXYを押したときの処理
        if (Input.isPressed("ok")) {
            console.log("RA");
            this.startAction(1);
        } else if (Input.isPressed("cancel")) {
            console.log("RB");
            this.startAction(3);
        } else if (Input.isPressed("menu")) {
            console.log("RX");
            this.startAction(5);
        } else if (Input.isPressed("shift")) {
            console.log("RY");
            this.startAction(7);
        }
    };

    /**
     * 行動開始
     * @param {number} index 
     * @returns void
     */
    Scene_Battle.prototype.startAction = function (index) {
        const action = BattleManager.inputtingAction();
        let skillId = 0;
        if (this._actorCommandWindow.itemAt(index)) {
            skillId = this._actorCommandWindow.itemAt(index).ext;
        }

        if (!action) {
            console.log("inputting action is negative.");
            return;
        }

        const skill = $dataSkills[skillId];
        switch (skillId) {
            case COMMON_SKILL_IDS.ATTACK:
                this.commandAttack();
                break;
            case COMMON_SKILL_IDS.DEFEND:
                this.commandGuard();
                break;
            case COMMON_SKILL_IDS.ESCAPE:
                if ($s.get(param.noEscapeSwId)) {
                    // 逃走禁止
                    SoundManager.playBuzzer();
                    this.logSkillNg("noEscape");
                    return;
                } else {
                    this.commandEscape();
                }
                break;
            case COMMON_SKILL_IDS.ITEM:
                this.commandItem();
                break;
            default:
                if (!skill) {
                    console.log("unknown skill.");
                    return;
                }

                const usable = BattleManager.actor().canUse(skill);
                if (!usable) {
                    SoundManager.playBuzzer();
                    this.logSkillNg(BattleManager.actor()._skillNgReason);
                    BattleManager.actor()._skillNgReason = "";
                    return;
                }

                action.setSkill(skillId);
                this.onSelectAction();
                break;
        }
        this.resetSuspendedFrames();
    };

    /**
     * スキル使用不可利用表示
     * @param {string} reason 
     */
    Scene_Battle.prototype.logSkillNg = function (reason) {
        console.log(`reason: ${reason}`);
        const head = "【スキル使用不可】";
        switch (reason) {
            case "wtypeNg":
                this._logWindow.push("skillNgReason", head + "武器タイプ不適合");
                break;
            case "cantPaySkillCost":
                this._logWindow.push("skillNgReason", head + "MP不足 or BB上限オーバー");
                break;
            case "skillSealed":
                this._logWindow.push("skillNgReason", head + "スキル封印");
                break;
            case "stypeSealed":
                this._logWindow.push("skillNgReason", head + "スキルタイプ封印");
                break;
            case "noEscape":
                this._logWindow.push("skillNgReason", "撤退禁止");
                break;
        }
    };

    const _Scene_Battle_commanAttack = Scene_Battle.prototype.commandAttack;
    /**
     * 先制時、決定ボタンをおすと通常攻撃が勝手に選ばれてしまう不具合の対策
     */
    Scene_Battle.prototype.commandAttack = function () {
        if (BattleManager._preemptive) {
            this.startActorCommandSelection();
        } else {
            _Scene_Battle_commanAttack.call(this);
        }
    };

    const _Scene_Battle_commandCancel = Scene_Battle.prototype.commandCancel;
    /**
     * アクターコマンドでキャンセルしたときには一旦アクターコマンドウィンドウは無効化
     */
    Scene_Battle.prototype.commandCancel = function () {
        this._actorCommandWindow.deactivate();
        this._actorCommandWindow.hide();
        _Scene_Battle_commandCancel.call(this);
    };

    const _Scene_Battle_commandItem = Scene_Battle.prototype.commandItem;
    /**
     * アイテム選択中はコマンドウィンドウに入力がいかないようにする
     */
    Scene_Battle.prototype.commandItem = function () {
        _Scene_Battle_commandItem.call(this);
        this._actorCommandWindow.deactivate();
    };

    const _Scene_Battle_onItemOk = Scene_Battle.prototype.onItemOk;
    /**
     * アイテム決定後にも入力受付禁止フレームをリセット
     */
    Scene_Battle.prototype.onItemOk = function () {
        _Scene_Battle_onItemOk.call(this);
        this.resetSuspendedFrames();
    };

    const _Scene_Battle_onActorOk = Scene_Battle.prototype.onActorOk;
    /**
     * 敵選択後も入力受付禁止フレームをリセット
     */
    Scene_Battle.prototype.onActorOk = function () {
        _Scene_Battle_onActorOk.call(this);
        this.resetSuspendedFrames();
    };

    const _Scene_Battle_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
    /**
     * 敵選択後も入力受付禁止フレームをリセット
     */
    Scene_Battle.prototype.onEnemyOk = function () {
        _Scene_Battle_onEnemyOk.call(this);
        this.resetSuspendedFrames();
    };

    /**
     * 入力受付禁止フレームのリセット
     */
    Scene_Battle.prototype.resetSuspendedFrames = function () {
        this._suspendedFrames = FRAMES_TO_BE_SUSPENDED;
    };

    /**
     * アクターコマンドを全て無効化する
     */
    Scene_Battle.prototype.disableAllActorCommands = function () {
        for (let i = 0; i < 8; i++) {
            this._actorCommandWindow.itemAt(i).enabled = false;
        }
    };

    /**
     * アイテムウィンドウ領域再定義
     * @returns Rectangle
     */
    Scene_Battle.prototype.itemWindowRect = function () {
        const ww = Graphics.boxWidth - 160;
        const wh = this.windowAreaHeight();
        const wx = 0;
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 敵選択ウィンドウ領域再定義
     * @returns Rectangle
     */
    Scene_Battle.prototype.enemyWindowRect = function () {
        return this.itemWindowRect();
    };

    /**
     * 新設カスタムアクターコマンドウィンドウの領域
     */
    Scene_Battle.prototype.customActorCommandWindowRect = function () {
        const ww = Graphics.boxWidth - this._partyCommandWindow.width;
        const wh = this.windowAreaHeight();
        const wx = 0;
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Battle_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
    /**
     * パーティーコマンド表示中はアクターコマンドウィンドウは非活性に
     */
    Scene_Battle.prototype.startPartyCommandSelection = function () {
        _Scene_Battle_startPartyCommandSelection.call(this);
        this._actorCommandWindow.deactivate();
    };

    //-------------------------------------------------------------------------
    // Window_Selectable

    /**
     * 戦闘中はブザーが鳴らないようにする
     */
    Window_Selectable.prototype.processOk = function () {
        if (this.isCurrentItemEnabled()) {
            this.playOkSound();
            this.updateInputData();
            this.deactivate();
            this.callOkHandler();
        } else {
            if (!$gameParty.inBattle()) this.playBuzzerSound();
        }
    };

    //-----------------------------------------------------------------------------
    // Window_BattleActor

    const _Window_BattleActor_initialize = Window_BattleActor.prototype.initialize;
    /**
     * 透明化
     * @param {Rectangle} rect 
     */
    Window_BattleActor.prototype.initialize = function (rect) {
        _Window_BattleActor_initialize.call(this, rect);
        this.frameVisible = true;
    };

    /**
     * 対象者選択ウィンドウの1人分を描画する(名前のみ)。
     * @param {number} index 
     */
    Window_BattleActor.prototype.drawItem = function (index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const x = rect.x;
        const y = rect.y;
        this.drawActorName(actor, x + 16, y);
    }

    /**
     * HUDに合わせて修正
     * @returns number
     */
    Window_BattleActor.prototype.maxCols = function () {
        return 1;
    };

    /**
     * HUDに合わせて修正
     * @returns number
     */
    Window_BattleActor.prototype.numVisibleRows = function () {
        return $gameParty.battleMembers().length;
    };

    Window_BattleActor.prototype.itemHeight = function () {
        return this.innerHeight / this.numVisibleRows();
    };

    //-------------------------------------------------------------------------
    // Window_BattleLog

    /**
     * スキル使用不可表示
     * @param {string} text 
     */
    Window_BattleLog.prototype.skillNgReason = function (text) {
        this.waitForEffect();
        this._lines.push(text);
        this.refresh();
        this.waitAbs();
    };

    //-----------------------------------------------------------------------------
    // Window_CustomActorCommand
    //
    // The Window for selecting skills on the battle screen.

    function Window_CustomActorCommand() {
        this.initialize(...arguments);
    }

    Window_CustomActorCommand.prototype = Object.create(Window_Command.prototype);
    Window_CustomActorCommand.prototype.constructor = Window_CustomActorCommand;

    /**
     * 初期化
     * @param {Rectangle} rect 
     */
    Window_CustomActorCommand.prototype.initialize = function (rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this.openness = 0;
        this.deactivate();
    }

    /**
     * アクターコマンドに入れるものがない場合のデフォルトデータを返す
     * @returns any[]
     */
    Window_CustomActorCommand.prototype.defaultData = function () {
        let skills = [];
        skills.push($dataSkills[COMMON_SKILL_IDS.ATTACK]);
        skills.push($dataSkills[COMMON_SKILL_IDS.DEFEND]);
        skills.push($dataSkills[COMMON_SKILL_IDS.ESCAPE]);
        skills.push($dataSkills[COMMON_SKILL_IDS.ITEM]);
        return skills;
    };

    /**
     * 最大項目数を返す
     * @returns number
     */
    Window_CustomActorCommand.prototype.maxItems = function () {
        return 8;
    };

    /**
     * 最大列数を返す
     * @returns number
     */
    Window_CustomActorCommand.prototype.maxCols = function () {
        return 2;
    };

    /**
     * コマンドリスト作成
     */
    Window_CustomActorCommand.prototype.makeCommandList = function () {
        this.addActorCommand();
    };

    /**
     * コマンドリスト作成
     */
    Window_CustomActorCommand.prototype.addActorCommand = function () {
        this._data = [];
        if (this.actor()) {
            const vi = param.setSkillVarIndex + this.actor().actorId();
            const ss = $gameVariables.value(vi).toString().split(",");
            ss.map(s => {
                this._data.push($dataSkills[s]);
            });
        }

        if (!this._data[0]) this._data = this.defaultData();

        // 左から右、上から下ではなく
        // 上から下、左から右に並べる
        let arranged = [
            null, null,
            null, null,
            null, null,
            null, null,
        ];
        arranged[0] = this._data[0];
        arranged[1] = this._data[4] ? this._data[4] : null;
        arranged[2] = this._data[1];
        arranged[3] = this._data[5] ? this._data[5] : null;
        arranged[4] = this._data[2];
        arranged[5] = this._data[6] ? this._data[6] : null;
        arranged[6] = this._data[3] ? this._data[3] : null;
        arranged[7] = this._data[7] ? this._data[7] : null;
        this._data = arranged;

        let symbol = "";
        for (let i = 0; i < this.maxItems(); i++) {
            switch (i % 4) {
                case 0:
                    // A
                    symbol = "ok";
                    break;
                case 1:
                    // B
                    symbol = "cancel";
                    break;
                case 2:
                    // X
                    symbol = "menu";
                    break;
                case 3:
                    // Y
                    symbol = "shift";
                    break;
            }
            this.addCommand(
                this._data[i] ? this._data[i].name : "",
                symbol,
                this.actor() ? this.actor().canUse(this._data[i]) : false,
                this._data[i] ? this._data[i].id : null
            );
        }

    };

    /**
     * セットアップ
     */
    Window_CustomActorCommand.prototype.setup = function () {
        this.refresh();
        this.activate();
        this.open();
    };

    /**
     * 対応アクターを返す
     * @returns Game_Actor
     */
    Window_CustomActorCommand.prototype.actor = function () {
        return BattleManager.actor();
    };

    /**
     * 指定したインデックスにあるスキルデータを返す
     * @param {number} index 
     * @returns any
     */
    Window_CustomActorCommand.prototype.itemAt = function (index) {
        return this._list && index >= 0 ? this._list[index] : null;
    };

    /**
     * 表示はすべて「使用可」で
     * @param {any} item 
     * @returns boolean
     */
    Window_CustomActorCommand.prototype.isEnabled = function (/*item*/) {
        return true;
    };

    /**
     * セット中スキルの描画
     */
    Window_CustomActorCommand.prototype.drawItem = function (index) {
        const cmd = this.itemAt(index);
        if (cmd) {
            const costWidth = this.costWidth();
            const rect = this.itemLineRect(index);
            this.changePaintOpacity(this.isEnabled(cmd));
            this.drawKeysName(index, rect);
            this.drawItemName(
                cmd,
                rect.x + this.keysNameWidth() + this.itemPadding(),
                rect.y,
                rect.width - costWidth,
                index
            );
            this.drawSkillCost(cmd, rect.x, rect.y, costWidth);
            this.changePaintOpacity(1);
        }
    };

    /**
     * コマンドごとのキー操作描画
     * @param {number} index 
     * @param {Rectangle} rect 
     */
    Window_CustomActorCommand.prototype.drawKeysName = function (index, rect) {
        const keysName = this.keysName(index);
        this.drawText(keysName, rect.x, rect.y, this.keysNameWidth());
    };

    const _Window_Base_drawItemName = Window_Base.prototype.drawItemName;
    /**
     * スキル名描画
     * @param {any} cmd 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} index 
     */
    Window_CustomActorCommand.prototype.drawItemName = function (cmd, x, y, width, index) {
        const skill = $dataSkills[cmd.ext];
        _Window_Base_drawItemName.call(this, skill, x, y, width);
    };

    /**
     * スキルの発動BB上限とMPコストの描画
     * @param {any} cmd 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @returns void
     */
    Window_CustomActorCommand.prototype.drawSkillCost = function (cmd, x, y, width) {
        if (!this.actor()) return;

        const skill = $dataSkills[cmd.ext];
        if (!skill) return;

        // X座標微調整
        const x2 = x + this.width / 2 - this.costWidth() * 2 + this.textWidth("0");

        this.drawTpCost(skill, x2, y);
        this.drawMpCost(skill, x2 + this.textWidth("0000"), y);
    };

    /**
     * 発動BB上限の描画
     * @param {any} skill 
     * @param {number} x 
     * @param {number} y 
     */
    Window_CustomActorCommand.prototype.drawTpCost = function (skill, x, y) {
        const cost = this.actor() ? this.actor().skillTpCost(skill) : 0;
        const width = this.textWidth("000");

        this.changeTextColor(ColorManager.tpCostColor());
        if (cost < 100) {
            this.drawText(cost, x, y, width, "right");
        }
        this.resetTextColor();
    };

    /**
     * MPコストの描画
     * @param {any} skill 
     * @param {number} x 
     * @param {number} y 
     */
    Window_CustomActorCommand.prototype.drawMpCost = function (skill, x, y) {
        const cost = this.actor() ? this.actor().skillMpCost(skill) : 0;
        const width = this.textWidth("000");

        this.changeTextColor(ColorManager.mpCostColor());
        this.drawText(cost, x, y, width, "right");
        this.resetTextColor();
    };

    /**
     * コマンドウィンドウ中の位置ごとのキー操作を返す
     * @param {number} index 
     * @returns string
     */
    Window_CustomActorCommand.prototype.keysName = function (index) {
        const padConfig = ConfigManager["gamepads"] ? ConfigManager["gamepads"] : 0;
        const pad = PADS[padConfig];
        const LKEY = pad === "KEYBOARD" ? this.keyboardKeysName("pageup") : this.gamePadBtn("pageup");
        const RKEY = pad === "KEYBOARD" ? this.keyboardKeysName("pagedown") : this.gamePadBtn("pagedown");
        const keys = [
            pad === "KEYBOARD" ? this.keyboardKeysName("ok") : this.gamePadBtn("ok"),
            pad === "KEYBOARD" ? this.keyboardKeysName("cancel") : this.gamePadBtn("cancel"),
            pad === "KEYBOARD" ? this.keyboardKeysName("menu") : this.gamePadBtn("menu"),
            pad === "KEYBOARD" ? this.keyboardKeysName("shift") : this.gamePadBtn("shift")
        ];

        const LR = [LKEY, RKEY][index % 2];
        let ABXY = "";
        switch (index) {
            case 0:
            case 1:
                ABXY = keys[0];
                break;
            case 2:
            case 3:
                ABXY = keys[1];
                break;
            case 4:
            case 5:
                ABXY = keys[2];
                break;
            case 6:
            case 7:
                ABXY = keys[3];
                break;
            default:
                break;
        }

        return LR + "+" + ABXY;
    };

    Window_CustomActorCommand.prototype.gamePadBtn = Window_ButtonGuide.prototype.gamePadBtn;
    Window_CustomActorCommand.prototype.keyboardKeysName = function (role) {
        if (role === "menu") role = "escape";

        const keyNo = Object.keys(Input.keyMapper).filter(
            n => Input.keyMapper[n] === role
        );
        const priorKeyNo = keyNo.filter(
            n => 65 <= parseInt(n) && parseInt(n) <= 90
        );

        // A-Zに割り当てがあればそれを優先
        let resultKeyNo = 0;
        if (priorKeyNo.length === 0) {
            resultKeyNo = Math.min.apply(null, keyNo);
        } else {
            resultKeyNo = Math.min.apply(null, priorKeyNo);
        }

        return NUMBER_KEY_MAP.KEYBOARD[resultKeyNo];
    };

    /**
     * キー描画用の幅を返す
     * @returns number
     */
    Window_CustomActorCommand.prototype.keysNameWidth = function () {
        return this.textWidth("000");
    };

    /**
     * コスト描画用の幅を返す
     * @returns number
     */
    Window_CustomActorCommand.prototype.costWidth = function () {
        return this.textWidth("0000000");
    };

})();