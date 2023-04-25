//=============================================================================
// 戦闘背景色調変更プラグイン
// tintBattleBack.js
// Copyright (c) 2018 村人Ａ
//=============================================================================

/*:ja
 * @target MV MZ
 * @plugindesc 戦闘背景の色調を変更するプラグインです。(無償版)
 * @author 村人A
 *
 * @help
 *
 *	　#プラグインコマンドを宣言し、左から赤、緑、青を0～255の間で指定
 *	　#床と遠景を宣言する場合は左から床の色調、遠景の色調という順番で指定
 *
 * 　#プラグインコマンド例:
 *   tintBB1 255 100 0                            #戦闘背景の床を赤255、緑100、青0に色調変化
 *   tintBB2 123 221 10                           #戦闘背景の遠景を赤123、緑221、青10に色調変化
 *   tintBB12 255 100 0 123 221 10                #戦闘背景の床を赤255、緑100、青0、遠景を赤123、緑221、青10に色調変化
 */

(function () {
    villaA_tintBattleBackArray = [];
    villaA_tintBattleBack1On = false;
    villaA_tintBattleBack2On = false;
    villaA_tintBattleBack12On = false;

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'tintBB1') {
            if ($gameParty.inBattle()) {
                villaA_tintBattleBackArray = [];
                for (var i = 0; i < args.length; i++) {
                    villaA_tintBattleBackArray.push(parseInt(args[i]))
                }
                villaA_tintBattleBack1On = true;
            }
        }

        if (command === 'tintBB2') {
            if ($gameParty.inBattle()) {
                villaA_tintBattleBackArray = [];
                for (var i = 0; i < args.length; i++) {
                    villaA_tintBattleBackArray.push(parseInt(args[i]))
                }
                villaA_tintBattleBack2On = true;
            }
        }

        if (command === 'tintBB12') {
            if ($gameParty.inBattle()) {
                villaA_tintBattleBackArray = [];
                for (var i = 0; i < args.length; i++) {
                    villaA_tintBattleBackArray.push(parseInt(args[i]))
                }
                villaA_tintBattleBack12On = true;
            }
        }
    }

    var _Spriteset_Battle_updateBattleback = Spriteset_Battle.prototype.updateBattleback;
    Spriteset_Battle.prototype.updateBattleback = function () {
        _Spriteset_Battle_updateBattleback.call(this);
        if (villaA_tintBattleBack1On) {
            this.tintBB10to16ChangeAndDo(villaA_tintBattleBackArray, this._back1Sprite)
            villaA_tintBattleBack1On = false;
        }

        if (villaA_tintBattleBack2On) {
            this.tintBB10to16ChangeAndDo(villaA_tintBattleBackArray, this._back2Sprite)
            villaA_tintBattleBack2On = false;
        }

        if (villaA_tintBattleBack12On) {
            var tintArray1 = villaA_tintBattleBackArray.slice(0, 3);
            var tintArray2 = villaA_tintBattleBackArray.slice(3, 6);
            this.tintBB10to16ChangeAndDo(tintArray1, this._back1Sprite)
            this.tintBB10to16ChangeAndDo(tintArray2, this._back2Sprite)
            villaA_tintBattleBack12On = false;
        }
    };

    Spriteset_Battle.prototype.tintBB10to16ChangeAndDo = function (tintarray, tintsprite) {
        var num = tintarray;
        var tintnum = "";
        for (var i = 0; i < 3; i++) {
            num[i] = num[i].toString(16);
            if (num[i].length < 2) {
                num[i] = "0" + num[i];
            }
            tintnum = tintnum + num[i];
        }
        tintnum = "0x" + tintnum;
        console.log(tintnum)
        tintsprite.tint = tintnum;
    }
})();