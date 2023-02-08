//=============================================================================
// RPG Maker MZ - DNMC_sceneBattle
// ----------------------------------------------------------------------------
// (C)2023 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/02/05 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc Donut Machine 専用戦闘改変いろいろ
 * @author cursed_twitch
 * @base CSVN_base
 * @base NUUN_Result
 * @orderAfter CSVN_base
 * @orderAfter NUUN_Result
 * 
 * @help DNMC_sceneBattle.js
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

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