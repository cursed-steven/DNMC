//=============================================================================
// RPG Maker MZ - DNMC_changeCharacter
// ----------------------------------------------------------------------------
// (C)2022 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/02/01 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc プレイヤーキャラの通常・ミニキャラの相互変換
 * @author cursed_twitch
 * @base DNMC_statics
 * @orderAfter DNMC_statics
 * 
 * @help DNMC_changeCharacter.js
 * 
 * @param miniCharSwId
 * @text ミニキャラ化スイッチ
 * @type switch
 * 
 * @command toMini
 * @text 通常→ミニキャラ
 * 
 * @command toNormal
 * @text ミニキャラ→通常
 */

/**
 * staticで外部から呼ぶための関数宣言
 */
function DNMC_changeCharacter() {
    throw new Error("This is a static class");
}

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, "toMini", args => {
        DNMC_changeCharacter.toMini();
    });

    PluginManagerEx.registerCommand(script, "toNormal", args => {
        DNMC_changeCharacter.toNormal();
    });

    /**
     * プレイヤー画像をミニキャラに変更
     * @returns void
     */
    DNMC_changeCharacter.toMini = function () {
        CSVN_base.log(">> DNMC_changeCharacter.toMini");
        const actor = $gameParty.leader();
        const bcfKey = Object.keys(ACTOR_BCF).find(a => {
            return ACTOR_BCF[a].characterIndex === actor.characterIndex()
                && ACTOR_BCF[a].characterName === actor.characterName();
        });
        if (!ACTOR_BCF[bcfKey]) {
            CSVN_base.logWarn("No ACTOR_BCF found.");
            return;
        }

        if (param.miniCharSwId) {
            $s.off(param.miniCharSwId);
        }
        const miniCharIndex = ACTOR_BCF[bcfKey].miniCharIndex;
        const miniCharName = ACTOR_BCF[bcfKey].miniCharName;

        $gameMap._interpreter.command322(
            [
                actor.actorId(),
                miniCharName,
                miniCharIndex,
                actor.faceName(),
                actor.faceIndex(),
                actor.battlerName()
            ]
        );
    };

    /**
     * プレイヤー画像を通常キャラに変更
     * @returns void
     */
    DNMC_changeCharacter.toNormal = function () {
        CSVN_base.log(">> DNMC_changeCharacter.toNormal");
        const actor = $gameParty.leader();
        const bcfKey = Object.keys(ACTOR_BCF).find(a => {
            return ACTOR_BCF[a].miniCharIndex === actor.characterIndex()
                && ACTOR_BCF[a].miniCharName === actor.characterName();
        });
        if (!ACTOR_BCF[bcfKey]) {
            CSVN_base.logWarn("No ACTOR_BCF found.");
            return;
        }

        const characterIndex = ACTOR_BCF[bcfKey].characterIndex;
        const characterName = ACTOR_BCF[bcfKey].characterName;

        $gameMap._interpreter.command322(
            [
                actor.actorId(),
                characterName,
                characterIndex,
                actor.faceName(),
                actor.faceIndex(),
                actor.battlerName()
            ]
        );
    };

    //-----------------------------------------------------------------------------
    // Game_Player

    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function () {
        _Game_Player_performTransfer.call(this);

        if ($gameSwitches.value(param.miniCharSwId)) {
            CSVN_base.log(">> Game_Player.performTransfer -> DNMC_changecharacter.toMini");
            DNMC_changeCharacter.toMini();
        }
    };

})();