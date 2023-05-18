//=============================================================================
// RPG Maker MZ - CSVN_sceneHelp
// ----------------------------------------------------------------------------
// (C)2023 cursed_steven
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/05/xx 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_steven
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc テキストと画像をつかったヘルプシーンを実装します
 * @author cursed_steven
 * @base CSVN_base
 * @orderAfter CSVN_base
 * 
 * @help CSVN_sceneHelp.js
 * 
 * @param leftTopX
 * @text 左上隅のX座標
 * @type number
 * @default 0
 * 
 * @param leftTopY
 * @text 左上隅のY座標
 * @type number
 * @default 48
 * 
 * @param width
 * @text 全体の横幅
 * @type number
 * @default 816
 * 
 * @param height
 * @text 全体の高さ
 * @type number
 * @default 576
 * 
 * @param articleWidth
 * @text 記事項目ウィンドウの幅
 * @type number
 * @default 160
 * 
 * @param titleOnMenu
 * @text メニュー上のタイトル
 * @type string
 * @default ヘルプ
 * 
 * @param menuIncludeSwId
 * @text メニュー表示スイッチ
 * @desc ここで指定したスイッチがONになるとメニューに項目が入ります。0を指定すると常に表示します。
 * @type switch
 * @default 0
 * 
 * @param menuActivateSwId
 * @text メニュー有効化スイッチ
 * @desc ここで指定したスイッチがONになるとメニューに入っている項目が有効になります。0を指定すると常に有効になります。向こうの場合はグレイアウトされて選択できません。
 * @type switch
 * @default 0
 * 
 * @param articles
 * @text ヘルプ項目リスト
 * @desc 当面項目と画像は1:1とします。
 * @type struct<HelpArticle>[]
 * @default []
 * 
 * @param pageStr
 * @text ナビ中で各ページを表す文字
 * @type string
 * @default ○
 * 
 * @param currentPageStr
 * @text ナビ中で表示中のページを表す文字
 * @type string
 * @default ●
 * 
 * @param prevStr
 * @text 「前」の表示テキスト
 * @desc 各項目の前画面に移るための文字列表示
 * @type string
 * @default <
 * 
 * @param nextStr
 * @text 「次」の表示テキスト
 * @desc 各項目の次画面に移るための文字列表示
 * @type string
 * @default >
 * 
 * @param doneStr
 * @text 「終了」の表示テキスト
 * @desc 各項目を終わるための文字列表示
 * @type string
 * @default End
 * 
 * @command startScene
 * @text ヘルプシーン開始
 * 
 * @command startSceneFrom
 * @text ヘルプシーン開始(特定項目)
 * 
 * @arg id
 * @text ヘルプ項目ID
 * 
 * @command show
 * @text ヘルプ項目開示
 * @desc 指定項目をメニューから見えるようにします
 * 
 * @arg id
 * @text ヘルプ項目ID
 * 
 * @command hide
 * @text ヘルプ項目隠蔽
 * @desc 指定項目をメニューから見えないようにします
 * 
 * @arg id
 * @text ヘルプ項目ID
 */

/*~struct~HelpArticle:
 *
 * @param id
 * @text 記事項目ID
 * @type number
 *
 * @param title
 * @text 項目タイトル
 * @type string
 * 
 * @param children
 * @text 子項目
 * @type struct<HelpChild>[]
 * @default []
 */

/*~struct~HelpChild:
 *
 * @param id
 * @text 記事子項目ID
 * @type number
 * 
 * @param title
 * @text タイトル
 * @type string
 * 
 * @param desc
 * @text 説明
 * @type multiline_string
 * 
 * @param image
 * @text 使用画像
 * @dir img/pictures
 * @type file
 */

//-------------------------------------------------------------------------
// Scene_Help
//
// The scene class of the help screen.

function Scene_Help() {
    this.initialize.apply(this, arguments);
}
Scene_Help.prototype = Object.create(Scene_ItemBase.prototype);
Scene_Help.prototype.constructor = Scene_Help;

