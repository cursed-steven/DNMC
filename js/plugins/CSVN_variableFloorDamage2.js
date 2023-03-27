//=============================================================================
// RPG Maker MZ - CSVN_variableFloorDamage2
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2021/07/19 初版
// 2.0.0  2023/03/19 リファクタリングと機能追加
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 地形タグによってダメージ床の挙動を変化させます。
 * @author cursed_steven
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_variableFloorDamage2.js
 * 
 * @param FDSpecList
 * @text ダメージ床情報構造体のリスト
 * @type struct<FDSpec>[]
 */

/*~struct~FDSpec:ja
 *
 * @param terrainTag
 * @text 地形タグ
 * @type number
 * @max 7
 * @min 1
 * 
 * @param damage
 * @text ダメージ値
 * @type number
 * @default 10
 * 
 * @param flashColor
 * @text フラッシュの色
 * @default red
 * @type select
 * @option 赤
 * @value red
 * @option 白
 * @value white
 * @option 黄
 * @value yellow
 * @option 青
 * @value blue
 * @option 緑
 * @value green
 * @option なし
 * @value none
 * 
 * @param se
 * @text SE
 * @default Damage3
 * @dir audio/se/
 * @type file
 * 
 * @param seVolume
 * @parent se
 * @text SE音量
 * @type number
 * @max 100
 * @min 0
 * @default 35
 * 
 * @param sePitch
 * @parent se
 * @text SEピッチ
 * @type number
 * @max 150
 * @min 50
 * @default 100
 * 
 * @param state
 * @text 追加発生するステート
 * @desc 毒沼に入ったら毒がつくみたいなことをしたいときに設定
 * @type state
 * 
 * @param stateRate
 * @parent state
 * @text 追加ステートの発生率
 * @type number
 * @max 100
 * @min 1
 * 
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const FLASH = {
        red: [255, 0, 0, 128],
        white: [255, 255, 255, 128],
        yellow: [255, 255, 0, 128],
        blue: [0, 0, 255, 128],
        green: [0, 255, 255, 128]
    };

    /**
     * 地形タグが合致しかつ追加ステートが設定されていればそのなかでダメージ最大のもの、
     * 追加ステートが設定されているものがない場合はそのうちダメージが最大のものを返す。
     * @param {number} tt 
     * @returns FDSpec
     */
    function selectFDSpecs(tt) {
        // 地形タグが合致するもの
        const fitByTt = param.FDSpecList.filter(fds => fds.terrainTag === tt);
        // さらに追加ステートが設定されているもの
        const andState = fitByTt.filter(fds => fds.state);

        let sortedByDamage = null;
        if (andState.length > 0) {
            // 地形タグが合致しかつ追加ステートが設定されているものの中でダメージが最大のものを選択
            sortedByDamage = andState.sort((a, b) => b.damage - a.damage);
        } else {
            // 地形タグが合致するもののうちダメージが最大のものを選択
            sortedByDamage = fitByTt.sort((a, b) => b.damage - a.damage);
        }

        return sortedByDamage.length > 0 ? sortedByDamage[0] : null;
    }

    //-----------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_basicFloorDamage = Game_Actor.prototype.basicFloorDamage;
    /**
     * 指定条件のダメージ値を返す
     * ※指定条件に合致するものがない場合は通常のダメージ床として処理
     * @returns number
     */
    Game_Actor.prototype.basicFloorDamage = function () {
        const tt = $gamePlayer.terrainTag();
        const spec = selectFDSpecs(tt);

        return spec ? spec.damage : _Game_Actor_basicFloorDamage.call(this);
    };

    const _Game_Actor_executeFloorDamage = Game_Actor.prototype.executeFloorDamage;
    /**
     * 床からのダメージ実行後、さらに指定条件に合致する追加ステートがあれば付加
     */
    Game_Actor.prototype.executeFloorDamage = function () {
        _Game_Actor_executeFloorDamage.call(this);

        const tt = $gamePlayer.terrainTag();
        const spec = selectFDSpecs(tt);
        if (spec && Math.trueByRate(spec.stateRate)) {
            this.addState(spec.state);
            $gameScreen.startFlashForDamage();
        }
    };

    //-----------------------------------------------------------------------------
    // Game_Screen

    const _Game_Screen_startFlashForDamage = Game_Screen.prototype.startFlashForDamage;
    /**
     * 指定条件のフラッシュを実行、SE演奏
     * ※指定条件に合致するものがない場合は通常のダメージ床として処理
     */
    Game_Screen.prototype.startFlashForDamage = function () {
        const tt = $gamePlayer.terrainTag();
        const spec = selectFDSpecs(tt);

        if (spec) {
            if (spec.flashColor !== "none") {
                this.startFlash(FLASH[spec.flashColor], 8);
            }
            this.playSeForDamage(spec);
        } else {
            // 指定条件がなければ通常の処理
            _Game_Screen_startFlashForDamage.call(this);
        }
    };

    /**
     * 指定条件フラッシュ実行時に同時にSE演奏
     * @param {FDSpec} spec 
     */
    Game_Screen.prototype.playSeForDamage = function (spec) {
        AudioManager.playStaticSe({
            name: spec.se,
            volume: spec.seVolume,
            pitch: spec.sePitch
        });
    };

})();