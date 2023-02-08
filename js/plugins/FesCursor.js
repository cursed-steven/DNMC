// FesCursor.js Ver.2.1.0

/*:
* @target MZ
* @orderBefore EnemyGauge
* @plugindesc Display an RPG Maker Fes style cursor.
* @author あわやまたな (Awaya_Matana)
* @url https://awaya3ji.seesaa.net/
* @help Ver.2.1.0
* You can use it by putting images in the img/system folder.
* By combining with MVStyleWindow.js, you can make it closer to RPG Maker Fes.
*
* @param windowArrowImage
* @text Window Arrow Image
* @desc Displays arrows in selectable windows.
* If the image is (None), this feature is disabled.
* @type file
* @dir img/system
* @default WindowArrow
*
* @param saveCursorImage
* @text Save Cursor Image
* @desc Select the image of the cursor only when saving.
* If the image is (None), it is the same image as the arrow cursor.
* @type file
* @dir img/system
* @default 
*
* @param windowArrowRange
* @text Window Arrow Movement Range
* @desc The amount to move from the initial position during animation.
* 0 means no movement.
* @type number
* @default 10
*
* @param textPadding
* @text Text Padding
* @desc Shifts left-aligned text to the right.
* 0 means no shift.
* @type number
* @default 14
*
* @param windowArrowDuration
* @text Window Arrow Animation Duration
* @desc This is the number of frames the cursor will animate.
* 0 means no.
* @type number
* @default 50
*
* @param enemyCursorImage
* @text Enemy Cursor Image
* @desc Displays the cursor when selecting an enemy character.
* If the image is (None), the feature is disabled.
* @type file
* @dir img/system
* @default EnemyCursor
*
* @param enemyCursorHomeX
* @text Enemy Cursor Home X
* @desc How far the sprite is from the center.
* @type number
* @default 56
*
* @param enemyCursorHomeY
* @text Enemy Cursor Home Y
* @desc How far the sprite is from the center.
* @type number
* @default 56
*
* @param enemyCursorRangeX
* @text Enemy Cursor Movement Range X
* @desc The amount to move from the initial position during animation.
* If it is 0, it will not move from the spot.
* @type number
* @default 6
*
* @param enemyCursorRangeY
* @text Enemy Cursor Movement Range Y
* @desc The amount to move from the initial position during animation.
* 0 means no movement.
* @type number
* @default 6
*
* @param enemyCursorDuration
* @text Enemy Cursor Animation Duration
* @desc This is the number of frames the cursor will animate.
* 0 means no.
* @type number
* @default 50
*
* @param stopCursorAnimation
* @text Stop Cursor Animation
* @desc Stops the original rectangle cursor animation in the selectable window.
* @type boolean
* @default true
*
* @param hideCursor
* @text Hide Cursor
* @desc Do not show the original rectangle cursor when the background is dimmed.
* @type boolean
* @default true
*
* @param fastPauseSign
* @text Fast Pause Sign
* @desc Speeds up pause sign animation.
* @type boolean
* @default false
*
* @param gradientCursor
* @text Gradient Cursor
* @desc Display the cursor with a RPG Maker Fes style gradient.
* @type boolean
* @default false
*
* @param gradientCursorBladeLength
* @text Gradient Cursor Blade Length
* @desc The sharpness of the cursor tip.
* @type number
* @default 16
*
* @param pauseSignToRight
* @text Pause Sign Right Alignment
* @desc Display the pause sign on the right.
* @type boolean
* @default true
*
* @param exclusionList
* @text Exclusion List
* @desc Set the window without the window arrow.
* @type string[]
* @default ["Window_NameEdit","Window_ShopNumber","Window_BattleStatus","Window_BattleActor"]
*
*/

