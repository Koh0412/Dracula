import { dialog, BrowserWindow, ipcMain as main } from "electron";
import * as fs from "fs-extra";
import * as path from "path";

import { IPCConstants } from "../../common/constants/Keys";
import { IOpenFile } from "../../common/definition/IOpenFile";
import { IOpenDirectory } from "../../common/definition/IOpenDirectory";

import { Elapsed } from "../../common/decorators";

class FileIO {

  private filePath: string = "";

  private openDirectoies: IOpenDirectory[] = [];
  private dialogOptions: Electron.OpenDialogOptions = {};

  private get isEmptyPath(): boolean {
    return this.filePath === "";
  }

  /**
   * テキストの保存
   *
   * @param value
   * @param window
   */
  public async save(value: string, window: Electron.BrowserWindow): Promise<void> {
    if (this.isEmptyPath) {
      // 保存ダイアログを生成
      const saveDialog = await this.createSaveDialog();

      // 保存ボタンを押した且つ、ファイルパスが記入されていれば保存
      if (!saveDialog.canceled && saveDialog.filePath) {
        try {
          this.filePath = saveDialog.filePath;
          fs.writeFileSync(this.filePath, value, { encoding: "utf8" });

          window.webContents.send(IPCConstants.SAVE_PATH, this.filePath);
        } catch (err) {
          dialog.showErrorBox("error", `cannot save to ${this.filePath}`);
        }
      }
    } else {
      fs.writeFileSync(this.filePath, value);
      window.webContents.send(IPCConstants.SAVE_PATH, this.filePath);
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
  @Elapsed("open")
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

    window.webContents.send(IPCConstants.OPEN_VALUE, openFileProp);
  }

  /**
   * フォルダを開く
   *
   * @param window
   */
  @Elapsed("dir")
  public openDirectory(window: BrowserWindow): void {
    this.openDirectoies = [];
    this.dialogOptions.properties = ["openDirectory"];

    const paths = dialog.showOpenDialogSync(this.dialogOptions);

    if (!paths) {
      return;
    }

    this.addOpenDirProp(paths[0], this.openDirectoies);

    window.webContents.send(IPCConstants.OPEN_DIR, this.openDirectoies);
  }

  /**
   * `path`をfilePathにセット
   *
   * @param path
   */
  public setPath(path: string): void {
    this.filePath = path;
  }

  /**
   * dirPath内にあるファイル名とパスをopenDirectoriesに追加
   *
   * @param dirPath
   */
  private addOpenDirProp(dirPath: string, openDirectories: IOpenDirectory[]): void {
    const fileNames = fs.readdirSync(dirPath);

    fileNames.forEach((name) => {
      const fullPath: string = path.join(dirPath, name);
      const stats = fs.statSync(fullPath);

      const prop: IOpenDirectory = {
        filename: name,
        fullPath,
        isDirectory: stats.isDirectory(),
      };
      openDirectories.push(prop);

      if (stats.isDirectory()) {
        this.addOpenDirProp(fullPath, openDirectories);
      }
    });
  }

  /**
   * saveDialogを生成
   */
  private createSaveDialog(): Promise<Electron.SaveDialogReturnValue> {
    if (!this.isEmptyPath) {
      this.dialogOptions.defaultPath = this.filePath;
    }
    const saveDialog = dialog.showSaveDialog(this.dialogOptions);

    return saveDialog;
  }
}

export default new FileIO();