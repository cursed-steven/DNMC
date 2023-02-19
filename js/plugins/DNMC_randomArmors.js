//=============================================================================
// RPG Maker MZ - DNMC_randomArmors
// ----------------------------------------------------------------------------
// (C)2023 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/01/02 初版
// 1.1.0  2023/01/12 外部からの生成に対応
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 防具をランダム生成する
 * @author cursed_twitch
 * @base DNMC_base
 * @orderAfter DNMC_base
 * 
 * @help DNMC_randomArmors.js
 * 
 * @command generate
 * @text 防具生成
 * 
 * @arg rank
 * @text ランク
 * @type number
 * @max 3
 * @min 0
 * 
 * @arg type
 * @text 種別
 * @type select
 * @option 汎用品
 * @value 1
 * @option 戦士装備
 * @value 2
 * @option 騎士装備
 * @value 3
 * @option 術師装備
 * @value 4
 * @option 魔道士装備
 * @value 5
 * 
 * @arg slot
 * @text 装備先のスロット
 * @type select
 * @option 盾
 * @value 2
 * @option 頭部
 * @value 3
 * @option 胴体
 * @value 4
 * @option アクセサリ
 * @value 5
 * 
 * @command gainLatest
 * @text 生成した防具を取得
 * 
 * @arg index
 * @text 直前生成分のインデックス
 * @type number
 * 
 * @command reset
 * @text リセット
 */