//-------------------------------------------------------------------------
// Window_HelpArticle
//
// The window class of the help article.

function Window_HelpArticle() {
    this.initialize(...arguments);
}
Window_HelpArticle.prototype = Object.create(Window_Selectable.prototype);
Window_HelpArticle.prototype.constructor = Window_HelpArticle;

//-------------------------------------------------------------------------
// Widnow_HelpChild
//
// The window class of the help article children.

function Window_HelpChild() {
    this.initialize(...arguments);
}
Window_HelpChild.prototype = Object.create(Window_Base.prototype);
Window_HelpChild.prototype.constructor = Window_HelpChild;

//-------------------------------------------------------------------------
// Window_HelpTitle
//
// The window class of the help article children's title.

function Window_HelpTitle() {
    this.initialize(...arguments);
}
Window_HelpTitle.prototype = Object.create(Window_Base.prototype);
Window_HelpTitle.prototype.constructor = Window_HelpTitle;

//-------------------------------------------------------------------------
// Widnow_HelpNavi
//
// The window class of the help article children's navigation.

function Window_HelpNavi() {
    this.initialize(...arguments);
}
Window_HelpNavi.prototype = Object.create(Window_Base.prototype);
Window_HelpNavi.prototype.constructor = Window_HelpNavi;

//-------------------------------------------------------------------------
// Widnow_HelpButton
//
// The window class of the help article children's button.

