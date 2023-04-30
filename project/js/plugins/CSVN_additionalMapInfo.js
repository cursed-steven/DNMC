//=============================================================================
// RPG Maker MZ - CSVN_additionalMapInfo.js
// ----------------------------------------------------------------------------
// (C)2022 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/11/13 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 追加マップ情報の入出力
 * @author cursed_steven
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_additionalMapInfo.js
 * 
 * プラグインパラメータにマップごとの以下の情報を設定し、
 * $gameMap に追加したメソッドから取得できるようになります。
 * ・マップID (以下の情報の設定の対象となるマップのID)
 * ・説明 ($gameMap.description())
 * ・1人分の宿賃 ($gameMap.innFee())
 * ・スキルやアイテムによる脱出可否 ($gameMap.canEscape())
 * ・スキルやアイテムによるファストトラベル可否 ($gameMap.canTravelFrom())
 * ・ファストトラベルの行き先になりうるか ($gameMap.canTravelTo())
 * ・プレイヤーによって訪問済みか ($gameMap.visited())
 * また、$gameMap.visit() と記述すると、そのマップの訪問済みフラグが立ちます。
 * 
 * @param list
 * @text マップごとの追加情報のリスト
 * @desc
 * @type struct<AMI>[]
 * 
 * @param ftVarId
 * @text ルーラスイッチ変数
 * @desc ファストトラベル先に登録されているかどうかを保持する変数のID
 * @type variable
 * 
 * @param swReservedCev
 * @text 移動後CEV有無
 * @desc コモンイベント実行を移動後に控えているかどうか
 * @type switch
 * 
 * @param varReservedCev
 * @text 移動後CEV保持変数
 * @desc 移動後に実行するコモンイベントIDを書き込む変数ID
 * @type variable
 * 
 * @command resetFTFlag
 * @text ファストトラベル先訪問履歴のリセット
 */

