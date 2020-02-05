"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var common_1 = require("./common");
var Processer = /** @class */ (function () {
    function Processer() {
        this.browserWindow = null;
        this.windowOptions = {};
    }
    Processer.prototype.createWindow = function () {
        this.windowOptions = {
            width: common_1.default.size.width,
            height: common_1.default.size.height,
            acceptFirstMouse: true,
            backgroundColor: common_1.default.backgroundColor,
            icon: common_1.default.iconPath,
            show: false,
            paintWhenInitiallyHidden: false,
            // INFO: ないとrequire is undefinedになる
            webPreferences: {
                nodeIntegration: true
            }
        };
        this.browserWindow = new electron_1.BrowserWindow(this.windowOptions);
        return this.browserWindow;
    };
    Processer.prototype.setBrowserWindowConfig = function () {
        var _this = this;
        if (!this.browserWindow) {
            return;
        }
        this.browserWindow.loadURL(common_1.default.mainURL);
        this.browserWindow.webContents.on("did-finish-load", function () {
            var _a;
            (_a = _this.browserWindow) === null || _a === void 0 ? void 0 : _a.show();
        });
    };
    return Processer;
}());
exports.default = Processer;
//# sourceMappingURL=processer.js.map