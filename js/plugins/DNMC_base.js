//=============================================================================
// RPG Maker MZ - DNMC_base
// ----------------------------------------------------------------------------
// (C)2022 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/12/26 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc Donut Machine 内で共通利用する関数群
 * @author cursed_twitch
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

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-----------------------------------------------------------------------------
    // DNMC_base
    //
    // Common static functions for Donut Machine.

    function DNMC_base() {
        throw new Error("This is a static class");
    }

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

    //-----------------------------------------------------------------------------
    // DataManager

    /**
     * $data* を上書きする
     * @param {string} path 
     * @param {any[]} data 
     */
    DataManager.overWriteDataFile = function (path, data) {
        const fs = require('fs');
        try {
            fs.unlinkSync(path);
            fs.writeFileSync(path, JSON.stringify(data), "utf-8");
        } catch (e) {
            console.log(e);
        }
    };

    /**
     * 武器データを Weapons.json に追記する。
     * @param {DataWeapon} weapon 
     */
    DataManager.registerWeapon = function (weapon) {
        $dataWeapons.push(weapon);
        this.overWriteDataFile(DATA_PATH.WEAPON, $dataWeapons);
    }

    /**
     * 防具データを Armors.json に追記する。
     * @param {DataArmor} armor 
     */
    DataManager.registerArmor = function (armor) {
        $dataArmors.push(armor);
        this.overWriteDataFile(DATA_PATH.ARMOR, $dataArmors);
    }

    /**
     * アクターデータを Actors.json に追記する。
     * @param {DataActor} actor 
     */
    DataManager.registerActor = function (actor) {
        $dataActors.push(actor);
        this.overWriteDataFile(DATA_PATH.ACTOR, $dataActors);
    };

    /**
     * ID:1を残して武器データを全てクリアする
     */
    DataManager.resetWeapon = function () {
        const orgWeapon = $dataWeapons[1];
        $dataWeapons = [];
        $dataWeapons.push(null);
        $dataWeapons.push(orgWeapon);
        this.overWriteDataFile(DATA_PATH.WEAPON, $dataWeapons);
    };

    /**
     * ID:1を残して防具データを全てクリアする
     */
    DataManager.resetArmor = function () {
        const orgArmor = $dataArmors[1];
        $dataArmors = [];
        $dataArmors.push(null);
        $dataArmors.push(orgArmor);
        this.overWriteDataFile(DATA_PATH.ARMOR, $dataArmors);
    };

    /**
     * ID:1を残してアクターデータを全てクリアする
     */
    DataManager.resetActor = function () {
        const orgActor = $dataActors[1];
        $dataActors = [];
        $dataActors.push(null);
        $dataActors.push(orgActor);
        this.overWriteDataFile(DATA_PATH.ACTOR, $dataActors);
    };

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
    // Game_Item

    /*
     * alpha
     *     gamma, omega以外全部
     * gamma
     *     α-3,4、γ、γ-1,2
     * omega
     *     γ-3,4、Ω
     */

    /**
     * 上位スキルかどうかを返す。
     * @returns boolean
     */
    Game_Item.prototype.isOmegaSkill = function () {
        if (!this.isSkill()) return false;
        if (this.object().name.includes("Ω")) return true;
        if (this.object().name.includes("γ-3")) return true;
        if (this.object().name.includes("γ-4")) return true;
        if (this.object().name.includes("-4")) return true;
        if (this.object().mpCost > 48) return true;

        return false;
    };

    /**
     * 中位スキルかどうかを返す。
     * @returns boolean
     */
    Game_Item.prototype.isGammaSkill = function () {
        if (!this.isSkill()) return false;
        if (this.object().name.includes("γ")) return true;
        if (this.object().name.includes("γ-1")) return true;
        if (this.object().name.includes("γ-2")) return true;
        if (this.object().name.includes("α-3")) return true;
        if (this.object().name.includes("α-4")) return true;
        if (this.object().name.includes("-3")) return true;
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

})();