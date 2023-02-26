//=============================================================================
// RPG Maker MZ - CSVN_damagePopupEx
// ----------------------------------------------------------------------------
// (C)2023 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/02/xx 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc ダメージポップアップに耐性や弱点表記を追加
 * @author cursed_twitch
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_damagePopupEx.js
 * 
 * @param blockText
 * @text 無効表記
 * @type string
 * @default BLOCK
 * 
 * @param reduceThreshold
 * @text 耐性閾値
 * @desc 属性によって{この数値}%以下までダメージが軽減されている場合に適用
 * @type number
 * @default 50
 * @max 99
 * @min 1
 * 
 * @param reduceText
 * @text 耐性表記
 * @type string
 * @default RESIST
 * 
 * @param weakThreshold
 * @text 弱点閾値
 * @desc 属性によって{この数値}%以上までダメージが増幅されている場合に適用
 * @type number
 * @default 200
 * @min 101
 * 
 * @param weakText
 * @text 弱点表記
 * @type string
 * @default WEAK
 * 
 * @param damageOffsetX
 * @text ダメージ表示オフセットX
 * @desc 複数回ダメージが入る場合のX座標オフセット
 * @type number
 * @max 26
 * @min 0
 * 
 * @param damageOffsetY
 * @text ダメージ表示オフセットY
 * @desc 複数回ダメージが入る場合のY座標オフセット
 * @type number
 * @max 26
 * @min 0
 * 
 * @param damageOffsetRandomize
 * @text ランダマイズ
 * @desc ダメージ表示位置のランダム化
 * @type boolean
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // Game_BattlerBase

    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    /**
     * バトラーベースの初期化時に行動結果が属性にどの程度影響されたのかを保持する場所を追加
     */
    Game_BattlerBase.prototype.initMembers = function () {
        _Game_BattlerBase_initMembers.call(this);
        this._calcuratedElementRate = 100;
    };

    //-----------------------------------------------------------------------------
    // Game_Action

    /**
     * ターゲットの指定属性の相性を算出して返す／同時に算出結果を保持
     * @param {Game_Battler} target 
     * @returns number
     */
    Game_Action.prototype.calcElementRate = function (target) {
        let result = 0;
        if (this.item().damage.elementId < 0) {
            CSVN_base.log("rate: NORMAL");
            result = this.elementsMaxRate(target, this.subject().attackElements());
        } else {
            CSVN_base.log("rate: ELEMENTAL");
            result = target.elementRate(this.item().damage.elementId);
        }
        CSVN_base.log(`result: ${result * 100}`);
        target._calcuratedElementRate = result * 100;

        return result;
    };

    //-----------------------------------------------------------------------------
    // Sprite_Damage

    const _Sprite_Damage_setup = Sprite_Damage.prototype.setup;
    /**
     * 追加テキスト生成処理を追加
     * @param {Game_Battler} target 
     */
    Sprite_Damage.prototype.setup = function (target) {
        this.additionalSetup(target);
        _Sprite_Damage_setup.call(this, target);
    };

    /**
     * 追加テキストの生成
     * @param {Game_Battler} target 
     */
    Sprite_Damage.prototype.additionalSetup = function (target) {
        CSVN_base.log(`rate: ${target._calcuratedElementRate}`);
        if (target._calcuratedElementRate === 0) {
            // BLOCK
            this.createAdditional(param.blockText);
        } else if (target._calcuratedElementRate <= param.reduceThreshold
            && target._calcuratedElementRate < 100) {
            // REDUCE
            this.createAdditional(param.reduceText);
        } else if (target._calcuratedElementRate >= param.weakThreshold) {
            // WEAK
            this.createAdditional(param.weakText);
        }
    };

    /**
     * 追加分の文字生成
     * @param {string} text 
     */
    Sprite_Damage.prototype.createAdditional = function (text) {
        this._colorType = 9;
        const offset = 16;
        const h = this.fontSize() + offset + 8;
        const w = Math.floor(h * 3.0);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.drawText(text, 0, offset * -1, w, h, "center");
        sprite.dy = 0;
    };

})();