//=============================================================================
// RPG Maker MZ - CSVN_fastTravel2.js
// ----------------------------------------------------------------------------
// (C)2022 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/11/23 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc ファストトラベルスキル／アイテム
 * @author cursed_steven
 * @base CSVN_additionalMapInfo
 * @orderAfter CSVN_additionalMapInfo
 * 
 * @help CSVN_fastTravel2.js
 * 
 * ※設計を大幅に変更したため新規蒔き直し。
 * 
 * @param executeCevId
 * @text ルーラ実行CEV
 * @desc ルーラ実行時のコモンイベントID(アイテム,スキル)
 * @type common_event[]
 * 
 * @param cancelCevId
 * @text キャンセルCEV
 * @desc 行先選択まで入ってキャンセルする場合のコスト返却CEV(アイテム,スキル)
 * @type common_event[]
 * 
 * @param travelMapId
 * @text ファストトラベル時のマップID
 * @desc ファストトラベル時のマップIDを入れる変数のID
 * @type variable
 * 
 * @param travelX
 * @text ファストトラベル時のX座標
 * @desc ファストトラベル時のX座標を入れる変数のID
 * @type variable
 * 
 * @param travelY
 * @text ファストトラベル時のY座標
 * @desc ファストトラベル時のY座標を入れる変数のID
 * @type variable
 * 
 * @param boatMapId
 * @text FT時の小型船のマップID
 * @desc FT時の小型船のマップIDを入れる変数のID
 * @type variable
 * 
 * @param boatX
 * @text FT時の小型船のX座標
 * @text FT時の小型船のX座標を入れる変数のID
 * @type variable
 * 
 * @param boatY
 * @text FT時の小型船のY座標
 * @desc FT時の小型船のY座標を入れる変数のID
 * @type variable
 * 
 * @param shipMapId
 * @text FT時の大型船のマップID
 * @desc FT時の大型船のマップIDを入れる変数のID
 * @type variable
 * 
 * @param shipX
 * @text FT時の大型船のX座標
 * @desc FT時の大型船のX座標を入れる変数のID
 * @type variable
 * 
 * @param shipY
 * @text FT時の大型船のY座標
 * @desc FT時の大型船のY座標を入れる変数ID
 * @type variable
 * 
 * @param getOffShipDir
 * @text 下船方向
 * @desc 下船方向を入れる変数のID
 * @type variable
 * 
 * @param airshipMapId
 * @text FT時の飛空艇のマップID
 * @desc FT時の飛空艇のマップIDを入れる変数のID
 * @type variable
 * 
 * @param airshipX
 * @text FT時の飛空艇のX座標
 * @desc FT時の飛空艇のX座標を入れる変数のID
 * @type variable
 * 
 * @param airshipY
 * @text FT時の飛空艇のY座標
 * @desc FT時の飛空艇のY座標を入れる変数のID
 * @type variable
 * 
 * @command startItem
 * @text 行先選択開始(アイテム)
 * 
 * @command startSkill
 * @text 行先選択開始(スキル)
 */

//-----------------------------------------------------------------------------
// Scene_FastTravelSkill
//
// The scene class of the fast travel screen.

function Scene_FastTravelSkill() {
    this.initialize(...arguments);
}

Scene_FastTravelSkill.prototype = Object.create(Scene_ItemBase.prototype);
Scene_FastTravelSkill.prototype.constructor = Scene_FastTravelSkill;

//-----------------------------------------------------------------------------
// Scene_FastTravelItem
//
// The scene class of the fast travel screen.

function Scene_FastTravelItem() {
    this.initialize(...arguments);
}

Scene_FastTravelItem.prototype = Object.create(Scene_FastTravelSkill.prototype);
Scene_FastTravelItem.prototype.constructor = Scene_FastTravelItem;

//-----------------------------------------------------------------------------
// Window_Destinations
//
// The window for selecting an item on the fast travel screen.

function Window_Destinations() {
    this.initialize(...arguments);
}

