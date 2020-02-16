import { dialog, BrowserWindow } from "electron";
import * as fs from "fs";
import * as path from "path";
import { IPCKeys } from "../../common/constants/Keys";
import { IOpenFile } from "../../common/definition/IOpenFile";

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

            window.webContents.send(IPCKeys.save.path, this.filePath);
          } catch (err) {
            console.log("save file error: " + err);
          }
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      fs.writeFileSync(this.filePath, value);
      window.webContents.send(IPCKeys.save.path, this.filePath);
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
      return;
    }
    this.filePath = paths[0];
    const text: string = fs.readFileSync(this.filePath, { encoding: "utf8" });

    const openFileProp: IOpenFile = {
      text,
      path: this.filePath,
    };

    window.webContents.send(IPCKeys.open.value, openFileProp);
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

    this.insertFileOrDirIn(paths[0]);
    window.webContents.send(IPCKeys.open.dir, this.fileOrDirNames);
  }

  /**
   * dirPath内にあるファイルやディレクトリを配列に挿入
   *
   * @param dirPath
   */
  private insertFileOrDirIn(dirPath: string) {
    const fileAndDirs = fs.readdirSync(dirPath);

    fileAndDirs.forEach((name) => {
      this.fileOrDirNames.push(name);

      const fullPath: string = path.join(dirPath, name);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        this.insertFileOrDirIn(fullPath);
      }
    });
  }
}

export default new FileIO();