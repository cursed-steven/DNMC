//=============================================================================
// RPG Maker MZ - CSVN_TauriForMz
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/04/21 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc NW.js ではなく Tauri によるビルド・デプロイ
 * @author cursed_steven
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * 
 * @help CSVN_TauriForMz.js
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //vv-----------------------------------------------------------------------
    //vv DevToolManager.js 的な開発支援部分
    //vv-----------------------------------------------------------------------

    //-------------------------------------------------------------------------
    // Graphics

    const _Graphics__clearAllElements = Graphics._createAllElements;
    /**
     * 起動時ログ表示の追加
     */
    Graphics._createAllElements = function () {
        _Graphics__clearAllElements.apply(this, arguments);
        this.tauriStartUpLog();
    };

    Graphics.tauriStartUpLog = function () {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log('>> This is CSVN_TauriForMz speaking...');
        console.log('>> ');
        console.log('>> RPG Maker Name   : ' + Utils.RPGMAKER_NAME);
        console.log('>> RPG Maker Version: ' + Utils.RPGMAKER_VERSION);
        console.log('>> User Agent       : ' + navigator.userAgent);
        console.log('>> Location Origin  : ' + location.origin);
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    };

    // テストプレイでない場合はこれ以降の機能は無効。
    if (location.port === "1430") {
        // cargo tauri dev すると 127.0.0.1:1430 で動く模様
        console.log('>> Features for test/debug mode activated.');
        Graphics._isTauriTest = true;
    } else {
        console.log('>> Features for test/debug mode deactivated in production mode.');
        return;
    }

})();