"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var localShortcut = require("electron-localshortcut");
var Keys_1 = require("../constants/Keys");
var fileIO_1 = require("./fileIO");
var Shortcut = /** @class */ (function () {
    function Shortcut() {
    }
    /**
     * ショートカットキーの登録
     *
     * @param shortcut
     */
    Shortcut.resister = function (shortcut) {
        this.window = shortcut.window;
        this.app = shortcut.app;
        if (!this.window || !this.app) {
            return;
        }
        this.quit();
        this.devTool();
        this.saveFile();
        this.openFile();
    };
    Shortcut.quit = function () {
        var _this = this;
        localShortcut.register(this.window, "Ctrl+Q", function () {
            _this.app.quit();
        });
    };
    // デバッグ用
    Shortcut.devTool = function () {
        var _this = this;
        localShortcut.register(this.window, Keys_1.shortcutKeys.atMark, function () {
            _this.window.webContents.openDevTools();
        });
    };
    Shortcut.saveFile = function () {
        var _this = this;
        localShortcut.register(this.window, Keys_1.shortcutKeys.S, function () {
            _this.window.webContents.send(Keys_1.ICPKeys.save.request);
            electron_1.ipcMain.on(Keys_1.ICPKeys.save.value, function (_, value) {
                fileIO_1.default.save(value, _this.window);
            });
        });
    };
    Shortcut.openFile = function () {
        var _this = this;
        localShortcut.register(this.window, Keys_1.shortcutKeys.O, function () {
            fileIO_1.default.open(_this.window);
        });
    };
    return Shortcut;
}());
exports.default = Shortcut;
//# sourceMappingURL=shortcut.js.map