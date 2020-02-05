"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs = require("fs");
var Keys_1 = require("../constants/Keys");
var FileIO = /** @class */ (function () {
    function FileIO() {
    }
    /**
     * inputに記入されたテキストを保存する
     *
     * @param input
     */
    FileIO.save = function (value, window) {
        var _this = this;
        if (this.filePath === "") {
            // 保存ダイアログを生成
            var saveDialog = electron_1.dialog.showSaveDialog(this.dialogOptions());
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
     * ファイルを開いてその中身をinputに流し込む
     *
     * @param input
     */
    FileIO.open = function (window) {
        var paths = electron_1.dialog.showOpenDialogSync(this.dialogOptions());
        if (paths) {
            this.filePath = paths[0];
            var value = fs.readFileSync(this.filePath, { encoding: "utf8" });
            window.webContents.send(Keys_1.ICPKeys.open.value, [value, this.filePath]);
        }
    };
    FileIO.dialogOptions = function (path) {
        var options = {
            defaultPath: path,
        };
        return options;
    };
    FileIO.filePath = "";
    return FileIO;
}());
exports.default = FileIO;
//# sourceMappingURL=fileIO.js.map