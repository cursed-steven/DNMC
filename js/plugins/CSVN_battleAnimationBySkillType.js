//=============================================================================
// RPG Maker MZ - CSVN_battleAnimationBySkillType.js
// ----------------------------------------------------------------------------
// (C)2022 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/12/02 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc スキル発動時、スキルタイプに対応したアニメーションを挿入
 * @author cursed_twitch
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_battleAnimationBySkillType.js
 * 
 * @param settings
 * @text 設定
 * @desc スキルタイプとアニメーションの組み合わせ
 * @type struct<Setting>[]
 */

/*~struct~Setting:ja
 * 
 * @param skillType
 * @text スキルタイプ
 * @type number
 * 
 * @param animation
 * @text アニメーション
 * @type animation
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * スキルタイプIDに対応するアニメーションIDを返す
     * @param {number} stypeId 
     * @returns number
     */
    function findAnimationId(stypeId) {
        const setting = param.settings.find(e => {
            return e.skillType === stypeId;
        });

        return setting ? setting.animation : 0;
    }

    //-----------------------------------------------------------------------------
    // Window_BattleLog

    const _Window_BattleLog_startAction = Window_BattleLog.prototype.startAction;
    /**
     * もともとの処理の前にPPで設定したアニメーションを挿入する
     * @param {Game_Battler} subject 
     * @param {Game_Action} action 
     * @param {Game_Battler[]} targets 
     */
    Window_BattleLog.prototype.startAction = function (subject, action, targets) {
        if (subject._actorId) {
            const skill = $dataSkills[subject._lastBattleSkill._itemId];
            const stypeId = skill ? skill.stypeId : 0;

            if (stypeId !== 0) {
                const additionalAnimationId = findAnimationId(stypeId);
                CSVN_base.log(">>>> " + this.constructor.name + " startAction");
                CSVN_base.log(additionalAnimationId);
                if (additionalAnimationId !== 0) {
                    this.push("showAnimation", subject, [subject].clone(), additionalAnimationId);
                }
            }
        }

        _Window_BattleLog_startAction.call(this, subject, action, targets);
    };

})();