//=============================================================================
// RPG Maker MZ - DNMC_base
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
 * @plugindesc Donut Machine 内で共通利用する関数群
 * @author cursed_steven
 * @base DNMC_statics
 * @orderAfter DNMC_statics
 * 
 * @help DNMC_base.js
 */

/**
 * Trait/Effect
 * 
 * The class that contains code, dataId, value1/2.
 */
class Trait_Effect {
    code = 0;
    dataId = 0;
    value = 0;
    value1 = 0;
    value2 = 0;

    constructor(code, dataId, value1, value2) {
        this.code = code;
        this.dataId = dataId;
        this.value = value1;
        this.value1 = value1;
        this.value2 = value2;
    }

    get code() {
        return this.code;
    }

    set code(code) {
        this.code = code;
    }

    get dataId() {
        return this.dataId;
    }

    set dataId(dataId) {
        this.dataId = dataId;
    }

    get value() {
        return this.value;
    }

    set value(value) {
        this.value = value;
    }

    get value1() {
        return this.value1;
    }

    set value1(value) {
        this.value1 = value;
    }

    get value2() {
        return this.value2;
    }

    set value2(value) {
        this.value2 = value;
    }

}

//-----------------------------------------------------------------------------
// DNMC_base
//
// Common static functions for Donut Machine.

