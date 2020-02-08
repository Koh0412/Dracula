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
        this.openDirectory();
    };
    // 開発用 INFO: 後で消す
    Shortcut.quit = function () {
        var _this = this;
        this.setShortcut("Ctrl+Q", function () {
            _this.app.quit();
        });
    };
    // 開発用 INFO: 後で消す
    Shortcut.devTool = function () {
        var _this = this;
        this.setShortcut(Keys_1.shortcutKeys.atMark, function () {
            _this.window.webContents.openDevTools();
        });
    };
    Shortcut.saveFile = function () {
        var _this = this;
        this.setShortcut(Keys_1.shortcutKeys.S, function () {
            _this.window.webContents.send(Keys_1.ICPKeys.save.request);
            electron_1.ipcMain.on(Keys_1.ICPKeys.save.value, function (_, value) {
                fileIO_1.default.save(value, _this.window);
            });
        });
    };
    Shortcut.openFile = function () {
        var _this = this;
        this.setShortcut(Keys_1.shortcutKeys.O, function () {
            fileIO_1.default.open(_this.window);
        });
    };
    Shortcut.openDirectory = function () {
        var _this = this;
        this.setShortcut(Keys_1.shortcutKeys.ShiftO, function () {
            fileIO_1.default.openDirectory(_this.window);
        });
    };
    Shortcut.setShortcut = function (accelerator, callback) {
        localShortcut.register(this.window, accelerator, function () {
            callback();
        });
    };
    return Shortcut;
}());
exports.default = Shortcut;
//# sourceMappingURL=shortcut.js.map