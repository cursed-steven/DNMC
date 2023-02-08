//=============================================================================
// RPG Maker MZ - CSVN_swlfSwitchCtrl.js
// ----------------------------------------------------------------------------
// (C)2022 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2022/11/27 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc セルフスイッチを動的に制御する
 * @author cursed_twitch
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_swlfSwitchCtrl.js
 * 
 * @command controlSelfSwitch
 * @text セルフスイッチの制御
 * 
 * @arg mapId
 * @text マップID
 * @desc スクリプトで指定可能
 * @type string
 * 
 * @arg eventId
 * @text イベントID
 * @desc スクリプトで指定可能
 * @type string
 * 
 * @arg switchType
 * @text セルフスイッチA-D
 * @desc スクリプトで指定可能
 * @type string
 * 
 * @arg switchValue
 * @text true/false
 * @desc スクリプトで指定可能
 * @type string
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, "controlSelfSwitch", args => {
        $gameSelfSwitches.setValue(
            [
                eval(args.mapId),
                eval(args.eventId),
                eval("\"" + args.switchType + "\"")
            ],
            eval(args.switchValue) === 0
        );
    });
})();