//=============================================================================
// RPG Maker MZ - DNMC_randomWeapons
// ----------------------------------------------------------------------------
// (C)2022 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/12/26 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 武器をランダム生成する
 * @author cursed_steven
 * @base DNMC_base
 * @orderAfter DNMC_base
 * 
 * @help DNMC_randomWeapons.js
 * 
 * @param generatedWeaponsVarId
 * @text 生成武器IDリスト
 * @desc 生成した武器のリストを保持する変数
 * @type variable
 * 
 * @command generate
 * @text 武器生成
 * 
 * @arg rank
 * @text ランク
 * @type number
 * @max 3
 * @min 0
 * 
 * @arg classId
 * @text 職業ID
 * @type class
 * 
 * @command gainLatest
 * @text 生成した武器を取得
 * 
 * @arg index
 * @text 直前生成分のインデックス
 * @type number
 * 
 * @command reset
 * @text リセット
*/

/**
 * staticで外部から呼ぶための関数宣言
 */
function DNMC_randomWeapons() {
    throw new Error("This is a static class");
}

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * ランダム武器生成。
     */
    PluginManagerEx.registerCommand(script, "generate", args => {
        const weapon = randomWeapon(args.rank, args.classId);
        DataManager.registerWeapon(weapon);
        registerWeaponId(weapon.id);
        $gameTemp.setLatestGenerated([weapon]);
    });

    /**
     * 直近で生成した武器を増やす。
     */
    PluginManagerEx.registerCommand(script, "gainLatest", args => {
        $gameParty.gainItem($gameTemp.getLatestGenerated()[args.index], 1);
    });

    /**
     * 生成した武器(ID2以降)をクリアする
     */
    PluginManagerEx.registerCommand(script, "reset", args => {
        DataManager.resetWeapon();
    });

    /**
     * ランダムに武器を生成して返す。
     * @param {number} rank 
     * @returns DataWeapon
     */
    DNMC_randomWeapons.randomWeapon = function (rank, classId) {
        const weapon = randomWeapon(rank, classId);
        DataManager.registerWeapon(weapon);
        registerWeaponId(weapon.id);
        $gameTemp.setLatestGenerated([weapon]);

        return weapon;
    };

    /**
     * 新しい武器IDを発行する。
     * @returns number
     */
    function getNewId() {
        let ids = [];
        for (const weapon of $dataWeapons) {
            if (weapon) ids.push(weapon.id);
        }
        const maxId = Math.max.apply(null, ids);

        return maxId + 1;
    }

    /**
     * 指定した職業IDに対応する中でランダムな武器タイプオブジェクトを返す。
     * @param {number} classId 
     * @returns number
     */
    function randomWtype(classId) {
        const suitables = $dataClasses[classId].traits.filter(t => {
            return t.code === Game_BattlerBase.TRAIT_EQUIP_WTYPE;
        });
        const wtypeId = suitables[Math.randomInt(suitables.length)].dataId;

        return WEAPON_TYPE[wtypeId];
    }

    /**
     * 指定したランクの中でランダムな材質オブジェクトを返す。
     * @param {number} rank 
     * @returns any
     */
    function randomMaterial(rank) {
        const rankMat = WEAPON_MATERIALS.find(mat => {
            return mat.rank === rank;
        });
        return rankMat.materials[Math.randomInt(rankMat.materials.length)];
    }

    /**
     * 武器種と材質の組み合わせが適切かどうかを返す。
     * @param {number} rank 
     * @param {any} wtype 
     * @param {any} mat 
     * @returns boolean
     */
    function isNGPairWtypeMat(rank, wtype, mat) {
        // rank:0では銃NG
        if (rank === 0
            && wtype.id === WEAPON_TYPE_ID.GUN) {
            return true;
        }

        // グローブは革以外NG
        if (wtype.id === WEAPON_TYPE_ID.GLOVE) {
            if (mat.id !== MATERIAL_ID.LEATHER) {
                return true;
            }
        }

        // 革はムチとグローブ以外NG
        if (mat.id === MATERIAL_ID.LEATHER) {
            if (wtype.id !== WEAPON_TYPE_ID.WHIP
                && wtype.id !== WEAPON_TYPE.GLOVE) {
                return true;
            }
        }

        // 木は剣、杖、弓、クロスボウ以外NG
        if (mat.id === MATERIAL_ID.WOOD) {
            if (wtype.id !== WEAPON_TYPE_ID.SWORD
                && wtype.id !== WEAPON_TYPE_ID.STAFF
                && wtype.id !== WEAPON_TYPE_ID.BOW
                && wtype.id !== WEAPON_TYPE_ID.CROSS_BOW) {
                return true;
            }
        }

        // 石と銅はムチがNG
        if (mat.id === MATERIAL_ID.STONE
            || mat.id === MATERIAL_ID.COPPER) {
            if (wtype.id === WEAPON_TYPE_ID.WHIP
                || wtype.id === WEAPON_TYPE_ID.GLOVE) {
                return true;
            }
        }

        return false;
    }

    /**
     * 武器種と材質に応じてパラメータをランダム設定して返す。
     * @param {nay} wtype
     * @param {number} matId 
     * @returns number[]
     */
    function randomParams(wtype, matId) {
        return [
            Math.applyVariance(wtype.params[0][matId - 1], 10),
            Math.applyVariance(wtype.params[1][matId - 1], 10),
            Math.applyVariance(wtype.params[2][matId - 1], 10),
            Math.applyVariance(wtype.params[3][matId - 1], 10),
            Math.applyVariance(wtype.params[4][matId - 1], 10),
            Math.applyVariance(wtype.params[5][matId - 1], 10),
            Math.applyVariance(wtype.params[6][matId - 1], 10),
            Math.applyVariance(wtype.params[7][matId - 1], 10)
        ];
    }

    /**
     * 材質に対応するランダムな特徴を生成して返す。
     * @param {any} mat 
     * @returns any[]
     */
    function randomTraits(mat) {
        let add = false;
        let value = 0;
        let trait = null;
        let traits = [];
        for (let i = 0; i < mat.traits.length; i++) {
            add = Math.trueByRate(mat.traits[i][0]);
            value = Math.randomRangeInt(mat.traits[i][1], mat.traits[i][2]);
            if (add) {
                trait = new Trait_Effect();
                if (i < 12) {
                    // 通常能力値
                    trait.code = Game_BattlerBase.TRAIT_PARAM;
                    trait.dataId = traitsParamDataIdTable(i);
                    trait.value = 1 + value / 100;
                } else if (12 <= i && i < 20) {
                    // 追加能力値
                    trait.code = Game_BattlerBase.TRAIT_XPARAM;
                    trait.dataId = traitsParamDataIdTable(i);
                    trait.value = value / 100;
                } else if (i === 20) {
                    // 攻撃追加回数
                    trait.code = Game_BattlerBase.TRAIT_ATTACK_TIMES;
                    trait.dataId = 0;
                    trait.value = 1;
                } else if (i === 21) {
                    // 攻撃追加回数
                    trait.code = Game_BattlerBase.TRAIT_ATTACK_TIMES;
                    trait.dataId = 0;
                    trait.value = 1;
                    // // 行動追加率
                    // trait.code = Game_BattlerBase.TRAIT_ACTION_PLUS;
                    // trait.dataId = 0;
                    // trait.value = 1;
                }

                if (trait && trait.code) traits.push(trait);
            }
        }

        return traits;
    }

    /**
     * 材質の特徴のインデックスに対応するdataIdを返す。
     * @param {number} index 
     * @returns number
     */
    function traitsParamDataIdTable(index) {
        const table = [
            PARAM.ATK, PARAM.ATK,
            PARAM.MAT, PARAM.MAT,
            PARAM.AGI, PARAM.AGI,
            PARAM.LUK, PARAM.LUK,
            PARAM.MHP, PARAM.MHP,
            PARAM.MMP, PARAM.MMP,
            ADDITIONAL_PARAM.HIT_RATE, ADDITIONAL_PARAM.HIT_RATE,
            ADDITIONAL_PARAM.EVADE_RATE, ADDITIONAL_PARAM.EVADE_RATE,
            ADDITIONAL_PARAM.CRITICAL_RATE, ADDITIONAL_PARAM.CRITICAL_RATE,
            ADDITIONAL_PARAM.STRIKE_BACK_RATE, ADDITIONAL_PARAM.STRIKE_BACK_RATE
        ];

        return table[index];
    }

    /**
     * 特徴の内容から説明文を出力する。
     * @param {any} trait 
     * @returns string
     */
    function traitToDesc(trait) {
        const tmpl = "{{param}}: {{value}}";
        let param = null;
        let value = null;

        switch (trait.code) {
            case Game_BattlerBase.TRAIT_PARAM:
                if (trait.value === 1) return "";
                param = TextManager.param(trait.dataId);
                value = valueStringMultiply(trait.value);
                break;
            case Game_BattlerBase.TRAIT_XPARAM:
                if (trait.value === 0) return "";
                param = TextManager.additionalParam(trait.dataId);
                value = valueStringAddSub(trait.value);
                break;
            case Game_BattlerBase.TRAIT_ATTACK_ELEMENT:
                return $dataSystem.elements[trait.dataId];
                break;
            case Game_BattlerBase.TRAIT_ATTACK_TIMES:
                return TextManager.trait(trait.code);
                break;
            case Game_BattlerBase.TRAIT_ACTION_PLUS:
                return TextManager.trait(trait.code);
                break;
        }

        const result = param && value
            ? tmpl.replace("{{param}}", param).replace("{{value}}", value)
            : "";

        return result;
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
     * 指定したランクでランダムな武器を生成して返す。
     * @param {number} rank 
     * @param {number} classId 
     * @returns DataWeapon
     */
    function randomWeapon(rank, classId) {
        const id = getNewId();
        const nameTmpl = "{{matName}}の{{wtypeName}}";
        let descItems = [];
        let wtype = randomWtype(classId);
        let mat = randomMaterial(rank);

        console.group(">> DNMC_randomWeapon isNGPairWtypeMat");
        let ngCount = 0;
        while (isNGPairWtypeMat(rank, wtype, mat)) {
            if (ngCount >= 10) {
                console.log($dataSystem.weaponTypes[wtype.id]);
                console.log(wtype);
                console.log(mat);
                throw new Error("something went wrong, NG pair of wtype/mat.");
            }
            ngCount++;
            wtype = randomWtype(classId);
            mat = randomMaterial(rank);
        }
        console.groupEnd(">> DNMC_randomWeapon isNGPairWtypeMat");

        const name = nameTmpl.replace("{{matName}}", mat.name).replace("{{wtypeName}}", $dataSystem.weaponTypes[wtype.id]);
        const wtypeId = wtype.id;
        const iconIndex = wtype.iconIndex[rank];
        const animationId = wtype.animationId[mat.id - 1];
        const params = randomParams(wtype, mat.id);
        let price = mat.price;
        descItems.push(TextManager.param(2) + ": " + params[2]);
        let traits1 = [];
        let traits2 = [];
        traits1 = traits1.concat(wtype.fixedTraits);
        traits1 = traits1.concat(mat.elementTraits);
        for (const trait of traits1) {
            if (trait && traitToDesc(trait)) {
                descItems.push(traitToDesc(trait));
                price += traitToPrice(trait);
            }
        }
        descItems.push("\n");
        traits2 = randomTraits(mat);
        for (const trait of traits2) {
            if (trait && traitToDesc(trait)) {
                descItems.push(traitToDesc(trait));
                price += traitToPrice(trait);
            }
        }
        const traits = traits1.concat(traits2);

        // 不利な特徴で価格が0以下になる場合があるのでケア
        if (price <= 0) price = 1;

        let weapon = new DataWeapon();
        weapon.id = id;
        weapon.animationId = animationId;
        weapon.name = name;
        weapon.traits = traits;
        weapon.description = descItems.join("／").replace("／\n／", "\n");
        weapon.wtypeId = wtypeId;
        weapon.iconIndex = iconIndex;
        weapon.params = params;
        weapon.price = price;

        return weapon;
    }

    function registerWeaponId(id) {
        let registered = $v.get(param.generatedWeaponsVarId).toString().split(",");
        registered.push(id);
        $v.set(param.generatedWeaponsVarId, registered.join(","));
    }

    /**
     * 武器クラス。
     */
    class DataWeapon {
        id = 0;
        animationId = 0;
        description = "";
        etypeId = 1;
        traits = [];
        wtypeId = 0;
        iconIndex = 0;
        name = "";
        params = [0, 0, 0, 0, 0, 0, 0, 0];
        price = 0;
        meta = {};

        constructor() { }

        get id() {
            return this.id;
        }

        set id(id) {
            this.id = id;
        }

        get animationId() {
            return this.animationId;
        }

        set animationId(animationId) {
            this.animationId = animationId;
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

        get wtypeId() {
            return this.wtypeId;
        }

        set wtypeId(wtypeId) {
            this.wtypeId = wtypeId;
        }

        get meta() {
            return this.meta;
        }

        set meta(obj) {
            this.meta = obj;
        }
    }

})();