/*:ja
* @target MZ
* @orderBefore EnemyGauge
* @plugindesc ツクールフェス風のカーソルを表示します。
* @author あわやまたな (Awaya_Matana)
* @url https://awaya3ji.seesaa.net/
* @help img/systemフォルダに画像を入れることで使用できます。
* MVStyleWindow.jsと組み合わせるとよりツクールフェスに近づけられます。
*
* [更新履歴]
* 2022/06/16：Ver.1.0.0　公開
* 2022/06/20：Ver.1.1.0　パラメータ追加。
* 2022/07/18：Ver.1.1.1　イベントコマンド［選択肢］のウィンドウ幅を修正。
* 2022/07/30：Ver.2.0.0　スプライト数削減。パラメータに除外リスト追加。フェス仕様のグラデーションを追加。セーブ時専用のカーソルを使用可能に。
* 2022/07/31：Ver.2.0.1　スクロール中にしか矢印の位置調整をしないようにした。
* 2022/08/28：Ver.2.0.2　カーソルアニメーションを無効にした時の不透明度を修正。所持金ウィンドウを修正。
* 2022/09/09：Ver.2.0.3　ステータス表示のパディングを修正。
* 2022/09/19：Ver.2.0.4　装備画面のパディングを修正。
* 2022/12/09：Ver.2.0.5　FesStyleBattleの判別方法を修正。
* 2022/12/19：Ver.2.1.0　階調カーソルをツクールフェスに近くなるように調整。
*
* @param windowArrowImage
* @text 矢印カーソル画像
* @desc 矢印カーソルの画像を選択します。
* 画像が（なし）の場合、この機能は無効です。
* @type file
* @dir img/system
* @default WindowArrow
*
* @param saveCursorImage
* @text セーブカーソル画像
* @desc セーブ時限定のカーソルの画像を選択します。
* 画像が（なし）の場合、矢印カーソルと同じ画像です。
* @type file
* @dir img/system
* @default 
*
* @param windowArrowRange
* @text 矢印カーソル移動範囲
* @desc アニメーション時、初期位置からどれくらい動くか。
* 0ならその場から動きません。
* @type number
* @default 10
*
* @param textPadding
* @text テキストのパディング
* @desc 左揃えのテキストを右にずらします。
* 0だとずらしません。
* @type number
* @default 14
*
* @param windowArrowDuration
* @text ウィンドウ矢印のアニメーション間隔
* @desc このフレーム数でカーソルがアニメーションを行います。
* 0で行いません。
* @type number
* @default 50
*
* @param enemyCursorImage
* @text 敵キャラカーソル画像
* @desc 敵キャラ選択時にカーソルを表示します。
* 画像が（なし）の場合、この機能は無効です。
* @type file
* @dir img/system
* @default EnemyCursor
*
* @param enemyCursorHomeX
* @text エネミーカーソル初期位置X
* @desc スプライトが中央からどれくらい離れるか。
* @type number
* @default 56
*
* @param enemyCursorHomeY
* @text エネミーカーソル初期位置Y
* @desc スプライトが中央からどれくらい離れるか。
* @type number
* @default 56
*
* @param enemyCursorRangeX
* @text エネミーカーソル移動範囲X
* @desc アニメーション時、初期位置からどれくらい動くか。
* 0ならその場から動きません。
* @type number
* @default 6
*
* @param enemyCursorRangeY
* @text エネミーカーソル移動範囲Y
* @desc アニメーション時、初期位置からどれくらい動くか。
* 0ならその場から動きません。
* @type number
* @default 6
*
* @param enemyCursorDuration
* @text エネミーカーソルのアニメーション間隔
* @desc このフレーム数でカーソルがアニメーションを行います。
* 0で行いません。
* @type number
* @default 50
*
* @param stopCursorAnimation
* @text カーソルアニメーション停止
* @desc 選択ウィンドウに元からあるカーソルのアニメーションを停止します。
* @type boolean
* @default true
*
* @param hideCursor
* @text カーソル非表示
* @desc 背景を暗くしたときに元からあるカーソルを表示しません。
* @type boolean
* @default true
*
* @param fastPauseSign
* @text ポーズサイン高速化
* @desc ポーズサインのアニメーションを速くします。
* @type boolean
* @default false
*
* @param gradientCursor
* @text 階調カーソル
* @desc ツクールフェス風のグラデーションが掛かったカーソルを表示します。
* @type boolean
* @default false
*
* @param gradientCursorBladeLength
* @text 階調カーソル刃渡り
* @desc カーソル先端の鋭さです。
* @type number
* @default 16
*
* @param pauseSignToRight
* @text ポーズサイン右寄せ
* @desc ポーズサインを右側に表示します。
* @type boolean
* @default true
*
* @param exclusionList
* @text 除外リスト
* @desc ウィンドウ矢印を使用しないウィンドウを設定します。
* @type string[]
* @default ["Window_NameEdit","Window_ShopNumber","Window_BattleStatus","Window_BattleActor"]
*
*/

'use strict';

function Sprite_WindowCursor() {
	this.initialize(...arguments);
}

function Sprite_EnemyCursor() {
	this.initialize(...arguments);
}

