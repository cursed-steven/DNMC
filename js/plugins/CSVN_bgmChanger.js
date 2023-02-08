//=============================================================================
// RPG Maker MZ - CSVN_bgmChanger.js
// ----------------------------------------------------------------------------
// (C)2022 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/11/14 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc マップID、リージョン、スイッチ、変数を見て条件を判定し、必要に応じてBGM/BGSを変更する。
 * @author cursed_twitch
 * @base CSVN_conditionChecker
 * @orderAfter CSVN_conditionChecker
 * 
 * @help CSVN_bgmChanger.js
 * 
 * プラグインパラメータにBGM/BGS変更の条件とそのときに
 * 演奏するBGM/BGSを設定しておき、プラグインコマンドでそのIDを
 * 指定した状態で、場所移動したりスイッチや変数の操作を行うと、
 * そこで自動的にBGM/BGSが演奏されます。
 * 
 * @param defaultBGMVolume
 * @text 既定のBGMボリューム
 * @type number
 * @max 100
 * @min 0
 * 
 * @param defaultBGMPitch
 * @text 既定のBGMピッチ
 * @type number
 * @max 150
 * @min 50
 * 
 * @param defaultBGSVolume
 * @text 既定のBGSボリューム
 * @type number
 * @max 100
 * @min 0
 * 
 * @param defaultBGSPitch
 * @text 既定のBGSピッチ
 * @type number
 * @max 150
 * @min 50
 * 
 * @param excepVarIds
 * @text 変更されてもチェックしない変数
 * @desc この変数の変更時にはBGM/BGS変更条件の確認をskipします
 * @type variables[]
 * 
 * @param BGMConditions
 * @text BGM変更条件
 * @desc リージョン/スイッチ/変数の条件を満たしたときに変更するBGM設定
 * @type struct<BGMCondition>[]
 */

