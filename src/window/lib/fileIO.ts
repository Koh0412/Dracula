import { dialog, BrowserWindow } from "electron";
import * as fs from "fs";
import { ICPKeys } from "../constants/Keys";

export default class FileIO {

  public static filePath: string = "";
  /**
   * inputに記入されたテキストを保存する
   *
   * @param input
   */
  public static save(value: string, window: Electron.BrowserWindow): void {
    if (this.filePath === "") {
      // 保存ダイアログを生成
      const saveDialog = dialog.showSaveDialog(this.dialogOptions());

      saveDialog.then((result) => {
        // 保存ボタンを押した且つ、ファイルパスが記入されていれば保存
        if (!result.canceled && result.filePath) {
          try {
            this.filePath = result.filePath;
            fs.writeFileSync(this.filePath, value, { encoding: "utf8" });

            window.webContents.send(ICPKeys.save.path, this.filePath);
          } catch (err) {
            console.log("save file error: " + err);
          }
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      fs.writeFileSync(this.filePath, value);
      window.webContents.send(ICPKeys.save.path, this.filePath);
    }
  }

  /**
   * ファイルを開いてその中身をinputに流し込む
   *
   * @param input
   */
  public static open(window: BrowserWindow): void {
    const paths = dialog.showOpenDialogSync(this.dialogOptions());

    if (paths) {
      this.filePath = paths[0];
      const value: string = fs.readFileSync(this.filePath, { encoding: "utf8" });
      window.webContents.send(ICPKeys.open.value, [value, this.filePath]);
    }
  }

  private static dialogOptions(path?: string): Electron.OpenDialogOptions {
    const options: Electron.OpenDialogOptions = {
      defaultPath: path,
    };

    return options;
  }
}