{

	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
	const parameters = PluginManager.parameters(pluginName);
	const fesStyleBattle = $plugins.some(plugin => Utils.extractFileName(plugin.name) === "FesStyleBattle" && plugin.status);
	const windowArrowImage = parameters["windowArrowImage"];
	const windowArrowRange = Number(parameters["windowArrowRange"]);
	const textPadding = Number(parameters["textPadding"]);
	const windowArrowDuration = Number(parameters["windowArrowDuration"]);
	const enemyCursorImage = parameters["enemyCursorImage"];
	const enemyCursorHomeX = Number(parameters["enemyCursorHomeX"])*-1;
	const enemyCursorHomeY = Number(parameters["enemyCursorHomeY"])*-1;
	const enemyCursorRangeX = Number(parameters["enemyCursorRangeX"]);
	const enemyCursorRangeY = Number(parameters["enemyCursorRangeY"]);
	const enemyCursorDuration = Number(parameters["enemyCursorDuration"]);
	const stopCursorAnimation = parameters["stopCursorAnimation"] === "true";
	const fastPauseSign = parameters["fastPauseSign"] === "true";
	const gradientCursor = parameters["gradientCursor"] === "true";
	const gradientCursorBladeLength = Number(parameters["gradientCursorBladeLength"]);
	const pauseSignToRight = parameters["pauseSignToRight"] === "true";
	const hideCursor = parameters["hideCursor"] === "true";
	const exclusionList = new Set(JSON.parse(parameters["exclusionList"] || "[]"));
	const saveCursorImage = parameters["saveCursorImage"];

	//-----------------------------------------------------------------------------
	// Window

	if (pauseSignToRight) {
		const _Window__refreshPauseSign = Window.prototype._refreshPauseSign;
		Window.prototype._refreshPauseSign = function() {
			_Window__refreshPauseSign.call(this);
			this._pauseSignSprite.move(this._width-24, this._height-12);
		};
	}

	if (fastPauseSign) {
		const _Window__updatePauseSign = Window.prototype._updatePauseSign;
		Window.prototype._updatePauseSign = function() {
			_Window__updatePauseSign.call(this);
			const sprite = this._pauseSignSprite;
			const x = Math.floor(this._animationCount / 8) % 2;
			const y = Math.floor(this._animationCount / 8 / 2) % 2;
			const sx = 144;
			const sy = 96;
			const p = 24;
			sprite.setFrame(sx + x * p, sy + y * p, p, p);
		};
	}

	if (stopCursorAnimation) {
		Window.prototype._makeCursorAlpha = function() {
			return this.contentsOpacity / 255;
		};
	}

	if (windowArrowImage) {

		//-----------------------------------------------------------------------------
		// Window_Selectable

		const _Window_Selectable_initialize = Window_Selectable.prototype.initialize;
		Window_Selectable.prototype.initialize = function(rect) {
			this._arrowCursorSprites = [];
			this._arrowCursor = null;
			this._arrowCursorDuration = 0;
			this.arrowCursorVisible = this.fesArrowCursorEnabled();
			_Window_Selectable_initialize.call(this, rect);
		};

		Window_Selectable.prototype.fesArrowCursorEnabled = function() {
			return !exclusionList.has(this.constructor.name);
		};

		const _Window_Selectable__createClientArea = Window_Selectable.prototype._createClientArea;
		Window_Selectable.prototype._createClientArea = function() {
			_Window_Selectable__createClientArea.call(this);
			this._createArrowCursorArea();
		};

		Window_Selectable.prototype._createArrowCursorArea = function() {
			this._arrowCursorArea = new Sprite();
			this._arrowCursorArea.filters = [new PIXI.filters.AlphaFilter()];
			this._arrowCursorArea.filterArea = new Rectangle();
			this._arrowCursorArea.move(this._padding, this._padding);
			this.addChild(this._arrowCursorArea);
		};

		const _Window_Selectable__updateClientArea = Window_Selectable.prototype._updateClientArea;
		Window_Selectable.prototype._updateClientArea = function() {
			_Window_Selectable__updateClientArea.call(this);
			this._updateArrowCursorArea();
		};

		Window_Selectable.prototype._updateArrowCursorArea = function() {
			this._arrowCursorArea.x = this._clientArea.x;
			this._arrowCursorArea.y = this._clientArea.y;
	        this._arrowCursorArea.visible = this._clientArea.visible;
		};

		const _Window_Selectable__updateFilterArea = Window_Selectable.prototype._updateFilterArea;
		Window_Selectable.prototype._updateFilterArea = function() {
			_Window_Selectable__updateFilterArea.call(this);
			this._updateArrowCursorFilterArea();
		};

		Window_Selectable.prototype._updateArrowCursorFilterArea = function() {
			const pos = this._arrowCursorArea.worldTransform.apply(new Point(0, 0));
			const filterArea = this._arrowCursorArea.filterArea;
			const exWidth = this._updateArrowCursorFilterAreaExtraWidth();
			filterArea.x = pos.x + this.origin.x - this.padding - Math.floor(exWidth/2);
			filterArea.y = pos.y + this.origin.y;
			filterArea.width = this.width + exWidth;
			filterArea.height = this.innerHeight;
		};

		Window_Selectable.prototype._updateArrowCursorFilterAreaExtraWidth = function() {
			return 0;
		};

		const _Window_Selectable_updateScrollBase = Window_Selectable.prototype.updateScrollBase;
		Window_Selectable.prototype.updateScrollBase = function(baseX, baseY) {
			_Window_Selectable_updateScrollBase.apply(this, arguments);
			if (this._arrowCursorSprites.length > 0) {
				this.updateArrowCursor();
			}
		};

		Window_Selectable.prototype.updateArrowCursor = function() {
			this._arrowCursorSprites.forEach(sprite => sprite.visible = false);
			const cursorIndex = this.index() - this.topIndex();
			this._arrowCursor = cursorIndex >= 0 ? this._arrowCursorSprites[cursorIndex] : null;
			this.adjustArrowCursorPosition();
		};

		Window_Selectable.prototype.createArrowCursor = function() {
			const sprite = new Sprite_WindowCursor(this.arrowCursorToRight());
			this._arrowCursorSprites.push(sprite);
			this._arrowCursorArea.addChild(sprite);
		};

		Window_Selectable.prototype.arrowCursorToRight = function() {
			return false;
		};

		Window_Selectable.prototype.arrowCursorPadding = function() {
			return this.arrowCursorVisible;
		};

		Window_Selectable.prototype.refreshArrowCursorActivate = function() {
			if (this.active) {
				this._arrowCursorSprites.forEach(sprite => sprite.activate());
			} else {
				this._arrowCursorSprites.forEach(sprite => sprite.deactivate());
			}
		};

		const _Window_Selectable_activate = Window_Selectable.prototype.activate;
		Window_Selectable.prototype.activate = function() {
			_Window_Selectable_activate.call(this);
			this.refreshArrowCursorActivate();
		};

		const _Window_Selectable_deactivate = Window_Selectable.prototype.deactivate;
		Window_Selectable.prototype.deactivate = function() {
			_Window_Selectable_deactivate.call(this);
			this.refreshArrowCursorActivate();
		};

		const _Window_Selectable_itemLineRect = Window_Selectable.prototype.itemLineRect;
		Window_Selectable.prototype.itemLineRect = function(index) {
			const rect = _Window_Selectable_itemLineRect.call(this, index);
			const padding = textPadding;
			if (this.arrowCursorPadding()) {
				if (!this.arrowCursorToRight()) {
					rect.x += padding;
				}
				rect.width -= padding;
			}
			return rect;
		};

		const _Window_Selectable__updateCursor = Window_Selectable.prototype._updateCursor;
		Window_Selectable.prototype._updateCursor = function() {
			_Window_Selectable__updateCursor.call(this);
			if (this._backCursorCanInvisible()) {
				this._cursorSprite.visible = false;
			}
			this._updateArrowCursor();
		};

		Window_Selectable.prototype._backCursorCanInvisible = function() {
			return (hideCursor && this._dimmerSprite && this._dimmerSprite.visible) || (this.arrowCursorVisible && gradientCursor && this.maxCols() > 1);
		};

		Window_Selectable.prototype._updateArrowCursor = function() {
			if (this._arrowCursorSprites.length === 0) return;
			const visible = this.isOpen() && this.cursorVisible && this.arrowCursorVisible;
			this._arrowCursorSprites.forEach(sprite => sprite.visible = false);
			this._updateArrowCursorDuration();
			if (this._cursorAll) {
				this._arrowCursorSprites.forEach(sprite => sprite.visible = visible);
			} else if (this._arrowCursor) {
				this._arrowCursor.visible = visible;
			}
			this._arrowCursorSprites.forEach(sprite => {
				if (sprite.visible) {
					sprite.updateSprite(this._arrowCursorDuration);
				}
			});
		};

		Window_Selectable.prototype._updateArrowCursorDuration = function() {
			this._arrowCursorDuration--;
			if (!this.active) {
				this._arrowCursorDuration = 0;
			} else if (this._arrowCursorDuration <= 0) {
				this._arrowCursorDuration = arrowDuration;
			}
		};

		const _Window_Selectable_moveCursorBy = Window_Selectable.prototype.moveCursorBy;
		Window_Selectable.prototype.moveCursorBy = function(x, y) {
			_Window_Selectable_moveCursorBy.call(this, x, y);
			this.moveArrowCursorBy(x, y);
		};

		Window_Selectable.prototype.moveArrowCursorBy = function(x, y) {
			this._arrowCursorSprites.forEach(sprite => {
				const lastHomeX = sprite._homeX;
				const lastHomeY = sprite._homeY;
				sprite.setHome(sprite._homeX + x, sprite._homeY + y);
			});
		};

		Window_Selectable.prototype.adjustArrowCursorSize = function() {
			let visibleItems = this.maxVisibleItems();
			const difference = visibleItems - this._arrowCursorSprites.length;
			if (difference > 0) {
				for (let i = 0; difference > i; i++) {
					this.createArrowCursor();
				};
			} else if (difference < 0) {
				const d = -difference
				for (let i = 0; d > i; i++) {
					const sprite = this._arrowCursorSprites.shift();
					sprite.destroy();
				};
			}
		};

		Window_Selectable.prototype.refreshArrowCursorSkin = function() {
			this._arrowCursorSprites.forEach(sprite => sprite.loadCursorskin(this.arrowCursorSkinName()));
		};

		Window_Selectable.prototype.arrowCursorSkinName = function() {
			return windowArrowImage;
		};

		Window_Selectable.prototype.adjustArrowCursorPosition = function() {
			this._arrowCursorSprites.forEach((sprite, index) => {
				const rect = this.itemRect(index + this.topIndex());
				sprite.setHome(this.arrowCursorX(rect), this.arrowCursorY(rect));
			});
		};

		const _Window_Selectable_select = Window_Selectable.prototype.select;
		Window_Selectable.prototype.select = function(index) {
			const lastIndex = this._index;
			_Window_Selectable_select.call(this, index);
			if (this.fesArrowCursorEnabled()) {
				this.refreshArrowCursor(lastIndex);
			}
		};

		Window_Selectable.prototype.refreshArrowCursor = function(lastIndex) {
			this.adjustArrowCursorSize();
			if (this._arrowCursorSprites.length === 0) return;
			if (this._cursorAll) {
				this.refreshArrowCursorForAll();
			} else if (this.index() >= 0 && this._index !== lastIndex) {
				this._arrowCursorDuration = 0;
			}
			this.refreshArrowCursorSkin();
			this.updateArrowCursor();
		};

		Window_Selectable.prototype.refreshArrowCursorForAll = function() {
			const lastVisible = this._arrowCursorSprites.every(sprite => sprite.visible);
			if (!lastVisible) {
				this._arrowCursorDuration = 0;
			}
		};

		Window_Selectable.prototype.arrowCursorOffsetX = function() {
			return 0;
		};

		Window_Selectable.prototype.arrowCursorX = function(rect) {
			const toRight = this.arrowCursorToRight();
			const offsetX = this.arrowCursorOffsetX();
			rect.x += (toRight ? rect.width - offsetX : offsetX);
			return rect.x;
		};

		Window_Selectable.prototype.arrowCursorY = function(rect) {
			const shiftY = 0;
			rect.y += rect.height / 2 + shiftY;
			return rect.y;
		};

		//-----------------------------------------------------------------------------
		// Window_Command

		Window_Command.prototype.arrowCursorPadding = function() {
			return this.arrowCursorVisible && this.itemTextAlign() !== "center";
		};

		//-----------------------------------------------------------------------------
		// Window_Options

		Window_Options.prototype.arrowCursorPadding = function() {
			return this.arrowCursorVisible;
		};

		//-----------------------------------------------------------------------------
		// Window_SavefileList

		Window_SavefileList.prototype.arrowCursorPadding = function() {
			return false;
		};

		//-----------------------------------------------------------------------------
		// Window_NameInput

		Window_NameInput.prototype.arrowCursorPadding = function() {
			return false;
		};

		const _Window_NameInput_processCursorMove = Window_NameInput.prototype.processCursorMove;
		Window_NameInput.prototype.processCursorMove = function() {
			const lastIndex = this._index;
			_Window_NameInput_processCursorMove.call(this);
			if (lastIndex !== this._index) {
				this.refreshArrowCursor();
			}
		};

		//-----------------------------------------------------------------------------
		// Window_NumberInput

		Window_NumberInput.prototype.arrowCursorPadding = function() {
			return false;
		};

		// Window_StatusBase系

		//-----------------------------------------------------------------------------
		// Window_StatusBase
/*
		Window_StatusBase.prototype.arrowCursorPadding = function() {
			return false;
		};
*/
		//-----------------------------------------------------------------------------
		// Window_StatusParams

		Window_StatusParams.prototype.arrowCursorPadding = function() {
			return false;
		};

		//-----------------------------------------------------------------------------
		// Window_EquipStatus

		Window_EquipStatus.prototype.arrowCursorPadding = function() {
			return false;
		};

		//-----------------------------------------------------------------------------
		// Window_Gold

		Window_Gold.prototype.arrowCursorPadding = function() {
			return false;
		};

		//-----------------------------------------------------------------------------
		// Window_ChoiceList

		const _Window_ChoiceList_maxChoiceWidth = Window_ChoiceList.prototype.maxChoiceWidth;
		Window_ChoiceList.prototype.maxChoiceWidth = function() {
			const maxWidth = _Window_ChoiceList_maxChoiceWidth.call(this);
			const padding = this.arrowCursorPadding() ? textPadding : 0;
			return maxWidth + padding*2;
		};

		Window_ChoiceList.prototype.arrowCursorPadding = function() {
			return this.arrowCursorVisible;
		};

		//-----------------------------------------------------------------------------
		// Window_BattleStatus

		Window_BattleStatus.prototype.fesArrowCursorEnabled = function() {
			return fesStyleBattle || Window_Selectable.prototype.fesArrowCursorEnabled.call(this);
		};

		//-----------------------------------------------------------------------------
		// Window_SavefileList

		Window_SavefileList.prototype.arrowCursorSkinName = function() {
			return this._mode === "save" && saveCursorImage ? saveCursorImage : Window_Selectable.prototype.arrowCursorSkinName();
		};

	}

	//-----------------------------------------------------------------------------
	// Sprite_WindowCursor

	Sprite_WindowCursor.prototype = Object.create(Sprite.prototype);
	Sprite_WindowCursor.prototype.constructor = Sprite_WindowCursor;

	Sprite_WindowCursor.prototype.initialize = function(mirror) {
		Sprite.prototype.initialize.call(this);
		this._cursorskin = null;
		this.initMembers(mirror);
		this.createBitmap();
		//this.loadCursorskin();
	};

	Object.defineProperty(Sprite_WindowCursor.prototype, "cursorskin", {
		get: function() {
			return this._cursorskin;
		},
		set: function(value) {
			if (this._cursorskin !== value) {
				this._cursorskin = value;
				this._cursorskin.addLoadListener(this.onCursorskinLoad.bind(this));
			}
		},
		configurable: true
	});

	Sprite_WindowCursor.prototype.initMembers = function(mirror) {
		this._duration = 0;
		this._homeX = 0;
		this._homeY = 0;
		this._offsetX = 0;
		this._offsetY = 0;
		this.active = false;
		this._mirror = !!mirror;
	};

	Sprite_WindowCursor.prototype.animationShouldMirror = function() {
		return this._mirror;
	};

	Sprite_WindowCursor.prototype.setHome = function(x, y) {
		this._homeX = x;
		this._homeY = y;
		this.updatePosition();
	};

	Sprite_WindowCursor.prototype.destroy = function(options) {
		Sprite.prototype.destroy.call(this, options);
	};

	Sprite_WindowCursor.prototype.activate = function() {
		this.active = true;
	};

	Sprite_WindowCursor.prototype.deactivate = function() {
		this.active = false;
	};

	Sprite_WindowCursor.prototype.loadCursorskin = function(filename) {
		this.cursorskin = ImageManager.loadSystem(filename);
	};

	Sprite_WindowCursor.prototype.createBitmap = function() {
		this.createInnerSprite();
		this.createFrameSprite();
	};
		
	Sprite_WindowCursor.prototype.createFrameSprite = function() {
		const sprite = new Sprite();
		this._frameSprite = sprite;
		this.addChild(sprite);
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;
		sprite.scale.x = this.animationShouldMirror() ? -1 : 1;
	};

	Sprite_WindowCursor.prototype.createInnerSprite = function() {
		const sprite = new Sprite();
		this._innerSprite = sprite;
		this.addChild(sprite);
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;
		sprite.scale.x = this.animationShouldMirror() ? -1 : 1;
	};

	Sprite_WindowCursor.prototype.onCursorskinLoad = function() {
		this.refreshFrame();
		this.refreshInner();
	};

	Sprite_WindowCursor.prototype.refreshFrame = function() {
		const sprite = this._frameSprite;
		const skin = sprite.bitmap = this.cursorskin;
		sprite.setFrame(0, 0, skin.width/2, skin.height);
	};

	Sprite_WindowCursor.prototype.refreshInner = function() {
		const sprite = this._innerSprite;
		const skin = sprite.bitmap = this.cursorskin;
		sprite.setFrame(skin.width/2, 0, skin.width/2, skin.height);
	};

	Sprite_WindowCursor.prototype.updateSprite = function(duration) {
		this._duration = duration;
		this.updateBlendColor();
		this.updateColorTone();
		this.updatePattern();
		this.updatePosition();
	};

	Sprite_WindowCursor.prototype.updatePattern = function() {
		const duration = this._duration;
		const max = windowArrowRange;
		if (duration < arrowDuration / 2) {
			this._offsetX = max * duration / arrowDuration * 2;
		} else {
			this._offsetX = max * (arrowDuration - duration) / arrowDuration * 2;
		}
		if (this.animationShouldMirror()) {
			this._offsetX -= max;
		};
	};

	Sprite_WindowCursor.prototype.updatePosition = function() {
		this.x = Math.round(this._homeX + this._offsetX);
		this.y = Math.round(this._homeY + this._offsetY);
	};

	Sprite_WindowCursor.prototype.updateBlendColor = function() {
		const alpha = this.active ? 0 : 64;
		this.setBlendColor([0, 0, 0, alpha]);
	};

	const arrowDuration = windowArrowDuration;
	Sprite_WindowCursor.prototype.updateColorTone = function() {
		const colorTone = this.makeColorTone();
		this._innerSprite.setColorTone(colorTone);
	};

	Sprite_WindowCursor.prototype.makeColorTone = function() {
		const duration = this._duration;
		const max = 64;
		let c = 0;
		if (duration < arrowDuration / 2) {
			c = max * duration / arrowDuration * 2;
		} else {
			c = max * (arrowDuration - duration) / arrowDuration * 2;
		}
		c -= 32;
		return [c, c, c, 0];
	};

	if (arrowDuration === 0) {
		Sprite_WindowCursor.prototype.updatePattern = function() {};
		Sprite_WindowCursor.prototype.updateColorTone = function() {};
		Sprite_WindowCursor.prototype.updateDuration = function() {};
	}

	//-----------------------------------------------------------------------------
	// Spriteset_Battle

	const _Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
	Spriteset_Battle.prototype.createLowerLayer = function() {
		_Spriteset_Battle_createLowerLayer.call(this);
		if (enemyCursorImage) this.createEnemyCursorSprite();
	};

	Spriteset_Battle.prototype.createEnemyCursorSprite = function() {
		const enemySprites = this._enemySprites;
		this._enemyCursorSprites = [];
		for (const enemySprite of enemySprites) {
			const sprite = new Sprite_EnemyCursor();
			sprite.setup(enemySprite);
			this._enemyCursorSprites.push(sprite);
			this._battleField.addChild(sprite);
			sprite.anchor.x = 0.5;
			sprite.anchor.y = 0.5;
		}
	};

	//-----------------------------------------------------------------------------
	// Sprite_EnemyCursor

	Sprite_EnemyCursor.prototype = Object.create(Sprite.prototype);
	Sprite_EnemyCursor.prototype.constructor = Sprite_EnemyCursor;

	Sprite_EnemyCursor.prototype.initialize = function() {
		Sprite.prototype.initialize.call(this);
		this._cursorskin = null;
		this.initMembers();
		this.createSprites();
		this.loadCursorskin();
	};

	Object.defineProperty(Sprite_EnemyCursor.prototype, "cursorskin", {
		get: function() {
			return this._cursorskin;
		},
		set: function(value) {
			if (this._cursorskin !== value) {
				this._cursorskin = value;
				this._cursorskin.addLoadListener(this.onCursorskinLoad.bind(this));
			}
		},
		configurable: true
	});

	Sprite_EnemyCursor.prototype.initMembers = function() {
		this._battler = null;
		this._target = null;
		this._homeX = 0;
		this._homeY = 0;
		this._offsetX = 0;
		this._offsetY = 0;
		this._battler = null;
		this._scaleMap = [ { x: 1, y: 1},  { x: 1, y: -1},  { x: -1, y: 1},  { x: -1, y: -1} ];
	};

	Sprite_EnemyCursor.prototype.loadCursorskin = function() {
		this.cursorskin = ImageManager.loadSystem(enemyCursorImage);
	};

	Sprite_EnemyCursor.prototype.onCursorskinLoad = function() {
		this.refresh();
	};

	Sprite_EnemyCursor.prototype.refresh = function() {
		this.refreshSprites();
	};

	Sprite_EnemyCursor.prototype.refreshSprites = function() {
		this._cursorSprites.forEach(sprite => {
			this.refreshFrame(sprite);
			this.refreshInner(sprite);
		});
	};

	Sprite_EnemyCursor.prototype.refreshFrame = function(sprites) {
		const sprite = sprites._frameSprite;
		const skin = sprite.bitmap = this.cursorskin;
		sprite.setFrame(0, 0, skin.width/2, skin.height);
	};

	Sprite_EnemyCursor.prototype.refreshInner = function(sprites) {
		const sprite = sprites._innerSprite;
		const skin = sprite.bitmap = this.cursorskin;
		sprite.setFrame(skin.width/2, 0, skin.width/2, skin.height);
	};

	Sprite_EnemyCursor.prototype.setup = function(target) {
		this._battler = target._battler;
		this._target = target;
	};

	Sprite_EnemyCursor.prototype.destroy = function(options) {
		Sprite.prototype.destroy.call(this, options);
	};

	Sprite_EnemyCursor.prototype.createSprites = function() {
		this._cursorSprites = [];
		for (let i = 0; i < 4; i++) {
			const sprite = new Sprite();
			const inner = this.createInnerSprite(i);
			const frame = this.createFrameSprite(i);
			this._cursorSprites.push(sprite);
			this.addChild(sprite);
			sprite.addChild(inner);
			sprite.addChild(frame);
			sprite._innerSprite = inner;
			sprite._frameSprite = frame;
		}
	};

	Sprite_EnemyCursor.prototype.createFrameSprite = function(i) {
		const sprite = new Sprite();
		const scale = this._scaleMap[i];
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;
		sprite.scale.x = scale.x;
		sprite.scale.y = scale.y;
		return sprite;
	};

	Sprite_EnemyCursor.prototype.createInnerSprite = function(i) {
		const sprite = new Sprite();
		const scale = this._scaleMap[i];
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;
		sprite.scale.x = scale.x;
		sprite.scale.y = scale.y;
		return sprite;
	};

	Sprite_EnemyCursor.prototype.update = function() {
		Sprite.prototype.update.call(this);
		this.updatePattern();
		this.updatePosition();
		this.updateColorTone();
	};

	const cursorDuration = enemyCursorDuration;
	Sprite_EnemyCursor.prototype.updatePattern = function() {
		this.visible = this._battler.isSelected();
		if (this.visible) {
			const duration = Graphics.frameCount % cursorDuration;
			let ratio = 1;
			if (duration < cursorDuration / 2) {
				ratio = duration / cursorDuration * 2;
			} else {
				ratio = (cursorDuration - duration) / cursorDuration * 2;
			}
			
			const homeX = enemyCursorHomeX;
			const homeY = enemyCursorHomeY;
			const offsetX = enemyCursorRangeX * ratio;
			const offsetY = enemyCursorRangeY * ratio;
			this._cursorSprites.forEach((sprite, index) => {
				const scale = this._scaleMap[index];
				const x = Math.round((homeX + offsetX) * (scale.x < 0 ? -1 : 1));
				const y = Math.round((homeY + offsetY) * (scale.y < 0 ? -1 : 1));
				sprite.move(x, y);
			});
		}
	};

	Sprite_EnemyCursor.prototype.updatePosition = function() {
		const sprite = this._target;
		this.x = sprite._homeX + sprite._offsetX;
		this.y = sprite._homeY + sprite._offsetY;
		this.y -= Math.floor(sprite.height/2);
	};
		
	Sprite_EnemyCursor.prototype.updateColorTone = function() {
		if (this.visible) {
			const colorTone = this.makeColorTone();
			this._cursorSprites.forEach((sprite, index) => {
				sprite._innerSprite.setColorTone(colorTone);
			});
		}
	};

	Sprite_EnemyCursor.prototype.makeColorTone = function() {
		const duration = Graphics.frameCount % cursorDuration;
		const max = 64;
		let c = 0;
		if (duration < cursorDuration / 2) {
			c = max * duration / cursorDuration * 2;
		} else {
			c = max * (cursorDuration - duration) / cursorDuration * 2;
		}
		c -= 32;
		return [c, c, c, 0];
	};

	if (cursorDuration === 0) {
		Sprite_EnemyCursor.prototype.updatePattern = function() {
			this.visible = this._battler.isSelected();
			if (this.visible) {
				const homeX = enemyCursorHomeX;
				const homeY = enemyCursorHomeY;
				this._cursorSprites.forEach((sprite, index) => {
					const scale = this._scaleMap[index];
					const x = Math.round(homeX * (scale.x < 0 ? -1 : 1));
					const y = Math.round(homeY * (scale.y < 0 ? -1 : 1));
					sprite.move(x, y);
				});
			}
		};
		Sprite_EnemyCursor.prototype.updateColorTone = function() {};
		Sprite_EnemyCursor.prototype.updateDuration = function() {};
	}

	//-----------------------------------------------------------------------------
	// ColorManager

	ColorManager.fesCursorColor1 = function() {
		return "rgba(143, 107, 57, 1)";
	};

	ColorManager.fesCursorColor2 = function() {
		return "rgba(143, 107, 57, 0)";
	};
/* old version
	ColorManager.fesCursorColor1 = function() {
		return "rgba(253, 163, 38, 0.5)";
	};

	ColorManager.fesCursorColor2 = function() {
		return "rgba(253, 163, 38, 0)";
	};
*/
	//-----------------------------------------------------------------------------
	// Bitmap

	Bitmap.prototype.fillFesArrowHead = function(x, y, width, height, color) {
		const x1 = x;
		const y1 = y + height / 2;
		const x2 = x + width;
		const y2 = y;
		const x3 = x2;
		const y3 = y + height;
		const context = this.context;
		context.save();
		context.fillStyle = color;
		context.beginPath();
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.lineTo(x3, y3);
		context.fill();
		context.restore();
		this._baseTexture.update();
	};

	//-----------------------------------------------------------------------------
	// Window

	const _Window__createCursorSprite = Window.prototype._createCursorSprite;
	Window.prototype._createCursorSprite = function() {
		_Window__createCursorSprite.call(this);
		if (this.fesGradCursorEnabled()) {
			this._createFesGradientCursorSprite();
		}
	};

	Window.prototype._createFesGradientCursorSprite = function() {
		this._fesCursorBitmap = new Bitmap(48, 48);
	};

	Window.prototype.fesGradCursorEnabled = function() {
		return gradientCursor && this.arrowCursorVisible && !exclusionList.has(this.constructor.name);
	};

	const _Window__setRectPartsGeometry = Window.prototype._setRectPartsGeometry;
	Window.prototype._setRectPartsGeometry = function(sprite, srect, drect, m) {
		if (this._cursorSprite === sprite && this.fesGradCursorEnabled()) {
			this._setFesStyleGradCursor(...arguments);
		} else {
			_Window__setRectPartsGeometry.apply(this, arguments);
		}
	};

	Window.prototype._setFesStyleGradCursor = function(sprite, srect, drect, m) {
		const col1 = ColorManager.fesCursorColor1();
		const col2 = ColorManager.fesCursorColor2();
		const dx = drect.x;
		const dy = drect.y;
		const dw = drect.width;
		const dh = drect.height;
		const children = sprite.children;
		for (const child of children) {
			child.visible = false;
		}
		const cursor = children[0];
		const gradWidth = Math.floor(dw / 2);
		sprite.setFrame(0, 0, dw, dh);
		sprite.move(dx, dy);
		let bitmap = this._fesCursorBitmap;
		cursor.visible = dw > 0 && dh > 0;
		if (cursor.visible) {
			this._fesCursorBitmap.destroy();
			this._fesCursorBitmap = new Bitmap(dw, dh);
			bitmap = this._fesCursorBitmap;
			cursor.bitmap = bitmap;
			const aw = gradientCursorBladeLength;
			bitmap.fillFesArrowHead(0, 0, aw, dh, col1);
			bitmap.fillRect(aw, 0, dw - gradWidth - aw, dh, col1);
			bitmap.gradientFillRect(dw - gradWidth, 0, gradWidth, dh, col1, col2);
		}
	};

}