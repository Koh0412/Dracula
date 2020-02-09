"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs = require("fs");
var path = require("path");
var Keys_1 = require("../constants/Keys");
var FileIO = /** @class */ (function () {
    function FileIO() {
        this.filePath = "";
        this.fileOrDirNames = [];
        this.dialogOptions = {};
    }
    /**
     * テキストの保存
     *
     * @param value
     * @param window
     */
    FileIO.prototype.save = function (value, window) {
        var _this = this;
        if (this.filePath === "") {
            // 保存ダイアログを生成
            this.dialogOptions.defaultPath = this.filePath;
            var saveDialog = electron_1.dialog.showSaveDialog(this.dialogOptions);
            saveDialog.then(function (result) {
                // 保存ボタンを押した且つ、ファイルパスが記入されていれば保存
                if (!result.canceled && result.filePath) {
                    try {
                        _this.filePath = result.filePath;
                        fs.writeFileSync(_this.filePath, value, { encoding: "utf8" });
                        window.webContents.send(Keys_1.ICPKeys.save.path, _this.filePath);
                    }
                    catch (err) {
                        console.log("save file error: " + err);
                    }
                }
            }).catch(function (err) {
                console.log(err);
            });
        }
        else {
            fs.writeFileSync(this.filePath, value);
            window.webContents.send(Keys_1.ICPKeys.save.path, this.filePath);
        }
    };
    /**
     * 名前を付けて保存する
     *
     * @param value
     * @param window
     */
    FileIO.prototype.saveAs = function (value, window) {
        // 後々作る
    };
    /**
     * ファイルを開いてその中身を流し込む
     *
     * @param window
     */
    FileIO.prototype.open = function (window) {
        this.dialogOptions.properties = ["openFile"];
        var paths = electron_1.dialog.showOpenDialogSync(this.dialogOptions);
        if (!paths) {
            return;
        }
        this.filePath = paths[0];
        var textValue = fs.readFileSync(this.filePath, { encoding: "utf8" });
        window.webContents.send(Keys_1.ICPKeys.open.value, [textValue, this.filePath]);
    };
    FileIO.prototype.openDirectory = function (window) {
        this.dialogOptions.properties = ["openDirectory"];
        var paths = electron_1.dialog.showOpenDialogSync(this.dialogOptions);
        if (!paths) {
            return;
        }
        this.exposing(paths[0]);
        window.webContents.send(Keys_1.ICPKeys.open.dir, this.fileOrDirNames);
    };
    FileIO.prototype.exposing = function (dirPath) {
        var _this = this;
        var fileAndDirs = fs.readdirSync(dirPath);
        fileAndDirs.forEach(function (name) {
            _this.fileOrDirNames.push(name);
            var fullPath = path.join(dirPath, name);
            var stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                _this.exposing(fullPath);
            }
        });
    };
    return FileIO;
}());
exports.default = new FileIO();
//# sourceMappingURL=fileIO.js.map