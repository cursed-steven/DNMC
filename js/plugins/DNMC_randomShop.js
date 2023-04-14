//=============================================================================
// RPG Maker MZ - DNMC_randomShop
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/01/22 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 指定した条件で品目がランダムショップを生成します
 * @author cursed_steven
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help DNMC_randomShop.js
 *
 * @command generate
 * @text ショップ生成
 * 
 * @arg shopType
 * @text タイプ
 * @type select
 * @option アイテム
 * @value 0
 * @option 武器
 * @value 1
 * @option 防具
 * @value 2
 * 
 * @arg count
 * @text 品目数
 * @type number
 * @max 10
 * @min 1
 *
 * @arg classId
 * @text 職業ID
 * @type class
 * 
 * @arg priceRank
 * @text 価格水準
 * @type select
 * @option おてごろ
 * @value 1
 * @option そこそこ
 * @value 2
 * @option なかなか
 * @value 3
 * @option 高級
 * @value 4
 * @option ラグジュアリー
 * @value 5
 * 
 * @arg recovery
 * @text 回復アイテムに限定する
 * @type boolean
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, "generate", args => {
        generateRandomShop(
            args.shopType,
            args.count,
            args.classId,
            args.priceRank,
            args.recovery
        );
    });

    /**
     * 指定条件でランダム品目のショップを生成する。
     * @param {number} shopType 
     * @param {number} count 
     * @param {number} classId 
     * @param {number} priceRank
     * @param {boolean} recovery
     */
    function generateRandomShop(shopType, count, classId, priceRank, recovery) {
        // CSVN_base.logGroup(">> CSVN_randomShop generateRandomShop");

        let items = [];
        let item = null;
        let missCount = 0;
        while (items.length < count) {
            item = randomGood(shopType, classId, priceRank, recovery);
            if (item && !items.some(i => i.id === item.id)) {
                items.push(item);
            } else {
                missCount++;
                // CSVN_base.log("missCount: " + missCount);
                if (missCount >= 3) {
                    registerNewGood(shopType, classId, priceRank);
                    missCount = 0;
                    continue;
                }
            }
            // CSVN_base.log("items.length: " + items.length);
        }

        items = sortItems(shopType, items);
        const goods = itemsToGoods(shopType, items);

        // CSVN_base.logGroupEnd(">> CSVN_randomShop generateRandomShop");

        SceneManager.push(Scene_Shop);
        SceneManager.prepareNextScene(goods, false);
    }

    /**
     * 店種、職業、価格帯、回復限定有無を指定してランダム品目を返す
     * @param {number} shopType 
     * @param {number} classId 
     * @param {number} priceRank 
     * @param {boolean} recovery 
     * @returns number[]
     */
    function randomGood(shopType, classId, priceRank, recovery) {
        let good = null;
        switch (shopType) {
            case 0:
                good = randomItem(priceRank, recovery);
                break;
            case 1:
                good = randomWeapon(classId, priceRank);
                break;
            case 2:
                good = randomArmor(classId, priceRank);
                break;
        }

        return good;
    }

    /**
     * データ不足の場合、店種、職業、価格帯を指定してランダム生成する。
     * @param {number} shopType 
     * @param {number} classId 
     * @param {number} priceRank 
     */
    function registerNewGood(shopType, classId, priceRank) {
        switch (shopType) {
            case 0:
                break;
            case 1:
                DNMC_randomWeapons.randomWeapon(priceRankToRank(priceRank), classId);
                break;
            case 2:
                DNMC_randomArmors.randomArmor(priceRankToRank(priceRank), classId, Math.randomInt(4) + 2);
                break;
        }
    }

    /**
     * 店頭用にソートする
     * @param {number} shopType 
     * @param {any[]} items 
     * @returns any[]
     */
    function sortItems(shopType, items) {
        let sorted = null;
        switch (shopType) {
            case 0:
                sorted = sortDataItems(items);
                break;
            case 1:
                sorted = sortDataWeapons(items);
                break;
            case 2:
                sorted = sortDataArmors(items);
                break;
        }

        return sorted;
    }

    /**
     * 店頭用にソートする(アイテム)
     * @param {any[]} data 
     * @returns any[]
     */
    function sortDataItems(data) {
        return data.sort((a, b) => {
            // 消耗有無降順
            if (a.consumable !== b.consumable) {
                return (a.consumable - b.consumable) * -1;
            }

            // 使用可能時昇順
            if (a.occasion !== b.occasion) {
                return a.occasion - b.occasion
            }

            // 価格昇順
            if (a.price !== b.price) {
                return a.price - b.price;
            }

            return 0;
        });
    }

    /**
     * 店頭用にソートする(武器)
     * @param {any[]} data 
     * @returns any[]
     */
    function sortDataWeapons(data) {
        return data.sort((a, b) => {
            // 武器タイプ昇順
            if (a.wtypeId !== b.wtypeId) {
                return a.wtypeId - b.wtypeId;
            }

            // 価格昇順
            if (a.price !== b.price) {
                return a.price - b.price;
            }

            return 0;
        });
    }

    /**
     * 店頭用にソートする(防具)
     * @param {any[]} data 
     * @returns any[]
     */
    function sortDataArmors(data) {
        return data.sort((a, b) => {
            // 防具タイプ昇順
            if (a.atypeId !== b.atypeId) {
                return a.atypeId - b.atypeId;
            }

            // スロット昇順
            if (a.etypeId !== b.etypeId) {
                return a.etypeId - b.etypeId;
            }

            // 価格昇順
            if (a.price !== b.price) {
                return a.price - b.price;
            }

            return 0;
        });
    }

    /**
     * $data*を品目データに変換して返す。
     * @param {number} shopType
     * @param {any[]} items 
     * @returns number[][]
     */
    function itemsToGoods(shopType, items) {
        return items.map(i => {
            return [shopType, i.id, 0, 0];
        });
    }

    /**
     * 価格帯と回復アイテムに限定するかどうかを指定して
     * ランダムなアイテムを返す
     * @param {number} priceRank 
     * @param {boolean} recovery 
     * @returns number[]
     */
    function randomItem(priceRank, recovery) {
        const priceRanks = [0, 300, 1000, 5000, 50000, 100000];
        const items = $dataItems.filter(i => {
            if (!i || !i.name || i.price === 0) return false;

            if (recovery) {
                return i.price <= priceRanks[priceRank]
                    && DataManager.isItemForRecovery(i);
            } else {
                return i.price <= priceRanks[priceRank];
            }
        });

        return items[Math.randomInt(items.length)];
    }

    /**
     * 価格帯をランクに変換
     * @param {number} priceRank 
     * @returns number
     */
    function priceRankToRank(priceRank) {
        let rank = 0;
        switch (priceRank) {
            case 1:
                rank = 0;
                break;
            case 2:
                rank = 1;
                break;
            case 3:
                rank = 1;
                break;
            case 4:
                rank = 2;
                break;
            case 5:
                rank = 2;
                break;
        }

        return rank;
    }

    /**
     * 職業と価格帯を指定してランダムな武器を返す。
     * @param {number} classId 
     * @param {number} priceRank 
     * @returns number[]
     */
    function randomWeapon(classId, priceRank) {
        const priceRanks = [0, 500, 2000, 10000, 50000, 100000];
        const suitableWtypeIds = getSuitableWtypeIds(classId);
        const weapons = $dataWeapons.filter(w => {
            if (!w || !w.name || w.price === 0) return false;

            return w.price <= priceRanks[priceRank]
                && suitableWtypeIds.includes(w.wtypeId);
        });

        return weapons[Math.randomInt(weapons.length)];
    }

    /**
     * 指定した職業で装備可能な武器タイプIDを配列で返す
     * @param {number} classId 
     * @returns number[]
     */
    function getSuitableWtypeIds(classId) {
        const suitables = $dataClasses[classId].traits.filter(t => {
            return t.code === Game_BattlerBase.TRAIT_EQUIP_WTYPE;
        });
        let suitableWtypeIds = [];
        for (const t of suitables) {
            suitableWtypeIds.push(t.dataId);
        }

        return suitableWtypeIds;
    }

    /**
     * 職業と価格帯を指定してランダムな防具を返す。
     * @param {number} classId 
     * @param {number} priceRank 
     * @returns number[]
     */
    function randomArmor(classId, priceRank) {
        const priceRanks = [0, 500, 2000, 10000, 50000, 100000];
        const suitableAtypeIds = getSuitableAtypeIds(classId);
        const armors = $dataArmors.filter(a => {
            if (!a || !a.name || a.price === 0) return false;

            return a.price <= priceRanks[priceRank]
                && suitableAtypeIds.includes(a.atypeId);
        });

        return armors[Math.randomInt(armors.length)];
    }

    /**
     * 指定した職業で装備可能な防具タイプIDを配列で返す
     * @param {number} classId 
     * @returns number[]
     */
    function getSuitableAtypeIds(classId) {
        const suitables = $dataClasses[classId].traits.filter(t => {
            return t.code === Game_BattlerBase.TRAIT_EQUIP_ATYPE;
        });
        let suitableAtypeIds = [];
        for (const t of suitables) {
            suitableAtypeIds.push(t.dataId);
        }

        return suitableAtypeIds;
    }

})();