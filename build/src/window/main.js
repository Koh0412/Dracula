"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var processer_1 = require("./lib/processer");
var shortcut_1 = require("./lib/shortcut");
var Main = /** @class */ (function () {
    function Main(app) {
        this.window = null;
        this.mainProcesser = new processer_1.default();
        this.app = app;
        this.app.on("window-all-closed", this.onWindowAllClosed.bind(this));
        this.app.on("ready", this.create.bind(this));
        this.app.on("activate", this.onActivated.bind(this));
    }
    Main.prototype.onWindowAllClosed = function () {
        this.app.quit();
    };
    Main.prototype.create = function () {
        var _this = this;
        this.window = this.mainProcesser.createWindow();
        this.mainProcesser.setBrowserWindowConfig();
        var shortcut = {
            window: this.window,
            app: this.app,
        };
        shortcut_1.default.resister(shortcut);
        this.window.on("closed", function () {
            _this.window = null;
        });
    };
    Main.prototype.onActivated = function () {
        if (this.window === null) {
            this.create();
        }
    };
    return Main;
}());
var main = new Main(electron_1.app);
//# sourceMappingURL=main.js.map