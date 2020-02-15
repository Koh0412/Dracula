import { dialog, BrowserWindow } from "electron";
import * as fs from "fs";
import * as path from "path";
import { ICPKeys } from "../../constants/Keys";
import { IOpenFile } from "../../definition/IOpenFile";

class FileIO {

  public filePath: string = "";

  private fileOrDirNames: string[] = [];
  private dialogOptions: Electron.OpenDialogOptions = {};
  /**
   * テキストの保存
   *
   * @param value
   * @param window
   */
  public save(value: string, window: Electron.BrowserWindow): void {
    if (this.filePath === "") {
      // 保存ダイアログを生成
      this.dialogOptions.defaultPath = this.filePath;
      const saveDialog = dialog.showSaveDialog(this.dialogOptions);

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
   * 名前を付けて保存する
   *
   * @param value
   * @param window
   */
  public saveAs(value: string, window: BrowserWindow) {
    // 後々作る
  }

  /**
   * ファイルを開いてその中身を流し込む
   *
   * @param window
   */
  public open(window: BrowserWindow): void {
    this.dialogOptions.properties = ["openFile"];
    const paths = dialog.showOpenDialogSync(this.dialogOptions);

    if (!paths) {
      return
    }
    this.filePath = paths[0];
    const text: string = fs.readFileSync(this.filePath, { encoding: "utf8" });

    const openFileProp: IOpenFile = {
      text: text,
      path: this.filePath,
    }

    window.webContents.send(ICPKeys.open.value, openFileProp);
  }

  /**
   * フォルダを開く
   *
   * @param window
   */
  public openDirectory(window: BrowserWindow): void {
    this.fileOrDirNames = [];
    this.dialogOptions.properties = ["openDirectory"];

    const paths = dialog.showOpenDialogSync(this.dialogOptions);

    if (!paths) {
      return;
    }

    this.insertFileOrDirData(paths[0]);
    window.webContents.send(ICPKeys.open.dir, this.fileOrDirNames);
  }

  /**
   * dirPath内にあるファイルやディレクトリを配列に挿入
   *
   * @param dirPath
   */
  private insertFileOrDirData(dirPath: string) {
    const fileAndDirs = fs.readdirSync(dirPath);

    fileAndDirs.forEach((name) => {
      this.fileOrDirNames.push(name);

      const fullPath: string = path.join(dirPath, name);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        this.insertFileOrDirData(fullPath);
      }
    })
  }
}

export default new FileIO();