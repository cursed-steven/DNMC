//=============================================================================
// RPG Maker MZ - DNMC_randomActors
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/01/11 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc アクターをランダム生成する
 * @author cursed_steven
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
 * @param generatedActorsVarId
 * @text 生成アクターIDリスト
 * @desc 生成したアクターのリストを保持する変数、CSVN_xuidasTavernの使用可能アクターリストと合わせる。
 * @type variable
 * 
 * @param reserveMemberVarId
 * @text 控えメンバーを入れる変数ID
 * @desc CSVN_xuidasTavernと必ず合わせること
 * @type variable
 * 
 * @command generate
 * @text アクター生成
 * 
 * @arg classId
 * @text 職業
 * @desc 0を指定するとランダム
 * @type class
 * 
 * @arg sex
 * @text 性別
 * @desc 指定しなければランダム
 * @type select
 * @option ランダム
 * @value 
 * @option 男性
 * @value m
 * @option 女性
 * @value f
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
 * @command reserveLatest
 * @text 生成したアクターを控えに追加する
 * 
 * @arg index
 * @text 直前生成分のインデックス
 * @type number
 * 
 * @command setIdToVarSoon
 * @text 生成直後のアクターIDを指定変数に格納
 * 
 * @arg targetVarId
 * @text 格納先変数
 * @type variable
 * 
 * @command reset
 * @text リセット
 */

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

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * ランダムアクター生成
     */
    PluginManagerEx.registerCommand(script, "generate", args => {
        const actor = randomActor(args.classId, args.sex, args.rank);
        DataManager.registerActor(actor);
        registerActorId(actor.id);
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
     * 直近で生成したアクターを控えメンバーに入れる
     */
    PluginManagerEx.registerCommand(script, "reserveLatest", args => {
        const actorId = $gameTemp.getLatestGenerated()[args.index].id
        let reserves = $v.get(param.reserveMemberVarId).toString().split(",");
        reserves.push(actorId);
        // 0は除外しておく
        reserves = reserves.filter(r => {
            return parseInt(r) !== 0;
        });
        $v.set(param.reserveMemberVarId, reserves.join(","));
    });

    /**
     * 直近で生成したアクターのIDを指定変数に入れる
     */
    PluginManagerEx.registerCommand(script, "setIdToVarSoon", args => {
        $v.set(args.targetVarId, $gameTemp.getLatestGenerated()[0].id);
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
     * @param {number} classId 
     * @param {string} sex
     * @returns any
     */
    function randomClass(classId, sex) {
        let swId = 0;
        if (!sex) {
            sex = ["m", "f"][Math.randomInt(2)];
        }
        const maxId = $dataClasses.length;

        if (classId === 0) {
            Math.randomInt(maxId);
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
        }
        const bcf = classId.toString() + sex;

        return {
            classId: classId,
            sex: sex,
            battlerName: ACTOR_BCF[bcf].battlerName,
            characterIndex: ACTOR_BCF[bcf].characterIndex,
            characterName: ACTOR_BCF[bcf].characterName,
            faceIndex: ACTOR_BCF[bcf].characterIndex,
            faceName: ACTOR_BCF[bcf].characterName
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
     * @param {number} classId 
     * @param {string} sex
     * @param {number} rank 
     * @returns DataActor
     */
    function randomActor(classId, sex, rank) {
        console.group(">> DNMC_randomActors randomActor");

        const id = getNewId();
        console.log("getNewId----");
        const bcf = randomClass(classId, sex);
        console.log("randomClass----");
        const initialLevel = $gameParty.averageLevel();
        console.log("averageLevel----");
        const name = randomName(bcf.sex);
        console.log("randomName----");
        const weapon = DNMC_randomWeapons.randomWeapon(rank, bcf.classId);
        console.log("randomWeapon----");
        const shield = DNMC_randomArmors.randomArmor(rank, bcf.classId, 2);
        console.log("randomArmor/shield----");
        const head = DNMC_randomArmors.randomArmor(rank, bcf.classId, 3);
        console.log("randomArmor/head----");
        const armor = DNMC_randomArmors.randomArmor(rank, bcf.classId, 4);
        console.log("randomArmor/body----");
        const acc = DNMC_randomArmors.randomArmor(rank, bcf.classId, 5);
        console.log("randomArmor/accesory----");
        const weaponId = weapon ? weapon.id : 0;
        const shieldId = shield ? shield.id : 0;
        const headId = head ? head.id : 0;
        const armorId = armor ? armor.id : 0;
        const accId = acc ? acc.id : 0;
        const equips = [weaponId, shieldId, headId, armorId, accId];

        console.groupEnd(">> DNMC_randomActors randomActor");

        let actor = new DataActor();
        actor.id = id;
        actor.battlerName = bcf.battlerName;
        actor.characterIndex = bcf.characterIndex;
        actor.characterName = bcf.characterName;
        actor.faceIndex = bcf.faceIndex;
        actor.faceName = bcf.faceName;
        actor.classId = bcf.classId;
        actor.initialLevel = initialLevel;
        actor.equips = equips;
        actor.name = name;

        return actor;
    }

    function registerActorId(id) {
        let registered = $v.get(param.generatedActorsVarId).toString().split(",");
        registered.push(id);
        $v.set(param.generatedActorsVarId, registered.join(","));
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
})();