function Window_HelpButton() {
    this.initialize(...arguments);
}
Window_HelpButton.prototype = Object.create(Window_Selectable.prototype);
Window_HelpButton.prototype.constructor = Window_HelpButton;

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //-------------------------------------------------------------------------
    // Scene_Menu

    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('help', this.commandHelp.bind(this));
    };

    Scene_Menu.prototype.commandHelp = function () {
        SceneManager.push(Scene_Help);
    };

    //-------------------------------------------------------------------------
    // Scene_Help

    Scene_Help.prototype.create = function () {
        Scene_ItemBase.prototype.create.call(this);
        this.createArticleWindow();
        this.createNaviWindow();
        this.createButtonWindow();
        this.createTitleWindow();
        this.createHelpChildWindow();
        this._articleWindow.refresh();
        this._articleWindow.selectLast();
        this._articleWindow.activate();
    };

    Scene_Help.prototype.createArticleWindow = function () {
        const rect = this.articleWindowRect();
        this._articleWindow = new Window_HelpArticle(rect);
        this._articleWindow.setHandler('ok', this.onArticleOk.bind(this));
        this._articleWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._articleWindow);
    };

    Scene_Help.prototype.createNaviWindow = function () {
        const rect = this.naviWindowRect();
        this._naviWindow = new Window_HelpNavi(rect);
        this.addWindow(this._naviWindow);
    };

    Scene_Help.prototype.createButtonWindow = function () {
        const rect = this.buttonWindowRect();
        this._buttonWindow = new Window_HelpButton(rect);
        this._buttonWindow.setHandler('cancel', this.onChildCancel.bind(this));
        this._buttonWindow.setHandler('ok', this.onChildOk.bind(this));
        this._buttonWindow.setHandler('pageup', this.prevChild.bind(this));
        this._buttonWindow.setHandler('pagedown', this.nextChild.bind(this));
        this.addWindow(this._buttonWindow);
    };

    Scene_Help.prototype.createTitleWindow = function () {
        const rect = this.titleWindowRect();
        this._titleWindow = new Window_HelpTitle(rect);
        this.addWindow(this._titleWindow);
    };

    Scene_Help.prototype.createHelpChildWindow = function () {
        const rect = this.helpChildWindowRect();
        this._helpChildWindow = new Window_HelpChild(rect);
        this.addWindow(this._helpChildWindow);
    };

    Scene_Help.prototype.articleWindowRect = function () {
        const wx = param.leftTopX;
        const wy = param.leftTopY;
        const ww = param.articleWidth;
        const wh = param.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_Help.prototype.naviWindowRect = function () {
        const ww = (param.width - this._articleWindow.width) * 0.67;
        const wh = this.calcWindowHeight(1, true);
        const wx = this._articleWindow.x + this._articleWindow.width;
        const wy = this._articleWindow.y + param.height - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_Help.prototype.buttonWindowRect = function () {
        const ww = (param.width - this._articleWindow.width) * 0.33;
        const wh = this._naviWindow.height;
        const wx = this._naviWindow.x + this._naviWindow.width;
        const wy = this._naviWindow.y;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_Help.prototype.titleWindowRect = function () {
        const ww = param.width - this._articleWindow.width;
        const wh = this.calcWindowHeight(1, true);
        const wx = this._naviWindow.x;
        const wy = this._articleWindow.y;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_Help.prototype.helpChildWindowRect = function () {
        const ww = this._titleWindow.width;
        const wh = param.height - this._titleWindow.height - this._naviWindow.height;
        const wx = this._titleWindow.x;
        const wy = this._titleWindow.y + this._titleWindow.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_Help.prototype.onArticleOk = function () {
        const article = this._articleWindow.item();
        this._articleWindow.deactivate();

        this._titleWindow.setArticleChild(article.children[0]);
        this._helpChildWindow.setArticle(article);
        this._helpChildWindow.setArticleChild(article.children[0]);

        this._buttonWindow.activate();
        this._buttonWindow.isEnabled(1)
            ? this._buttonWindow.select(1)
            : this._buttonWindow.select(2);
        this.refreshAll();
    };

    Scene_Help.prototype.onChildOk = function () {
        switch (this._buttonWindow.index()) {
            case 0:
                this.prevChild();
                break;
            case 1:
                this.nextChild();
                break;
            case 2:
                this.onChildCancel();
                break;
        }
    };

    Scene_Help.prototype.onChildCancel = function () {
        this._articleWindow.activate();
        this.clear1();
        this.refreshAll();
        this.clear2();
        this._buttonWindow.deactivate();
    };

    Scene_Help.prototype.prevChild = function () {
        this._buttonWindow.prev();
        this.refreshAll();
        this._buttonWindow.activate();
    };

    Scene_Help.prototype.nextChild = function () {
        this._buttonWindow.next();
        this.refreshAll();
        this._buttonWindow.activate();
    };

    Scene_Help.prototype.refreshAll = function () {
        this._titleWindow.refresh();
        this._helpChildWindow.refresh();

        const childrenCount = this._articleWindow.item().children.length;
        this._naviWindow.setChildrenCount(childrenCount);
        this._buttonWindow.setChildrenCount(childrenCount);
        this._naviWindow.refresh();
        this._buttonWindow.refresh();
    };

    Scene_Help.prototype.clear1 = function () {
        this._titleWindow.clear();
        this._helpChildWindow.clear();
    };

    Scene_Help.prototype.clear2 = function () {
        this._naviWindow.clear();
        this._buttonWindow.clear();
        this._helpChildWindow.destroySprite();
    };

    //-------------------------------------------------------------------------
    // Game_Party

    const _Game_Party_initialize = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function () {
        _Game_Party_initialize.call(this);
        this._lastHelpArticleId = 0;
        this._readHelpArticles = {};
    };

    Game_Party.prototype.getReadHelpArticles = function () {
        if (!this._readHelpArticles) {
            this._readHelpArticles = {};
        }

        return this._readHelpArticles;
    };

    //-------------------------------------------------------------------------
    // Window_MenuCommand

    const _Window_MenuCommand_makeCommandList = Window_MenuCommand.prototype.makeCommandList;
    Window_MenuCommand.prototype.makeCommandList = function () {
        _Window_MenuCommand_makeCommandList.call(this);
        this.addHelpCommand();
    };

    Window_MenuCommand.prototype.addHelpCommand = function () {
        if (param.menuIncludeSwId === 0 || $s.get(param.menuIncludeSwId)) {
            const enabled = param.menuActivateSwId === 0 || $s.get(param.menuActivateSwId);
            this.addCommand(param.titleOnMenu, 'help', enabled);
        }
    };

    //-------------------------------------------------------------------------
    // Window_HelpArticle

    Window_HelpArticle.prototype.initialize = function (rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._data = [];
    };

    Window_HelpArticle.prototype.maxItems = function () {
        return param.articles.length;
    };

    Window_HelpArticle.prototype.makeArticleList = function () {
        this._data = param.articles/*.filter(a => this.includes(a)):*/;
    };

    /*
    Window_HelpArticle.prototype.includes = function (article) {
        const key = Object.keys($gameParty.getReadHelpArticles()).some(key => {
            return $gameParty.getReadHelpArticles()[key].length === article.length;
        });

        return key.length > 0;
    };
    */

    Window_HelpArticle.prototype.selectLast = function () {
        const lastArticle = param.articles.find(a => a.id === $gameParty._lastHelpArticleId);
        let i = 0;
        if (!lastArticle) {
            this.forceSelect(0);
        } else {
            for (let ii = 0; ii < this._data.length; ii++) {
                if (this._data[ii] === lastArticle.id) {
                    i = ii;
                    break;
                }
            }
            this.forceSelect(i);
        }
    };

    Window_HelpArticle.prototype.itemAt = function (index) {
        return this._data && index >= 0 ? this._data[index] : null;
    };

    Window_HelpArticle.prototype.item = function () {
        return this.itemAt(this.index());
    };

    Window_HelpArticle.prototype.drawItem = function (index) {
        const article = this.itemAt(index);
        if (article) {
            const rect = this.itemLineRect(index);
            this.resetTextColor();
            this.changePaintOpacity(true);
            this.drawText(article.title, rect.x, rect.y, rect.width);
        }
    };

    Window_HelpArticle.prototype.refresh = function () {
        this.makeArticleList();
        Window_Selectable.prototype.refresh.call(this);
    };

    //-------------------------------------------------------------------------
    // Window_HelpChild

    Window_HelpChild.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._currentPage = 0;
        this._article = {};
        this._text = '';
        this._picture = '';
        this._sprite = null;
    };

    Window_HelpChild.prototype.setText = function (text) {
        this._text = text;
    };

    Window_HelpChild.prototype.setPicture = function (picture) {
        this._picture = picture;
    };

    Window_HelpChild.prototype.clear = function () {
        this.setText('');
        this.setPicture('');
        this._sprite.hide();
    };

    Window_HelpChild.prototype.destroySprite = function () { 
        this._sprite.destroy();
    };

    Window_HelpChild.prototype.setArticle = function (article) {
        this._article = article;
    };

    Window_HelpChild.prototype.setArticleChild = function (child) {
        this.setText(child ? child.desc : '');
        this.setPicture(child ? child.image : '');
        if (this._picture) {
            this.loadSprite();
        }
    }

    Window_HelpChild.prototype.loadSprite = function () { 
        this._sprite = new Sprite();
        this._sprite.hide();
        this._sprite.bitmap = ImageManager.loadPicture(this._picture);
        this.addChildToBack(this._sprite);
    };

    Window_HelpChild.prototype.processDesc = function () {
        const rect = this.baseTextRect();
        const tyo = 4;
        let currentY = rect.y + tyo;
        const lines = this._text.split("\n");
        lines.forEach(line => {
            this.drawText(line, rect.x, currentY, rect.width);
            currentY += this.lineHeight();
        });

        return currentY;
    };

    Window_HelpChild.prototype.refresh = function () {
        this.contents.clear();
        if (this._article) {
            const pxo = 8;
            const pyo = 16;
            let currentY = this.processDesc();
            if (this._sprite) { 
                const spriteWidth = this._sprite.bitmap.width;
                if (spriteWidth > 0) {
                    this._sprite.x = (this.width - spriteWidth) / 2;
                } else {
                    this._sprite.x = pxo;
                }
                this._sprite.y = currentY + pyo;
                this._sprite.show();
            }
        }
    };

    //-------------------------------------------------------------------------
    // Window_HelpTitle

    Window_HelpTitle.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._currentPage = 0;
        this._text = '';
    };

    Window_HelpTitle.prototype.setText = function (text) {
        this._text = text;
    };

    Window_HelpTitle.prototype.clear = function () {
        this.setText('');
    };

    Window_HelpTitle.prototype.setArticleChild = function (child) {
        this.setText(child ? child.title : '');
    };

    Window_HelpTitle.prototype.refresh = function () {
        const rect = this.baseTextRect();
        const yo = 4;
        this.contents.clear();
        this.drawText(this._text, rect.x, rect.y + yo, rect.width);
    };

    //-------------------------------------------------------------------------
    // Window_HelpNavi

    Window_HelpNavi.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._currentPage = 0;
        this._childrenCount = 0;
    };

    Window_HelpNavi.prototype.getChildrenCount = function () {
        return this._childrenCount;
    };

    Window_HelpNavi.prototype.setChildrenCount = function (count) {
        this._childrenCount = count;
    };

    Window_HelpNavi.prototype.makeItemList = function () {
        const rect = this.baseTextRect();
        const yo = 4;
        let currentX = 16;
        for (let i = 0; i < this.getChildrenCount(); i++) {
            if (this._currentPage === i) {
                this.drawText(param.currentPageStr, currentX, rect.y + yo, rect.width);
            } else {
                this.drawText(param.pageStr, currentX, rect.y + yo, rect.width);
            }
            currentX += this.textWidth('00');
        }
    };

    Window_HelpNavi.prototype.clear = function () {
        this.contents.clear();
    };

    Window_HelpNavi.prototype.prev = function () {
        if (this._currentPage > 0) {
            this._currentPage--;
        }
    };

    Window_HelpNavi.prototype.next = function () {
        if (this._currentPage < this.getChildrenCount() - 1) {
            this._currentPage++;
        }
    };

    Window_HelpNavi.prototype.refresh = function () {
        this.makeItemList();
    };

    //-------------------------------------------------------------------------
    // Window_HelpButton

    Window_HelpButton.prototype.initialize = function (rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._currentPage = 0;
        this._childrenCount = 0;
        this.makeItemList();
    };

    Window_HelpButton.prototype.maxCols = function () {
        return 3;
    };

    Window_HelpButton.prototype.maxItems = function () {
        return 3;
    };

    Window_HelpButton.prototype.getChildrenCount = function () {
        return this._childrenCount;
    };

    Window_HelpButton.prototype.setChildrenCount = function (count) {
        this._childrenCount = count;
    };

    Window_HelpButton.prototype.item = function () {
        return this.itemAt(this.index());
    };

    Window_HelpButton.prototype.itemAt = function (index) {
        return this._data && index >= 0 ? this._data[index] : null;
    };

    Window_HelpButton.prototype.isCurrentItemEnabled = function () {
        return this.isEnabled(this.item());
    };

    Window_HelpButton.prototype.isEnabled = function (index) {
        if (this._currentPage === 0 && index === 0) {
            return false;
        } else if (this._currentPage === this.getChildrenCount() - 1
            && index === 1) {
            return false;
        }

        return true;
    };

    Window_HelpButton.prototype.makeItemList = function () {
        this._data = [
            param.prevStr,
            param.nextStr,
            param.doneStr
        ];
    };

    Window_HelpButton.prototype.drawItem = function (index) {
        const label = this.itemAt(index);
        const rect = this.itemLineRect(index);
        const enabled = this.isEnabled(index);
        this.changePaintOpacity(enabled);
        this.drawText(label, rect.x, rect.y, rect.width, 'center');
        this.changePaintOpacity(1);
    };

    Window_HelpButton.prototype.clear = function () {
        this.contents.clear();
        this.deselect();
    };

    Window_HelpButton.prototype.prev = function () {
        if (this._currentPage > 0) {
            this._currentPage--;
        }
    };

    Window_HelpButton.prototype.next = function () {
        if (this._currentPage < this.getChildrenCount() - 1) {
            this._currentPage++;
        }
    };

    Window_HelpButton.prototype.refresh = function () {
        Window_Selectable.prototype.refresh.call(this);
    };

})();