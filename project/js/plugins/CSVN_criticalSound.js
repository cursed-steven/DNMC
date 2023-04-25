/*=============================================================================
 CSVN_criticalSound.js
----------------------------------------------------------------------------
 (C)2021 cursed_steven
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/07/17 初版
 1.0.1 2021/07/17 PluginCommonBase採用
 1.0.2 2022/11/18 フラッシュ追加
----------------------------------------------------------------------------
 [Twitter]: https://twitter.com/cursed_steven
=============================================================================*/

/*:
 * @target MZ
 * @plugindesc Play specified SE when critical.
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author cursed_steven
 * @url https://note.com/cursed_steven/n/ne9aafd8d7c31
 *
 * @help CSVN_criticalSound.js
 *
 * Play specified SE when critical.
 *
 * Terms:
 *  No permission needed for change or re-distribute this plugin.
 *  But I will be glad to being informed you used or reffered this.
 *
 * @param name1
 * @text file name for actor's.
 * @desc
 * @default Attack3
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume1
 * @parent name1
 * @text volume for actor's.'
 * @desc
 * @type number
 * @min 0
 * @default 90
 *
 * @param pitch1
 * @parent name1
 * @text pitch for actor's.'
 * @desc
 * @type number
 * @max 1000000
 * @min 10
 * @default 100
 *
 * @param name2
 * @text file name for actor's.
 * @desc
 * @default Damage3
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume2
 * @parent name2
 * @text volume for actor's.
 * @desc
 * @type number
 * @min 0
 * @default 90
 *
 * @param pitch2
 * @parent name2
 * @text pitch for actor's.
 * @desc
 * @type number
 * @max 1000000
 * @min 10
 * @default 100
 */

/*:ja
 * @target MZ
 * @plugindesc クリティカル発生時に指定したSEを演奏します。
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author ノロワレ
 * @url https://note.com/cursed_steven/n/ne9aafd8d7c31
 *
 * @help CSVN_criticalSound.js
 *
 * クリティカル発生時に指定したSEを演奏します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 *  が、使ったとか参考にしたとか伝えてもらえると喜びます。
 *
 * @param name1
 * @text アクター側のファイル名
 * @desc
 * @default Attack3
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume1
 * @parent name1
 * @text アクター側のボリューム
 * @desc
 * @type number
 * @min 0
 * @default 90
 *
 * @param pitch1
 * @parent name1
 * @text アクター側のピッチ
 * @desc
 * @type number
 * @max 1000000
 * @min 10
 * @default 100
 * 
 * @param flashColor1
 * @text フラッシュの色(RGBA)
 * @desc 
 * @type struct<FlashColor>
 * 
 * @param flashDuration1
 * @text フラッシュの長さ
 * @desc
 * @type number
 * @default 12
 *
 * @param name2
 * @text エネミー側のファイル名
 * @desc
 * @default Damage3
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume2
 * @parent name2
 * @text エネミー側のボリューム
 * @desc
 * @type number
 * @min 0
 * @default 90
 *
 * @param pitch2
 * @parent name2
 * @text エネミー側のピッチ
 * @desc
 * @type number
 * @max 1000000
 * @min 10
 * @default 100
 * 
 * @param flashColor2
 * @text フラッシュの色(RGBA)
 * @desc 
 * @type struct<FlashColor>
 * 
 * @param flashDuration2
 * @text フラッシュの長さ
 * @desc
 * @type number
 * @default 12
 */

/*~struct~FlashColor:ja
 * 
 * @param R
 * @text R
 * @type number
 * @max 255
 * @min 0
 * 
 * 
 * @param G
 * @text G
 * @type number
 * @max 255
 * @min 0
 * 
 * @param B
 * @text B
 * @type number
 * @max 255
 * @min 0
 * 
 * @param A
 * @text A
 * @type number
 * @max 255
 * @min 0
 */

(() => {
    'use strict';
    const params = PluginManagerEx.createParameter(document.currentScript);

    function playActorCritical() {
        AudioManager.playStaticSe({
            name: params.name1,
            volume: params.volume1,
            pitch: params.pitch1,
        });
    }

    function playEnemyCritical() {
        AudioManager.playStaticSe({
            name: params.name2,
            volume: params.volume2,
            pitch: params.pitch2,
        });
    }

    //-------------------------------------------------------------------------
    // Game_Screen

    Game_Screen.prototype.startFlashForPlayerCritical = function () {
        if (!params.flashColor1) return;
        this.startFlash(
            [
                params.flashColor1.R,
                params.flashColor1.G,
                params.flashColor1.B,
                params.flashColor1.A
            ],
            params.flashDuration1
        );
    };

    Game_Screen.prototype.startFlashForEnemyCritical = function () {
        if (!params.flashColor2) return;
        this.startFlash(
            [
                params.flashColor2.R,
                params.flashColor2.G,
                params.flashColor2.B,
                params.flashColor2.A
            ],
            params.flashDuration2
        );
    };

    //-------------------------------------------------------------------------
    // Window_BattleLog

    Window_BattleLog.prototype.displayCritical = function (target) {
        if (target.result().critical) {
            if (target.isActor()) {
                playEnemyCritical();
                $gameScreen.startFlashForEnemyCritical();
                this.wait();
                this.wait();
                this.wait();
                this.push("addText", TextManager.criticalToActor);
            } else {
                playActorCritical();
                $gameScreen.startFlashForPlayerCritical();
                this.wait();
                this.wait();
                this.wait();
                this.push("addText", TextManager.criticalToEnemy);
            }
        }
    }
})();