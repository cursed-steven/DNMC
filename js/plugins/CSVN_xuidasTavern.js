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
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const PARTY_MAX_LENGTH = 8;
    const ACTORS_MAX_LENGTH = param.actorsMaxLength;
    const MEMBERS_CANT_CHANGE = $v.get(param.membersCantChangeVarId);
    const LABEL_CHANGE_CMD = param.labelForChangeCmd;
    const MEMBERS_CANT_ELIMINATE = $v.get(param.membersCantEliminateVarId);
    const LABEL_ELIMINATE_CMD = param.labelForEliminateCmd;
    const LABEL_PARTY_LIST = param.labelForPartyList;
    const LABEL_RESERVE_LIST = param.labelForReserveList;
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

})();