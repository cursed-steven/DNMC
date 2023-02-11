//=============================================================================
// RPG Maker MZ - CSVN_playSeForItemEx.js
// ----------------------------------------------------------------------------
// (C)2022 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2021/07/30 初版
// 2.0.0  2022/11/19 メモ欄対応廃止、プラグインパラメータによる設定に変更
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc スキルタイプ／アイテムの使用効果に応じて追加の効果音を鳴らします。
 * @author cursed_twitch
 * @base CSVN_statics
 * @orderAfter CSVN_statics
 * 
 * @help CSVN_playSeForItemEx.js
 * 
 * メニュー画面上で、スキルタイプやアイテムの使用効果設定に応じて
 * 設定したSEを鳴らします。
 * 
 * ＊スキル
 * スキルタイプに対応して、設定したSEを鳴らします。
 * ※システム1で設定している「スキル使用」もそのまま鳴ります。
 * 
 * ＊アイテム
 * 使用効果に含まれている内容ごとに、設定したSEを鳴らします。
 * 複数種類の使用効果を含むアイテムの場合、先に書いてある方が優先されます。
 * ※システム1で設定している「アイテム使用」もそのまま鳴ります。
 * 
 * @param settingsForSkill
 * @text スキルタイプごとの効果音設定
 * @type struct<SettingsForSkill>[]
 * 
 * @param settingForHPRecovery
 * @text 使用効果「HP回復」の効果音設定
 * @type struct<SettingsForItem>
 * 
 * @param settingForMPRecovery
 * @text 使用効果「MP回復」の効果音設定
 * @type struct<SettingsForItem>
 * 
 * @param settingForStateAdd
 * @text 使用効果「ステート付加」の効果音設定
 * @type struct<SettingsForItem>
 * 
 * @param settingForStateRemove
 * @text 使用効果「ステート解除」の効果音設定
 * @type struct<SettingsForItem>
 * 
 * @param settingForGrow
 * @text 使用効果「成長」の効果音設定
 * @type struct<SettingsForItem>
 */

/*~struct~SettingsForSkill:ja
 * 
 * @param stypeId
 * @text スキルタイプID
 * @desc
 * @type number
 * 
 * @param SE
 * @text SE
 * @type file
 * @dir audio/se
 * 
 * @param SEVolume
 * @text SEボリューム
 * @type number
 * @max 100
 * @min 0
 * @default 90
 * @parent SE
 * 
 * @param SEPitch
 * @text SEピッチ
 * @type numner
 * @max 150
 * @min 50
 * @default 100
 * @parent SE
 */

/*~struct~SettingsForItem:ja
 * 
 * @param SE
 * @text SE
 * @type file
 * @dir audio/se
 * 
 * @param SEVolume
 * @text SEボリューム
 * @type number
 * @max 100
 * @min 0
 * @default 90
 * @parent SE
 * 
 * @param SEPitch
 * @text SEピッチ
 * @type numner
 * @max 150
 * @min 50
 * @default 100
 * @parent SE
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Scene_Skill_playSeForItem = Scene_Skill.prototype.playSeForItem;
    /**
     * スキル使用時に設定済SEを鳴らす。
     */
    Scene_Skill.prototype.playSeForItem = function () {
        _Scene_Skill_playSeForItem.call(this);

        if (!SceneManager.isCurrentScene(Scene_Battle)) {
            if (DataManager.isSkill(this.item())) {
                const stypeId = $dataSkills[this.item().id].stypeId;
                //CSVN_base.log("stypeId: " + stypeId);
                const condition = this.findSkillSESetting(stypeId);
                //CSVN_base.log(condition);
                this.playAdditionalSeForItem(condition);
            }
        }
    };

    /**
     * 与えたスキルタイプに該当する設定を検索して返却する(先勝ち)。
     * @param {number} stypeId 
     * @returns 該当する設定
     */
    Scene_Skill.prototype.findSkillSESetting = function (stypeId) {
        if (!param.settings) return;
        return param.settingsForSkill.find(e => {
            return stypeId === e.stypeId;
        });
    };

    /**
     * 与えた設定に沿ってSEを鳴らす
     * @param {any} condition 
     * @returns void
     */
    Scene_Skill.prototype.playAdditionalSeForItem = function (condition) {
        if (!condition) return;
        AudioManager.playStaticSe({
            name: condition.SE,
            volume: condition.SEVolume,
            pitch: condition.SEPitch
        });
    };

    const _Scene_Item_playSeForItem = Scene_Item.prototype.playSeForItem;
    /**
     * アイテムの使用効果設定に応じて設定したSEを鳴らす
     */
    Scene_Item.prototype.playSeForItem = function () {
        _Scene_Item_playSeForItem.call(this);

        if (!SceneManager.isCurrentScene(Scene_Battle)) {
            if (DataManager.isItem(this.item())) {
                const item = $dataItems[this.item().id];
                CSVN_base.log(item);
                if (item.damage.type === DAMAGE_TYPE.HP_RECOVERY) {
                    this.playAdditionalSeForItem(param.settingForHPRecovery);
                } else if (item.damage.type === DAMAGE_TYPE.MP_RECOVERY) {
                    this.playAdditionalSeForItem(param.settingForMPRecovery);
                } else {
                    const effects = item.effects;
                    //CSVN_base.log(effects);
                    const setting = this.findItemSESetting(effects);
                    //CSVN_base.log(setting);
                    this.playAdditionalSeForItem(setting);
                }
            }
        }
    };

    /**
     * アイテムの使用効果に応じて設定済SEを鳴らす(先勝ち)。
     * @param {any[]} effects 
     * @returns any
     */
    Scene_Item.prototype.findItemSESetting = function (effects) {
        if (!effects) return;
        const effect = effects.find(e => {
            return [
                EFFECTS.HP_RECOVERY.CODE,
                EFFECTS.MP_RECOVERY.CODE,
                EFFECTS.ADD_STATE.CODE,
                EFFECTS.REMOVE_STATE.CODE,
                EFFECTS.GROW.CODE
            ].includes(e.code);
        });
        if (!effect) return;

        let setting;
        switch (effect.code) {
            case 11:
                setting = param.settingForHPRecovery;
                break;
            case 12:
                setting = param.settingForMPRecovery;
                break;
            case 21:
                setting = param.settingForStateAdd;
                break;
            case 22:
                setting = param.settingForStateRemove;
                break;
            case 42:
                setting = param.settingForGrow;
                break;
            default:
                break;
        }

        return setting;
    };

    const _Scene_Skill_playAdditionalSeForItem = Scene_Skill.prototype.playAdditionalSeForItem;
    /**
     * 与えた設定に応じたSEを鳴らす
     * (スキルのときと同じ処理)
     * @param {any} setting 
     */
    Scene_Item.prototype.playAdditionalSeForItem = function (setting) {
        _Scene_Skill_playAdditionalSeForItem.call(this, setting);
    };

})();