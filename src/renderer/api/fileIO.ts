import { BrowserWindow } from "electron";
import * as fs from "fs-extra";
import * as path from "path";

import { IOpenFile } from "../../common/definition/IOpenFile";
import { IOpenDirectory } from "../../common/definition/IOpenDirectory";
import { Elapsed } from "../../common/decorators";

class FileIO {
  public filePath: string = "";
  private openDirectoies: IOpenDirectory[] = [];

  public get isEmptyPath(): boolean {
    return this.filePath === "";
  }

  /**
   * テキストの保存
   *
   * @param value
   * @param window
   */
  public save(value: string, path: string): void {
    if (this.isEmptyPath) {
      if (!path) {
        return;
      }
      this.setPath(path);
    }
    fs.writeFileSync(this.filePath, value);
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
  public open(path: string): IOpenFile {
    this.filePath = path;
    const text: string = fs.readFileSync(this.filePath, { encoding: "utf8" });
    // ファイルの中身とパスをまとめる
    const openFileProp: IOpenFile = {
      text,
      path: this.filePath,
    };
    return openFileProp;
  }

  /**
   * フォルダを開く
   *
   * @param window
   */
  @Elapsed("dir")
  public openDirectory(path: string): IOpenDirectory[] {
    this.openDirectoies = [];
    this.addOpenDirProp(path, this.openDirectoies);
    return this.openDirectoies;
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
  public addOpenDirProp(dirPath: string, openDirectories: IOpenDirectory[]): void {
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