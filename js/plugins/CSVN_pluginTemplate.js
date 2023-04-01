//=============================================================================
// RPG Maker MZ - Plugin Template
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/04/xx 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 実質的な機能を持たないプラグインテンプレートです。
 * @author cursed_steven
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_pluginTemplate.js
 * 
 * 本プラグインは、プラグインとしての実質的な機能は何も持たず、
 * このヘルプやプラグインパラメータ記法のテンプレートとしての
 * 利用を想定しています。
 * cf. https://tkool.jp/mz/plugin/make/annotation.html
 * 
 * @param stringValue
 * @text 文字列
 * @desc 特に制約のない通常の文字列入力項目になります。
 * @type string
 * 
 * @param multilineStringValue
 * @text 複数行文字列
 * @desc 複数行入力可能な文字列入力項目になります。
 * @type multiline_string
 * 
 * @param fileValue
 * @text ファイル
 * @desc 画像や音声などのファイル選択ダイアログになります。設定されるのは、選択したファイル名(拡張子なし)です。
 * @dir audio/se
 * @type file
 * 
 * @param numberValue
 * @text 数値
 * @desc 数値のみ入力可能な項目になります。
 * @max 10
 * @min 0
 * @decimals 2
 * @type number
 * 
 * @param booleanValue
 * @text 真偽値
 * @desc ON:true OFF:false を設定するラジオボタンになります。
 * @default false
 * @type boolean
 * @on YES
 * @off NO
 * 
 * @param selectValue1
 * @text プルダウンリスト(1)
 * @desc 選択した項目のoptionが設定されるプルダウンリストになります。
 * @default B
 * @type select
 * @option A
 * @option B
 * @option C
 * 
 * @param selectValue2
 * @text プルダウンリスト(2)
 * @desc 選択した項目のvalueが設定されるプルダウンリストになります。
 * @default 2
 * @type select
 * @option その1
 * @value 1
 * @option その2
 * @value 2
 * @option その3
 * @value 3
 * 
 * @param comboValue
 * @text コンボボックス
 * @desc 選択した項目のoptionが設定されるコンボボックスになります。
 * @default B
 * @type combo
 * @option A
 * @option B
 * @option C
 * 
 * @param actorId
 * @text アクター
 * @desc データベースのアクターを選択するダイアログになります。
 * @default 1
 * @type actor
 * 
 * @param classId
 * @text 職業
 * @desc データベースの職業を選択するダイアログになります。
 * @default 1
 * @type class
 * 
 * @param skillId
 * @text スキル
 * @desc データベースのスキルを選択するダイアログになります。
 * @default 1
 * @type skill
 * 
 * @param itemId
 * @text アイテム
 * @desc データベースのアイテムを選択するダイアログになります。
 * @default 1
 * @type item
 * 
 * @param weaponId
 * @text 武器
 * @desc データベースの武器を選択するダイアログになります。
 * @default 1
 * @type weapon
 * 
 * @param armorId
 * @text 防具
 * @desc データベースの防具を選択するダイアログになります。
 * @default 1
 * @type armor
 * 
 * @param enemyId
 * @text 敵キャラ
 * @desc データベースの敵キャラを選択するダイアログになります。
 * @default 1
 * @type enemy
 * 
 * @param troopId
 * @text 敵グループ
 * @desc データベースの敵グループを選択するダイアログになります。
 * @default 1
 * @type troop
 * 
 * @param stateId
 * @text ステート
 * @desc データベースのステートを選択するダイアログになります。
 * @default 1
 * @type state
 * 
 * @param animationId
 * @text アニメーション
 * @desc データベースのアニメーションを選択するダイアログになります。
 * @default 1
 * @type animation
 * 
 * @param tilesetId
 * @text タイルセット
 * @desc データベースのタイルセットを選択するダイアログになります。
 * @default 1
 * @type tileset
 * 
 * @param commonEventId
 * @text コモンイベント
 * @desc データベースのコモンイベントを選択するダイアログになります。
 * @default 
 * @type common_event
 * 
 * @param switchId
 * @text スイッチ
 * @desc データベースのスイッチを選択するダイアログになります。
 * @default 1
 * @type switch
 * 
 * @param variableId
 * @text 変数
 * @desc データベースの変数を選択するダイアログになります。
 * @default 1
 * @type variable
 * 
 * @param stringArray
 * @text 文字列の配列
 * @desc 複数の文字列を入力できるダイアログになります。number[]のようなこともできます。
 * @default ["a", "b"]
 * @type string[]
 * 
 * @param structList
 * @text 構造体の配列
 * @desc 構造体の配列です。
 * @default 
 * @type struct<Sample>[]
 * 
 * @command test
 * @text テスト
 * 
 * @arg arg1
 * @text 引数1
 * @desc 引数1
 * @type string
 * 
 * @arg arg2
 * @text 引数2
 * @desc 引数2
 * @type number
 */

/*~struct~Sample:ja
 * 
 * @param value1
 * @text 値1
 * @desc 値1
 * @default a
 * @type string
 * 
 * @param value2
 * @text 値2
 * @desc 値2
 * @default b
 * @type string
 */

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, "test", args => {
        console.log('CSVN_pluginTemplate: TEST PCOM. arg1: ' + args.arg1 + ' arg2: ' + args.arg2);
    });

    console.log(param.stringValue);
    console.log(param.multilineStringValue);
    console.log(param.fileValue);
    console.log(param.numberValue);
    console.log(param.booleanValue);
    console.log(param.selectValue1);
    console.log(param.selectValue2);
    console.log(param.comboValue);
    console.log(param.actorId);
    console.log(param.classId);
    console.log(param.skillId);
    console.log(param.itemId);
    console.log(param.weaponId);
    console.log(param.armorId);
    console.log(param.enemyId);
    console.log(param.troopId);
    console.log(param.stateId);
    console.log(param.animationId);
    console.log(param.tilesetId);
    console.log(param.commonEventId);
    console.log(param.switchId);
    console.log(param.variableId);
    console.table(param.stringArray);
    console.table(param.structList);

})();