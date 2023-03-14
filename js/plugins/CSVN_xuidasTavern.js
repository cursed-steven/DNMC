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
 * @param excludedActors
 * @text 除外アクター
 * @desc テスト用等でウィンドウに登場させたくないもの
 * @type actor[]
 * 
 * @param actorListVarId
 * @text 使用可能アクターリスト
 * @desc このセーブファイル内で使えるアクターのリスト(※DNMC_randomActors.js対策)
 * @type variable
 * 
 * @param reserveMemberVarId
 * @text 控えメンバーを入れる変数ID
 * @type variable
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
 * @param faceWidth
 * @text 顔画像幅
 * @type number
 * @default 144
 * 
 * @param faceHeight
 * @text 顔画像高さ
 * @type number
 * @default 144
 * 
 * @param actorsMaxLength
 * @text アクター最大人数
 * @desc これを超えると除籍が必要になる人数
 * @type number
 * @min 2
 * @default 16
 * 
 * @param membersCantChangeVarId
 * @text 入替不可アクターIDリスト変数ID
 * @type variable
 * 
 * @param labelForChangeMode
 * @text 入替コマンドラベル
 * @type string
 * @default 入れ替え
 * 
 * @param membersCantEliminateVarId
 * @text 除籍不可アクターIDリスト変数ID
 * @type variable
 * 
 * @param labelForEliminateMode
 * @text 除籍コマンドラベル
 * @type string
 * @default 除籍
 * 
 * @param labelForBrowseMode
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
 * @param labelForLevel
 * @text ソートキー「レベル」をあらわすラベル
 * @type string
 * @default Lv
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
 * 
 * @command changeStart
 * @text 入替シーン開始
 * 
 * @command eliminateStart
 * @text 除籍シーン開始
 * 
 * @command browseStart
 * @text 閲覧シーン開始
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const EXCLUDED_ACTORS = param.excludedActors ? param.excludedActors : [];
    const CHAR_WIDTH = param.charWidth;
    const CHAR_HEIGHT = param.charHeight;
    const FACE_WIDTH = param.faceWidth;
    const FACE_HEIGHT = param.faceHeight;
    const PARTY_MAX_LENGTH = 8;
    const ACTORS_MAX_LENGTH = param.actorsMaxLength;
    const LABEL_YOFFSET = 4;
    const LABEL_CHANGE_MODE = param.labelForChangeMode;
    const LABEL_ELIMINATE_MODE = param.labelForEliminateMode;
    const LABEL_BROWSE_MODE = param.labelForBrowseMode;
    const LABEL_PARTY_LIST = param.labelForPartyList;
    const LABEL_RESERVE_LIST = param.labelForReserveList;
    const TOPSIDE_OFFSET = param.topSideOffset;
    const RIGHTSIDE_OFFSET = param.rightSideOffset;
    const SORT_KEYS = [
        TextManager.mhp,
        TextManager.mmp,
        TextManager.atk,
        TextManager.def,
        TextManager.mat,
        TextManager.mdf,
        TextManager.agi,
        TextManager.luk,
        "ID",
        param.labelForClass,
        param.labelForLevel,
        "任意"
    ];
    let membersCantChange = [];
    let membersCantEliminate = [];

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
        membersCantChange = $v.get(param.membersCantChangeVarId).toString().split(",");
        membersCantEliminate = $v.get(param.membersCantEliminateVarId).toString().split(",");
        this._partyMemberWindow.setReserveMemberWindow(this._reserveMemberWindow);
        this._reserveMemberWindow.setPartyMemberWindow(this._partyMemberWindow);
        this._partyMemberWindow.setStatusWindow(this._statusWindow);
        this._reserveMemberWindow.setStatusWindow(this._statusWindow);
        this._partyMemberWindow.activate();
        this._reserveMemberWindow.deactivate();

        const actor = this._partyMemberWindow.itemAt(0);
        this._statusWindow.setActor(actor);
        this._statusWindow.refresh();
    };

    /**
     * 表示するものの作成
     */
    Scene_PartyChange.prototype.createDisplayObjects = function () {
        this.createModeWindow();
        this.createPartyMemberWindow();
        this.createReserveMemberWindow();
        this.createPartyLabelWindow();
        this.createReserveLabelWindow();
        this.createStatusWindow();
        this.createSortKeyWindow();
    };

    /**
     * モードウィンドウ作成
     */
    Scene_PartyChange.prototype.createModeWindow = function () {
        const rect = this.modeWindowRect();
        this._modeWindow = new Window_Base(rect);
        // TODO モードごと(入れ替え/除籍/閲覧)にほんとは変わる
        this._modeWindow.changeTextColor(ColorManager.systemColor());
        this._modeWindow.drawText(LABEL_CHANGE_MODE, 0, LABEL_YOFFSET, CHAR_WIDTH * 4 + 8 * 5);
        this._modeWindow.resetTextColor();
        this.addWindow(this._modeWindow);
    };

    /**
     * モードウィンドウの領域を返す
     * @returns Rectangle
     */
    Scene_PartyChange.prototype.modeWindowRect = function () {
        const wx = 0;
        const wy = TOPSIDE_OFFSET;
        const ww = CHAR_WIDTH * 4 + 8 * 7;
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * パーティーメンバーウィンドウ作成
     */
    Scene_PartyChange.prototype.createPartyMemberWindow = function () {
        const rect = this.partyMemberWindowRect();
        this._partyMemberWindow = new Window_PartyChangeMember(rect);
        this._partyMemberWindow.setHandler("ok", this.onPartyOk.bind(this));
        this._partyMemberWindow.setHandler("cancel", this.onPartyCancel.bind(this));
        this._partyMemberWindow.setHandler("pageup", this.toggleStatus.bind(this));
        this._partyMemberWindow.setHandler("pagedown", this.toggleStatus.bind(this));
        this._partyMemberWindow.setHandler("menu", this.moveSortKeyForward.bind(this));
        this._partyMemberWindow.setHandler("shift", this.moveSortKeyBackward.bind(this));
        this.addWindow(this._partyMemberWindow);
    };

    /**
     * パーティーメンバーウィンドウ領域を返す
     * @returns Rectangle
     */
    Scene_PartyChange.prototype.partyMemberWindowRect = function () {
        const mrect = this.modeWindowRect();
        const lrect = this.partyLabelWindowRect();
        const wx = 0;
        const wy = mrect.height + lrect.height + TOPSIDE_OFFSET;
        const ww = CHAR_WIDTH * 4 + 8 * 7;
        const wh = (CHAR_HEIGHT + $gameSystem.mainFontSize() / 2) * 2 + 8 * 5;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * パーティーメンバーウィンドウでOK押下時の処理
     */
    Scene_PartyChange.prototype.onPartyOk = function () {
        CSVN_base.logGroup("onPartyOk");

        const p = this._partyMemberWindow;
        const r = this._reserveMemberWindow;
        if (p.isMarked()) {
            // パーティーメンバー側でだれかすでにマークされている
            if (p.index() === p.marked()) {
                // マークされているメンバーの上でさらに選択→マーク解除
            } else {
                // 別のパーティーメンバーを選択→順番入替
                const a = p.marked();
                const b = p.index();
                if (!p.markedItem() || !p.item()) {
                    SoundManager.playBuzzer();
                    CSVN_base.logWarn("cant swap empty.");
                } else {
                    $gameParty.swapOrder(a, b);
                    CSVN_base.log(`party swapped: ${a}, ${b}`);
                }
            }
            p.unmark();
        } else {
            if (r.isMarked()) {
                // 控えメンバーを既に誰かマークしている
                const p2r = p.item();
                const r2p = r.markedItem();
                if (r2p) {
                    // 控えメンバーで先に誰か選んでいる
                    if (p2r) {
                        // パーティーメンバーからも誰か選んだ(=入替)
                        this.partyReserveExchange(p2r.actorId(), r2p.actorId());
                    } else {
                        // パーティーメンバーからは空欄を選んだ(控えからの単純加入)
                        // 人数超過がないか確認
                        if ($gameParty.members().length + 1 > PARTY_MAX_LENGTH) {
                            SoundManager.playBuzzer();
                            CSVN_base.logWarn("too many party members.");
                        } else {
                            // パーティーに移動
                            this.moveToParty(r2p.actorId());
                        }
                    }
                } else {
                    // 控え側では空欄を選んでいる
                    if (p2r) {
                        // パーティー側では誰か選んだ(=パーティーからの単純追い出し)
                        if ($gameParty.members().length === 1) {
                            // パーティーから誰もいなくなるのはNG
                            SoundManager.playBuzzer();
                            CSVN_base.logWarn("1 member needed at least.");
                        } else {
                            this.moveToReserve(p2r.actorId());
                        }
                    } else {
                        // どちらも空欄を選んだ(=buzz)
                        SoundManager.playBuzzer();
                        CSVN_base.logWarn("both empty.");
                    }
                }
                p.unmark();
                r.unmark();
                p.refresh();
                r.refresh();
            } else {
                // 誰もマークしていない→カーソルのあるパーティーメンバーをマーク
                p.mark();
            }
        }
        p.activate();
        p.refresh();

        CSVN_base.logGroupEnd("onPartyOK");
    };

    /**
     * パーティーメンバーウィンドウでキャンセル押下時の処理
     */
    Scene_PartyChange.prototype.onPartyCancel = function () {
        if (this._partyMemberWindow.isMarked()) {
            // パーティーメンバー側で誰かマークしている場合
            this._partyMemberWindow.unmark();
            this._partyMemberWindow.refresh();
            this._partyMemberWindow.activate();
        } else {
            // シーン終了
            this.popScene();
        }
    };

    /**
     * パーティーラベルウィンドウ作成
     */
    Scene_PartyChange.prototype.createPartyLabelWindow = function () {
        const rect = this.partyLabelWindowRect();
        this._partyLabelWindow = new Window_Base(rect);
        this._partyLabelWindow.drawText(LABEL_PARTY_LIST, 0, LABEL_YOFFSET, this.width);
        this.addWindow(this._partyLabelWindow);
    };

    /**
     * パーティーラベルウィンドウの領域を返す
     * @returns Rectangle
     */
    Scene_PartyChange.prototype.partyLabelWindowRect = function () {
        const mrect = this.modeWindowRect();
        const wx = 0;
        const wy = mrect.height + TOPSIDE_OFFSET;
        const ww = mrect.width;
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 控えメンバーウィンドウの作成
     */
    Scene_PartyChange.prototype.createReserveMemberWindow = function () {
        const rect = this.reserveMemberWindowRect();
        this._reserveMemberWindow = new Window_ReserveChangeMember(rect);
        this._reserveMemberWindow.setHandler("ok", this.onReserveOk.bind(this));
        this._reserveMemberWindow.setHandler("cancel", this.onReserveCancel.bind(this));
        this._reserveMemberWindow.setHandler("pageup", this.toggleStatus.bind(this));
        this._reserveMemberWindow.setHandler("pagedown", this.toggleStatus.bind(this));
        this._reserveMemberWindow.setHandler("menu", this.moveSortKeyForward.bind(this));
        this._reserveMemberWindow.setHandler("shift", this.moveSortKeyBackward.bind(this));
        this.addWindow(this._reserveMemberWindow);
    };

    /**
     * 控えメンバーウィンドウの領域を返す
     * @returns Rectangle
     */
    Scene_PartyChange.prototype.reserveMemberWindowRect = function () {
        const rrect = this.reserveLabelWindowRect();
        const srect = this.sortKeyWindowRect();
        const wx = 0;
        const wy = rrect.y + rrect.height;
        const ww = rrect.width;
        const wh = Graphics.boxHeight - wy - srect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 控えメンバータイトルウィンドウを作成する
     */
    Scene_PartyChange.prototype.createReserveLabelWindow = function () {
        const rect = this.reserveLabelWindowRect();
        this._reserveLabelWindow = new Window_Base(rect);
        this._reserveLabelWindow.drawText(LABEL_RESERVE_LIST, 0, LABEL_YOFFSET, this.width);
        this.addWindow(this._reserveLabelWindow);
    };

    /**
     * 控えメンバータイトルウィンドウの領域を返す
     * @returns Rectangle
     */
    Scene_PartyChange.prototype.reserveLabelWindowRect = function () {
        const prect = this.partyMemberWindowRect();
        const ww = prect.width;
        const wh = this.calcWindowHeight(1, true);
        const wx = 0;
        const wy = prect.y + prect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 控えメンバーウィンドウでOK押下時の処理
     * ※控えメンバー側にはパーティーメンバーをマークしたあときている前提
     */
    Scene_PartyChange.prototype.onReserveOk = function () {
        CSVN_base.logGroup("onReserveOK");

        const p = this._partyMemberWindow;
        const r = this._reserveMemberWindow;
        if (r.isMarked()) {
            // 控えメンバー側でだれかすでにマークされている
            if (r.index() === r.marked()) {
                // マークされているメンバーの上でさらに選択→マーク解除
            } else {
                // 別のパーティーメンバーを選択→ソートキーを任意に変更して順番入替
                const a = r.marked();
                const b = r.index();
                if (!r.markedItem() || !r.item()) {
                    SoundManager.playBuzzer();
                    CSVN_base.logWarn("cant swap empty.");
                } else {
                    this.swapReservers(a, b);
                    r.refresh();
                }
            }
            r.unmark();
        } else {
            if (p.isMarked()) {
                // パーティーメンバーを既に誰かマークしている
                const p2r = p.markedItem();
                const r2p = r.item();
                if (p2r) {
                    // パーティー側で先に誰か選んでいる
                    if (r2p) {
                        // 控側でも誰か選んだ(=入替)
                        this.partyReserveExchange(p2r.actorId(), r2p.actorId());
                    } else {
                        // 控側では空欄を選んだ(=パーティからの単純追い出し)
                        if ($gameParty.members().length === 1) {
                            // パーティーに誰もいなくなるのはNG
                            SoundManager.playBuzzer();
                            CSVN_base.logWarn(); (`1 member needed at least.`);
                        } else {
                            this.moveToReserve(p2r.actorId());
                        }
                    }
                } else {
                    // パーティー側で空欄を選んでいる
                    if (r2p) {
                        // 控側では誰か選んだ(=控えからの単純加入)
                        // 人数超過がないか確認
                        if ($gameParty.members().length + 1 > PARTY_MAX_LENGTH) {
                            SoundManager.playBuzzer();
                            CSVN_base.logWarn("too many party members.");
                        } else {
                            // パーティーに移動
                            this.moveToParty(r2p.actorId());
                        }
                    } else {
                        // どちらも空欄を選んだ(=buzz)
                        SoundManager.playBuzzer();
                        CSVN_base.logWarn("both empty.");
                    }
                }
                p.unmark();
                r.unmark();
                p.refresh();
                r.refresh();
            } else {
                // 誰もマークしていない→カーソルのある控えメンバーをマーク
                r.mark();
            }
        }
        r.activate();
        r.refresh();

        CSVN_base.logGroupEnd("onReserveOK");
    };

    /**
     * 控えメンバーウィンドウでキャンセル押下時の処理
     */
    Scene_PartyChange.prototype.onReserveCancel = function () {
        if (this._reserveMemberWindow.isMarked()) {
            // 控えメンバー側で誰かマークしている場合
            this._reserveMemberWindow.unmark();
            this._reserveMemberWindow.refresh();
            this._reserveMemberWindow.activate();
        } else {
            // シーン終了
            this.popScene();
        }
    };

    /**
     * 控えメンバーのa項めとb項めを入れ替える
     * @param {number} a 
     * @param {number} b 
     * @returns void
     */
    Scene_PartyChange.prototype.swapReservers = function (a, b) {
        let org = $v.get(param.reserveMemberVarId).toString().split(",");
        if (!org[a] || !org[b]) return;

        $v.set(param.reserveMemberVarId, org.swap(a, b).join(","));
        CSVN_base.log(`reservers swapped: ${a}, ${b}`);
    };

    /**
     * パーティーにいるp2rと控えにいるr2pを入替
     * @param {number} p2r 
     * @param {number} r2p 
     */
    Scene_PartyChange.prototype.partyReserveExchange = function (p2r, r2p) {
        this.moveToParty(r2p);
        this.moveToReserve(p2r);
    };

    /**
     * パーティーから控えに指定アクターを移動
     * @param {number} actorId 
     */
    Scene_PartyChange.prototype.moveToReserve = function (actorId) {
        this.addToReserve(actorId);
        $gameParty.removeActor(parseInt(actorId));
        CSVN_base.log(`p-out: ${actorId}`);
    };

    /**
     * 控えからパーティーに指定アクターを移動
     * @param {number} actorId 
     */
    Scene_PartyChange.prototype.moveToParty = function (actorId) {
        this.removeFromReserve(actorId);
        $gameParty.addActor(parseInt(actorId));
        CSVN_base.log(`p-in: ${actorId}`);
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
        const mrect = this.modeWindowRect();
        const prect = this.partyMemberWindowRect();
        const wx = mrect.width;
        const wy = mrect.y;
        const ww = (Graphics.boxWidth - wx) - RIGHTSIDE_OFFSET;
        const wh = Graphics.boxHeight - prect.y - prect.height - TOPSIDE_OFFSET;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ステータスパラメータウィンドウ作成
     */
    Scene_PartyChange.prototype.createStatusParamsWindow = function () {
        const rect = this.statusParamsWindowRect();
        this._statusParamsWindow = new Window_XuidasStatusParams(rect);
        this.addWindow(this._statusParamsWindow);
    };

    /**
     * ステータスパラメータウィンドウの領域を返す
     * @returns Rectangle
     */
    Scene_PartyChange.prototype.statusParamsWindowRect = function () {
        const rmrect = this.reserveMemberWindowRect();
        const wx = rmrect.x + rmrect.width;
        const wy = rmrect.y;
        const ww = (Graphics.boxWidth - rmrect.width - RIGHTSIDE_OFFSET) / 3;
        const wh = Graphics.boxHeight - rmrect.y;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ステータス装備ウィンドウ作成
     */
    Scene_PartyChange.prototype.createStatusEquipWindow = function () {
        const rect = this.statusEquipWindowRect();
        this._statusEquipWindow = new Window_XuidasStatusEquip(rect);
        this.addWindow(this._statusEquipWindow);
    };

    /**
     * ステータス装備ウィンドウ領域
     * @returns Rectangle
     */
    Scene_PartyChange.prototype.statusEquipWindowRect = function () {
        const rmrect = this.reserveMemberWindowRect();
        const serect = this.statusParamsWindowRect();
        const wx = rmrect.x + rmrect.width + serect.width;
        const wy = rmrect.y;
        const ww = (Graphics.boxWidth - rmrect.width - RIGHTSIDE_OFFSET) / 3;
        const wh = Graphics.boxHeight - rmrect.y;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ステータス特徴ウィンドウの作成
     */
    Scene_PartyChange.prototype.createStatusTraitsWindow = function () {
        const rect = this.statusTraitsWindowRect();
        this._statusTraitsWindow = new Window_XuidasStatusTraits(rect);
        this.addWindow(this._statusTraitsWindow);
    };

    /**
     * ステータス特徴ウィンドウ領域
     * @returns Rectangle
     */
    Scene_PartyChange.prototype.statusTraitsWindowRect = function () {
        const rmrect = this.reserveMemberWindowRect();
        const serect = this.statusParamsWindowRect();
        const wx = rmrect.x + rmrect.width + serect.width * 2;
        const wy = rmrect.y;
        const ww = (Graphics.boxWidth - rmrect.width - RIGHTSIDE_OFFSET) / 3;
        const wh = Graphics.boxHeight - rmrect.y;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ステータスウィンドウを「パラメータ・装備」と「代表的なスキル一覧」を切り替える。
     */
    Scene_PartyChange.prototype.toggleStatus = function () {
        this._statusWindow.toggleStatus();
    };

    /**
     * ソートキーを昇順に1つ変更
     */
    Scene_PartyChange.prototype.moveSortKeyForward = function () {
        this._sortKeyWindow.moveSortKeyForward();
        this._partyMemberWindow.refresh();
        this._reserveMemberWindow.refresh();
    };

    /**
     * ソートキーを降順に1つ変更
     */
    Scene_PartyChange.prototype.moveSortKeyBackward = function () {
        this._sortKeyWindow.moveSortKeyBackward();
        this._partyMemberWindow.refresh();
        this._reserveMemberWindow.refresh();
    };

    /**
     * ソートキーウィンドウの作成
     */
    Scene_PartyChange.prototype.createSortKeyWindow = function () {
        const rect = this.sortKeyWindowRect();
        this._sortKeyWindow = new Window_ReserveMemberSortKey(rect);
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

    /**
     * 指定したアクターIDを控えメンバーに追加
     * @param {number} actorId 
     */
    Scene_PartyChange.prototype.addToReserve = function (actorId) {
        let reserves = $v.get(param.reserveMemberVarId).toString().split(",");
        reserves.push(actorId);
        // 0は除外しておく
        reserves = reserves.filter(r => {
            return parseInt(r) !== 0;
        });
        $v.set(param.reserveMemberVarId, reserves.join(","));
    };

    /**
     * 指定したアクターIDを控えメンバーから削除
     * @param {number} actorId 
     */
    Scene_PartyChange.prototype.removeFromReserve = function (actorId) {
        let reserves = $v.get(param.reserveMemberVarId).toString().split(",");
        const removed = reserves.filter(r => {
            return r !== 0 && r !== actorId;
        });

        $v.set(param.reserveMemberVarId, removed.join(","));
    };

    //-----------------------------------------------------------------------------
    // Window_PartyChangeBase
    //
    // The window base class for displaying party member on the party change screen.

    function Window_PartyChangeBase() {
        this.initialize(...arguments);
    }

    Window_PartyChangeBase.prototype = Object.create(Window_MenuStatus.prototype);
    Window_PartyChangeBase.prototype.constructor = Window_PartyChangeBase;

    /**
     * ウィンドウ初期化
     * @param {Rectangle} rect 
     */
    Window_PartyChangeBase.prototype.initialize = function (rect) {
        Window_MenuStatus.prototype.initialize.call(this, rect);
        this._list = [];
        this._marked = -1;
    };

    /**
     * ステータスウィンドウ(の参照)を保持する
     * @param {Window_XuidasStatus} statusWindow 
     */
    Window_PartyChangeBase.prototype.setStatusWindow = function (statusWindow) {
        this._statusWindow = statusWindow;
    }

    /**
     * 列数は固定
     * @returns number
     */
    Window_PartyChangeBase.prototype.maxCols = function () {
        return 4;
    };

    /**
     * いまある項目数を返す
     * @returns number
     */
    Window_PartyChangeBase.prototype.itemsCount = function () {
        return this._list.length;
    };

    /**
     * 行高を返す
     * @returns number
     */
    Window_PartyChangeBase.prototype.itemHeight = function () {
        return CHAR_HEIGHT + $gameSystem.mainFontSize() / 2 + this.itemPadding();
    };

    /**
     * カーソルがいる項目のデータを返す
     * @returns Game_Actor
     */
    Window_PartyChangeBase.prototype.item = function () {
        return this.itemAt(this.index());
    };

    /**
     * マークされている項目のデータを返す
     * @returns Game_Actor
     */
    Window_PartyChangeBase.prototype.markedItem = function () {
        return this.itemAt(this.marked());
    };

    /**
     * インデックスで指定した項目のデータを返す
     * @param {number} index 
     * @returns Game_Actor
     */
    Window_PartyChangeBase.prototype.itemAt = function (index) {
        return this._list && index >= 0 ? this._list[index] : null;
    };

    /**
     * カーソルがいる項目が利用可能かを返す
     * @returns boolean
     */
    Window_PartyChangeBase.prototype.isCurrentItemEnabled = function () {
        return this.isEnabled(this.item());
    };

    /**
     * 指定可能かどうかを返す
     * @param {Game_Actor} item 
     * @returns boolean
     */
    Window_PartyChangeBase.prototype.isEnabled = function (item) {
        return !membersCantChange.some(m => {
            return item && parseInt(m) === item.actorId();
        });
    }

    /**
     * カーソルがいる部分のデータを返す
     * @param {number} index 
     * @returns Game_Actor
     */
    Window_PartyChangeBase.prototype.listActor = function (index) {
        return this.itemAt(index);
    };

    /**
     * 1項目分の描画
     * @param {number} index 
     * @param {boolean} opacity 
     */
    Window_PartyChangeBase.prototype.drawItem = function (index, opacity) {
        if (!opacity) opacity = false;
        // console.log(`opacity: ${opacity}`);
        this.changePaintOpacity(opacity);
        this.drawActorCharacter(index);
        this.drawActorName(index);
        this.changePaintOpacity(true);
    };

    /**
     * アクターキャラクターの描画
     * @param {number} index 
     */
    Window_PartyChangeBase.prototype.drawActorCharacter = function (index) {
        const actor = this.listActor(index);
        const rect = this.itemRect(index);
        if (actor) {
            this.drawCharacter(
                actor.characterName(),
                actor.characterIndex(),
                rect.x + CHAR_WIDTH / 2,
                rect.y + CHAR_HEIGHT
            );
        }
    };

    /**
     * アクター名描画
     * @param {number} index 
     */
    Window_PartyChangeBase.prototype.drawActorName = function (index) {
        const actor = this.listActor(index);
        const rect = this.itemRect(index);
        if (actor) {
            const fontSize = $gameSystem.mainFontSize() / 2;
            this.contents.fontSize = fontSize;
            this.drawText(actor.name(), rect.x, rect.y + CHAR_HEIGHT - fontSize, CHAR_WIDTH, "center");
            this.contents.fontSize = $gameSystem.mainFontSize();
        }
    };

    /**
     * 描画更新
     */
    Window_PartyChangeBase.prototype.refresh = function () {
        this.contents.clear();
        this.makeItemList();
        for (let i = 0; i < this._list.length; i++) {
            // console.log(`i: ${i} / e: ${this._list[i]} / marked: ${this._marked}`);
            i === this._marked
                ? this.drawItem(i, true)
                : this.drawItem(i, false);
        }
        // CSVN_base.log(`${this.constructor.name} refreshed.`);
    };

    const _Window_Selectable_select = Window_Selectable.prototype.select;
    /**
     * アクターを選択するたびにステータスウィンドウの描画を更新
     * @param {number} index 
     */
    Window_PartyChangeBase.prototype.select = function (index) {
        if (this._statusWindow) {
            this.refresh();
            this._statusWindow.setActor(this.itemAt(index));
            this._statusWindow.refresh();
        }
        _Window_Selectable_select.call(this, index);
    };

    /**
     * 項目を選択中の状態にする
     */
    Window_PartyChangeBase.prototype.mark = function () {
        this._marked = this.index();
        CSVN_base.log(`${this.constructor.name} marked: ${this.index()}`);
        if (this.markedItem()) {
            this.drawItem(this.index(), true);
            this.refresh()
        }
    };

    /**
     * 項目を選択されていない状態にする
     */
    Window_PartyChangeBase.prototype.unmark = function () {
        CSVN_base.log(`${this.constructor.name} unmarked`);
        this._marked = -1;
        this.drawItem(this.index(), false);
        this.refresh()
    };

    /**
     * 選択中のインデックスを返す
     * @returns number
     */
    Window_PartyChangeBase.prototype.marked = function () {
        return this._marked;
    };

    /**
     * 項目をマーク中かどうかを返す
     * @returns boolean
     */
    Window_PartyChangeBase.prototype.isMarked = function () {
        return this._marked >= 0;
    };

    /**
     * 継承元の余計な処理を省略
     */
    Window_PartyChangeBase.prototype.processOk = function () {
        Window_StatusBase.prototype.processOk.call(this);
        // const actor = this.actor(this.index());
        // $gameParty.setMenuActor(actor);
    };

    //-----------------------------------------------------------------------------
    // Window_PartyChangeMember
    //
    // The window for displaying party member on the party change screen.

    function Window_PartyChangeMember() {
        this.initialize(...arguments);
    }

    Window_PartyChangeMember.prototype = Object.create(Window_PartyChangeBase.prototype);
    Window_PartyChangeMember.prototype.constructor = Window_PartyChangeMember;

    /**
     * パーテイーメンバーウィンドウの作成
     * @param {Rectangle} rect 
     */
    Window_PartyChangeMember.prototype.initialize = function (rect) {
        Window_PartyChangeBase.prototype.initialize.call(this, rect);
        this.select(0);
    };

    /**
     * 控えメンバーウィンドウの参照を持たせる
     * @param {Window_ReserveChangeMember} reserveMemberWindow 
     */
    Window_PartyChangeMember.prototype.setReserveMemberWindow = function (reserveMemberWindow) {
        this._reserveMemberWindow = reserveMemberWindow;
    };

    /**
     * 行数は固定
     * @returns number
     */
    Window_PartyChangeMember.prototype.numVisibleRows = function () {
        return 2;
    };

    /**
     * 最大項目数
     * @returns number
     */
    Window_PartyChangeMember.prototype.maxItems = function () {
        return $gameParty.members().length + 1 < PARTY_MAX_LENGTH
            ? $gameParty.members().length + 1
            : PARTY_MAX_LENGTH;
    };

    /**
     * 項目リスト作成
     */
    Window_PartyChangeMember.prototype.makeItemList = function () {
        this._list = $gameParty.members().filter(a => {
            return !EXCLUDED_ACTORS.includes(a.actorId());
        });
        this._list.push(null);
        // console.log("party list----");
        // console.log(this._list);
    };

    /**
     * パーティーメンバーウィンドウが有効な間に下を押したときの処理
     */
    Window_PartyChangeMember.prototype.cursorDown = function () {
        const r = this._reserveMemberWindow;
        r.refresh();
        const row = Math.floor(this.index() / this.maxCols());
        const col = this.index() % this.maxCols();
        const rowMax = Math.floor((this.itemsCount() - 1) / this.maxCols());

        // いちばん下の行を選択中の場合は控えメンバーウィンドウに移る
        if (row === rowMax) {
            let destIndex = 0;
            if (r.itemsCount() > col) {
                destIndex = col;
            } else {
                destIndex = r.itemsCount() - 1;
            }
            this.deselect();
            this.deactivate();
            r.activate();
            r.forceSelect(destIndex);
            // console.log(`col: ${col} count: ${r.itemsCount()}`);
            // console.log(`destIndex: ${destIndex}`);
        }
    };

    //-----------------------------------------------------------------------------
    // Window_ReserveChangeMember
    //
    // The window for displaying reserve member on the party change screen.

    function Window_ReserveChangeMember() {
        this.initialize(...arguments);
    }

    Window_ReserveChangeMember.prototype = Object.create(Window_PartyChangeBase.prototype);
    Window_ReserveChangeMember.prototype.constructor = Window_ReserveChangeMember;

    /**
     * ウィンドウ初期化
     * @param {Rectangle} rect 
     */
    Window_ReserveChangeMember.prototype.initialize = function (rect) {
        Window_PartyChangeBase.prototype.initialize.call(this, rect);

        // Donut Machine 用特殊仕様
        this._dnmcActive = false;
        try {
            const test = new DataActor();
            // console.log(`DataActor?: ${typeof test}`);
            if (typeof test === "object") {
                this._dnmcActive = true;
            }
        } catch (e) {
            CSVN_base.log(">>>> " + this.constructor.name + " initialize");
            CSVN_base.log("Donut Machine not activated, do not mind.");
        }
    };

    /**
     * パーティーメンバーウィンドウの参照を持たせる
     * @param {Window_PartyChangeMember} partyMemberWindow 
     */
    Window_ReserveChangeMember.prototype.setPartyMemberWindow = function (partyMemberWindow) {
        this._partyMemberWindow = partyMemberWindow;
    };

    /**
     * 最大行数を返す
     * @returns number
     */
    Window_ReserveChangeMember.prototype.numVisibleRows = function () {
        const a = Math.floor($dataActors.length / this.maxCols()) + 1;
        const b = Math.floor(ACTORS_MAX_LENGTH / this.maxCols()) + 1;
        return Math.max(a, b);
    };

    /**
     * 最大項目数を返す
     * @returns number
     */
    Window_ReserveChangeMember.prototype.maxItems = function () {
        const a = this.possibleReservesCount();
        const b = ACTORS_MAX_LENGTH;
        return Math.min(a, b);
    };

    /**
     * 控えメンバーとしてありうる人数を返す
     * ※DNMC_randomActors.js対策
     * @returns number
     */
    Window_ReserveChangeMember.prototype.possibleReservesCount = function () {
        let result = 0;
        if (!this._dnmcActive) {
            result = $dataActors.length;
            // CSVN_base.log(`$dataActors.length = ${result}`);
        } else {
            if (!this.itemAt(0)) {
                result = 1;
            } else {
                result = $v.get(param.actorListVarId).toString().split(",").length + 1;
            }
            // CSVN_base.log(`actorList.length: ${result}`);
        }

        return result;
    };

    /**
     * 項目リスト作成
     */
    Window_ReserveChangeMember.prototype.makeItemList = function () {
        this._list = [];
        const reserves = $v.get(param.reserveMemberVarId).toString().split(",");

        for (const r of reserves) {
            if (r === "0") continue;
            if (!$dataActors[r]) continue;
            if (EXCLUDED_ACTORS.includes(r)) continue;
            this._list.push(new Game_Actor(r));
        }
        this._list.push(null);
        // console.log("reserve list----");
        // console.log(this._list);
        // console.log("reserve var----");
        // console.log(reserves);
    };

    /**
     * 控えメンバーウィンドウのいちばん下の行にいるときはそれ以上下にいかない
     * @returns void
     */
    Window_ReserveChangeMember.prototype.cursorDown = function () {
        const row = Math.floor(this.index() / this.maxCols());
        const rowMax = Math.floor((this.itemsCount() - 1) / this.maxCols());

        if (row === rowMax) {
            // いちばん下の行を選択中は動かない
            this.smoothSelect(this.index());
        } else {
            Window_Selectable.prototype.cursorDown.call(this, false);
        }
    };

    /**
     * 控えメンバーウィンドウ内で右を押した時の処理
     */
    Window_ReserveChangeMember.prototype.cursorRight = function () {
        if (this.itemsCount() - 1 === this.index()) {
            this.smoothSelect(this.index());
        } else {
            Window_Selectable.prototype.cursorRight.call(this, false);
        }
    };

    /**
     * 控えメンバーウィンドウが有効な間に上を押したときの処理
     */
    Window_ReserveChangeMember.prototype.cursorUp = function () {
        const p = this._partyMemberWindow;
        p.refresh();
        const row = Math.floor(this.index() / this.maxCols());
        const col = this.index() % this.maxCols();

        // いちばん上の行を選択中の場合はパーティーメンバーウィンドウに移る
        if (row === 0) {
            let destLine = Math.floor(p.itemsCount() / p.maxCols());
            if (p.itemsCount() % p.maxCols() === 0) destLine--;
            let itemsCountOnLastLine = p.itemsCount() % p.maxCols();
            if (itemsCountOnLastLine === 0) itemsCountOnLastLine += p.maxCols();
            const destCol = col > itemsCountOnLastLine ? itemsCountOnLastLine - 1 : col;
            const destIndex = destLine * p.maxCols() + col;
            this.deselect();
            this.deactivate();
            p.activate();
            p.forceSelect(destIndex);
            // console.log(`destLine: ${destLine}, icoll: ${itemsCountOnLastLine}, destCol: ${destCol}, destIndex: ${destIndex}`);
        } else {
            Window_Selectable.prototype.cursorUp.call(this, false);
        }
    };

    //-----------------------------------------------------------------------------
    // Window_ReserveMemberSortKey
    //
    // The window for displaying sort key on the party change screen.

    function Window_ReserveMemberSortKey() {
        this.initialize(...arguments);
    }

    Window_ReserveMemberSortKey.prototype = Object.create(Window_Base.prototype);
    Window_ReserveMemberSortKey.prototype.constructor = Window_ReserveMemberSortKey;

    /**
     * ソートキーウィンドウ初期化
     * @param {Rectangle} rect
     */
    Window_ReserveMemberSortKey.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._sortKey = $v.get(param.sortKeyVarId);
    };

    /**
     * ソートキーをひとつ前に進める
     */
    Window_ReserveMemberSortKey.prototype.moveSortKeyForward = function () {
        this._sortKey++;
        $v.set(param.sortKeyVarId, this._sortKey);
    };

    /**
     * ソートキーをひとつ後ろに戻す
     */
    Window_ReserveMemberSortKey.prototype.moveSortKeyBackward = function () {
        this._sortKey--;
        $v.set(param.sortKeyVarId, this._sortKey);
    };

    /**
     * ソートキー名の描画
     */
    Window_ReserveMemberSortKey.prototype.drawSortKey = function () {
        const keyIndex = $v.get(param.sortKeyVarId);
        const keyName = SORT_KEYS[keyIndex];
        this.drawText(keyName, 0, 0, this.width, "center");
    };

    /**
     * 現在のソートキーを描画
     */
    Window_ReserveMemberSortKey.prototype.refresh = function () {
        this.drawSortKey();
    };

    //-----------------------------------------------------------------------------
    // Window_XuidasStatus
    //
    // The window for displaying selected members status on the party change screen.

    function Window_XuidasStatus() {
        this.initialize(...arguments);
    }

    Window_XuidasStatus.prototype = Object.create(Window_Status.prototype);
    Window_XuidasStatus.prototype.constructor = Window_XuidasStatus;

    /**
     * ステータスウィンドウ初期化
     * @param {Rectangle} rect 
     */
    Window_XuidasStatus.prototype.initialize = function (rect) {
        Window_Status.prototype.initialize.call(this, rect);
        this._actor = null;
        this.refresh();
    };

    /**
     * ブロック1の描画
     */
    Window_XuidasStatus.prototype.drawBlock1 = function () {
        this.drawActorName(this._actor, 0, 0, this.width * 0.3);
        this.drawActorClass(this._actor, this.width * 0.3, 0, this.width * 0.3);
        this.drawActorNickname(this._actor, this.width * 0.6, 0, this.width * 0.4);
    };

    /**
     * ブロック2の描画
     */
    Window_XuidasStatus.prototype.drawBlock2 = function () {
        const y = this.lineHeight();
        this.drawActorFace(this._actor, 0, y);
        this.drawBasicInfo(this.width * 0.3, y);
        this.drawExpInfo(this.width * 0.6, y);
    };

    /**
     * 基本情報の描画
     * @param {number} x 
     * @param {number} y 
     */
    Window_XuidasStatus.prototype.drawBasicInfo = function (x, y) {
        const lh = this.lineHeight();
        this.drawActorLevel(this._actor, x, y + lh * 0);
        this.drawActorIcons(this._actor, x, y + lh * 1);
        this.placeBasicGauges(this._actor, x, y + lh * 2);
    };

    /**
     * 経験値情報の描画
     * @param {number} x 
     * @param {number} y 
     */
    Window_XuidasStatus.prototype.drawExpInfo = function (x, y) {
        const lh = this.lineHeight();
        const expTotal = TextManager.expTotal.format(TextManager.exp);
        const expNext = TextManager.expNext.format(TextManager.level);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(expTotal, x, y + lh * 0, this.width * 0.4);
        this.drawText(expNext, x, y + lh * 2, this.width * 0.4);
        this.resetTextColor();
        this.drawText(this.expTotalValue(), x, y + lh * 1, this.width * 0.3, "right");
        this.drawText(this.expNextValue(), x, y + lh * 3, this.width * 0.3, "right");
    };

    //-----------------------------------------------------------------------------
    // Window_XuidasStatusParams
    //
    // The window for displaying selected members params on the party change screen.

    function Window_XuidasStatusParams() {
        this.initialize(...arguments);
    }

    Window_XuidasStatusParams.prototype = Object.create(Window_StatusParams.prototype);
    Window_XuidasStatusParams.prototype.constructor = Window_XuidasStatusParams;

    /**
     * 最大項目数(MHP,MMPも入れる)
     * @returns number
     */
    Window_XuidasStatusParams.prototype.maxItems = function () {
        return 8;
    };

    //-----------------------------------------------------------------------------
    // Window_XuidasStatusEquips
    //
    // The window for displaying selected members equips on the party change screen.

    function Window_XuidasStatusEquip() {
        this.initialize(...arguments);
    }

    Window_XuidasStatusEquip.prototype = Object.create(Window_StatusEquip.prototype);
    Window_XuidasStatusEquip.prototype.constructor = Window_XuidasStatusEquip;

    //-----------------------------------------------------------------------------
    // Window_XuidasStatusTraits
    //
    // The window for displaying selected members traits on the party change screen.

    function Window_XuidasStatusTraits() {
        this.initialize(...arguments);
    }

    Window_XuidasStatusTraits.prototype = Object.create(Window_Base);
    Window_XuidasStatusTraits.prototype.constructor = Window_XuidasStatusTraits;

    Window_XuidasStatusTraits.prototype.initilize = function () {
        Window_Base.prototype.initialize.call(this);
    };

    //-----------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_nickname = Game_Actor.prototype.nickname;
    /**
     * undefinedなんて出ないようにする
     * @returns string
     */
    Game_Actor.prototype.nickname = function () {
        const nickname = _Game_Actor_nickname.call(this);
        return nickname ? nickname : "";
    };

})();