function DNMC_randomArmors() {
    throw new Error("This is a static class");
}

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * ランダム防具生成
     */
    PluginManagerEx.registerCommand(script, "generate", args => {
        const armor = randomArmor(args.rank, args.type, args.slot);
        DataManager.registerArmor(armor);
        $gameTemp.setLatestGenerated([armor]);
    });

    /**
     * 直近で生成した防具を増やす。
     */
    PluginManagerEx.registerCommand(script, "gainLatest", args => {
        $gameParty.gainItem($gameTemp.getLatestGenerated()[args.index], 1);
    });

    /**
     * 生成した防具(ID2以降)をクリアする
     */
    PluginManagerEx.registerCommand(script, "reset", args => {
        DataManager.resetArmor();
    });

    /**
     * ランダムに防具を生成して返す。
     * @param {number} rank 
     * @param {number} classId 
     * @returns DataArmor
     */
    DNMC_randomArmors.randomArmor = function (rank, classId, slot) {
        const type = randomTypeId(classId);
        const armor = randomArmor(rank, type, slot);
        DataManager.registerArmor(armor);
        $gameTemp.setLatestGenerated([armor]);

        return armor;
    };

    /**
     * 新しい防具IDを発行する。
     * @returns number
     */
    function getNewId() {
        let ids = [];
        for (const armor of $dataArmors) {
            if (armor) ids.push(armor.id);
        }
        const maxId = Math.max.apply(null, ids);

        return maxId + 1;
    }

    /**
     * 指定した職業IDに対応する中でランダムな防具タイプIDを返す。
     * @param {number} classId 
     * @returns number
     */
    function randomTypeId(classId) {
        const suitables = $dataClasses[classId].traits.filter(t => {
            return t.code === Game_BattlerBase.TRAIT_EQUIP_ATYPE;
        });
        const atypeId = suitables[Math.randomInt(suitables.length)].dataId;

        return atypeId;
    }

    /**
     * 装備タイプとスロットに該当する防具タイプオブジェクトを返す。
     * @param {number} type 
     * @param {number} slot 
     * @returns any
     */
    function getAtypeSlot(type, slot) {
        const id = type + "-" + slot;
        const typeObject = ARMOR_TYPE[parseInt(type)];
        return typeObject.find(e => {
            return e && e.id === id;
        });
    }

    /**
     * 指定したランクとスロットに対応する範囲でランダムな
     * 材質オブジェクトを返す。
     * @param {number} rank 
     * @param {number} slot 
     * @returns any
     */
    function randomMaterial(rank, slot) {
        let rankMat = null;

        switch (slot) {
            case 2:
                rankMat = SHIELD_MATERIALS.find(mat => {
                    return mat.rank === rank;
                });
                break;
            case 3:
                rankMat = HEAD_BODY_MATERIALS.find(mat => {
                    return mat.rank === rank;
                });
                break;
            case 4:
                rankMat = HEAD_BODY_MATERIALS.find(mat => {
                    return mat.rank === rank;
                });
                break;
            case 5:
                rankMat = ACCESORY_MATERIALS.find(mat => {
                    return mat.rank === rank;
                });
                break;
        }

        return rankMat
            ? rankMat.materials[Math.randomInt(rankMat.materials.length)]
            : null;
    }

    /**
     * 防具タイプ・スロットと材質に応じてパラメータをランダム設定して返す。
     * @param {any} atypeSlot 
     * @param {any} rankMat 
     * @returns number[]
     */
    function randomParams(atypeSlot, rankMat) {
        return [
            Math.applyVariance(atypeSlot.params[0][rankMat.id - 1], 10),
            Math.applyVariance(atypeSlot.params[1][rankMat.id - 1], 10),
            Math.applyVariance(atypeSlot.params[2][rankMat.id - 1], 10),
            Math.applyVariance(atypeSlot.params[3][rankMat.id - 1], 10),
            Math.applyVariance(atypeSlot.params[4][rankMat.id - 1], 10),
            Math.applyVariance(atypeSlot.params[5][rankMat.id - 1], 10),
            Math.applyVariance(atypeSlot.params[6][rankMat.id - 1], 10),
            Math.applyVariance(atypeSlot.params[7][rankMat.id - 1], 10)
        ];
    }

    /**
     * 材質に応じてランダムな特徴を設定して配列で返す。
     * @param {number} slot 
     * @param {number} mat 
     * @returns Trait_Effect[]
     */
    function randomTraits(slot, mat) {
        let add = false;
        let value = 0;
        let trait = null;
        let traits = [];
        for (let i = 0; i < mat.traits.length; i++) {
            add = Math.trueByRate(mat.traits[i][0]);
            value = Math.randomRange(mat.traits[i][1], mat.traits[i][2]);
            if (add) {
                trait = new Trait_Effect();
                if (i < 12) {
                    // 通常能力値
                    trait.code = Game_BattlerBase.TRAIT_PARAM;
                    trait.dataId = traitsParamDataIdTable(slot, i);
                    trait.value = 1 + value / 100;
                } else if (12 <= i && i < 20) {
                    // 追加能力値
                    trait.code = Game_BattlerBase.TRAIT_XPARAM;
                    trait.dataId = traitsParamDataIdTable(slot, i);
                    trait.value = value / 100;
                } else if (i === 20) {
                    // 攻撃追加回数
                    trait.code = Game_BattlerBase.TRAIT_ATTACK_TIMES;
                    trait.dataId = 0;
                    trait.value = 1;
                } else if (i === 21) {
                    // 行動追加率
                    trait.code = Game_BattlerBase.TRAIT_ACTION_PLUS;
                    trait.dataId = 0;
                    trait.value = 1;
                } else if (22 <= i && i < 44) {
                    // 属性有効度
                    trait.code = Game_BattlerBase.TRAIT_ELEMENT_RATE;
                    trait.dataId = (i % 11) + 1;
                    trait.value = 1 - value / 100;
                } else if (44 <= i && i < 52) {
                    // 弱体有効度
                    trait.code = Game_BattlerBase.TRAIT_DEBUFF_RATE;
                    trait.dataId = i - 44;
                    trait.value = 1 - value / 100;
                } else if (52 <= i && i < 64) {
                    // ステート有効度
                    trait.code = Game_BattlerBase.TRAIT_STATE_RATE;
                    trait.dataId = traitsParamDataIdTable(slot, i);
                    trait.value = 1 - value / 100;
                } else if (64 <= i && i < 78) {
                    // ステート無効化
                    trait.code = Game_BattlerBase.TRAIT_STATE_RESIST;
                    trait.dataId = traitsParamDataIdTable(slot, i);
                    if (trait.dataId === STATE.DEAD) {
                        // 戦闘不能無効はナシ
                        trait = null;
                    }
                } else if (78 <= i && i < 84) {
                    // パーティー能力
                    trait.code = Game_BattlerBase.TRAIT_PARTY_ABILITY;
                    trait.dataId = i - 78;
                } else if (84 <= i) {
                    // 特殊能力値
                    trait.code = Game_BattlerBase.TRAIT_SPARAM;
                    trait.dataId = traitsParamDataIdTable(slot, i);
                    switch (trait.dataId) {
                        case 0:
                            // trt
                            trait.value = 1 - value / 100;
                            break;
                        case 3:
                            // pha
                            trait.value = value / 100;
                            break;
                        case 4:
                            // mp-save
                            trait.value = 1 - value / 100;
                            break;
                        case 5:
                            // tpc
                            trait.value = 1 - value / 100;
                            break;
                        case 8:
                            // fdm
                            trait.value = 1 - value / 100;
                            break;
                        case 9:
                            // exr
                            trait.value = value / 100;
                            break;
                    }
                }

                if (trait && trait.code) traits.push(trait);
            }
        }

        return traits;
    }

    /**
     * スロットに応じた特徴用データIDを返す。
     * @param {number} slot 
     * @param {number} i 
     * @returns number
     */
    function traitsParamDataIdTable(slot, i) {
        let result = null;
        switch (slot) {
            case 2:
                result = tpditForShield(i);
                break;
            case 3:
            case 4:
                result = tpditForHeadBody(i);
                break;
            case 5:
                result = tpditForAccesory(i);
                break;
        }

        return result;
    }

    /**
     * 特徴のインデックスに対応するデータIDの配列を返す
     * (盾・頭部・胴体用)
     * @returns number[]
     */
    function concatDataIds() {
        return PARAMS_DATAIDS
            .concat(ADDITIONAL_PARAMS_DATAIDS)
            .concat(ELEMENT_DATAIDS)
            .concat(ELEMENT_DATAIDS)
            .concat(DEBUFF_DATAIDS)
            .concat(STATE_DATAIDS)
            .concat(STATE_DATAIDS)
            .concat(PARTY_ABILITIES_DATAIDS);
    }

    /**
     * インデックスに対応したデータIDを返す(盾)
     * @param {number} i 
     * @returns number
     */
    function tpditForShield(i) {
        return concatDataIds()[i];
    }

    /**
     * インデックスに対応したデータIDを返す(頭部・胴体)
     * @param {number} i 
     * @returns number
     */
    function tpditForHeadBody(i) {
        return concatDataIds()[i];
    }

    /**
     * インデックスに対応したデータIDを返す(装飾品)
     * @param {number} i 
     * @returns number
     */
    function tpditForAccesory(i) {
        return concatDataIds().concat(SPECIAL_PARAMS_DATAIDS)[i];
    }

    /**
     * 特徴のカテゴリごとに件数を絞る
     * @param {Trait_Effect[]} traits 
     * @param {any} mat 
     * @returns Trait_Effect[]
     */
    function trimTraits(traits, mat) {
        let rix = 0;
        let picked = [];

        // 通常能力値を3件以内に絞る
        let normals = traits.filter(t => {
            return t.code === Game_BattlerBase.TRAIT_PARAM;
        });
        let pickedNormals = [];
        if (normals.length > 3) {
            while (pickedNormals.length < 3) {
                rix = Math.randomInt(normals.length);
                if (!pickedNormals.contains(normals[rix])) {
                    pickedNormals.push(normals[rix]);
                }
            }
        } else {
            pickedNormals = normals;
        }
        picked = picked.concat(pickedNormals);

        // 追加能力値・攻撃回数追加・行動回数追加の全体で1件に絞る
        let additionals = traits.filter(t => {
            return t.code === Game_BattlerBase.TRAIT_XPARAM
                || t.code === Game_BattlerBase.TRAIT_ATTACK_TIMES
                || t.code === Game_BattlerBase.TRAIT_ACTION_PLUS;
        });
        let pickedAdditionals = [];
        if (additionals.length > 1) {
            while (pickedAdditionals.length < 1) {
                rix = Math.randomInt(additionals.length);
                if (!pickedAdditionals.contains(additionals[rix])) {
                    pickedAdditionals.push(additionals[rix]);
                }
            }
        } else {
            pickedAdditionals = additionals;
        }
        picked = picked.concat(pickedAdditionals);

        // 属性有効度を2件以内に絞る
        let elements = traits.filter(t => {
            return t.code === Game_BattlerBase.TRAIT_ELEMENT_RATE;
        });
        // 材質に属性がある場合はその属性を優先してピックする
        let pickedElements = elements.filter(e => {
            return e.dataId === mat.id - 8;
        });
        if (elements.length > 2) {
            while (pickedElements.length < 2) {
                rix = Math.randomInt(elements.length);
                if (!pickedElements.contains(elements[rix])) {
                    pickedElements.push(elements[rix]);
                }
            }
        } else {
            pickedElements = elements;
        }
        picked = picked.concat(pickedElements);

        // 弱体有効度を1件に絞る
        let debuffs = traits.filter(t => {
            return t.code === Game_BattlerBase.TRAIT_DEBUFF_RATE;
        });
        let pickedDebuffs = [];
        if (debuffs.length > 1) {
            while (pickedDebuffs.length < 1) {
                rix = Math.randomInt(debuffs.length);
                if (!pickedDebuffs.contains(debuffs[rix])) {
                    pickedDebuffs.push(debuffs[rix]);
                }
            }
        } else {
            pickedDebuffs = debuffs;
        }
        picked = picked.concat(pickedDebuffs);

        // ステート無効を1件以下に絞る
        let pickedStateNos = traits.find(t => {
            return t.code === Game_BattlerBase.TRAIT_STATE_RESIST;
        });
        if (pickedStateNos) {
            picked.push(pickedStateNos);
        }

        // ステート有効度を2件以下に絞る／ここまでで9件あれば削除
        let pickedStates = traits.filter(t => {
            return t.code === Game_BattlerBase.TRAIT_STATE_RATE;
        });
        if ((pickedStateNos && pickedStates.length > 1)
            || pickedStates.length > 2) {
            // ステート無効とステート有効度が合わせて3件以上になった場合
            // →2件に絞る
            rix = Math.randomInt(pickedStates.length);
            picked.push(pickedStates[rix]);
        } else {
            // そのまま追加する
            picked = picked.concat(pickedStates);
        }

        // パーティー能力を1件に絞る／ここまでで9件あれば削除
        if (picked.length < 9) {
            let party = traits.filter(t => {
                return t.code === Game_BattlerBase.TRAIT_PARTY_ABILITY;
            });
            let pickedParty = [];
            if (party.length > 1) {
                while (pickedParty.length < 1) {
                    rix = Math.randomInt(party.length);
                    if (!pickedParty.contains(party[rix])) {
                        pickedParty.push(party[rix]);
                    }
                }
            } else {
                pickedParty = party;
            }
            picked = picked.concat(pickedParty);
        }

        // 特殊能力値を1件に絞る／ここまでで9件あれば削除
        if (picked.length < 9) {
            let sp = traits.filter(t => {
                return t.code === Game_BattlerBase.TRAIT_SPARAM;
            });
            let pickedSp = [];
            if (sp.length > 1) {
                while (pickedSp.length < 1) {
                    rix = Math.randomInt(sp.length);
                    if (!pickedSp.contains(sp[rix])) {
                        pickedSp.push(sp[rix]);
                    }
                }
            } else {
                pickedSp = sp;
            }
            picked = picked.concat(pickedSp);
        }

        return picked;
    }

    /**
     * 特徴の内容から説明文を出力する。
     * @param {Trait_Effect} trait 
     * @returns string
     */
    function traitToDesc(trait) {
        const tmplParam = "{{param}}{{value}}";
        const tmplElement = "対{{element}}{{value}}";
        const tmplState = "{{state}}やられ{{value}}";
        const tmplDebuff = "{{param}}弱体{{value}}";
        let param = null;
        let elementState = null;
        let value = null;

        switch (trait.code) {
            case Game_BattlerBase.TRAIT_PARAM:
                param = TextManager.param(trait.dataId);
                value = valueStringMultiply(trait.value);
                break;
            case Game_BattlerBase.TRAIT_XPARAM:
                param = TextManager.additionalParam(trait.dataId);
                value = valueStringAddSub(trait.value);
                break;
            case Game_BattlerBase.TRAIT_ATTACK_TIMES:
                return TextManager.trait(trait.code);
                break;
            case Game_BattlerBase.TRAIT_ACTION_PLUS:
                return TextManager.trait(trait.code);
                break;
            case Game_BattlerBase.TRAIT_ELEMENT_RATE:
                elementState = $dataSystem.elements[trait.dataId];
                value = valueStringMultiply(trait.value);
                return value ? tmplElement.replace("{{element}}", elementState).replace("{{value}}", value) : "";
                break;
            case Game_BattlerBase.TRAIT_DEBUFF_RATE:
                param = TextManager.param(trait.dataId);
                value = valueStringMultiply(trait.value);
                return value ? tmplDebuff.replace("{{param}}", param).replace("{{value}}", value) : "";
                break;
            case Game_BattlerBase.TRAIT_STATE_RATE:
                elementState = $dataStates[trait.dataId].name;
                value = valueStringMultiply(trait.value);
                return value ? tmplState.replace("{{state}}", elementState).replace("{{value}}", value) : "";
                break;
            case Game_BattlerBase.TRAIT_STATE_RESIST:
                elementState = $dataStates[trait.dataId].name;
                return elementState + "無効";
                break;
            case Game_BattlerBase.TRAIT_PARTY_ABILITY:
                return TextManager.trait(trait.code, trait.dataId);
                break;
            case Game_BattlerBase.TRAIT_SPARAM:
                param = TextManager.trait(trait.code, trait.dataId);
                value = valueStringMultiply(trait.value);
                break;
        }

        return value ? tmplParam.replace("{{param}}", param).replace("{{value}}", value) : "";
    }

    /**
     * 数値から説明文パーツを組み立てて返す(倍率の場合)
     * @param {number} tvalue 
     * @returns string
     */
    function valueStringMultiply(tvalue) {
        let value = "";
        if (tvalue > 1) {
            value = (Math.floor((tvalue - 1) * 100)).toString() + "%↑";
        } else if (tvalue === 1) {
            return "";
        } else if (tvalue < 1) {
            value = Math.floor(tvalue * 100 - 100).toString().replace("-", "") + "%↓";
        }

        return value;
    }

    /**
     * 数値から説明文パーツを組み立てて返す(確率加算の場合)
     * @param {number} tvalue 
     * @returns string
     */
    function valueStringAddSub(tvalue) {
        let value = "";
        if (tvalue > 0) {
            value = (Math.floor(tvalue * 100)).toString() + "%↑";
        } else if (tvalue === 0) {
            return "";
        } else if (tvalue < 0) {
            value = (Math.floor(tvalue * 100)).toString().replace("-", "") + "%↓";
        }

        return value;
    }

    /**
     * 特徴とその値に応じた価格を返す。
     * @param {Trait_Effect} trait 
     * @returns number
     */
    function traitToPrice(trait) {
        let price = 0;

        switch (trait.code) {
            case Game_BattlerBase.TRAIT_ELEMENT_RATE:
                price = elementEffectivenessToPrice(trait);
                break;
            case Game_BattlerBase.TRAIT_DEBUFF_RATE:
                price = debuffEffectivenessToPrice(trait);
                break;
            case Game_BattlerBase.TRAIT_STATE_RATE:
                price = stateEffectivenessToPrice(trait);
                break;
            case Game_BattlerBase.TRAIT_STATE_RESIST:
                price = stateNoEffectToPrice(trait);
                break;
            case Game_BattlerBase.TRAIT_PARAM:
                price = paramToPrice(trait);
                break;
            case Game_BattlerBase.TRAIT_XPARAM:
                price = additionalParamToPrice(trait);
                break;
            case Game_BattlerBase.TRAIT_SPARAM:
                price = specialParamToPrice(trait);
                break;
            case Game_BattlerBase.TRAIT_ATTACK_ELEMENT:
                price = attackElementToPrice(trait);
                break;
            case Game_BattlerBase.TRAIT_ATTACK_TIMES:
                price = 5000;
                break;
            case Game_BattlerBase.TRAIT_ACTION_PLUS:
                price = 10000;
                break;
            case Game_BattlerBase.TRAIT_PARTY_ABILITY:
                price = partyAbilityToPrice(trait);
                break;
        }

        return Math.floor(price);
    }

    /**
     * 属性有効度の価格を算定して返す
     * @param {Trait_Effect} trait 
     * @returns number
     */
    function elementEffectivenessToPrice(trait) {
        let price = 0;
        if (trait.dataId < 4) {
            // 斬貫打
            price = 20;
        } else if (4 <= trait.dataId && trait.dataId < 7) {
            // 炎氷雷
            price = 50;
        } else if (7 <= trait.dataId && trait.dataId < 10) {
            // 水土風
            price = 70;
        } else if (10 <= trait.dataId) {
            // 光闇
            price = 100;
        }

        return price * (2 - trait.value);
    }

    /**
     * 弱体有効度の価格を算定して返す
     * @param {Trait_Effect} trait 
     * @returns number
     */
    function debuffEffectivenessToPrice(trait) {
        let price = 0;
        switch (trait.dataId) {
            case PARAM.MHP:
                price = 50;
                break;
            case PARAM.MMP:
                price = 100;
                break;
            case PARAM.ATK:
                price = 50;
                break;
            case PARAM.DEF:
                price = 50;
                break;
            case PARAM.MAT:
                price = 70;
                break;
            case PARAM.MDF:
                price = 100;
                break;
            case PARAM.AGI:
                price = 50;
                break;
            case PARAM.LUK:
                price = 30;
                break;
        }

        return price * (2 - trait.value);
    }

    /**
     * ステート有効度の価格を算定して返す
     * @param {Trait_Effect} trait 
     * @returns number
     */
    function stateEffectivenessToPrice(trait) {
        let price = 0;
        switch (trait.dataId) {
            case STATE.DEAD:
                price = 500;
                break;
            case STATE.BERSERK:
                price = 30;
                break;
            case STATE.CONFUSE:
                price = 50;
                break;
            case STATE.TEMPTATION:
                price = 200;
                break;
            case STATE.SILENCE:
                price = 70;
                break;
            case STATE.PHANTOM:
                price = 40;
                break;
            case STATE.PARALYZE:
                price = 50;
                break;
            case STATE.POISON:
                price = 40;
                break;
            case STATE.DEADLY_POISON:
                price = 60;
                break;
            case STATE.MAGICAL_POISON:
                price = 80;
                break;
            case STATE.SLEEP:
                price = 40;
                break;
            case STATE.MP_DOUBLECOST:
                price = 90;
                break;
            case STATE.VULNERABLE:
                price = 60;
                break;
        }

        return price * (2 - trait.value);
    }

    /**
     * ステート無効の価格を算定して返す
     * @param {Trait_Effect} trait 
     * @returns number
     */
    function stateNoEffectToPrice(trait) {
        let price = 0;
        switch (trait.dataId) {
            case STATE.DEAD:
                price = 2000;
                break;
            case STATE.BERSERK:
                price = 200;
                break;
            case STATE.CONFUSE:
                price = 300;
                break;
            case STATE.TEMPTATION:
                price = 500;
                break;
            case STATE.SILENCE:
                price = 300;
                break;
            case STATE.PHANTOM:
                price = 100;
                break;
            case STATE.PARALYZE:
                price = 150;
                break;
            case STATE.POISON:
                price = 100;
                break;
            case STATE.DEADLY_POISON:
                price = 250;
                break;
            case STATE.MAGICAL_POISON:
                price = 300;
                break;
            case STATE.SLEEP:
                price = 120;
                break;
            case STATE.MP_DOUBLECOST:
                price = 150;
                break;
            case STATE.VULNERABLE:
                price = 100;
                break;
        }

        return price;
    }

    /**
     * 通常能力値の価格を算定して返す
     * @param {Trait_Effect} trait 
     * @returns number
     */
    function paramToPrice(trait) {
        let price = 0;
        switch (trait.dataId) {
            case PARAM.MHP:
                price = 50;
                break;
            case PARAM.MMP:
                price = 100;
                break;
            case PARAM.ATK:
                price = 50;
                break;
            case PARAM.DEF:
                price = 50;
                break;
            case PARAM.MAT:
                price = 80;
                break;
            case PARAM.MDF:
                price = 100;
                break;
            case PARAM.AGI:
                price = 50;
                break;
            case PARAM.LUK:
                price = 30;
                break;
        }

        return trait.value > 1
            ? price * trait.value
            : price * (trait.value - 1);
    }

    /**
     * 追加能力値の価格を算定して返す
     * @param {Trait_Effect} trait 
     * @returns number
     */
    function additionalParamToPrice(trait) {
        let price = 0;
        switch (trait.dataId) {
            case ADDITIONAL_PARAM.HIT_RATE:
                price = 50;
                break;
            case ADDITIONAL_PARAM.EVADE_RATE:
                price = 50;
                break;
            case ADDITIONAL_PARAM.CRITICAL_RATE:
                price = 100;
                break;
            case ADDITIONAL_PARAM.STRIKE_BACK_RATE:
                price = 150;
                break;
        }

        return trait.value > 1
            ? price * (1 + trait.value)
            : price * (trait.value - 1);
    }

    /**
     * 特殊能力値の価格を算定して返す
     * @param {Trait_Effect} trait 
     * @returns number
     */
    function specialParamToPrice(trait) {
        let price = 0;
        switch (trait.dataId) {
            case SPECIAL_PARAM.TARGETTED_RATE:
                price = 50;
                trait.value > 1
                    ? price *= trait.value
                    : price *= 2 - trait.value;
                break;
            case SPECIAL_PARAM.PHARMACY:
                price = 200;
                price *= trait.value;
                break;
            case SPECIAL_PARAM.MP_COST_RATE:
                price = 250;
                trait.value < 1
                    ? price *= 2 - trait.value
                    : price *= trait.value - 1;
                break;
            case SPECIAL_PARAM.TP_CHARGE_RATE:
                price = 80;
                trait.value < 1
                    ? price *= 2 - trait.value
                    : price *= trait.value - 1;
                break;
            case SPECIAL_PARAM.FLOOR_DAMAGE_RATE:
                price = 60;
                price *= 2 - trait.value;
                break;
            case SPECIAL_PARAM.EXP_GET_RATE:
                price = 500;
                price *= trait.value;
                break;
        }

        return price;
    }

    /**
     * 攻撃時属性の価格を算定して返す
     * @param {Trait_Effect} trait 
     * @returns number
     */
    function attackElementToPrice(trait) {
        let price = 0;
        if (trait.dataId < 4) {
            // 斬貫打
            price = 0;
        } else if (4 <= trait.dataId && trait.dataId < 7) {
            // 炎氷雷
            price = 1000;
        } else if (7 <= trait.dataId && trait.dataId < 10) {
            // 水土風
            price = 1200;
        } else if (10 <= trait.dataId) {
            // 光闇
            price = 2000;
        }

        return price;
    }

    /**
     * パーティー能力の価格を算定して返す
     * @param {Trait_Effect} trait 
     * @returns number
     */
    function partyAbilityToPrice(trait) {
        let price = 0;
        switch (trait.dataId) {
            case PARTY_ABILITIY.REDUCE_ENCOUNTER:
                price = 1000;
                break;
            case PARTY_ABILITIY.NO_ENCOUNTER:
                price = 3000;
                break;
            case PARTY_ABILITIY.NO_AMBUSH:
                price = 1500;
                break;
            case PARTY_ABILITIY.MORE_PREEMPTIVE:
                price = 2000;
                break;
            case PARTY_ABILITIY.DOUBLE_GOLD:
                price = 10000;
                break;
            case PARTY_ABILITIY.DOUBLE_DROPS:
                price = 5000;
                break;
        }

        return price;
    }

    /**
     * 指定したランク・種別・スロットでランダムな防具を生成して返す
     * @param {number} rank 
     * @param {number} type 
     * @param {number} slot 
     * @returns DataArmor
     */
    function randomArmor(rank, type, slot) {
        const id = getNewId();
        const nameTmpl = "{{matName}}の{{atypeName}}";
        let descItems = [];
        if (!type) {
            type = Math.randomInt(5) + 1;
        }
        if (!slot) {
            slot = Math.randomInt(4) + 1;
        }
        let atypeSlot = getAtypeSlot(type, slot);
        let mat = randomMaterial(rank, slot);

        const matName = mat.name;
        const atypeName = atypeSlot.name[rank];
        const atypeId = atypeSlot.id.split("-")[0];
        const name = nameTmpl
            .replace("{{matName}}", matName)
            .replace("{{atypeName}}", atypeName);
        const iconIndex = atypeSlot.iconIndex[rank];
        const params = randomParams(atypeSlot, mat);
        let price = mat.price;
        descItems.push(TextManager.param(3) + ": " + params[3]);
        let traits = [];
        let traits1 = [];
        let traits2 = [];
        if (atypeSlot.fixedTraits.length > 0) {
            traits1 = traits1.concat(atypeSlot.fixedTraits);
        }
        traits2 = randomTraits(slot, mat);
        traits2 = trimTraits(traits2, mat);
        // traits2が長くなるので1に移動
        while (traits1.length < 3) {
            traits1.push(traits2.shift());
        }
        traits = traits1.concat(traits2);
        for (const trait of traits1) {
            if (trait && traitToDesc(trait)) {
                descItems.push(traitToDesc(trait));
                price += traitToPrice(trait);
            }
        }
        descItems.push("\n");
        for (const trait of traits2) {
            if (trait && traitToDesc(trait)) {
                descItems.push(traitToDesc(trait));
                price += traitToPrice(trait);
            }
        }

        let armor = new DataArmor();
        armor.id = id;
        armor.atypeId = parseInt(atypeId);
        armor.etypeId = slot;
        armor.name = name;
        armor.traits = traits;
        armor.description = descItems.join("／").replace("／\n／", "\n");
        armor.iconIndex = iconIndex;
        armor.params = params;
        armor.price = price;

        return armor;
    }

    /**
     * 防具クラス。
     */
    class DataArmor {
        id = 0;
        atypeId = 0;
        etypeId = 0;
        description = "";
        traits = [];
        iconIndex = 0;
        name = "";
        params = [0, 0, 0, 0, 0, 0, 0, 0];
        price = 0;
        meta = {};

        get id() {
            return this.id;
        }

        set id(id) {
            this.id = id;
        }

        get atypeId() {
            return this.atypeId;
        }

        set atypeId(atypeId) {
            return this.atypeId = atypeId;
        }

        get etypeId() {
            return this.etypeId;
        }

        set etypeId(etypeId) {
            this.etypeId = etypeId;
        }

        get description() {
            return this.description;
        }

        set description(description) {
            this.description = description;
        }

        get traits() {
            return this.traits;
        }

        set traits(traits) {
            this.traits = traits;
        }

        get iconIndex() {
            return this.iconIndex;
        }

        set iconIndex(iconIndex) {
            this.iconIndex = iconIndex;
        }

        get name() {
            return this.name;
        }

        set name(name) {
            this.name = name;
        }

        get params() {
            return this.params;
        }

        set params(params) {
            this.params = params;
        }

        get price() {
            return this.price;
        }

        set price(price) {
            this.price = price;
        }

        get meta() {
            return this.meta;
        }

        set meta(obj) {
            this.meta = obj;
        }
    }
})();