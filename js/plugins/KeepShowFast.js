// KeepShowFast.js Ver.1.0.0
// MIT License (C) 2021 あわやまたな
// http://opensource.org/licenses/mit-license.php

/*:
* @target MZ
* @plugindesc  瞬間表示"\>"を改行後も持続させます。
* @author あわやまたな (Awaya_Matana)
* @url https://awaya3ji.seesaa.net/
* @help 通常、瞬間表示"\>"は改行後に効果を失いますが、このプラグインを使うと
* 改行後の文章も瞬間表示されるようになります。
* つまり全文章の表示が1フレームで完了するようにできます。
*/

'use strict';
Window_Message.prototype.processNewLine = function(textState) {
    Window_Base.prototype.processNewLine.call(this, textState);
    if (this.needsNewPage(textState)) {
        this.startPause();
    }
};