/*~struct~BGMCondition:ja
 *
 * @param mapId
 * @text マップID
 * @type number
 *  
 * @param bgm
 * @text BGM
 * @type file
 * @dir audio/bgm
 * 
 * @param bgmVolume
 * @text BGM音量
 * @type number
 * @max 100
 * @min 0
 * @parent bgm
 * 
 * @param bgmPitch
 * @text BGMピッチ
 * @type number
 * @max 150
 * @min 50
 * @parent bgm
 * 
 * @param bgs
 * @text BGS
 * @type file
 * @dir audio/bgs
 * 
 * @param bgsVolume
 * @text BGS音量
 * @type number
 * @max 100
 * @min 0
 * @parent bgs
 * 
 * @param bgsPitch
 * @text BGSピッチ
 * @type number
 * @max 150
 * @min 50
 * @parent bgs
 * 
 * @param region
 * @text リージョン
 * @type number
 * @max 255
 * @min 0
 * 
 * @param switchId
 * @text スイッチID
 * @type switch
 * 
 * @param switchValue
 * @text スイッチの値
 * @type boolean
 * 
 * @param varId
 * @text 変数ID
 * @type variable
 * 
 * @param varInequality
 * @text 変数の不等号
 * @type select
 * @option <
 * @option <=
 * @option ==
 * @option >=
 * @option >
 * 
 * @param varValue
 * @text 変数値
 * @type number
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-------------------------------------------------------------------------
    // Game_Map

    const _Game_Map_initialize = Game_Map.prototype.initialize;
    /**
     * 初期化時に追加のプロパティを定義
     */
    Game_Map.prototype.initialize = function () {
        _Game_Map_initialize.call(this);

        // 判断対象にする条件データの格納先
        this._bgmCondition = null;
    };

    /**
     * 設定中のBGM変更条件を返す。
     * @returns any
     */
    Game_Map.prototype.getBGMCondition = function () {
        CSVN_base.log(">> getBGMCondition");
        CSVN_base.log(this._bgmCondition);
        return this._bgmCondition;
    };

    /**
     * 現在のマップID、リージョン、スイッチ、変数に該当する
     * BGM/BGS変更条件を検索してセットする。
     */
    Game_Map.prototype.setBGMCondition = function () {
        CSVN_base.log(">> setBGMCondition");
        const condition = this.findBGMCondition();

        if (typeof condition === "undefined") {
            CSVN_base.log("No condition found.");
            this.clearBGMCondition();
            this.autoplay();
        } else {
            this._bgmCondition = condition;
        }
    };

    /**
     * 現在のマップID、リージョン、スイッチ、変数に該当する
     * BGM/BGS変更条件を検索する。
     * @returns any
     */
    Game_Map.prototype.findBGMCondition = function () {
        const condition = param.BGMConditions.find(e => {
            const mapMatch = !e.mapId || e.mapId === $gameMap.mapId();
            const regionMatch = (!e.region && e.region !== 0) || e.region === $gamePlayer.regionId();
            const switchMatch = !e.switch || $s.get(e.switchId) === e.switchValue;
            const varMatch = !e.varId || eval("$v.get(" + e.varId + ") " + e.varInequality + " " + e.varValue)
            //CSVN_base.log(mapMatch + "|" + regionMatch + "|" + switchMatch + "|" + varMatch);

            return mapMatch && regionMatch && switchMatch && varMatch
        });

        return condition;
    };

    /**
     * 設定されていたBGM変更条件をクリアする。
     */
    Game_Map.prototype.clearBGMCondition = function () {
        CSVN_base.log(">> " + this.constructor.name + " clearBGMCondition: BGMCondition cleared.");
        this._bgmCondition = null;
    };

    const _Game_Map_audoplay = Game_Map.prototype.autoplay;
    /**
     * BGM変更条件の設定有無による分岐を追加
     */
    Game_Map.prototype.autoplay = function () {
        CSVN_base.log(">> " + this.constructor.name + " autoplay");
        if (this._bgmCondition) {
            CSVN_base.log("playing BGM/BGS by condition.");
            this.playBGMBGSByCondition();
        } else {
            CSVN_base.log("autoplaying(1).");
            _Game_Map_audoplay.call(this);
        }
    };

    const _Game_Map_refresh = Game_Map.prototype.refresh;
    /**
     * スイッチや変数の変更時のリフレッシュにBGM変更の判断も追加
     */
    Game_Map.prototype.refresh = function () {
        CSVN_base.log(">>>> " + this.constructor.name + " refresh");

        this.setBGMCondition();
        CSVN_base.log(this._bgmCondition);
        this.playBGMBGSByCondition();

        _Game_Map_refresh.call(this);
    };

    /**
     * 現在の状態がBGM変更条件を満たすかを確認して返す。
     * @returns boolean
     */
    Game_Map.prototype.checkBGMCondition = function () {
        CSVN_base.log(">> " + this.constructor.name + " checking BGM condition...");
        if (!this._bgmCondition) return false;

        const mapId = this._bgmCondition.mapId;
        const region = this._bgmCondition.region;
        const switchId = this._bgmCondition.switchId;
        const switchValue = this._bgmCondition.switchValue;
        const varId = this._bgmCondition.varId;
        const varInequality = this._bgmCondition.varInequality;
        const varValue = this._bgmCondition.varValue;
        $gameSystem.setConditionMatched(
            mapId,
            region,
            switchId,
            switchValue,
            varId,
            varInequality,
            varValue
        );

        return $gameSystem.getConditionMatched();
    };

    /**
     * BGM/BGSの条件を評価して、合致すれば条件中の内容をプレイ。
     * そうでなければ自動演奏に設定されているものをプレイ。
     */
    Game_Map.prototype.playBGMBGSByCondition = function () {
        CSVN_base.log(">> " + this.constructor.name + " playBGMBGSByCondition");

        if (this.checkBGMCondition()) {
            CSVN_base.log("playing BGM/BGS by condition.");
            this.playBGMByCondition();
            this.playBGSByCondition();
            this.clearBGMCondition();
        } else {
            CSVN_base.log("autoplaying(2).");
            this.clearBGMCondition();
            this.autoplay();
        }
    };

    /**
     * BGM/BGS変更条件に設定されているBGMをプレイ。
     */
    Game_Map.prototype.playBGMByCondition = function () {
        CSVN_base.log("BGM playing.");
        AudioManager.playBgm({
            name: this._bgmCondition.bgm,
            volume: this._bgmCondition.bgmVolume ? this._bgmCondition.bgmVolume : param.defaultBGMVolume,
            pitch: this._bgmCondition.bgmPitch ? this._bgmCondition.bgmPitch : param.defaultBGMPitch
        });
    };

    /**
     * BGM/BGS変更条件に設定されているBGSをプレイ。
     */
    Game_Map.prototype.playBGSByCondition = function () {
        CSVN_base.log("BGS playing.");
        AudioManager.playBgs({
            name: this._bgmCondition.bgs,
            volume: this._bgmCondition.bgsVolume ? this._bgmCondition.bgsVolume : param.defaultBGSVolume,
            pitch: this._bgmCondition.bgsPitch ? this._bgmCondition.bgsPitch : param.defaultBGSPitch
        });
    };

})();