/*~struct~AMI:ja
 * 
 * @param id
 * @text マップID
 * @desc
 * @type number
 * 
 * @param description
 * @text 説明
 * @desc ファストトラベルのメニューとかで使うマップの説明
 * @type multiline_string
 * 
 * @param goOutMapId
 * @text 出た先のマップID
 * @type number
 * 
 * @param goOutX
 * @parent goOutMapId
 * @text 出た先のマップX
 * @type number
 * 
 * @param goOutY
 * @parent goOutMapId
 * @text 出た先のマップY
 * @type number
 * 
 * @param goOutRegion
 * @text 外に出るイベントを発生させるリージョン
 * @type number
 * 
 * @param goOutFadeType
 * @parent goOutRegion
 * @text 外に出るときのフェードタイプ
 * @type select
 * @option 黒
 * @value 0
 * @option 白
 * @value 1
 * @option なし
 * @value 2
 * 
 * @param goOutCommonEvent
 * @parent goOutRegion
 * @text 外に出るときに実行するコモンイベント
 * @type common_event
 * 
 * @param enableEncounterGoingOut
 * @parent goOutRegion
 * @text 外に出るときにエンカ許可する
 * @type select
 * @default 0
 * @option 許可する
 * @value 0
 * @option 禁止する
 * @value 1
 * @option 変更しない
 * @value 2
 * 
 * @param innFee
 * @text 宿賃
 * @desc ひとりぶんの宿賃
 * @type number
 * 
 * @param canEscape
 * @text 脱出可否
 * @desc スキル/アイテムによる脱出の可否
 * @type boolean
 * 
 * @param canTravelFrom
 * @text ファストトラベル可否
 * @desc スキル/アイテムによるファストトラベルを使用できるか
 * @type boolean
 * 
 * @param canTravelTo
 * @text ファストトラベル先になれるか
 * @desc スキル/アイテムによるファストトラベル先になれるか
 * @type boolean
 * 
 * @param travelDisplayName
 * @text ファストトラベルの行先選択時の表示名
 * @type string
 * 
 * @param travelMapId
 * @text ファストトラベル時のマップID
 * @type number
 * 
 * @param travelX
 * @parent travelMapId
 * @text ファストトラベル時のX座標
 * @type number
 * 
 * @param travelY
 * @parent travelMapId
 * @text ファストトラベル時のY座標
 * @type number
 * 
 * @param boatMapId
 * @text FT時の小型船のマップID
 * @type number
 * 
 * @param boatX
 * @parent boatMapId
 * @text FT時の小型船のX座標
 * @type number
 * 
 * @param boatY
 * @parent boatMapId
 * @text FT時の小型船のY座標
 * @type number
 * 
 * @param shipMapId
 * @text FT時の大型船のマップID
 * @type number
 * 
 * @param shipX
 * @parent shipMapId
 * @text FT時の大型船のX座標
 * @type number
 * 
 * @param shipY
 * @parent shipMapId
 * @text FT時の大型船のY座標
 * @type number
 * 
 * @param getOffShipDir
 * @parent shipMapId
 * @text 下船方向
 * @type select
 * @option 南
 * @value 2
 * @option 西
 * @value 4
 * @option 東
 * @value 6
 * @option 北
 * @value 8
 * 
 * @param airshipMapId
 * @text FT時の飛空艇のマップID
 * @type number
 * 
 * @param airshipX
 * @parent airshipMapId
 * @text FT時の飛空艇のX座標
 * @type number
 * 
 * @param airshipY
 * @parent airshipMapId
 * @text FT時の飛空艇のY座標
 * @type number
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, "resetFTFlag", args => {
        $v.set(param.ftVarId, 0);
    });

    //-------------------------------------------------------------------------
    // CSVN_AMI
    //
    // The additional map info object class.

    function CSVN_AMI() {
        this.initialize(...arguments);
    }

    CSVN_AMI.prototype = Object.create(CSVN_AMI.prototype);
    CSVN_AMI.prototype.constructor = CSVN_AMI;

    /**
     * 初期化、プラグインパラメータ(以下PP)から指定のマップの情報を取得してプロパティに保持する。
     * @param {number} mapId 
     */
    CSVN_AMI.prototype.initialize = function (mapId) {
        this._data = param.list.find(e => { return e.id === mapId });

        console.log(">>>> " + this.constructor.name + " initialize");
        console.log(this._data);
    };

    /**
     * マップの説明を返す
     * @returns multiline_string
     */
    CSVN_AMI.prototype.description = function () {
        return this._data.description;
    };

    /**
     * マップから出る先の情報を返す
     * @returns any
     */
    CSVN_AMI.prototype.goOutSettings = function () {
        return {
            mapId: this._data.goOutMapId,
            x: this._data.goOutX,
            y: this._data.goOutY
        };
    };

    /**
     * マップから出るイベントを発生させるリージョンを返す
     * @returns number
     */
    CSVN_AMI.prototype.goOutRegion = function () {
        return this._data.goOutRegion;
    };

    /**
     * マップから出るときのフェードタイプを返す
     * @returns number
     */
    CSVN_AMI.prototype.goOutFadeType = function () {
        return this._data.goOutFadeType;
    };

    /**
     * マップから出るときのに実行するコモンイベントIDを返す
     * @returns number
     */
    CSVN_AMI.prototype.goOutCommonEvent = function () {
        return this._data.goOutCommonEvent;
    };

    /**
     * マップから出るときにエンカ許可するかを返す
     * @returns number
     */
    CSVN_AMI.prototype.enableEncounterGoingOut = function () {
        return this._data.enableEncounterGoingOut;
    };

    /**
     * マップにある宿屋の1人分の宿賃を返す
     * @returns number
     */
    CSVN_AMI.prototype.innFee = function () {
        return this._data.innFee;
    };

    /**
     * マップ内の脱出用スキル/アイテムの使用可否を返す
     * @returns boolean
     */
    CSVN_AMI.prototype.canEscape = function () {
        return this._data.canEscape;
    };

    /**
     * マップ内のファストトラベル用スキル/アイテムの使用可否を返す
     * @returns boolean
     */
    CSVN_AMI.prototype.canTravelFrom = function () {
        return this._data.canTravelFrom;
    };

    /**
     * マップがファストトラベル先になれるかどうかを返す
     * @returns boolean
     */
    CSVN_AMI.prototype.canTravelTo = function () {
        return this._data.canTravelTo;
    };

    /**
     * マップがプレイヤーによって訪問済みかを返却する
     * @returns boolean
     */
    CSVN_AMI.prototype.visited = function () {
        // flags の index 桁めが1ならtrue、0ならfalse
        const result = this.paddedFTVar().substr(this.visitedSwPosRight(), 1) === "1";
        console.log(">> " + this.constructor.name + " visited: " + result);

        return result;
    };

    /**
     * プレイヤーによる訪問済みフラグを立てる
     * @returns void
     */
    CSVN_AMI.prototype.visit = function () {
        if (!this.canTravelTo()) return;
        if (this.visited()) return;

        /*
         * ルーラスイッチ変数(2進変換後)の右から何桁めかから、
         * 2の何乗を加算すればいいか算出
         */
        const pow = this.visitedSwPosRight() * -1 - 1;
        const currentValue = $v.get(param.ftVarId);

        $v.set(param.ftVarId, currentValue + Math.pow(2, pow));
        //console.log("FTSwitchVar(10): " + $v.get(param.ftVarId));
        //console.log("FTSwitchVar( 2): " + $v.get(param.ftVarId).toString(2));
    };

    /**
     * ルーラスイッチ変数の値を2進数変換し、対象となりうるマップ分だけ
     * 左側に0埋めしたものを返す
     * @returns string
     */
    CSVN_AMI.prototype.paddedFTVar = function () {
        // listCanTravelToの全数
        const countListCanTravelTo = this.listCanTravelTo().length;

        // 10進数で持っているので2進数に変換
        const parsedInt2 = $gameVariables.value(param.ftVarId).toString(2);

        // 全数まで左を0埋め
        // ※1の位がPPの1項め、2の位がPPの2項め、4の位がPPの3項め...
        const padded = parsedInt2.padZero(countListCanTravelTo);

        return padded;
    };

    /**
     * ルーラスイッチ変数を2進数に変換したもののうち、
     * マップが訪問済みかどうかを表すのが右から何桁めかを返す
     * @returns number
     */
    CSVN_AMI.prototype.visitedSwPosRight = function () {
        // listCanTravelToの全数
        const countListCanTravelTo = this.listCanTravelTo().length;

        // マップが右(小さいほう)から何桁目にあたるかを返す
        const index = this.amiFTIndex();

        // substrの第一引数にして返す
        return -(countListCanTravelTo - index);
    };

    /**
     * プラグインパラメータ全体のうちファストトラベル先になれるもののリスト
     * @returns any[]
     */
    CSVN_AMI.prototype.listCanTravelTo = function () {
        const listCanTravelTo = param.list.filter(e => {
            return e.canTravelTo;
        });

        return listCanTravelTo;
    };

    /**
     * listCanTravelToのうちマップIDが一致するもののインデックスを返却
     * @returns number
     */
    CSVN_AMI.prototype.amiFTIndex = function () {
        return this.listCanTravelTo().findIndex(e => {
            return e.id === this._data.id;
        });
    };

    /**
     * ファストトラベル時の表示名
     * @returns string
     */
    CSVN_AMI.prototype.displayName = function () {
        return this._data.travelDisplayName;
    };

    /**
     * ファストトラベル先になった時のマップID
     * @returns number
     */
    CSVN_AMI.prototype.travelMapId = function () {
        return this._data.travelMapId;
    };

    /**
     * ファストトラベル先になった時のX座標
     * @returns number
     */
    CSVN_AMI.prototype.travelX = function () {
        return this._data.travelX;
    };

    /**
     * ファストトラベル先になった時のY座標
     * @returns number
     */
    CSVN_AMI.prototype.travelY = function () {
        return this._data.travelY;
    };

    /**
     * ファストトラベル先になった時の小型船のマップID
     * @returns number
     */
    CSVN_AMI.prototype.boatMapId = function () {
        return this._data.boatMapId;
    };

    /**
     * ファストトラベル先になった時の小型船のX座標
     * @returns number
     */
    CSVN_AMI.prototype.boatX = function () {
        return this._data.boatX;
    };

    /**
     * ファストトラベル先になった時の小型船のY座標
     * @returns number
     */
    CSVN_AMI.prototype.boatY = function () {
        return this._data.boatY;
    };

    /**
     * ファストトラベル先になった時の大型船のマップID
     * @returns number
     */
    CSVN_AMI.prototype.shipMapId = function () {
        return this._data.shipMapId;
    };

    /**
     * ファストトラベル先になった時の大型船のX座標
     * @returns number
     */
    CSVN_AMI.prototype.shipX = function () {
        return this._data.shipX;
    };

    /**
     * ファストトラベル先になった時の大型船のY座標
     * @returns number
     */
    CSVN_AMI.prototype.shipY = function () {
        return this._data.shipY;
    };

    /**
     * ファストトラベル時の船からの下船方向
     * @returns number
     */
    CSVN_AMI.prototype.getOffShipDir = function () {
        return this._data.getOffShipDir;
    };

    /**
     * ファストトラベル時の飛空艇のマップID
     * @returns number
     */
    CSVN_AMI.prototype.airshipMapId = function () {
        return this._data.airshipMapId;
    };

    /**
     * ファストトラベル時の飛空艇のX座標
     * @returns number
     */
    CSVN_AMI.prototype.airshipX = function () {
        return this._data.airshipX;
    };

    /**
     * ファストトラベル時の飛空艇のY座標
     * @returns number
     */
    CSVN_AMI.prototype.airshipY = function () {
        return this._data.airshipY;
    };

    //-------------------------------------------------------------------------
    // Game_Map

    const _Game_Map_initialize = Game_Map.prototype.initialize;
    /**
     * 初期化時に追加プロパティを用意する。
     */
    Game_Map.prototype.initialize = function () {
        console.log(">>>> " + this.constructor.name + " initialize");
        _Game_Map_initialize.call(this);

        // 追加情報の格納先
        this._ami = null;
    };

    const _Game_Map_setup = Game_Map.prototype.setup;
    /**
     * PPに設定されているマップ追加情報のうち、マップIDが
     * 合致するものを取得し、専用プロパティに保持する。
     */
    Game_Map.prototype.setup = function (mapId) {
        console.log(">>>> setup");
        _Game_Map_setup.call(this, mapId);
        this.setupAmi(mapId);
    };

    /**
     * 追加情報のセットアップがまだならする
     */
    Game_Map.prototype.setupAmiIfNeeded = function () {
        if (typeof this._ami.goOutRegion != "function") this.setupAmi(this.mapId());
    };

    /**
     * 追加情報をセットアップ
     * @param {number} mapId 
     */
    Game_Map.prototype.setupAmi = function (mapId) {
        console.log("AMI setting up...");
        this._ami = new CSVN_AMI(mapId);
        console.log(this._ami);
    };

    /**
     * マップの説明を返す
     * @returns multiline_string
     */
    Game_Map.prototype.description = function () {
        this.setupAmiIfNeeded();
        return this._ami.description();
    };

    /**
     * マップから出る先の情報を返す
     * @returns any
     */
    Game_Map.prototype.goOutSettings = function () {
        this.setupAmiIfNeeded();
        return this._ami.goOutSettings();
    };

    /**
     * マップから出るイベントが発生するリージョンを返す
     * @returns number
     */
    Game_Map.prototype.goOutRegion = function () {
        this.setupAmiIfNeeded();
        return this._ami.goOutRegion();
    };

    /**
     * マップから出るときのフェードタイプを返す
     * @returns number
     */
    Game_Map.prototype.goOutFadeType = function () {
        this.setupAmiIfNeeded();
        return this._ami.goOutFadeType();
    };

    /**
     * マップから出るときに実行するコモンイベントIDを返す
     * @returns number
     */
    Game_Map.prototype.goOutCommonEvent = function () {
        this.setupAmiIfNeeded();
        return this._ami.goOutCommonEvent();
    };

    /**
     * マップから出るときにエンカ許可するかどうかを返す
     * @returns number
     */
    Game_Map.prototype.enableEncounterGoingOut = function () {
        this.setupAmiIfNeeded();
        return this._ami.enableEncounterGoingOut();
    };

    /**
     * マップにある宿屋の1人分の宿賃を返す
     * @returns number
     */
    Game_Map.prototype.innFee = function () {
        this.setupAmiIfNeeded();
        return this._ami.innFee();
    };

    /**
     * マップ内の脱出用スキル/アイテムの使用可否を返す
     * @returns boolean
     */
    Game_Map.prototype.canEscape = function () {
        this.setupAmiIfNeeded();
        return this._ami.canEscape();
    };

    /**
     * マップ内のファストトラベル用スキル/アイテムの使用可否を返す
     * @returns boolean
     */
    Game_Map.prototype.canTravelFrom = function () {
        this.setupAmiIfNeeded();
        return this._ami.canTravelFrom();
    };

    /**
     * マップがファストトラベル先になれるかどうかを返す
     * @returns boolean
     */
    Game_Map.prototype.canTravelTo = function () {
        this.setupAmiIfNeeded();
        return this._ami.canTravelTo();
    };

    /**
     * マップがプレイヤーによって訪問済みかを返す
     * @returns boolean
     */
    Game_Map.prototype.visited = function () {
        this.setupAmiIfNeeded();
        return this._ami.visited();
    };

    /**
     * マップに訪問済みフラグを立てる
     */
    Game_Map.prototype.visit = function () {
        this.setupAmiIfNeeded();
        this._ami.visit();
    };

    /**
     * ファストトラベル先になった時のマップID
     * @returns number
     */
    Game_Map.prototype.travelMapId = function () {
        this.setupAmiIfNeeded();
        return this._ami.travelMapId();
    };

    /**
     * ファストトラベル先になった時のX座標
     * @returns number
     */
    Game_Map.prototype.travelX = function () {
        this.setupAmiIfNeeded();
        return this._ami.travelX();
    };

    /**
     * ファストトラベル先になった時のY座標
     * @returns number
     */
    Game_Map.prototype.travelY = function () {
        this.setupAmiIfNeeded();
        return this._ami.travelY();
    };

    /**
     *  ファストトラベル先になるときの小型船のマップIDを返す
     * @returns number
     */
    Game_Map.prototype.boatMapId = function () {
        this.setupAmiIfNeeded();
        return this._ami.boatMapId();
    };

    /**
     *  ファストトラベル先になるときの小型船のX座標を返す
     * @returns number
     */
    Game_Map.prototype.boatX = function () {
        this.setupAmiIfNeeded();
        return this._ami.boatX();
    };

    /**
     *  ファストトラベル先になるときの小型船のY座標を返す
     * @returns number
     */
    Game_Map.prototype.boatY = function () {
        this.setupAmiIfNeeded();
        return this._ami.boatY();
    };

    /**
     *  ファストトラベル先になるときの大型船のマップIDを返す
     * @returns number
     */
    Game_Map.prototype.shipMapId = function () {
        this.setupAmiIfNeeded();
        return this._ami.shipMapId();
    };

    /**
     *  ファストトラベル先になるときの大型船のX座標を返す
     * @returns number
     */
    Game_Map.prototype.shipX = function () {
        this.setupAmiIfNeeded();
        return this._ami.shipX();
    };

    /**
     *  ファストトラベル先になるときの大型船のY座標を返す
     * @returns number
     */
    Game_Map.prototype.shipY = function () {
        this.setupAmiIfNeeded();
        return this._ami.shipY();
    };

    /**
     * ファストトラベル時の下船方向
     * @returns number
     */
    Game_Map.prototype.getOffShipDir = function () {
        this.setupAmiIfNeeded();
        return this._ami.getOffShipDir();
    };

    /**
     *  ファストトラベル先になるときの飛空艇のマップIDを返す
     * @returns number
     */
    Game_Map.prototype.airshipMapId = function () {
        this.setupAmiIfNeeded();
        return this._ami.airshipMapId();
    };

    /**
     *  ファストトラベル先になるときの飛空艇のX座標を返す
     * @returns number
     */
    Game_Map.prototype.airshipX = function () {
        this.setupAmiIfNeeded();
        return this._ami.airshipX();
    };

    /**
     *  ファストトラベル先になるときの飛空艇のY座標を返す
     * @returns number
     */
    Game_Map.prototype.airshipY = function () {
        this.setupAmiIfNeeded();
        return this._ami.airshipY();
    };

    //-------------------------------------------------------------------------
    // Game_Party

    const _Game_Party_onPlayerWalk = Game_Party.prototype.onPlayerWalk;
    /**
     * プレイヤーが指定リージョンに乗った場合はマップの外への移動を行う
     */
    Game_Party.prototype.onPlayerWalk = function () {
        if ($gamePlayer.regionId() === $gameMap.goOutRegion()) {
            console.log(">>>> " + this.constructor.name);
            console.log($gameMap.goOutSettings());

            if ($gameMap.enableEncounterGoingOut() == 0) {
                $gameSystem.enableEncounter();
            } else if ($gameMap.enableEncounterGoingOut() == 1) {
                $gameSystem.disableEncounter();
            }

            $gamePlayer.reserveTransfer(
                $gameMap.goOutSettings().mapId,
                $gameMap.goOutSettings().x,
                $gameMap.goOutSettings().y,
                2,
                $gameMap.goOutFadeType()
            );

            // 移動が完全に終わった後に実行させるために別の場所に
            // CEV ID をひかえる
            if ($gameMap.goOutCommonEvent()) {
                $s.on(param.swReservedCev);
                $v.set(param.varReservedCev, $gameMap.goOutCommonEvent());
            }
        } else {
            _Game_Party_onPlayerWalk.call(this);
        }
    };

    //-------------------------------------------------------------------------
    // Game_Player

    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    /**
     * 移動が確実に完了した後にCEV実行し、訪問フラグを立てる
     */
    Game_Player.prototype.performTransfer = function () {
        _Game_Player_performTransfer.call(this);

        // 移動が完全に終わってから、ひかえておいたCEVを実行
        if ($gameSwitches.value(param.swReservedCev)) {
            $gameSwitches.setValue(param.swReservedCev, false);
            $gameTemp.reserveCommonEvent($gameVariables.value(param.varReservedCev));
        }

        $gameMap.visit();
    };
})();

