//=============================================================================
// RPG Maker MZ - CSVN_xuidasTavern
// ----------------------------------------------------------------------------
// (C)2023 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/03/07 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc ×イーダの酒場。
 * @author cursed_twitch
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_xuidasTavern.js
 * 
 * @param charWidth
 * @text キャラ画像横幅
 * @type number
 * @default 48
 * 
 * @param charHeight
 * @text キャラ画像高さ
 * @type number
 * @default 48
 * 
 * @param actorsMaxLength
 * @text アクター最大人数
 * @desc これを超えると除籍が必要になる人数
 * @type number
 * @min 2
 * 
 * @param membersCantChangeVarId
 * @text 入替不可アクターIDリスト変数ID
 * @type variable
 * 
 * @param labelForChangeCmd
 * @text 入替コマンドラベル
 * @type string
 * @default 入れ替え
 * 
 * @param membersCantEliminateVarId
 * @text 除籍不可アクターIDリスト変数ID
 * @type variable
 * 
 * @param labelForEliminateCmd
 * @text 除籍コマンドラベル
 * @type string
 * @default 除籍
 * 
 * @param labelForBrowseCmd
 * @text 閲覧コマンドラベル
 * @type string
 * @default 閲覧
 * 
 * @param labelForPartyList
 * @text パーティーリストタイトルラベル
 * @type string
 * @default パーティー側
 * 
 * @param labelForReserveList
 * @text 控えリストタイトルラベル
 * @type string
 * @default 控え側
 * 
 * @param sortKeyVarId
 * @text ソートキーID変数ID
 * @type variable
 * 
 * @param labelForClass
 * @text ソートキー「職業」をあらわすラベル
 * @type string
 * @default 職業
 * 
 * @command disableChange
 * @text 入れ替え禁止メンバー追加
 * 
 * @arg actorId
 * @text 入れ替えを禁止するアクター
 * @type actor
 * 
 * @command enableChange
 * @text 入れ替え禁止メンバー除去
 * 
 * @arg actorId
 * @text 入れ替え禁止を解除するアクター
 * @type actor
 * 
 * @command disableEliminate
 * @text 除籍禁止メンバー追加
 * 
 * @arg actorId
 * @text 除籍禁止アクター
 * @type actor
 * 
 * @command enableEliminate
 * @text 除籍禁止解除アクター
 * 
 * @arg actorId
 * @text 除籍禁止解除アクター
 * @type actor
 * 
 * @param topSideOffset
 * @text 上側の空きスペースの幅
 * @type number
 * @default 0
 * 
 * @param rightSideOffset
 * @text 右側の空きスペースの幅
 * @type number
 * @default 0
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const CHAR_WIDTH = param.charWidth;
    const CHAR_HEIGHT = param.charHeight;
    const PARTY_MAX_LENGTH = 8;
    const ACTORS_MAX_LENGTH = param.actorsMaxLength;
    const MEMBERS_CANT_CHANGE = $v.get(param.membersCantChangeVarId);
    const LABEL_CHANGE_CMD = param.labelForChangeCmd;
    const MEMBERS_CANT_ELIMINATE = $v.get(param.membersCantEliminateVarId);
    const LABEL_ELIMINATE_CMD = param.labelForEliminateCmd;
    const LABEL_BROWSE_CMD = param.labelForBrowseCmd;
    const LABEL_PARTY_LIST = param.labelForPartyList;
    const LABEL_RESERVE_LIST = param.labelForReserveList;
    const TOPSIDE_OFFSET = param.topSideOffset;
    const RIGHTSIDE_OFFSET = param.rightSideOffset;
    const SORT_KEYS = [
        { id: PARAM.MHP, label: TextManager.mhp },
        { id: PARAM.MMP, label: TextManager.mmp },
        { id: PARAM.ATK, label: TextManager.atk },
        { id: PARAM.DEF, label: TextManager.def },
        { id: PARAM.MAT, label: TextManager.mat },
        { id: PARAM.MDF, label: TextManager.mdf },
        { id: PARAM.AGI, label: TextManager.agi },
        { id: PARAM.LUK, label: TextManager.luk },
        { id: 8, label: "ID" },
        { id: 9, label: param.labelForClass },
        { id: 10, label: TextManager.levelA }
    ];

    PluginManagerEx.registerCommand(script, "disableChange", args => {
        // 入れ替え禁止メンバー追加
    });

    PluginManagerEx.registerCommand(script, "enableChange", args => {
        // 入れ替え禁止メンバー除去(=入れ替えできるようになる)
    });

    PluginManagerEx.registerCommand(script, "disableEliminate", args => {
        // 除籍禁止メンバーの追加
    });

    PluginManagerEx.registerCommand(script, "enableEliminate", args => {
        // 除籍禁止メンバーの除去(=除籍できるようになる)
    });

    PluginManagerEx.registerCommand(script, "changeStart", args => {
        SceneManager.push(Scene_PartyChange);
    });

    PluginManagerEx.registerCommand(script, "eliminateStart", args => {
        SceneManager.push(Scene_PartyEliminate);
    });

    PluginManagerEx.registerCommand(script, "browseStart", args => {
        SceneManager.push(Scene_PartyBrowse);
    });

    //-----------------------------------------------------------------------------
    // Scene_PartyChange
    //
    // The scene class of the party change screen.

    function Scene_PartyChange() {
        this.initialize(...arguments);
    }

    Scene_PartyChange.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_PartyChange.prototype.constructor = Scene_PartyChange;

    Scene_PartyChange.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    /**
     * 入れ替えシーン作成
     */
    Scene_PartyChange.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createDisplayObjects();
        this.setupDisplayObjects();
    };

    /**
     * 表示するものの作成
     */
    Scene_PartyChange.prototype.createDisplayObjects = function () {
        this.createPartyMemberWindow();
        this.createReserveMemberWindow();
        this.createPartyLabelWindow();
        this.createReserveLabelWindow();
        this.createStatusWindow();
        this.createSortKeyWindow();
    };

    /**
     * パーティーメンバーウィンドウ作成
     */
    Scene_PartyChange.prototype.createPartyMemberWindow = function () {
        const rect = this.partyMemberWindowRect();
        this._partyMemberWindow = new Window_PartyChangeMember(rect);
        this._partyMemberWindow.setHandler("ok", this.changeOk.bind(this));
        this._partyMemberWindow.setHandler("cancel", this.onChangeCancel.bind(this));
        this._partyMemberWindow.setHandler("pageup", this.toggleStatus.bind(this));
        this._partyMemberWindow.setHandler("pagedown", this.toggleStatus.bind(this));
        this._partyMemberWindow.setHandler("menu", this.changeSortKeyForward.bind(this));
        this._partyMemberWindow.setHandler("shift", this.changeSortKeyBackward.bind(this));
        this.addWindow(this._partyMemberWindow);
    };

    /**
     * パーティーメンバーウィンドウ領域を返す
     * @returns Rectangle
     */
    Scene_PartyChange.prototype.partyMemberWindowRect = function () {
        const wx = 0;
        const wy = this.calcWindowHeight(1, true) + TOPSIDE_OFFSET;
        const ww = CHAR_WIDTH * 4 + 8 * 5;
        const wh = CHAR_HEIGHT * 2 + 8 * 3;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * パーティーラベルウィンドウ作成
     */
    Scene_PartyChange.prototype.createPartyLabelWindow = function () {
        const rect = this.partyLabelWindowRect();
        this._partyLabelWindow = new Window_Base(rect);
        this._partyLabelWindow.drawText(LABEL_PARTY_LIST, 0, 0, this.textWidth(LABEL_PARTY_LIST));
        this.addWindow(this._partyLabelWindow);
    };

    /**
     * パーティーラベルウィンドウの領域を返す
     * @returns Rectangle
     */
    Scene_PartyChange.prototype.partyLabelWindowRect = function () {
        const prect = this.partyMemberWindowRect();
        const wx = 0;
        const wy = TOPSIDE_OFFSET;
        const ww = prect.width;
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 控えメンバーウィンドウの作成
     */
    Scene_PartyChange.prototype.createReserveMemberWindow = function () {
        const rect = this.reserveMemberWindowRect();
        this._reserveMemberWindow = new Window_ReserveMember(rect);
        this._reserveMemberWindow.setHandler("ok", this.onReserveOk.bind(this));
        this._reserveMemberWindow.setHandler("cancel", this.onReserveCancel.bind(this));
        this._reserveMemberWindow.setHandler("pageup", this.toggleStatus.bind(this));
        this._reserveMemberWindow.setHandler("pagedown", this.toggleStatus.bind(this));
        this._reserveMemberWindow.setHandler("menu", this.changeSortKeyForward.bind(this));
        this._reserveMemberWindow.setHandler("shift", this.changeSortKeyBackward.bind(this));
        this.addWindow(this._reserveMemberWindow);
    };

    /**
     * 控えメンバーウィンドウの領域を返す
     * @returns Rectangle
     */
    Scene_PartyChange.prototype.reserveMemberWindowRect = function () {
        const prect = this.partyMemberWindowRect();
        const ww = this.partyLabelWindowRect().width;
        const wh = Graphics.boxHeight - prect.height - this.calcWindowHeight(1, true) * 3;
        const wx = 0;
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ステータスウィンドウの作成
     */
    Scene_PartyChange.prototype.createStatusWindow = function () {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_XuidasStatus(rect);
        this.addWindow(this._statusWindow);
    };

    /**
     * ステータスウィンドウの領域を返す
     * @returns Rectangle
     */
    Scene_PartyChange.prototype.statusWindowRect = function () {
        const prect = this.partyMemberWindowRect();
        const wx = Graphcs.boxWidth - prect.width;
        const wy = 0;
        const ww = wx - RIGHTSIDE_OFFSET;
        const wh = Graphics.boxHeight;
        return new Rectanlge(wx, wy, ww, wh);
    };

    /**
     * ソートキーウィンドウの作成
     */
    Scene_PartyChange.prototype.createSortKeyWindow = function () {
        const rect = this.sortKeyWindowRect();
        this._sortKeyWindow = new Window_PartyChangeSortKey(rect);
        this.addWindow(this._sortKeyWindow);
    };

    /**
     * ソートキーウィンドウの領域を返す
     * @returns Rectangle
     */
    Scene_PartyChange.prototype.sortKeyWindowRect = function () {
        const prect = this.partyMemberWindowRect();
        const ww = prect.width;
        const wh = this.calcWindowHeight(1, true);
        const wx = 0;
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

})();