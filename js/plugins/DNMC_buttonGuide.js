//=============================================================================
// RPG Maker MZ - DNMC_buttonGuide
// ----------------------------------------------------------------------------
// (C)2022 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/12/22 初版
// 1.1.0  2023/02/28 Mano_InputConfigの設定を読んでキー表示
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc Donut Machine 専用ボタンガイド
 * @author cursed_twitch
 * @base CSVN_base
 * @base Mano_InputConfig
 * @orderAfter CSVN_base
 * 
 * @help DNMC_buttonGuide.js
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const NUMBER_KEY_MAP = {
        NINTENDO: {
            0: "B",
            1: "A",
            2: "Y",
            3: "X",
            4: "L1",
            5: "R1",
            12: "up",
            13: "down",
            14: "left",
            15: "right"
        },
        PLAYSTATION: {
            0: "×",
            1: "○",
            2: "□",
            3: "△",
            4: "L1",
            5: "R1",
            12: "up",
            13: "down",
            14: "left",
            15: "right"
        },
        XBOX: {
            0: "A",
            1: "B",
            2: "Y",
            3: "X",
            4: "L1",
            5: "R1",
            12: "up",
            13: "down",
            14: "left",
            15: "right"
        }
    };

    const PADS = ["NINTENDO", "PLAYSTATION", "XBOX"];

    //-----------------------------------------------------------------------------
    // Scene_Options

    const _Scene_Options_maxCommands = Scene_Options.prototype.maxCommands;
    /**
     * オプションのコマンド数に1追加
     * @returns number
     */
    Scene_Options.prototype.maxCommands = function () {
        const orgNum = _Scene_Options_maxCommands.call(this);
        return orgNum + 1;
    };

    //-----------------------------------------------------------------------------
    // Scene_Map

    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    /**
     * ボタンガイド作成処理を追加
     */
    Scene_Map.prototype.createAllWindows = function () {
        this.createButtonGuide();
        _Scene_Map_createAllWindows.call(this);
    };

    /**
     * ボタンガイドを作成する。
     */
    Scene_Map.prototype.createButtonGuide = function () {
        const rect = this.buttonGuideRect();
        this._buttonGuide = new Window_ButtonGuide(rect);
        this.addWindow(this._buttonGuide);
    };

    /**
     * ボタンガイドの領域を返す
     * @returns Rectangle
     */
    Scene_Map.prototype.buttonGuideRect = function () {
        const ww = 160;
        const wh = this.calcWindowHeight(2, true);
        const wx = Graphics.boxWidth - ww;
        const wy = 48;
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    /**
     * ボタンガイドの更新処理を追加
     */
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        this._buttonGuide.show();
        this._buttonGuide.refresh();
    };

    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    /**
     * ボタンガイド非表示化処理の追加
     */
    Scene_Map.prototype.terminate = function () {
        this._buttonGuide.hide();
        _Scene_Map_terminate.call(this);
    };

    //-----------------------------------------------------------------------------
    // Window_Options

    const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    /**
     * 使用ゲームパッド選択オプションを追加
     */
    Window_Options.prototype.makeCommandList = function () {
        _Window_Options_makeCommandList.call(this);
        this.addGamepadOptions();
    };

    Window_Options.prototype.addGamepadOptions = function () {
        this.addCommand("使用ゲームパッド", "gamepads");
    };

    const _Window_Options_processOk = Window_Options.prototype.processOk;
    /**
     * OK時の処理に使用ゲームパッドの変更を追加
     */
    Window_Options.prototype.processOk = function () {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (this.isGamepadSymbol(symbol)) {
            const lastValue = this.getConfigValue(symbol);
            this.changePad(symbol, lastValue + 1);
        } else {
            _Window_Options_processOk.call(this);
        }
    };

    /**
     * コマンドシンボルがゲームパッドかどうかを返す
     * @param {string} symbol 
     * @returns boolean
     */
    Window_Options.prototype.isGamepadSymbol = function (symbol) {
        return symbol === "gamepads";
    };

    const _Window_Options_statusText = Window_Options.prototype.statusText;
    /**
     * 現在値の表示の処理に使用ゲームパッド分を追加
     * @param {number} index 
     */
    Window_Options.prototype.statusText = function (index) {
        const text = _Window_Options_statusText.call(this, index);
        const symbol = this.commandSymbol(index);
        if (this.isGamepadSymbol(symbol)) {
            let value = this.getConfigValue(symbol);
            if (!value) {
                value = 0;
                this.setConfigValue(symbol, value);
            }
            return this.gamepadText(value);
        } else {
            return text;
        }
    };

    /**
     * 使用ゲームパッドの種類を表すテキストを返す
     * @param {number} value 
     * @returns string
     */
    Window_Options.prototype.gamepadText = function (value) {
        return PADS[value];
    };

    /**
     * 使用ゲームパッドの設定を保存する
     * @param {string} symbol 
     */
    Window_Options.prototype.changePad = function (symbol, value) {
        const keyPadNums = PADS.length;
        this.setConfigValue(symbol, value % keyPadNums);
        this.redrawItem(this.findSymbol(symbol));
        this.playCursorSound();
    };

    //-------------------------------------------------------------------------
    // Window_ButtonGuide
    //
    // The window for displaying button guide on the map scene.

    function Window_ButtonGuide() {
        this.initialize(...arguments);
    }

    Window_ButtonGuide.prototype = Object.create(Window_Base.prototype);
    Window_ButtonGuide.prototype.constructor = Window_ButtonGuide;

    /**
     * ボタンガイド初期化
     * @param {Rectangle} rect 
     */
    Window_ButtonGuide.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.setBackgroundType(2);
        this.fontSize = $gameSystem.mainFontSize() * 0.8;
    };

    /**
     * ボタンガイド更新
     */
    Window_ButtonGuide.prototype.refresh = function () {
        this.contents.clear();
        this.contents.fontSize = this.fontSize;
        const sceneName = SceneManager._scene.constructor.name;
        switch (sceneName) {
            case "Scene_Map":
                this.drawSceneMapGuide();
                break;
            case "Scene_Menu":
                // this.drawSceneMenuGuide();
                break;
            case "Scene_Item":
                // this.drawSceneItemGuide();
                break;
            case "Scene_Skill":
                // this.drawSceneSkillGuide();
                break;
            case "Scene_EquipStatus":
                // this.drawSceneEquipStatus();
                break;
            case "Scene_Operation":
                // this.drawSceneOperationStatus();
                break;
            case "Scene_Battle":
                // this.drawSceneBattleGuide();
                break;
        }
        this.contents.fontSize = $gameSystem.mainFontSize();
    };

    /**
     * Scene_Mapのボタンガイド
     */
    Window_ButtonGuide.prototype.drawSceneMapGuide = function () {
        this.drawButton("menu", "メニュー", 0, 0);
        this.drawButton("shift", "ダッシュ切替", 0, this.fontSize * 1.5);
    };

    /**
     * ボタンと説明を描画
     * @param {string} btn 
     * @param {string} desc 
     * @param {number} x 
     * @param {number} y 
     */
    Window_ButtonGuide.prototype.drawButton = function (role, desc, x, y) {
        const btnWidth = this.fontSize / 2 * 4;
        let width = 0;
        this.drawText("[" + this.gamePadBtn(role) + "]", x, y, btnWidth);
        width += btnWidth;
        this.drawText(desc, x + width, y, this.width - width);
    };

    /**
     * ロールからキー番号を取得し、そこからパッドごとの対応ボタンを返す。
     * @param {string} role 
     * @returns string
     */
    Window_ButtonGuide.prototype.gamePadBtn = function (role) {
        const btnNo = Object.keys(Input.gamepadMapper).find(
            n => Input.gamepadMapper[n] === role
        );
        const padConfig = ConfigManager["gamepads"] ? ConfigManager["gamepads"] : 0;
        const pad = PADS[padConfig];

        return NUMBER_KEY_MAP[pad][btnNo];
    };


})();