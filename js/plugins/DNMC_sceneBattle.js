//=============================================================================
// RPG Maker MZ - DNMC_sceneBattle
// ----------------------------------------------------------------------------
// (C)2023 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/02/05 初版
// 1.1.0  2023/02/19 HUD化
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc Donut Machine 専用戦闘改変いろいろ
 * @author cursed_twitch
 * @base DNMC_battleCommandUI
 * @orderAfter CSVN_base
 * 
 * @help DNMC_sceneBattle.js
 */

//-----------------------------------------------------------------------------
// Window_BattleHUD
//
// The window for displaying party member status on the battle scene.

function Window_BattleHUD() {
    this.initialize(...arguments);
}

Window_BattleHUD.prototype = Object.create(Window_MapHUD.prototype);
Window_BattleHUD.prototype.constructor = Window_BattleHUD;

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // Scene_Battle

    /**
     * 無効化
     */
    Scene_Battle.prototype.updateStatusWindowPosition = function () { };

    /**
     * 固定
     * @returns number
     */
    Scene_Battle.prototype.statusWindowX = function () {
        return Graphics.boxWidth - 160;
    };

    /**
     * ウィンドウ変更
     */
    Scene_Battle.prototype.createStatusWindow = function () {
        const rect = this.statusWindowRect();
        const statusWindow = new Window_BattleHUD(rect);
        this.addWindow(statusWindow);
        this._statusWindow = statusWindow;
    };

    /**
     * HUD領域に変更
     * @returns Rectangle
     */
    Scene_Battle.prototype.statusWindowRect = function () {
        const ww = 160;
        const wh = this.HUDHeight();
        const wx = Graphics.boxWidth - ww;
        const wy = this.calcWindowHeight(3, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 敵選択ウインドウの領域変更
     * @returns Rectangle
     */
    Scene_Battle.prototype.enemyWindowRect = function () {
        const wx = this._actorCommandWindow.x;
        const ww = this._actorCommandWindow.width;
        const wh = this.windowAreaHeight();
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * HUDの高さを返す
     * @returns number
     */
    Scene_Battle.prototype.HUDHeight = function () {
        return this.calcWindowHeight(2.7 * $gameParty.size(), true);
    };

    //-----------------------------------------------------------------------------
    // Window_BattleHUD

    Window_BattleHUD.prototype.drawItem = function (index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const x = rect.x;
        const y = rect.y;
        const lineHeight = this.lineHeight() * 0.6;
        this.drawActorName(actor, x, y);
        this.placeTimeGauge(actor, x, y + lineHeight);
        this.placeBasicGauges(actor, x, y + lineHeight * 2);
        this.drawActorIcons(actor, x, y + lineHeight + this.gaugeLineHeight() * 2 + this.itemPadding());
    };

    Window_BattleHUD.prototype.selectActor = function (actor) {
        const members = $gameParty.battleMembers();
        this.select(members.indexOf(actor));
    }

    //-----------------------------------------------------------------------------
    // BattleManager

    /**
     * 撤退成功率(限りなく高めに)
     */
    BattleManager.makeEscapeRatio = function () {
        this._escapeRatio = 0.98;
    };

    /**
     * 撤退成功の処理
     */
    BattleManager.onEscapeSuccess = function () {
        this.displayEscapeNoBusy();
        this._escaped = true;
        this.processAbort();
    };

    /**
     * 撤退時の結果表示
     */
    BattleManager.displayEscapeNoBusy = function () {
        $gameParty.removeBattleStates();
        this.replayBgmAndBgs();
        this.makeRewardsOnEscape();
        this.displayRewards();
        this.gainRewards();
        this._victoryStart = true;
    };

    /**
     * 撤退時の戦利品表示
     */
    BattleManager.makeRewardsOnEscape = function () {
        this._rewards = {
            gold: $gameTroop.goldTotal(),
            exp: $gameTroop.expTotal(),
            items: []
        };
    };

    //-----------------------------------------------------------------------------
    // Game_Enemy

    /**
     * 敵ダメージVEのうち点滅をやめる
     */
    Game_Enemy.prototype.performDamage = function () {
        Game_Battler.prototype.performDamage.call(this);
        SoundManager.playEnemyDamage();
        //this.requestEffect("blink");
    };

})();