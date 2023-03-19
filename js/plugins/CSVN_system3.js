//=============================================================================
// RPG Maker MZ - CSVN_system3.js
// ----------------------------------------------------------------------------
// (C)2022 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/11/26 初版
// 1.1.0  2022/11/30 トヘロス、トラマナ対応
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 追加的なシステム設定項目を保持する
 * @author cursed_steven
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_system3.js
 * 
 * システム1/システム2でおさまりきらない追加的な
 * システム設定項目を設定・保持します。
 * 
 * @param maxItemCount
 * @text アイテム1品目あたりの最大保持数
 * @type number
 * 
 * @param aliveLeaderActorId
 * @text 生存先頭アクターIDを入れる変数
 * @type variable
 * 
 * @param aliveMemberCount
 * @text 生存メンバー数を入れる変数
 * @type variable
 * 
 * @param chestSE
 * @text 宝箱開閉SE
 * @type file
 * @dir audio/se
 * 
 * @param chestSEVolume
 * @text 宝箱開閉SEボリューム
 * @type number
 * @max 100
 * @min 0
 * @default 90
 * @parent chestSE
 * 
 * @param chestSEPitch
 * @text 宝箱開閉SEピッチ
 * @type number
 * @max 150
 * @min 50
 * @default 100
 * @parent chestSE
 * 
 * @param tohelosSwitchId
 * @text トヘロススイッチID
 * @type switch
 * 
 * @param tohelosMaxCount
 * @text トヘロス最大歩数
 * @type number
 * 
 * @param tohelosCountVarId
 * @text トヘロス残歩数を入れる変数
 * @type variable
 * 
 * @param tohelosOutCEVId
 * @text トヘロス終了CEV
 * @type common_event
 * 
 * @param tramanaSwitchId
 * @text トラマナスイッチID
 * @type switch
 * 
 * @param tramanaMaxCount
 * @text トラマナ最大歩数
 * @type number
 * 
 * @param tramanaCountVarId
 * @text トラマナ残歩数を入れる変数
 * @type variable
 * 
 * @param tramanaOutCEVId
 * @text トラマナ終了CEV
 * @type common_event
 * 
 * @command playChestSE
 * @text 宝箱SE
 * 
 * @command setAliveLeaderActorId
 * @text 生存先頭アクターIDセット
 * @desc 生存メンバーのうち戦闘のアクターのIDを指定変数に入れる
 * 
 * @command setAliveMemberCount
 * @text 生存メンバー数セット
 * @desc 生存メンバーの数を指定変数に入れる
 * 
 * @command recoverAllNoRevive
 * @text 全員全回復(蘇生なし)
 * 
 * @command tohelosStart
 * @text トヘロス開始
 * 
 * @command tramanaStart
 * @text トラマナ開始
 * 
 * @command setupTestItems
 * @text テスト用アイテム一式追加
 * 
 * @command resetItems
 * @text 道具リセット
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * 宝箱の指定SE
     */
    PluginManagerEx.registerCommand(script, "playChestSE", args => {
        SoundManager.playChest();
    });

    /**
     * 生存メンバーのうち先頭のアクターのIDを指定変数に入れる
     */
    PluginManagerEx.registerCommand(script, "setAliveLeaderActorId", args => {
        $v.set(param.aliveLeaderActorId, $gameParty.aliveMembers()[0].actorId());
    });

    /**
     * 生存者数を指定変数に入れる
     */
    PluginManagerEx.registerCommand(script, "setAliveMemberCount", args => {
        $v.set(param.aliveMemberCountId, $gameParty.aliveMembers().length);
    });

    /**
     * 全員全回復(蘇生なし)
     */
    PluginManagerEx.registerCommand(script, "recoverAllNoRevive", args => {
        $gameParty.aliveMembers().forEach(function (actor, index) {
            actor.recoverAll();
        });
    });

    /**
     * トヘロス開始
     */
    PluginManagerEx.registerCommand(script, "tohelosStart", args => {
        $s.on(param.tohelosSwitchId);
        $v.set(param.tohelosCountVarId, param.tohelosMaxCount);
    });

    /**
     * トラマナ開始
     */
    PluginManagerEx.registerCommand(script, "tramanaStart", args => {
        $s.on(param.tramanaSwitchId);
        $v.set(param.tramanaCountVarId, param.tramanaMaxCount);
    });

    /**
     * 戦闘テストと同様の全アイテム追加
     */
    PluginManagerEx.registerCommand(script, "setupTestItems", args => {
        $gameParty.setupBattleTestItems();
    });

    /**
     * 所持アイテムのリセット(オールクリア)
     */
    PluginManagerEx.registerCommand(script, "resetItems", args => {
        $dataItems.forEach(function (item, index) {
            if ($gameParty.hasItem(item)) {
                $gameParty.loseItem(item, $gameParty.numItems(item));
            }
        });
        $dataWeapons.forEach(function (item, index) {
            if ($gameParty.hasItem(item)) {
                $gameParty.loseItem(item, $gameParty.numItems(item));
            }
        });
        $dataArmors.forEach(function (item, index) {
            if ($gameParty.hasItem(item)) {
                $gameParty.loseItem(item, $gameParty.numItems(item));
            }
        });
    });

    //-----------------------------------------------------------------------------
    // Game_Party

    /**
     * アイテム保持最大数をPP指定の値に変更(指定がなければ99)
     * @returns number
     */
    Game_Party.prototype.maxItems = function () {
        return param.maxItemCount || 99;
    };

    const _Game_Party_onPlayerWalk = Game_Party.prototype.onPlayerWalk;
    /**
     * 歩いたときにトヘロス・トラマナの残歩数を更新
     */
    Game_Party.prototype.onPlayerWalk = function () {
        _Game_Party_onPlayerWalk.call(this);

        let logging = false;

        /*
         * トヘロス
         */
        if ($s.get(param.tohelosSwitchId)) {

            CSVN_base.logGroup(">> " + this.constructor.name + " onPlayerWalk");
            logging = true;

            let tohelosCount = $v.get(param.tohelosCountVarId);
            tohelosCount--;
            $v.set(param.tohelosCountVarId, tohelosCount);

            CSVN_base.log("tohelosCount: " + tohelosCount);
            if (tohelosCount === 0) {
                $gameTemp.reserveCommonEvent(param.tohelosOutCEVId);
            }
        }

        /*
         * トラマナ
         */
        if ($s.get(param.tramanaSwitchId)) {
            if (!logging) {
                CSVN_base.logGroup(">> " + this.constructor.name + " onPlayerWalk");
                logging = true;
            }

            if (!$gamePlayer.isOnDamageFloor()) {
                /*
                 * ダメージ床に乗っていなければ残歩数を減らす
                 */
                let tramanaCount = $v.get(param.tramanaCountVarId);
                tramanaCount--;
                $v.set(param.tramanaCountVarId, tramanaCount);

                CSVN_base.log("tramanaCount: " + tramanaCount);
                if (tramanaCount === 0) {
                    $gameTemp.reserveCommonEvent(param.tramanaOutCEVId);
                }
            } else {
                /*
                 * ダメージ床に乗っていたら最大値に戻す
                 */
                CSVN_base.log("tramanaCount: " + param.tramanaMaxCount);
                $v.set(param.tramanaCountVarId, param.tramanaMaxCount);
            }
        }

        if (logging) {
            CSVN_base.logGroupEnd(">> " + this.constructor.name + " onPlayerWalk");
        }
    };

    //-----------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_basicFloorDamage = Game_Actor.prototype.basicFloorDamage;
    /**
     * ダメージ床の基礎ダメージ値／トラマナ効果中は0を返す
     * @returns number
     */
    Game_Actor.prototype.basicFloorDamage = function () {
        if ($s.get(param.tramanaSwitchId)) {
            return 0;
        } else {
            return _Game_Actor_basicFloorDamage.call(this);
        }
    };

    //-----------------------------------------------------------------------------
    // SoundManager

    /**
     * 宝箱SE
     */
    SoundManager.playChest = function () {
        AudioManager.playStaticSe({
            name: param.chestSE,
            volume: param.chestSEVolume,
            pitch: param.chestSEPitch
        });
    };

})();