function DNMC_base() {
    throw new Error("This is a static class");
}

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * いまいるのがHUD非表示マップかどうかを返す
     * @returns boolean
     */
    DNMC_base.isMapNoHUD = function () {
        return this.isMapForCredit() || this.isMapForInit();
    };

    /**
     * いまいるのが初期処理用マップかどうかを返す
     * @returns boolean
     */
    DNMC_base.isMapForInit = function () {
        return $gameMap.mapId() === MAP_INIT;
    };

    /**
     * いまいるのがクレジット用マップかどうかを返す
     * @returns boolean
     */
    DNMC_base.isMapForCredit = function () {
        return $gameMap.mapId() === MAP_FOR_CREDIT;
    };

    /**
     * 指定した職業の装備可能な武器タイプをIDの配列で返す。
     * @param {number} classId 
     * @returns number[]
     */
    DNMC_base.getClassWeaponTypes = function (classId) {
        const weaponTraits = $dataClasses[classId].traits.filter(t => {
            return t.code === Game_BattlerBase.TRAIT_EQUIP_WTYPE;
        });

        let wtypeIds = [];
        for (const trait of weaponTraits) {
            wtypeIds.push(trait.dataId);
        }

        return wtypeIds;
    };

    /**
     * ランクに応じたランダムな職業(ID)を返す
     * @param {number} rank 
     * @returns number
     */
    DNMC_base.randomClass = function (rank) {
        let result = 0;
        if (typeof rank !== 'number') {
            const flat = [].concat(...RANKS_JOBS);
            result = flat[Math.randomInt(flat.length)];
        } else {
            const classes = RANKS_JOBS[rank];
            result = classes[Math.randomInt(classes.length)];
        }

        return result;
    }

    //-----------------------------------------------------------------------------
    // Bitmap

    const _Bitmap_initialize = Bitmap.prototype.initialize;
    /**
     * フォント描画の調整
     * @param {number} width 
     * @param {number} height 
     */
    Bitmap.prototype.initialize = function (width, height) {
        _Bitmap_initialize.call(this, width, height);
        this.outlineColor = "rgba(0, 0, 0, 1)";
        this.outlineWidth = 6;
    };

    //-----------------------------------------------------------------------------
    // StorageManager

    const _StorageManager_isLocalMode = StorageManager.isLocalMode;
    /**
     * 常にfalse
     * @returns boolean
     */
    StorageManager.isLocalMode = function () {
        return false;
    };

    /**
     * System.json のロードを待たずに直接ゲームIDを定義する
     * @param {string} saveName 
     * @returns string
     */
    StorageManager.forageKey = function (saveName) {
        return "rmmzsave." + GAME_ID + "." + saveName;
    };

    /**
     * キーのログ出力のみ追加
     * @param {string} saveName 
     * @returns binary?
     */
    StorageManager.loadFromForage = function (saveName) {
        const key = this.forageKey(saveName);
        console.log(`** loading forage key: ${key}`);
        return localforage.getItem(key);
    };

    //-----------------------------------------------------------------------------
    // DataManager

    const _DataManager_loadDataFile = DataManager.loadDataFile;
    /**
     * 一部データは localforage から読む
     * @param {string} name 
     * @param {string} src 
     */
    DataManager.loadDataFile = async function (name, src) {
        if (src === 'Actors.json'
            || src === 'Weapons.json'
            || src === 'Armors.json') {
            const saveName = src.split('.')[0];
            const forageData = await StorageManager.loadObject(saveName);
            if (forageData) {
                console.log(`>> Data loaded from localforage: ${name}, ${saveName}`);
                window[name] = forageData;
                this.onLoad(window[name]);
            } else {
                console.log(`>> forage Data not found: ${name}, ${src}`);
                switch (src) {
                    case 'Actors.json':
                        this.resetActor();
                        break;
                    case 'Weapons.json':
                        this.resetWeapon();
                        break;
                    case 'Armors.json':
                        this.resetArmor();
                        break;
                }
            }
        } else {
            console.log(`>> Data loaded from local filesystem: ${name}, ${src}`);
            _DataManager_loadDataFile.call(this, name, src);
        }
    };

    /**
     * localforage にデータを書き込む
     * @param {string} name 
     * @param {any} object 
     */
    DataManager.saveDataFile = async function (name, object) {
        return StorageManager.saveObject(name, object);
    };

    /**
     * 武器データを Weapons.json に追記する。
     * @param {DataWeapon} weapon 
     */
    DataManager.registerWeapon = async function (weapon) {
        console.log('>> registerWeapon');
        $dataWeapons.push(weapon);
        await this.saveDataFile('Weapons', $dataWeapons);
    }

    /**
     * 防具データを Armors.json に追記する。
     * @param {DataArmor} armor 
     */
    DataManager.registerArmor = async function (armor) {
        console.log('>> registerArmor');
        $dataArmors.push(armor);
        await this.saveDataFile('Armors', $dataArmors);
    }

    /**
     * アクターデータを Actors.json に追記する。
     * @param {DataActor} actor 
     */
    DataManager.registerActor = async function (actor) {
        console.log('>> registerActor');
        $dataActors.push(actor);
        await this.saveDataFile('Actors', $dataActors);
    };

    /**
     * ID:1を残して武器データを全てクリアする
     */
    DataManager.resetWeapon = function () {
        console.log('>> resetWeapon');
        const orgWeapon = $dataWeapons && $dataWeapons[1]
            ? $dataWeapons[1]
            : { "id": 1, "animationId": 0, "description": "", "etypeId": 1, "traits": [{ "code": 31, "dataId": 1, "value": 0 }, { "code": 22, "dataId": 0, "value": 0 }], "iconIndex": 0, "name": "", "note": "", "params": [0, 0, 0, 0, 0, 0, 0, 0], "price": 0, "wtypeId": 0, "meta": {} };
        $dataWeapons = [];
        $dataWeapons.push(null);
        $dataWeapons.push(orgWeapon);
        this.saveDataFile('Weapons', $dataWeapons);
    };

    /**
     * ID:1を残して防具データを全てクリアする
     */
    DataManager.resetArmor = function () {
        console.log('>> resetArmor');
        const orgArmor = $dataArmors && $dataArmors[1]
            ? $dataArmors[1]
            : { "id": 1, "atypeId": 0, "description": "", "etypeId": 2, "traits": [{ "code": 22, "dataId": 1, "value": 0 }], "iconIndex": 0, "name": "", "note": "", "params": [0, 0, 0, 0, 0, 0, 0, 0], "price": 0, "meta": {} };
        $dataArmors = [];
        $dataArmors.push(null);
        $dataArmors.push(orgArmor);
        this.saveDataFile('Armors', $dataArmors);
    };

    /**
     * ID:1を残してアクターデータを全てクリアする
     */
    DataManager.resetActor = function () {
        console.log('>> resetActor');
        const orgActor = $dataActors && $dataActors[1]
            ? $dataActors[1]
            : { "id": 1, "battlerName": "", "characterIndex": 6, "characterName": "", "classId": 0, "equips": [0, 0, 0, 0, 0], "faceIndex": 0, "faceName": "", "traits": [], "initialLevel": 1, "maxLevel": 99, "name": "", "nickname": "", "note": "", "profile": "", "meta": {}, "normalAutoRate": 100, "FreeAutoActions": null };
        $dataActors = [];
        $dataActors.push(null);
        $dataActors.push(orgActor);
        this.saveDataFile('Actors', $dataActors);
    };

    //-----------------------------------------------------------------------------
    // Scene_Title

    /**
     * ゲームタイトル描画のもろもろ変更
     */
    Scene_Title.prototype.drawGameTitle = function () {
        const x = 480;
        const y = 440;
        const maxWidth = Graphics.width - x * 2;
        const text = $dataSystem.gameTitle;
        const bitmap = this._gameTitleSprite.bitmap;
        bitmap.fontFace = $gameSystem.numberFontFace();
        bitmap.textColor = ColorManager.systemColor();
        bitmap.outlineColor = "black";
        bitmap.outlineWidth = 8;
        bitmap.fontSize = 24;
        bitmap.drawText(text, x, y, maxWidth, 48, "center");
    };

    //-----------------------------------------------------------------------------
    // Scene_Message

    /**
     * メッセージウィンドウの変更
     * @returns Rectangle
     */
    Scene_Message.prototype.messageWindowRect = function () {
        const ww = Graphics.boxWidth - 160;
        const wh = this.calcWindowHeight(4, false) + 8;
        const wx = 0;
        const wy = 0;
        return new Rectangle(wx, wy, ww, wh);
    };

    //-----------------------------------------------------------------------------
    // Scene_MenuBase

    /**
     * 無効化
     */
    Scene_MenuBase.prototype.createPageButtons = function () { };

    //-----------------------------------------------------------------------------
    // Game_Temp

    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * 初期化時に追加プロパティを定義。
     */
    Game_Temp.prototype.initialize = function () {
        _Game_Temp_initialize.call(this);
        this._latestGenerated = [];
    };

    /**
     * 最後に生成したアイテムのオブジェクトを返す。
     * @returns any
     */
    Game_Temp.prototype.getLatestGenerated = function () {
        return this._latestGenerated;
    };

    /**
     * 最後に生成したアイテムのオブジェクトをセットする。
     * @param {any[]} items
     */
    Game_Temp.prototype.setLatestGenerated = function (items) {
        this._latestGenerated = items;
    }

    //-----------------------------------------------------------------------------
    // Game_Actor

    /**
     * actorId が null できてしまうこと自体おかしいけど一時的に workaround
     * @param {number} actorId 
     */
    Game_Actor.prototype.setup = function (actorId) {
        const actor = $dataActors[actorId];
        this._actorId = actorId;
        this._name = actor ? actor.name : '(tmp)';
        this._nickname = actor.nickname;
        this._profile = actor.profile;
        this._classId = actor.classId;
        this._level = actor.initialLevel;
        this.initImages();
        this.initExp();
        this.initSkills();
        this.initEquips(actor.equips);
        this.clearParamPlus();
        this.recoverAll();
    };

    /**
     * 指定の職業データが見つからない場合仮のデータを返す
     * @returns any
     */
    Game_Actor.prototype.currentClass = function () {
        return $dataClasses[this._classId]
            ? $dataClasses[this._classId]
            : $dataClasses[16];
    };

    //-----------------------------------------------------------------------------
    // Game_Unit

    /**
     * actor が null できてしまうこと自体おかしいけど一時的に workaround
     * @returns any[]
     */
    Game_Unit.prototype.aliveMembers = function () {
        return this.members().filter(member => member && member.isAlive());
    };

    //-----------------------------------------------------------------------------
    // Game_Party

    /**
     * エディタ側の不具合(?)で初期パーティーメンバーに未定義アクターIDが紛れ込む問題の対策
     */
    Game_Party.prototype.removeUndefinedActors = function () {
        const filtered = this._actors.filter(a => a !== undefined);
        this._actors = filtered;
    };

    /**
     * actor が null できてしまうこと自体おかしいけど一時的に workaround
     * @returns any[]
     */
    Game_Party.prototype.battleMembers = function () {
        return this.allBattleMembers().filter(actor => actor && actor.isAppeared());
    };

    //-----------------------------------------------------------------------------
    // Game_Item

    /**
     * 上位スキルかどうかを返す。
     * @returns boolean
     */
    Game_Item.prototype.isOmegaSkill = function () {
        if (!this.isSkill()) return false;
        if (this.object().name.includes("魔")) return true;
        if (this.object().name.includes("ディア")) return true;
        if (this.object().name.includes("モーリ")) return true;
        if (this.object().name.includes("モヴァ")) return true;
        if (this.object().name.includes("烈") && this.object().name.includes("三")) return true;
        if (this.object().name.includes("烈") && this.object().name.includes("四")) return true;
        if (this.object().mpCost > 48) return true;

        return false;
    };

    /**
     * 中位スキルかどうかを返す。
     * @returns boolean
     */
    Game_Item.prototype.isGammaSkill = function () {
        if (!this.isSkill()) return false;
        if (this.object().name.includes("モーユ")) return true;
        if (this.object().name.includes("モド")) return true;
        if (this.object().name.includes("モ")) return true;
        if (this.object().name.includes("烈") && this.object().name.includes("二")) return true;
        if (this.object().name.includes("烈")) return true;
        if (this.object().name.includes("ーリ")) return true;
        if (this.object().name.includes("ヴァ")) return true;
        if (this.object().name.includes("強") && this.object().name.includes("三")) return true;
        if (this.object().name.includes("強") && this.object().name.includes("四")) return true;
        if (this.object().mpCost > 24) return true;

        return false;
    };

    /**
     * 下位スキルかどうかを返す。
     * @returns boolean
     */
    Game_Item.prototype.isAlphaSkill = function () {
        if (!this.isSkill()) return false;
        if (this.isOmegaSkill()) return false;
        if (this.isGammaSkill()) return false;

        return true;
    };

    //-----------------------------------------------------------------------------
    // Scene_Options

    Scene_Options.prototype.maxCommands = function () {
        return 9;
    };

    //-----------------------------------------------------------------------------
    // Scene_Load

    const _Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
    /**
     * ゲームをロードしたとき、セーブしたときの位置に砂漠の塔を移動させる
     */
    Scene_Load.prototype.onLoadSuccess = function () {
        _Scene_Load_onLoadSuccess.call(this);
        console.log(`mapId: ${$gameMap.mapId()}`);
        if ($gameMap.mapId() === 2) $gameTemp.reserveCommonEvent(236);
    };

    //-----------------------------------------------------------------------------
    // Game_Message

    /**
     * outlineWidth を増やした影響でアウトライン部分が切れるのを防止する workaround 。
     * @param {string} text 
     */
    Game_Message.prototype.add = function (text) {
        this._texts.push(` ${text} `);
    };

    //-----------------------------------------------------------------------------
    // Window_StatusBase
    //
    // actor が null できてしまうこと自体おかしいけど一時的に workaround

    Window_StatusBase.prototype.drawActorName = function (actor, x, y, width) {
        width = width || 168;
        this.changeTextColor(ColorManager.hpColor(actor));
        this.drawText(actor ? actor.name() : '(tmp)', x, y, width);
    };

    Window_StatusBase.prototype.placeActorName = function (actor, x, y) {
        const key = "actor%1-name".format(actor ? actor.actorId() : 'tmp');
        const sprite = this.createInnerSprite(key, Sprite_Name);
        sprite.setup(actor);
        sprite.move(x, y);
        sprite.show();
    };

    Window_StatusBase.prototype.placeStateIcon = function (actor, x, y) {
        const key = "actor%1-stateIcon".format(actor ? actor.actorId() : 'tmp');
        const sprite = this.createInnerSprite(key, Sprite_StateIcon);
        sprite.setup(actor);
        sprite.move(x, y);
        sprite.show();
    };

    Window_StatusBase.prototype.placeGauge = function (actor, type, x, y) {
        const key = "actor%1-gauge-%2".format(actor ? actor.actorId() : 'tmp', type);
        const sprite = this.createInnerSprite(key, Sprite_Gauge);
        sprite.setup(actor, type);
        sprite.move(x, y);
        sprite.show();
    };

    Window_StatusBase.prototype.drawActorIcons = function (actor, x, y, width) {
        width = width || 144;
        const iconWidth = ImageManager.iconWidth;
        const icons = actor ? actor.allIcons().slice(0, Math.floor(width / iconWidth)) : [];
        let iconX = x;
        for (const icon of icons) {
            this.drawIcon(icon, iconX, y + 2);
            iconX += iconWidth;
        }
    };

    //-----------------------------------------------------------------------------
    // Window_NameBox

    /**
     * outlineWidth変更のための微調整
     * @returns number
     */
    Window_NameBox.prototype.windowHeight = function () {
        return this.fittingHeight(1) + 8;
    };

})();