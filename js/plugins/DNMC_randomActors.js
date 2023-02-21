//=============================================================================
// RPG Maker MZ - DNMC_randomActors
// ----------------------------------------------------------------------------
// (C)2023 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/01/11 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc アクターをランダム生成する
 * @author cursed_twitch
 * @base DNMC_base
 * @base DNMC_randomWeapons
 * @base DNMC_randomArmors
 * @orderAfter DNMC_base
 * 
 * @help DNMC_randomActors.js
 * 
 * @param classSwIx
 * @text 職業アンロックスイッチのインデックス
 * @desc classId + この値 = 職業のアンロックスイッチのID
 * @type switch
 * 
 * @command generate
 * @text アクター生成
 * 
 * @arg rank
 * @text 武器・防具のランク
 * @type number
 * @max 3
 * @min 0
 * 
 * @command joinLatest
 * @text 生成したアクターを加入させる
 * 
 * @arg index
 * @text 直前生成分のインデックス
 * @type number
 * 
 * @command reset
 * @text リセット
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * ランダムアクター生成
     */
    PluginManagerEx.registerCommand(script, "generate", args => {
        const actor = randomActor(args.rank);
        DataManager.registerActor(actor);
        $gameTemp.setLatestGenerated([actor]);
    });

    /**
     * 直近で生成したアクターを加入させる。
     */
    PluginManagerEx.registerCommand(script, "joinLatest", args => {
        const actorId = $gameTemp.getLatestGenerated()[args.index].id
        $gameParty.addActor(actorId);
    });

    /**
     * 生成したアクター(ID2以降)をクリアする
     */
    PluginManagerEx.registerCommand(script, "reset", args => {
        DataManager.resetActor();
    });

    /**
     * 新しいアクターIDを発行する。
     * @returns number
     */
    function getNewId() {
        let ids = [];
        for (const actor of $dataActors) {
            if (actor) ids.push(actor.id);
        }
        const maxId = Math.max.apply(null, ids);

        return maxId + 1;
    }

    /**
     * ランダムな職業を選出して関連情報をセットで返す。
     * @returns any
     */
    function randomClass() {
        let classId = 0;
        let swId = 0;
        const sex = ["m", "f"][Math.randomInt(2)];
        const maxId = $dataClasses.length;

        classId = Math.randomInt(maxId);
        swId = classId + param.classSwIx;
        let missCount = 0;
        // 職業アンロックされているものが出るまで再抽選
        while (!$s.get(swId)) {
            missCount++;
            classId = Math.randomInt(maxId);
            swId = classId + param.classSwIx;
            if (missCount >= 35) {
                throw new Error("no class unlocked");
            }
        }
        const bcf = classId.toString() + sex;

        return {
            classId: classId,
            sex: sex,
            battlerName: ACTOR_BCF[bcf].battlerName,
            characterIndex: ACTOR_BCF[bcf].characterIndex,
            characterName: ACTOR_BCF[bcf].characterName,
            faceIndex: ACTOR_BCF[bcf].faceIndex,
            faceName: ACTOR_BCF[bcf].faceName
        };
    }

    /**
     * 名前ファイルから指定性別のランダムな名を返す。
     * @param {number} sex 
     * @returns string
     */
    function randomName(sex) {
        const size = $dataUniques.names[sex].length;
        return $dataUniques.names[sex][Math.randomInt(size)];
    }

    /**
     * ランダムなアクターを生成する。
     * @returns DataActor
     */
    function randomActor(rank) {
        CSVN_base.logGroup(">> DNMC_randomActors randomActor");

        const id = getNewId();
        CSVN_base.log("getNewId----");
        const bcf = randomClass();
        CSVN_base.log("randomClass----");
        const initialLevel = $gameParty.averageLevel();
        CSVN_base.log("averageLevel----");
        const name = randomName(bcf.sex);
        CSVN_base.log("randomName----");
        const weapon = DNMC_randomWeapons.randomWeapon(rank, bcf.classId);
        CSVN_base.log("randomWeapon----");
        const shield = DNMC_randomArmors.randomArmor(rank, bcf.classId, 2);
        CSVN_base.log("randomArmor/shield----");
        const head = DNMC_randomArmors.randomArmor(rank, bcf.classId, 3);
        CSVN_base.log("randomArmor/head----");
        const armor = DNMC_randomArmors.randomArmor(rank, bcf.classId, 4);
        CSVN_base.log("randomArmor/body----");
        const acc = DNMC_randomArmors.randomArmor(rank, bcf.classId, 5);
        CSVN_base.log("randomArmor/accesory----");
        const weaponId = weapon ? weapon.id : 0;
        const shieldId = shield ? shield.id : 0;
        const headId = head ? head.id : 0;
        const armorId = armor ? armor.id : 0;
        const accId = acc ? acc.id : 0;
        const equips = [weaponId, shieldId, headId, armorId, accId];

        CSVN_base.logGroupEnd(">> DNMC_randomActors randomActor");

        let actor = new DataActor();
        actor.id = id;
        actor.battlerName = bcf.battlerName;
        actor.characterIndex = bcf.characterIndex;
        actor.characterName = bcf.characterName;
        actor.classId = bcf.classId;
        actor.initialLevel = initialLevel;
        actor.equips = equips;
        actor.name = name;

        return actor;
    }

    //-------------------------------------------------------------------------
    // Game_BattlerBase

    /**
     * objにundefinedが混入する場合があることへの対策
     * @returns any[]
     */
    Game_BattlerBase.prototype.allTraits = function () {
        return this.traitObjects().reduce((r, obj) => {
            return obj
                ? r.concat(obj.traits)
                : r.concat();
        }, []);
    };

    /**
     * traitがundefined/nullになる場合の対策
     * @param {number} code 
     * @returns any[]
     */
    Game_BattlerBase.prototype.traits = function (code) {
        return this.allTraits().filter(trait => trait && trait.code === code);
    };

    /**
     * 特定項目の特徴を抽出
     * @param {number} code 
     * @param {number} id 
     * @returns any[]
     */
    Game_BattlerBase.prototype.traitsWithId = function (code, id) {
        return this.allTraits().filter(
            trait => trait && trait.code === code && trait.dataId === id
        );
    };

    //-------------------------------------------------------------------------
    // Game_Actor

    /**
     * レベルアップ
     */
    Game_Actor.prototype.levelUp = function () {
        this._level++;
        for (const learning of this.currentClass().learnings) {
            // 基準レベルを超えたら所定の方法で算出した確率で習得
            if (learning.level <= this._level
                && Math.trueByRate(this.learnRate(learning))) {
                this.learnSkill(learning.skillId);
            }
        }
    };

    /**
     * スキルの習得率を算出して返す
     * @param {any} learning 
     * @returns number
     */
    Game_Actor.prototype.learnRate = function (learning) {
        let rate = (this._level - learning.level + 1) * 12.5;

        if (this._level >= $dataActors[this._actorId].initialLevel) {
            rate *= 4;
        }

        return rate;
    }

    //-------------------------------------------------------------------------
    // Game_Party

    /**
     * パーティーの平均レベルを返す。
     * @returns number
     */
    Game_Party.prototype.averageLevel = function () {
        const sum = this.members().reduce((v, e) => v += e.level, 0);
        return Math.floor(sum / this.size());
    };

    /**
     * アクタークラス。
     */
    class DataActor {
        id = 0;
        battlerName = "";
        characterIndex = 0;
        characterName = "";
        classId = 0;
        equips = [];
        faceIndex = 0;
        faceName = "";
        traits = [];
        initialLevel = 1;
        maxLevel = 99;
        name = "";
        nickName = "";
        note = "";
        profile = "";
        meta = {};

        get id() {
            return this.id;
        };

        set id(id) {
            this.id = id;
        }

        get battlerName() {
            return this.battlerName;
        };

        set battlerName(bn) {
            this.battlerName = bn;
        };

        get characterIndex() {
            return this.characterIndex;
        };

        set characterIndex(ci) {
            this.characterIndex = ci;
        }

        get characterName() {
            return this.characterName;
        };

        set characterName(cn) {
            this.characterName = cn;
        };

        get classId() {
            return this.classId;
        };

        set classId(ci) {
            this.classId = ci;
        }

        get equips() {
            return this.equips;
        };

        set equips(eq) {
            this.equips = eq;
        };

        get faceIndex() {
            return this.faceIndex;
        };

        set faceIndex(fi) {
            this.faceIndex = fi;
        };

        get faceName() {
            return this.faceName;
        };

        set faceName(fn) {
            this.faceName = fn;
        };

        get traits() {
            return this.traits;
        };

        set traits(traits) {
            this.traits = traits;
        };

        get initialLevel() {
            return this.initialLevel;
        };

        set initialLevel(il) {
            this.initialLevel = il;
        };

        get maxLevel() {
            return this.maxLevel;
        };

        set maxLevel(ml) {
            this.maxLevel = ml;
        };

        get name() {
            return this.name;
        };

        set name(name) {
            this.name = name;
        };

        get nickName() {
            return this.nickName;
        };

        set nickName(nn) {
            this.nickName = nn;
        };

        get note() {
            return this.note;
        };

        set note(note) {
            this.note = note;
        };

        get profile() {
            return this.profile;
        };

        set profile(p) {
            this.profile = p;
        };

        get meta() {
            return this.meta;
        };

        set meta(meta) {
            this.meta = meta;
        };
    }

})();