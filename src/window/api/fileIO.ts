import { BrowserWindow } from "electron";
import * as fs from "fs-extra";
import * as path from "path";

import Dialog from "./dialog";

import { IPCConstants } from "../../common/constants/systemConstants";
import { IOpenFile } from "../../common/definition/IOpenFile";
import { IOpenDirectory } from "../../common/definition/IOpenDirectory";
import { Elapsed } from "../../common/decorators";

class FileIO {
  private filePath: string = "";
  private openDirectoies: IOpenDirectory[] = [];

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
      const path = Dialog.createSaveDialog(this.filePath);
      if (path) {
        this.filePath = path;
      }
    }
    fs.writeFileSync(this.filePath, value);
    window.webContents.send(IPCConstants.SAVE_PATH, this.filePath);
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
    const paths = Dialog.createOpenDialog("openFile");
    if (paths) {
      this.filePath = paths[0];
      const text: string = fs.readFileSync(this.filePath, { encoding: "utf8" });
      // ファイルの中身とパスをまとめる
      const openFileProp: IOpenFile = {
        text,
        path: this.filePath,
      };

      window.webContents.send(IPCConstants.OPEN_VALUE, openFileProp);
    }
  }

  /**
   * フォルダを開く
   *
   * @param window
   */
  @Elapsed("dir")
  public openDirectory(window: BrowserWindow): void {
    this.openDirectoies = [];
    const paths = Dialog.createOpenDialog("openDirectory");

    if (paths) {
      this.addOpenDirProp(paths[0], this.openDirectoies);
      window.webContents.send(IPCConstants.OPEN_DIR, this.openDirectoies);
    }
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
   * dirPath内にあるファイル名とパスとstatsをopenDirectoriesに追加
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
}

export default new FileIO();