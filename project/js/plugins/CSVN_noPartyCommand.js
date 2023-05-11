//=============================================================================
// RPG Maker MZ - CSVN_noPartyCommand.js
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/05/12 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 戦闘開始時も含めて、戦闘中パーティーコマンドが一切出ないようにします。
 * @author cursed_steven
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_noPartyCommand.js
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // BattleManager

    const _BattleManager_initMembers = BattleManager.initMembers;
    /**
     * パーティーコマンドは常に「不要」
     */
    BattleManager.initMembers = function () { 
        _BattleManager_initMembers.call(this);
        this._tpbNeedsPartyCommand = false;
    };

    const _BattleManager_startActorInput = BattleManager.startActorInput;
    /**
     * アクターがみつからなかった場合、チャージ済の誰かをひっぱる
     */
    BattleManager.startActorInput = function () {
        _BattleManager_startActorInput.call(this);
        if (!this._currentActor) {
            this.rechangeCurrentActor();
        }
    };

    /**
     * チャージ済みのアクターから再度行動開始
     */
    BattleManager.rechangeCurrentActor = function () { 
        const charged = $gameParty.battleMembers().find(a => a._tpbState === 'charged');
        if (charged) {
            this._currentActor = charged;
        }
    };

    //-----------------------------------------------------------------------------
    // Scene_Battle

    /**
     * 上書き
     */
    Scene_Battle.prototype.stop = function () {
        Scene_Message.prototype.stop.call(this);
        if (this.needsSlowFadeOut()) {
            this.startFadeOut(this.slowFadeSpeed(), false);
        } else {
            this.startFadeOut(this.fadeSpeed(), false);
        }
        this._statusWindow.close();
        // this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    };

    /**
     * 無効化
     */
    Scene_Battle.prototype.createPartyCommandWindow = function () { };

    /**
     * 上書き
     * @returns boolean
     */
    Scene_Battle.prototype.isAnyInputWindowActive = function () {
        return (
            // this._partyCommandWindow.active ||
            this._actorCommandWindow.active ||
            this._skillWindow.active ||
            this._itemWindow.active ||
            this._actorWindow.active ||
            this._enemyWindow.active
        );
    };

    /**
     * 上書き
     */
    Scene_Battle.prototype.closeCommandWindows = function () {
        // this._partyCommandWindow.deactivate();
        this._actorCommandWindow.deactivate();
        // this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    };

    /**
     * 上書き
     */
    Scene_Battle.prototype.startPartyCommandSelection = function () {
        this._statusWindow.deselect();
        this._statusWindow.show();
        this._statusWindow.open();
        this._actorCommandWindow.setup(null);
        this._actorCommandWindow.close();
        // this._partyCommandWindow.setup();
    };

    /**
     * 上書き
     */
    Scene_Battle.prototype.startActorCommandSelection = function () {
        this._statusWindow.show();
        this._statusWindow.selectActor(BattleManager.actor());
        // this._partyCommandWindow.close();
        this._actorCommandWindow.show();
        this._actorCommandWindow.setup(BattleManager.actor());
    };

    /**
     * 上書き
     */
    Scene_Battle.prototype.updateCancelButton = function () {
        if (this._cancelButton) {
            this._cancelButton.visible = this.isAnyInputWindowActive();
        }
    };
})();