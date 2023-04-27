/*=============================================================================
 main.js
----------------------------------------------------------------------------
 Version
 1.0.0 2022/02/20 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

let mainWindow = null;

(() => {
    'use strict';

    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';
    const { app, BrowserWindow, Menu, ipcMain } = require('electron');
    const processArgv = process.argv[2] || '';

    /**
     * createWindow
     * メインウィンドウを生成します。
     */
    function createWindow() {
        mainWindow = new BrowserWindow({
            width: 1280,
            height: 720,
            useContentSize: true,
            webPreferences: {
                nodeIntegration: false,
                preload: 'preload.js',
                contextIsolation: true
            },
            icon: 'project/icon/icon.png'
        });
        mainWindow.loadFile('project/index.html');
        mainWindow.on('closed', () => {
            mainWindow = null;
        });
        Menu.setApplicationMenu(null);
        if (processArgv.includes('debug')) {
            mainWindow.webContents.openDevTools();
        }
    }
    app.on('ready', createWindow);

    ipcMain.on('option-valid', event => {
        event.reply('option-valid-reply', processArgv);
    });
    ipcMain.on('open-dev-tools', event => {
        mainWindow.webContents.openDevTools();
    });
})();
