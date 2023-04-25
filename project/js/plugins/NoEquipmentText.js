// NoEquipmentText.js Ver.1.0.0
// MIT License (C) 2022 あわやまたな
// http://opensource.org/licenses/mit-license.php

/*:
* @target MZ MV
* @plugindesc 装備画面に装備なしのテキストを追加します。
* @author あわやまたな (Awaya_Matana)
* @url https://awaya3ji.seesaa.net/
* @help 通常、装備を外すには空欄を選択する必要がありますが、
* それでは分かりづらいのでテキストを表示します。
*
* [更新履歴]
* 2022/09/28：Ver.1.0.0　公開。
*
* @param text
* @text テキスト
* @desc 表示するテキスト
* @default 装備なし
*
*/

{
	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
	const parameters = PluginManager.parameters(pluginName);
	const useMZ = Utils.RPGMAKER_NAME === "MZ";

	//-----------------------------------------------------------------------------
	// Window_EquipItem

	const _Window_EquipItem_drawItem = Window_EquipItem.prototype.drawItem;
	Window_EquipItem.prototype.drawItem = function(index) {
		_Window_EquipItem_drawItem.call(this, index);
		const item = useMZ ? this.itemAt(index) : this._data[index];
		if (item === null) {
			const rect = useMZ ? this.itemLineRect(index) : this.itemRectForText(index);
			this.drawText(parameters.text, rect.x, rect.y, rect.width);
		}
	};
}