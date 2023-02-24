//=============================================================================
// RPG Maker MZ - DNMC_battleCommandUI.js
// ----------------------------------------------------------------------------
// (C)2023 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/02/09 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc Donut Machine 専用戦闘コマンドUI
 * @author cursed_twitch
 * @base DNMC_sceneOperation
 * @base DNMC_sceneBattle
 * @orderAfter DNMC_sceneOperation
 * @orderAfter DNMC_sceneBattle
 * 
 * @help DNMC_battleCommandUI.js
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
            // CSVN_base.log(`cmd suspended. ${this._suspendedFrames} frames left.`);
            this._suspendedFrames--;
            return;
        }

        // 敵行動などでコマンド入力を受け付けていない場合
        if (BattleManager._cmdSuspended) {
            //CSVN_base.log("cmd suspended by enemy action.");
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
            CSVN_base.log("LA");
            this.startAction(0);
        } else if (Input.isPressed("cancel")) {
            CSVN_base.log("LB");
            this.startAction(2);
        } else if (Input.isPressed("menu")) {
            CSVN_base.log("LX");
            this.startAction(4);
        } else if (Input.isPressed("shift")) {
            CSVN_base.log("LY");
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
            CSVN_base.log("RA");
            this.startAction(1);
        } else if (Input.isPressed("cancel")) {
            CSVN_base.log("RB");
            this.startAction(3);
        } else if (Input.isPressed("menu")) {
            CSVN_base.log("RX");
            this.startAction(5);
        } else if (Input.isPressed("shift")) {
            CSVN_base.log("RY");
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
            CSVN_base.log("inputting action is negative.");
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
                this.commandEscape();
                break;
            case COMMON_SKILL_IDS.ITEM:
                this.commandItem();
                break;
            default:
                if (!skill) {
                    CSVN_base.log("unknown skill.");
                    return;
                }

                const usable = BattleManager.actor().canUse(skill);
                if (!usable) {
                    SoundManager.playBuzzer();
                    return;
                }

                action.setSkill(skillId);
                this.onSelectAction();
                break;
        }
        this.resetSuspendedFrames();
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
     * 新設カスタムアクターコマンドウィンドウの領域
     */
    Scene_Battle.prototype.customActorCommandWindowRect = function () {
        const ww = Graphics.boxWidth - this._partyCommandWindow.width;
        const wh = this.windowAreaHeight();
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
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
        this.setBackgroundType(2);
    };

    // HUDと同じ内容に
    Window_BattleActor.prototype.drawItem = Window_BattleHUD.prototype.drawItem;

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

        if (this._data.length === 0) this._data = this.defaultData();

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
     * 指定したスキルが対応アクターで使用可能かどうかを返す
     * @param {any} item 
     * @returns boolean
     */
    Window_CustomActorCommand.prototype.isEnabled = function (item) {
        const skill = $dataSkills[item.ext];
        return this.actor() ? this.actor().canUse(skill) : false;
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
        this.drawText(cost, x, y, width, "right");
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
        const LR = ["L", "R"][index % 2];
        let ABXY = "";
        switch (index) {
            case 0:
            case 1:
                ABXY = "A";
                break;
            case 2:
            case 3:
                ABXY = "B";
                break;
            case 4:
            case 5:
                ABXY = "X";
                break;
            case 6:
            case 7:
                ABXY = "Y";
                break;
            default:
                break;
        }

        return LR + "+" + ABXY;
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