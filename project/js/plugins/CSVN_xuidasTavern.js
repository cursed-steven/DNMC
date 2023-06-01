//=============================================================================
// RPG Maker MZ - CSVN_xuidasTavern
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/03/17 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc ×イーダの酒場。
 * @author cursed_steven
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
 * @param partyMaxSize
 * @text パーティー最大人数
 * @type number
 * @max 8
 * @min 1
 * @default 8
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
 * @param faceOrChar
 * @text 顔グラ or キャラ
 * @type select
 * @option 顔
 * @value 0
 * @option キャラ
 * @value 1
 * @default 0
 * 
 * @param charOffsetX
 * @text キャラグラの場合の表示位置補正(X)
 * @type number
 * @max 144
 * @min 0
 * @default 60
 * 
 * @param charOffsetY
 * @text キャラグラの場合の表示位置補正(Y)
 * @type number
 * @max 144
 * @min 0
 * @default 60
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
 * @param setSkillVarIndex
 * @text セット中スキル変数開始
 * @desc この変数の次から16変数に各部アクターのセット中スキルを入れる
 * @type variable
 * 
 * @param labelForEliminateMode
 * @text 除籍コマンドラベル
 * @type string
 * @default 除籍
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
 * @param topSideOffset
 * @text 上側の空きスペースの幅
 * @desc デフォルト(816x624)の場合1以上にすると相当せまいはずです
 * @type number
 * @default 0
 * 
 * @param rightSideOffset
 * @text 右側の空きスペースの幅
 * @desc デフォルト(816x624)の場合1以上にすると相当せまいはずです
 * @type number
 * @default 0
 * 
 * @param showMhpMmp
 * @text MHP/MMP表示有無
 * @type boolean
 * @default false
 * 
 * @param showEquipSlotName
 * @text 装備スロット名表示有無
 * @type boolean
 * @default false
 * 
 * @command disableChange
 * @text 入替禁止メンバー追加
 * 
 * @arg actorId
 * @text 入替を禁止するアクター
 * @desc 式も可
 * @type string
 * 
 * @command enableChange
 * @text 入替禁止メンバー除去
 * 
 * @arg actorId
 * @text 入替禁止を解除するアクター
 * @desc 式も可
 * @type string
 * 
 * @command disableEliminate
 * @text 除籍禁止メンバー追加
 * 
 * @arg actorId
 * @text 除籍を禁止するアクター
 * @desc 式も可
 * @type string
 * 
 * @command enableEliminate
 * @text 除籍禁止メンバー除去
 * 
 * @arg actorId
 * @text 除籍禁止を解除するアクター
 * @desc 式も可
 * @type string
 * 
 * @command changeStart
 * @text 入替シーン開始
 * 
 * @command eliminateStart
 * @text 除籍シーン開始
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const EXCLUDED_ACTORS = param.excludedActors ? param.excludedActors : [];
    const CHAR_WIDTH = param.charWidth;
    const CHAR_HEIGHT = param.charHeight;
    const FACE_OR_CHAR = param.faceOrChar;
    const PARTY_MAX_LENGTH = param.partyMaxSize;
    const ACTORS_MAX_LENGTH = param.actorsMaxLength;
    const LABEL_YOFFSET = 4;
    const LABEL_CHANGE_MODE = param.labelForChangeMode;
    const LABEL_ELIMINATE_MODE = param.labelForEliminateMode;
    const LABEL_ELIMINATE_CONFIRM = "ほんとうに%1を%2しますか？";
    const LABEL_ELIMINATED = "%1を%2しました。";
    const LABEL_PARTY_LIST = param.labelForPartyList;
    const LABEL_RESERVE_LIST = param.labelForReserveList;
    const TOPSIDE_OFFSET = param.topSideOffset;
    const RIGHTSIDE_OFFSET = param.rightSideOffset;
    const SHOW_MHP_MMP = param.showMhpMmp;
    const SHOW_EQUIP_SLOT_NAME = param.showEquipSlotName;
    let membersCantChange = [];
    const cantChangeName = "【入替禁止】";
    const cantEliminateName = "【除籍禁止】";
    let membersCantEliminate = [];

    /**
     * 入れ替え禁止メンバー追加
     */
    PluginManagerEx.registerCommand(script, "disableChange", args => {
        addToCantChange(eval(args.actorId));
    });

    /**
     * 入れ替え禁止メンバー除去(=入れ替えできるようになる)
     */
    PluginManagerEx.registerCommand(script, "enableChange", args => {
        removeFromCantChange(eval(args.actorId));
    });

    /**
     * 除籍禁止メンバーの追加
     */
    PluginManagerEx.registerCommand(script, "disableEliminate", args => {
        addToCantEliminate(eval(args.actorId));
    });

    /**
     * 除籍禁止メンバーの除去(=除籍できるようになる)
     */
    PluginManagerEx.registerCommand(script, "enableEliminate", args => {
        removeFromCantEliminate(eval(args.actorId));
    });

    /**
     * 入替シーン開始
     */
    PluginManagerEx.registerCommand(script, "changeStart", args => {
        SceneManager.push(Scene_PartyChange);
    });

    /**
     * 除籍シーン開始
     */
    PluginManagerEx.registerCommand(script, "eliminateStart", args => {
        SceneManager.push(Scene_PartyEliminate);
    });

    /**
     * 入替禁止追加実処理
     * @param {number} actorId 
     * @returns void
     */
    function addToCantChange(actorId) {
        if (!actorId) return;
        if (cantChange(actorId)) return;

        membersCantChange = $v.get(param.membersCantChangeVarId).toString().split(",");
        membersCantChange.push(actorId.toString());
        $v.set(param.membersCantChangeVarId, membersCantChange.join(","));
    }

    /**
     * 入替禁止解除実処理
     * @param {number} actorId 
     */
    function removeFromCantChange(actorId) {
        membersCantChange = $v.get(param.membersCantChangeVarId).toString().split(",");
        membersCantChange = membersCantChange.filter(m => m != actorId);
        $v.set(param.membersCantChangeVarId, membersCantChange.join(","));
    }

    /**
     * 指定したアクターが入替禁止かどうかを返す
     * @param {number} actorId 
     * @returns boolean
     */
    function cantChange(actorId) {
        if (!actorId) return false;
        return membersCantChange.toString().split(",").includes(actorId.toString());
    }

    /**
     * 除籍禁止追加実処理
     * @param {number} actorId 
     * @returns void
     */
    function addToCantEliminate(actorId) {
        if (!actorId) return;
        if (cantEliminate(actorId)) return;

        membersCantEliminate = $v.get(param.membersCantEliminateVarId).toString().split(",");
        membersCantEliminate.push(actorId.toString());
        $v.set(param.membersCantEliminateVarId, membersCantEliminate.join(","));
    }

    /**
     * 除籍禁止解除実処理
     * @param {number} actorId 
     */
    function removeFromCantEliminate(actorId) {
        membersCantEliminate = $v.get(param.membersCantEliminateVarId).toString().split(",");
        membersCantEliminate = membersCantEliminate.filter(m => m != actorId);
        $v.set(param.membersCantEliminateVarId, membersCantEliminate.join(","));
    }

    /**
     * 指定したアクターが除籍禁止かどうかを返す
     * @param {number} actorId 
     * @returns boolean
     */
    function cantEliminate(actorId) {
        if (!actorId) return false;
        return membersCantEliminate.toString().split(",").includes(actorId.toString());
    }

    /**
     * セット中スキルの書き込み先変数番号を取得する
     * ※DNMC_sceneOperation.js にある同名関数と同じ内容にしておくこと
     */
    function getVarNumForRegisterSkill(actorId) { 
        const ssvi = parseInt(param.setSkillVarIndex);
        const MAX_ACTORS_COUNT = 16;
        let vi = ssvi + 1;
        let actorIdInVar = 0;
        let viFound = false;

        // 新式でまずさがす
        for (let i = 0; i < MAX_ACTORS_COUNT; i++) {
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
        if (vi > ssvi + MAX_ACTORS_COUNT) {
            vi = ssvi + 1;
            while ($v.get(vi) !== 0) {
                vi++;
            }
        }
        console.log(`vi [old]: ${vi}`);

        return vi;
    };

    //-----------------------------------------------------------------------------
    // Scene_PartyChange
    //
    // The scene class of the party change screen.

    function Scene_PartyChange() {
        this.initialize(...arguments);
    }

    Scene_PartyChange.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_PartyChange.prototype.constructor = Scene_PartyChange;

    const _Scene_Map_createMapHUD = Scene_Map.prototype.createMapHUD;
    const _Scene_Map_createButtonGuide = Scene_Map.prototype.createButtonGuide;
    Scene_PartyChange.prototype.mapHUDRect = Scene_Map.prototype.mapHUDRect;
    Scene_PartyChange.prototype.HUDHeight = Scene_Map.prototype.HUDHeight;
    Scene_PartyChange.prototype.buttonGuideRect = Scene_Map.prototype.buttonGuideRect;
    Scene_PartyChange.prototype.createQuestHUD = Scene_Map.prototype.createQuestHUD;
    Scene_PartyChange.prototype.questHUDRect = Scene_Map.prototype.questHUDRect;

    /**
     * 入れ替えシーン作成
     */
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

        const p = this._partyMemberWindow;
        const r = this._reserveMemberWindow;
        p.setReserveMemberWindow(r);
        r.setPartyMemberWindow(p);

        p.setSortKeyWindow(this._sortKeyWindow);
        p.setStatusWindow(this._statusWindow);
        p.setStatusParamsWindow(this._statusParamsWindow);
        p.setStatusEquipWindow(this._statusEquipWindow);
        r.setSortKeyWindow(this._sortKeyWindow);
        r.setStatusWindow(this._statusWindow);
        r.setStatusParamsWindow(this._statusParamsWindow);
        r.setStatusEquipWindow(this._statusEquipWindow);

        p.activate();
        r.deactivate();

        const actor = this._partyMemberWindow.itemAt(0);
        this._statusWindow.setActor(actor);
        this._statusParamsWindow.setActor(actor);
        this._statusEquipWindow.setActor(actor);
        this._statusWindow.refresh();
        this._statusParamsWindow.refresh();
        this._statusEquipWindow.refresh();

        p.setMode("change");
        r.setMode("change");

        if (CSVN_base.isDNMCActive()) {
            this._buttonGuide.refresh();
        }
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
        this.createStatusParamsWindow();
        this.createStatusEquipWindow();
        this.createSortKeyWindow();

        if (CSVN_base.isDNMCActive()) {
            _Scene_Map_createMapHUD.call(this);
            _Scene_Map_createButtonGuide.call(this);
            this.createQuestHUD();
        }
    };

    /**
     * シーン更新
     */
    Scene_PartyChange.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (CSVN_base.isDNMCActive()) {
            this._questHUD.show();
            this._questHUD.refresh();
        }
    };

    /**
     * モードウィンドウ作成
     */
    Scene_PartyChange.prototype.createModeWindow = function () {
        const rect = this.modeWindowRect();
        this._modeWindow = new Window_Base(rect);
        this._modeWindow.changeTextColor(ColorManager.systemColor());
        this._modeWindow.drawText(LABEL_CHANGE_MODE, 0, LABEL_YOFFSET, this._modeWindow.width, "center");
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
        const ww = Graphics.boxWidth - RIGHTSIDE_OFFSET;
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
        this._partyMemberWindow.setHandler("pagedown", this.moveSortKeyForward.bind(this, "party"));
        this._partyMemberWindow.setHandler("pageup", this.moveSortKeyBackward.bind(this, "party"));
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
        console.group("Scene_PartyChange::onPartyOk");

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
                if (!p.item()) {
                    // 選択したメンバーが空欄だった
                    SoundManager.playBuzzer();
                    console.warn("cant swap empty.");
                } else if (cantChange(p.item().actorId())) {
                    // 選択したメンバーが入替禁止だった
                    SoundManager.playBuzzer();
                    console.warn("that member cant change.");
                } else {
                    if (!p.markedItem() || !p.item()) {
                        SoundManager.playBuzzer();
                        console.warn("cant swap empty.");
                    } else {
                        $gameParty.swapOrder(a, b);
                        console.log(`party swapped: ${a}, ${b}`);
                    }
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
                        if (cantChange(p2r.actorId())) {
                            // 選んだパーティーメンバーが入替禁止だった
                            SoundManager.playBuzzer();
                            console.warn("that member cant change.");
                        } else {
                            this.partyReserveExchange(p2r.actorId(), r2p.actorId());
                        }
                    } else {
                        // パーティーメンバーからは空欄を選んだ(控えからの単純加入)
                        // 人数超過がないか確認
                        if ($gameParty.members().length + 1 > PARTY_MAX_LENGTH) {
                            SoundManager.playBuzzer();
                            console.warn("too many party members.");
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
                            console.warn("1 member needed at least.");
                        } else if (cantChange(p2r.actorId())) {
                            // 選んだのが入替禁止メンバーだった
                            SoundManager.playBuzzer();
                            console.warn("that member cant change.");
                        } else {
                            this.moveToReserve(p2r.actorId());
                        }
                    } else {
                        // どちらも空欄を選んだ(=buzz)
                        SoundManager.playBuzzer();
                        console.warn("both empty.");
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

        console.groupEnd("Scene_PartyChange::onPartyOk");
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
        const ww = CHAR_WIDTH * 4 + 8 * 7;
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
        this._reserveMemberWindow.setHandler("pagedown", this.moveSortKeyForward.bind(this));
        this._reserveMemberWindow.setHandler("pageup", this.moveSortKeyBackward.bind(this));
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
        console.group("Scene_PartyChange::onReserveOK");

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
                    console.warn("cant swap empty.");
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
                            console.warn(); (`1 member needed at least.`);
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
                            console.warn("too many party members.");
                        } else {
                            // パーティーに移動
                            this.moveToParty(r2p.actorId());
                        }
                    } else {
                        // どちらも空欄を選んだ(=buzz)
                        SoundManager.playBuzzer();
                        console.warn("both empty.");
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

        console.groupEnd("Scene_PartyChange::onReserveOK");
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
     * ソートキーをひとつ進める
     */
    Scene_PartyChange.prototype.moveSortKeyForward = function () {
        this._reserveMemberWindow.moveSortKeyForward();
        this._partyMemberWindow.deactivate();
        this._reserveMemberWindow.activate();
        this._reserveMemberWindow.forceSelect(0);
    };

    /**
     * ソートキーをひとつ戻す
     */
    Scene_PartyChange.prototype.moveSortKeyBackward = function () {
        this._reserveMemberWindow.moveSortKeyBackward();
        this._partyMemberWindow.deactivate();
        this._reserveMemberWindow.activate();
        this._reserveMemberWindow.forceSelect(0);
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
        console.log(`reservers swapped: ${a}, ${b}`);

        this._sortKeyWindow.setSortKeyAny();
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
        console.log(`p-out: ${actorId}`);
    };

    /**
     * 控えからパーティーに指定アクターを移動
     * @param {number} actorId 
     */
    Scene_PartyChange.prototype.moveToParty = function (actorId) {
        this.removeFromReserve(actorId);
        $gameParty.addActor(parseInt(actorId));
        console.log(`p-in: ${actorId}`);
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
        const wx = prect.width;
        const wy = mrect.y + mrect.height;
        const ww = (Graphics.boxWidth - wx) - RIGHTSIDE_OFFSET;
        const wh = this.calcWindowHeight(5, true);
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
        const srect = this.statusWindowRect();
        const wx = srect.x;
        const wy = srect.y + srect.height;
        const ww = srect.width * 0.4;
        const wh = Graphics.boxHeight - (srect.y + srect.height);
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
        const srect = this.statusWindowRect();
        const prect = this.statusParamsWindowRect();
        const wx = prect.x + prect.width;
        const wy = prect.y;
        const ww = srect.width * 0.6;
        const wh = prect.height;
        return new Rectangle(wx, wy, ww, wh);
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
            return actorId && r !== 0 && r !== actorId.toString();
        });
        if (removed.length === 0) {
            $v.set(param.reserveMemberVarId, 0);
        } else {
            $v.set(param.reserveMemberVarId, removed.join(","));
        }
    };

    //-----------------------------------------------------------------------------
    // Scene_PartyEliminate
    //
    // The scene class of the party member eliminate screen.

    function Scene_PartyEliminate() {
        this.initialize(...arguments);
    }

    Scene_PartyEliminate.prototype = Object.create(Scene_PartyChange.prototype);
    Scene_PartyEliminate.prototype.constructor = Scene_PartyEliminate;

    /**
     * 除籍シーン初期化
     */
    Scene_PartyEliminate.prototype.initialize = function () {
        Scene_PartyChange.prototype.initialize.call(this);
        this._timer = 0;
    };

    /**
     * パーティ側、控え側のウィンドウモードを除籍用にする
     */
    Scene_PartyEliminate.prototype.create = function () {
        Scene_PartyChange.prototype.create.call(this);
        this._partyMemberWindow.setMode("eliminate");
        this._reserveMemberWindow.setMode("eliminate");
    };

    /**
     * 除籍完了表示の場合はフレームカウント、カウント0で通常表示
     */
    Scene_PartyEliminate.prototype.update = function () {
        Scene_PartyChange.prototype.update.call(this);
        if (this._timer > 0) {
            this._timer--;
        } else if (this._timer === 0) {
            this._modeWindow.drawNormalMode();
        }

        if (CSVN_base.isDNMCActive()) {
            this._questHUD.show();
            this._questHUD.refresh();
        }
    };

    /**
     * モードウィンドウ作成
     */
    Scene_PartyEliminate.prototype.createModeWindow = function () {
        const rect = this.modeWindowRect();
        this._modeWindow = new Window_EliminateMode(rect);
        this.addWindow(this._modeWindow);
    };

    /**
     * パーティー側で決定を押したときの処理
     */
    Scene_PartyEliminate.prototype.onPartyOk = function () {
        console.group("Scene_PartyEliminate::onPartyOk");

        const p = this._partyMemberWindow;
        if (p.isMarked()) {
            // すでにマークされていてメッセージも出ている
            this.eliminate(p.markedItem().actorId());
            this._modeWindow.drawEliminated(p.markedItem());
            this.setTimer(300);
            p.unmark();
        } else if (!p.item()) {
            // 選択したメンバーが空欄だった            
            SoundManager.playBuzzer();
            console.warn("empty cant eliminate.");
        } else if (cantEliminate(p.item().actorId())) {
            // 選択したメンバーが除籍禁止だった            
            SoundManager.playBuzzer();
            console.warn("that member cant eliminate.");
        } else {
            // マークして確認メッセージを出す
            this._modeWindow.drawConfirmMode(p.item());
            this.setTimer(-1);
            p.mark();
        }
        p.activate();
        p.refresh();

        console.groupEnd("Scene_PartyEliminate::onPartyOk");
    };

    /**
     * パーティー側でキャンセルした時の処理
     */
    Scene_PartyEliminate.prototype.onPartyCancel = function () {
        const p = this._partyMemberWindow;
        if (p.isMarked()) {
            this.setTimer(0);
            p.unmark();
            p.activate();
            p.refresh();
        } else {
            this.popScene();
        }
    };

    /**
     * 控え側で決定したときの処理
     */
    Scene_PartyEliminate.prototype.onReserveOk = function () {
        console.group("Scene_PartyEliminate::onReserveOk");

        const r = this._reserveMemberWindow;
        if (r.isMarked()) {
            // すでにマークされてメッセージも出ている
            this._modeWindow.drawEliminated(r.markedItem());
            this.eliminate(r.markedItem().actorId());
            this.setTimer(300);
            r.unmark();
        } else if (!r.item()) {
            // 選択したメンバーが空欄だった            
            SoundManager.playBuzzer();
            console.warn("empty cant eliminate.");
        } else if (cantEliminate(r.item().actorId())) {
            // 選択したメンバーが除籍禁止だった
            SoundManager.playBuzzer();
            console.warn("that member cant eliminate.");
        } else {
            // マークして確認メッセージを出す
            this._modeWindow.drawConfirmMode(r.item());
            this.setTimer(-1);
            r.mark();
        }
        r.activate();
        r.refresh();

        console.groupEnd("Scene_PartyEliminate::onReserveOk");
    };

    /**
     * 控え側でキャンセルした時の処理
     */
    Scene_PartyEliminate.prototype.onReserveCancel = function () {
        const r = this._reserveMemberWindow;
        if (r.isMarked()) {
            this.setTimer(0);
            r.unmark();
            r.activate();
            r.refresh();
        } else {
            this.popScene();
        }
    };

    /**
     * 除籍(=パーティーからも控えからもいなくなる)
     * @param {number} actorId 
     */
    Scene_PartyEliminate.prototype.eliminate = function (actorId) {
        $gameParty.removeActor(actorId);
        this.removeFromReserve(actorId);

        // 使用可能アクターからも削除
        const deleted = $v.get(param.actorListVarId).split(',').filter((a) => {
            return a != 0 && a != actorId
        });
        $v.set(param.actorListVarId, deleted.join(','));

        // セット中スキルを削除
        const setSkillVarId = getVarNumForRegisterSkill(actorId);
        console.log(`setSKillVarId: ${setSkillVarId}`);
        $v.set(setSkillVarId, 0);
    };

    /**
     * 除籍完了表示タイマーのセット(フレーム単位)
     * @param {number} duration 
     */
    Scene_PartyEliminate.prototype.setTimer = function (duration) {
        this._timer = duration;
    };

    //-----------------------------------------------------------------------------
    // Window_EliminateMode
    //
    // The window class for displaying party arrange modes.

    function Window_EliminateMode() {
        this.initialize(...arguments);
    }

    Window_EliminateMode.prototype = Object.create(Window_Base.prototype);
    Window_EliminateMode.prototype.constructor = Window_EliminateMode;

    /**
     * モードウィンドウ初期化
     * @param {Rectangle} rect 
     */
    Window_EliminateMode.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.drawNormalMode();
    };

    /**
     * 選択前状態の描画
     */
    Window_EliminateMode.prototype.drawNormalMode = function () {
        this.contents.clear();
        this.changeTextColor(ColorManager.deathColor());
        this.drawText(LABEL_ELIMINATE_MODE, 0, LABEL_YOFFSET, this.width, "center");
        this.resetTextColor();
    };

    /**
     * 選択中で除籍実行確認中の描画
     * @param {Game_Actor} actor 
     */
    Window_EliminateMode.prototype.drawConfirmMode = function (actor) {
        this.contents.clear();
        this.contents.fontSize = $gameSystem.mainFontSize() * 1.4;
        this.changeTextColor(ColorManager.deathColor());
        this.drawText(
            LABEL_ELIMINATE_CONFIRM.format(actor.name(), LABEL_ELIMINATE_MODE),
            0,
            LABEL_YOFFSET,
            this.width,
            "center"
        );
        this.resetTextColor();
        this.contents.fontSize = $gameSystem.mainFontSize();
    };

    /**
     * 除籍完了表示モード
     * @param {Game_Actor} actor 
     */
    Window_EliminateMode.prototype.drawEliminated = function (actor) {
        this.contents.clear();
        this.changeTextColor(ColorManager.deathColor());
        this.drawText(
            LABEL_ELIMINATED.format(actor.name(), LABEL_ELIMINATE_MODE),
            0,
            LABEL_YOFFSET,
            this.width,
            "center"
        );
        this.resetTextColor();
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
     * モード設定
     * @param {string} mode 
     */
    Window_PartyChangeBase.prototype.setMode = function (mode) {
        this._mode = mode;
    };

    /**
     * ソートキーウィンドウ(の参照)を保持する
     * @param {Window_ReserveMemberSortKey} sortKeyWindow 
     */
    Window_PartyChangeBase.prototype.setSortKeyWindow = function (sortKeyWindow) {
        this._sortKeyWindow = sortKeyWindow;
    };

    /**
     * ステータスウィンドウ(の参照)を保持する
     * @param {Window_XuidasStatus} statusWindow 
     */
    Window_PartyChangeBase.prototype.setStatusWindow = function (statusWindow) {
        this._statusWindow = statusWindow;
    }

    /**
     * ステータスパラメータウィンドウ(の参照)を保持する
     * @param {Window_XuidasStatusParams} statusParamsWindow 
     */
    Window_PartyChangeBase.prototype.setStatusParamsWindow = function (statusParamsWindow) {
        this._statusParamsWindow = statusParamsWindow;
    };

    /**
     * ステータス装備ウィンドウ(の参照)を保持する
     * @param {Window_XuidasStatusEquip} statusEquipWindow 
     */
    Window_PartyChangeBase.prototype.setStatusEquipWindow = function (statusEquipWindow) {
        this._statusEquipWindow = statusEquipWindow;
    };

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
            let actorName = actor.name();
            if (SceneManager.isCurrentScene(Scene_PartyChange)) {
                if (cantChange(actor.actorId())) {
                    this.changeTextColor(ColorManager.systemColor());
                    actorName = cantChangeName;
                }
            } else if (SceneManager.isCurrentScene(Scene_PartyEliminate)) {
                if (cantEliminate(actor.actorId())) {
                    this.changeTextColor(ColorManager.deathColor());
                    actorName = cantEliminateName;
                }
            }
            this.drawText(actorName, rect.x, rect.y + CHAR_HEIGHT - fontSize, CHAR_WIDTH, "center");
            this.contents.fontSize = $gameSystem.mainFontSize();
            this.resetTextColor();
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
        // console.log(`${this.constructor.name} refreshed.`);
    };

    const _Window_Selectable_select = Window_Selectable.prototype.select;
    /**
     * アクターを選択するたびにステータスウィンドウの描画を更新
     * @param {number} index 
     */
    Window_PartyChangeBase.prototype.select = function (index) {
        this.refresh();
        if (this._statusWindow) {
            this._statusWindow.setActor(this.itemAt(index));
            this._statusWindow.refresh();
        }
        if (this._statusParamsWindow) {
            this._statusParamsWindow.setActor(this.itemAt(index));
            this._statusParamsWindow.refresh();
        }
        if (this._statusEquipWindow) {
            this._statusEquipWindow.setActor(this.itemAt(index));
            this._statusEquipWindow.refresh();
        }
        _Window_Selectable_select.call(this, index);
    };

    const _Window_Selectable_isCursorMovable = Window_Selectable.prototype.isCursorMovable;
    /**
     * 除籍モードで選択中は動けなくする
     * @returns boolean
     */
    Window_PartyChangeBase.prototype.isCursorMovable = function () {
        // console.log(`window: ${this.constructor.name}, mode: ${this._mode}, marked: ${this.isMarked()}`);
        if (this._mode === "eliminate" && this.isMarked()) {
            return false;
        } else {
            return _Window_Selectable_isCursorMovable.call(this);
        }
    };

    /**
     * 項目を選択中の状態にする
     */
    Window_PartyChangeBase.prototype.mark = function () {
        this._marked = this.index();
        console.log(`${this.constructor.name} marked: ${this.index()}`);
        if (this.markedItem()) {
            this.drawItem(this.index(), true);
            this.refresh()
        }
    };

    /**
     * 項目を選択されていない状態にする
     */
    Window_PartyChangeBase.prototype.unmark = function () {
        console.log(`${this.constructor.name} unmarked`);
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

    /**
     * ソートキーを昇順に1つ変更
     */
    Window_PartyChangeBase.prototype.moveSortKeyForward = function () {
        this._sortKeyWindow.moveSortKeyForward();
        this.sortByCurrentKey();
    };

    /**
     * ソートキーを降順に1つ変更
     */
    Window_PartyChangeBase.prototype.moveSortKeyBackward = function () {
        this._sortKeyWindow.moveSortKeyBackward();
        this.sortByCurrentKey();
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
        return $gameParty.members().length + 1;
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
            if (col % r.maxCols() > r.itemsCount() - 1) {
                // 真下がない場合は次の行の末尾
                destIndex = r.itemsCount() % r.maxCols() - 1;
            } else {
                // 真下があるなら真下
                destIndex = col;
            }
            this.deselect();
            this.deactivate();
            r.activate();
            r.forceSelect(destIndex);
            // console.log(`col: ${col} count: ${r.itemsCount()}`);
            // console.log(`destIndex: ${destIndex}`);
        } else {
            Window_Selectable.prototype.cursorDown.call(this);
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
        this._dnmcActive = CSVN_base.isDNMCActive();
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
            // console.log(`$dataActors.length = ${result}`);
        } else {
            if (!this.itemAt(0)) {
                result = 1;
            } else {
                result = $v.get(param.actorListVarId).toString().split(",").length + 1;
            }
            // console.log(`actorList.length: ${result}`);
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
            this._list.push($gameActors.actor(r));
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
            this.reselect();
        } else {
            Window_Selectable.prototype.cursorDown.call(this, false);
        }
    };

    /**
     * 控えメンバーウィンドウ内で右を押した時の処理
     */
    Window_ReserveChangeMember.prototype.cursorRight = function () {
        if (this.itemsCount() - 1 === this.index()) {
            this.reselect();
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
            const destIndex = destLine * p.maxCols() + destCol;
            this.deselect();
            this.deactivate();
            p.activate();
            p.forceSelect(destIndex);
            // console.log(`destLine: ${destLine}, icoll: ${itemsCountOnLastLine}, destCol: ${destCol}, destIndex: ${destIndex}`);
        } else {
            Window_Selectable.prototype.cursorUp.call(this, false);
        }
    };

    /**
     * ソート実行
     */
    Window_ReserveChangeMember.prototype.sortByCurrentKey = function () {
        const sortKeyParamName = this.detailedSortKey();
        const filtered = this._list.filter(i => i);

        let sorted = filtered.sort((a, b) => {
            // console.log(`${sortKeyParamName} a:${a[sortKeyParamName]} b:${b[sortKeyParamName]}`);
            return b[sortKeyParamName] - a[sortKeyParamName];
        });
        sorted.push(null);
        this._list = sorted;
        const sortedIds = sorted.reduce((ids, actor) => {
            if (actor) {
                ids.push(actor.actorId());
            }
            return ids;
        }, []);
        $v.set(param.reserveMemberVarId, sortedIds.join(","));
        this.refresh();
    };

    /**
     * 設定中のソートキーに対応する内部プロパティ名を返す
     * @param {number} sortKey 
     * @returns string
     */
    Window_PartyChangeBase.prototype.detailedSortKey = function () {
        return this._sortKeyWindow.getSortKeyParamNames()[this._sortKeyWindow.getSortKey()];
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
        const descending1 = "(高い順)";
        const descending2 = "(降順)";
        this._sortKeys = [
            TextManager.param(0) + descending1,
            TextManager.param(1) + descending1,
            TextManager.param(2) + descending1,
            TextManager.param(3) + descending1,
            TextManager.param(4) + descending1,
            TextManager.param(5) + descending1,
            TextManager.param(6) + descending1,
            TextManager.param(7) + descending1,
            "ID" + descending2,
            param.labelForClass + descending2,
            param.labelForLevel + descending1,
            "任意"
        ];
        this._sortKeyParamNames = [
            PARAM_NAMES[0],
            PARAM_NAMES[1],
            PARAM_NAMES[2],
            PARAM_NAMES[3],
            PARAM_NAMES[4],
            PARAM_NAMES[5],
            PARAM_NAMES[6],
            PARAM_NAMES[7],
            "_actorId",
            "_classId",
            "_level",
            ""
        ];
        this._sortKey = 0;
        this.refresh();
    };

    /**
     * ソートキーをひとつ前に進める
     */
    Window_ReserveMemberSortKey.prototype.moveSortKeyForward = function () {
        this._sortKey++;
        this._sortKey = this._sortKey % this._sortKeys.length;

        $v.set(param.sortKeyVarId, this._sortKey);
        this.refresh();
    };

    /**
     * ソートキーをひとつ後ろに戻す
     */
    Window_ReserveMemberSortKey.prototype.moveSortKeyBackward = function () {
        this._sortKey--;
        if (this._sortKey < 0) this._sortKey = this._sortKeys.length - 1;

        $v.set(param.sortKeyVarId, this._sortKey);
        this.refresh();
    };

    /**
     * ソートキーを「任意」にセットする
     * ※最後に「任意」をおいておく前提
     */
    Window_ReserveMemberSortKey.prototype.setSortKeyAny = function () {
        this._sortKey = this._sortKeys.length - 1;
        $v.set(param.sortKeyVarId, this._sortKey);
        this.refresh();
    };

    /**
     * ソートキー名の描画
     */
    Window_ReserveMemberSortKey.prototype.drawSortKey = function () {
        this.contents.clear();
        const keyIndex = $v.get(param.sortKeyVarId);
        const keyName = this._sortKeys[keyIndex];
        const xOffset = 14;
        const yOffset = 6;
        this.drawText(keyName, -xOffset, yOffset, this.width, "center");
    };

    /**
     * 現在のソートキーを描画
     */
    Window_ReserveMemberSortKey.prototype.refresh = function () {
        this.drawSortKey();
    };

    /**
     * 設定中のソートキーを返す
     * @returns number
     */
    Window_ReserveMemberSortKey.prototype.getSortKey = function () {
        return this._sortKey;
    };

    /**
     * 設定可能なソートキーに対応する内部プロパティ名リストを返す
     * @returns string[]
     */
    Window_ReserveMemberSortKey.prototype.getSortKeyParamNames = function () {
        return this._sortKeyParamNames;
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
        switch (FACE_OR_CHAR) {
            case 0:
                this.drawActorFace(this._actor, 0, y);
                break;
            case 1:
                this.drawActorCharacter(this._actor, 0, y);
                break;
        }
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

    /**
     * アクターキャラクターの描画
     * @param {Game_Actor} actor 
     * @param {number} x 
     * @param {number} y 
     */
    Window_XuidasStatus.prototype.drawActorCharacter = function (actor, x, y) {
        if (actor) {
            this.drawCharacter(
                actor.characterName(),
                actor.characterIndex(),
                x + CHAR_WIDTH / 2 + param.charOffsetX,
                y + CHAR_HEIGHT + param.charOffsetY
            );
        }
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
        return SHOW_MHP_MMP ? 8 : 6;
    };

    /**
     * 行高は気少し詰める
     * @returns number
     */
    Window_XuidasStatusParams.prototype.itemHeight = function () {
        return this.lineHeight() * 0.9;
    };

    /**
     * 各パラメータの描画
     * @param {number} index 
     */
    Window_XuidasStatusParams.prototype.drawItem = function (index) {
        if (!this._actor) return;

        const rect = this.itemLineRect(index);
        let paramId = 0;
        if (!SHOW_MHP_MMP) {
            paramId = index + 2;
            if (paramId > 7) return;
        } else {
            paramId = index;
        }

        const name = TextManager.param(paramId);
        const value = this._actor[PARAM_NAMES[paramId]];  // paramでとれないことがある

        this.changeTextColor(ColorManager.systemColor());
        this.drawText(name, rect.x, rect.y, this.width * 0.8 - this.itemPadding());

        this.resetTextColor();
        this.drawText(value, rect.x, rect.y, this.width * 0.8 - this.itemPadding(), "right");
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

    /**
     * 装備名描画
     * @param {number} index 
     */
    Window_XuidasStatusEquip.prototype.drawItem = function (index) {
        const rect = this.itemLineRect(index);
        const equips = this._actor.equips();
        const item = equips[index];
        const slotName = this.actorSlotName(this._actor, index);
        const xOffset = 20;

        // console.log(typeof SHOW_EQUIP_SLOT_NAME);
        // console.log(SHOW_EQUIP_SLOT_NAME);
        if (SHOW_EQUIP_SLOT_NAME === "true") {
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(slotName, rect.x - xOffset, rect.y, rect.width * 0.45, rect.height);
            this.drawItemName(item, rect.x - xOffset + rect.width * 0.45, rect.y, rect.width * 0.55);
        } else {
            this.drawItemName(item, rect.x, rect.y, rect.width);
        }
    }

    //-----------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_nickname = Game_Actor.prototype.nickname;
    /**
     * undefinedなんて出ないようにする、入替禁止/除籍禁止を表示する
     * @returns string
     */
    Game_Actor.prototype.nickname = function () {
        let nickname = _Game_Actor_nickname.call(this);

        if (SceneManager.isCurrentScene(Scene_PartyChange)) {
            if (cantChange(this.actorId())) nickname = cantChangeName;
        } else if (SceneManager.isCurrentScene(Scene_PartyEliminate)) {
            if (cantEliminate(this.actorId())) nickname = cantEliminateName;
        }
        return nickname ? nickname : "";
    };

})();