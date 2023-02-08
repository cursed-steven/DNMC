//=============================================================================
// RPG Maker MZ - DNMC_tpFullCustom
// ----------------------------------------------------------------------------
// (C)2023 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/02/08 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 戦闘中のTP(BB)の扱いの変更部分
 * @author cursed_twitch
 * @base DNMC_sceneBattle
 * @orderAfter DNMC_sceneBattle
 * 
 * @help DNMC_tpFullCustom.js
 * 
 * @param stunStateId
 * @text スタンステートID
 * @desc
 * @type state
 * 
 * @param guardStateId
 * @text 防御ステートID
 * @desc
 * @type state
 * 
 * @param justGuardSe
 * @text ジャスガ発生SE
 * @desc
 * @type file
 * @dir audio/se/
 * 
 * @param justGuardSeVolume
 * @text ジャスガSEvol
 * @desc
 * @type number
 * 
 * @param justGuardSePitch
 * @text ジャスガSEピッチ
 * @desc
 * @type number
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    const STATE_IDS = {
        STUN: param.stunStateId,
        GUARD: param.guardStateId
    };

    //-------------------------------------------------------------------------
    // Game_BattlerBase

    /**
     * 消費TPをスキルの発動上限に読み替える
     * @param {any} skill 
     * @returns boolean
     */
    Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
        return (
            this._tp <= this.skillTpCost(skill) &&
            this._mp >= this.skillMpCost(skill)
        );
    };

    /**
     * 消費TPは無視、発動上限としてだけ使う
     * @param {any} skill 
     */
    Game_BattlerBase.prototype.paySkillCost = function (skill) {
        this._mp -= this.skillMpCost(skill);
    };

    //-------------------------------------------------------------------------
    // Game_Battler

    /**
     * TP(BB)の扱いを逆転させる
     * ※少ないほどよいようにする
     * @param {number} value 
     */
    Game_Battler.prototype.gainTp = function (value) {
        // 100を指定したときは0に戻す
        if (value === 100) {
            this._result.tpDamage = 100;
            this.setTp(0);
        } else {
            this._result.tpDamage = -value;
            this.setTp(this.tp + value);
        }
    };

    /**
     * 被弾時のTP蓄積割合を変更
     * @param {number} damageRate 
     */
    Game_Battler.prototype.chargeTpByDamage = function (damageRate) {
        // スタン中はTP蓄積なし
        if (!this.isStateAffected(STATE_IDS.STUN)) {
            // オリジナルは50
            const ratio = 100;

            const value = Math.floor(ratio * damageRate * this.tcr);
            this.gainSilentTp(value);
        }
    }

    const _Game_Battler_refresh = Game_Battler.prototype.refresh;
    /**
     * TPが100になったら強制スタン
     */
    Game_Battler.prototype.refresh = function () {
        _Game_Battler_refresh.call(this);

        if (this.tp === 100) {
            this.addState(STATE_IDS.STUN);
            this.initTp();
        }
    };

    //-------------------------------------------------------------------------
    // Game_Action

    const _Game_Action_executeDamage = Game_Action.prototype.executeDamage;
    /**
     * ダメージ処理に、防御中のTP変化の処理を追加
     * @param {Game_Battler} target 
     * @param {number} value 
     */
    Game_Action.prototype.executeDamage = function (target, value) {
        _Game_Action_executeDamage.call(this, target, value);
        this.applyTpOnGuarded(target, value);
    }

    /**
     * 攻撃側で増加するTPの決定
     * @param {Game_Battler} target 
     * @param {number} value 
     */
    Game_Action.prototype.applyTpOnGuarded = function (target, value) {
        if (this.isPhysical() && target.isStateAffected(STATE_IDS.STUN)) {
            // 与えたHPダメージ/攻撃側MHPの割合で攻撃側のTPの増加幅を決定する
            const ratio = 50;
            let tp = Math.floor(ratio * (value / this.subject().mhp) * this.subject().tcr);

            // ジャストガード発生
            const justGuardRate = this.justGuardRate(target) * 100;
            if (Math.randomInt(100) < justGuardRate) {
                // ジャストガードされた攻撃側のTP増加幅は倍
                tp *= 2;
                this.playJustGuard();
            }
            this.subject().gainTp(tp);
        }
    };

    /**
     * ジャストガード発生率の決定
     * @param {Game_Battler} target 
     * @returns number
     */
    Game_Action.prototype.justGuardRate = function (target) {
        // ((相手とのすばやさの差 - 自分の素早さ) / 100)％になるように
        const diff = this.subject().agi - target.agi;
        return diff > 0 ? diff / this.subject().agi : 1;
    };

    Game_Action.prototype.justGuardRate = function (target) {
        // ((相手とのすばやさの差 - 自分の素早さ) / 100)％になるように
        const diff = this.subject().agi - target.agi;
        return diff > 0 ? diff / this.subject().agi : 1;
    };

    /**
     * ジャストガードSEの再生
     */
    Game_Action.prototype.playJustGuard = function () {
        AudioManager.playStaticSe({
            name: param.justGuardSe ? param.justGuardSe : "",
            volume: param.justGuardSeVol ? param.justGuardSeVol : 50,
            pitch: param.justGuardSePitch ? param.justGuardSePitch : 100
        });
    };

})();