Window_Destinations.prototype = Object.create(Window_Selectable.prototype);
Window_Destinations.prototype.constructor = Window_Destinations;

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * 行先選択に入るPCOM
     */
    PluginManagerEx.registerCommand(script, "startItem", args => {
        SceneManager.push(Scene_FastTravelItem);
    });
    PluginManagerEx.registerCommand(script, "startSkill", args => {
        SceneManager.push(Scene_FastTravelSkill);
    });

    //-----------------------------------------------------------------------------
    // Scene_FastTravelSkill

    /**
     * 初期化
     */
    Scene_FastTravelSkill.prototype.initialize = function () {
        Scene_ItemBase.prototype.initialize.call(this);
    };

    /**
     * シーン作成
     */
    Scene_FastTravelSkill.prototype.create = function () {
        Scene_ItemBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createItemWindow();
    };

    /**
     * 行先リストウィンドウ
     */
    Scene_FastTravelSkill.prototype.createItemWindow = function () {
        const rect = this.itemWindowRect();
        this._itemWindow = new Window_Destinations(rect);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
        this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
        this.activateItemWindow();
    };

    /**
     * 行先リストウィンドウ領域
     * @returns Rectangle
     */
    Scene_FastTravelSkill.prototype.itemWindowRect = function () {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaBottom() - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 項目に対応した移動開始
     */
    Scene_FastTravelSkill.prototype.onItemOk = function () {
        this.go();
        this.reserveExecuteCEV();
    };

    /**
     * スキル用の実行CEVを予約
     */
    Scene_FastTravelSkill.prototype.reserveExecuteCEV = function () {
        $gameTemp.reserveCommonEvent(param.executeCevId[1]);
    };

    /**
     * キャンセル
     */
    Scene_FastTravelSkill.prototype.onItemCancel = function () {
        this.popScene();
        this.reserveCancelCEV();
    };

    /**
     * スキル用のキャンセルCEVを予約
     */
    Scene_FastTravelSkill.prototype.reserveCancelCEV = function () {
        $gameTemp.reserveCommonEvent(param.cancelCevId[1]);
    };

    /**
     * 必要な変数を登録して移動実行CEV呼び出し
     */
    Scene_FastTravelSkill.prototype.go = function () {
        $v.set(param.travelMapId, this.item().travelMapId);
        $v.set(param.travelX, this.item().travelX);
        $v.set(param.travelY, this.item().travelY);
        $v.set(param.boatMapId, this.item().boatMapId);
        $v.set(param.boatX, this.item().boatX);
        $v.set(param.boatY, this.item().boatY);
        $v.set(param.shipMapId, this.item().shipMapId);
        $v.set(param.shipX, this.item().shipX);
        $v.set(param.shipY, this.item().shipY);
        $v.set(param.getOffShipDir, this.item().getOffShipDir);
        $v.set(param.airshipMapId, this.item().airshipMapId);
        $v.set(param.airshipX, this.item().airshipX);
        $v.set(param.airshipY, this.item().airshipY);

        this.popScene();
    };

    //-----------------------------------------------------------------------------
    // Scene_FastTravelItem

    Scene_FastTravelItem.prototype.initialize = function () {
        Scene_FastTravelSkill.prototype.initialize.call(this);
    };

    Scene_FastTravelItem.prototype.create = function () {
        Scene_FastTravelSkill.prototype.create.call(this);
    };

    /**
     * スキル用の実行CEVを予約
     */
    Scene_FastTravelItem.prototype.reserveExecuteCEV = function () {
        $gameTemp.reserveCommonEvent(param.executeCevId[0]);
    };

    /**
     * スキル用のキャンセルCEVを予約
     */
    Scene_FastTravelItem.prototype.reserveCancelCEV = function () {
        $gameTemp.reserveCommonEvent(param.cancelCevId[0]);
    };

    //-----------------------------------------------------------------------------
    // Window_Destinations

    /**
     * 初期化
     * @param {Rectangle} rect 
     */
    Window_Destinations.prototype.initialize = function (rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._data = [];
    };

    /**
     * 項目の列数
     * @returns number
     */
    Window_Destinations.prototype.maxCols = function () {
        return 2;
    };

    /**
     * 列の間のスペースのサイズ
     * @returns number
     */
    Window_Destinations.prototype.colSpacing = function () {
        return 16;
    };

    /**
     * 項目の最大数
     * @returns number
     */
    Window_Destinations.prototype.maxItems = function () {
        return this._data ? this._data.length : 1;
    };

    /**
     * 選択中の項目情報を返す
     * @returns any
     */
    Window_Destinations.prototype.item = function () {
        return this.itemAt(this.index());
    };

    /**
     * indexで指定した項目を返却
     * @param {number} index 
     * @returns any
     */
    Window_Destinations.prototype.itemAt = function (index) {
        return this._data && index >= 0 ? this._data[index] : null;
    };

    /**
     * リスト作成
     */
    Window_Destinations.prototype.makeItemList = function () {
        /*
         * CSVN_additionalMapInfoのプラグインパラメータのうち
         * ファストトラベル先になれるものを抽出し、0/1で
         * 訪問済みかどうかを並べた形したものを配列にする
         */
        const ami = $gameMap._ami;
        const listCanTravelTo = ami.listCanTravelTo();
        const paddedFTVar = ami.paddedFTVar();
        const split = paddedFTVar.split("");

        /*
         * 訪問済みになっているものをリストに追加
         */
        for (let i = 0; i < split.length; i++) {
            if (split[i] === "1") {
                const destination = listCanTravelTo[i];
                this._data.push({
                    name: destination.travelDisplayName,
                    description: destination.description,
                    travelMapId: destination.travelMapId,
                    travelX: destination.travelX,
                    travelY: destination.travelY,
                    boatMapId: destination.boatMapId,
                    boatX: destination.boatX,
                    boatY: destination.boatY,
                    shipMapId: destination.shipMapId,
                    shipX: destination.shipX,
                    shipY: destination.shipY,
                    getOffShipDir: destination.getOffShipDir,
                    airshipMapId: destination.airshipMapId,
                    airshipX: destination.airshipX,
                    airshipY: destination.airshipY
                });
            }
        }
        if (this._data.length === 0) this._data.push(null);

        // 初期選択は先頭で固定
        this.forceSelect(0);
    };

    /**
     * indexで指定した項目を描画
     * @param {number} index 
     */
    Window_Destinations.prototype.drawItem = function (index) {
        const item = this.itemAt(index);
        const rect = this.itemLineRect(index);
        this.drawItemName(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    };

    /**
     * ヘルプテキストを更新
     */
    Window_Destinations.prototype.updateHelp = function () {
        this.setHelpWindowItem(this.item());
    };

    /**
     * 描画の更新
     */
    Window_Destinations.prototype.refresh = function () {
        this.makeItemList();
        Window_Selectable.prototype.refresh.call(this);
    };

})();