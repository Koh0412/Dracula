import * as fs from "fs-extra";
import * as path from "path";

import { IOpenFile } from "../../common/definition/IOpenFile";
import { IOpenDirectory } from "../../common/definition/IOpenDirectory";
import CallDialog from "../process/callDialog";
import Events from "../../common/events";

class FileIO {
  public filePath: string = "";
  public currentText: string = "";
  public openTexts: string[] = [];

  /** ファイルパスが空か */
  private get isEmptyPath(): boolean {
    return this.filePath === "";
  }

  /**
   * テキストの保存
   * @param value
   */
  public save(value: string): void {
    if (this.isEmptyPath) {
      this.saveAs(value);
    } else {
      this.writeFile(value);
    }
  }

  /**
   * 名前を付けて保存する
   * @param value
   */
  public saveAs(value: string) {
    CallDialog.save(this.filePath, (path) => {
      if (!path) {
        return;
      }
      this.setPath(path);
      this.writeFile(value);
    });
  }

  /**
   * ファイルを開いてその中身を流し込む
   * @param path
   */
  public open(path: string): IOpenFile {
    this.setPath(path);
    this.currentText = fs.readFileSync(path, { encoding: "utf8" });
    // ファイルの中身とパスをまとめる
    const openFileProp: IOpenFile = {
      text: this.currentText,
      path: this.filePath,
    };
    Events.fileEvent("update", path);
    return openFileProp;
  }

  /**
   * - フォルダを開く
   * - `dirPath`内にあるファイル名とパスとstatsを`directoryList`に追加
   * @param dirPath
   * @param directoryList
   */
  public openDirectory(dirPath: string, directoryList: IOpenDirectory[]): void {
    const fileNames = fs.readdirSync(dirPath);

    fileNames.forEach((name) => {
      const fullPath: string = path.join(dirPath, name);
      const stats = fs.statSync(fullPath);

      const prop: IOpenDirectory = {
        filename: name,
        fullPath,
        isDirectory: stats.isDirectory(),
      };
      directoryList.push(prop);
    });
  }

  /**
   * `path`をfilePathにセット
   * @param path
   */
  public setPath(path: string): void {
    this.filePath = path;
  }

  /**
   * セーブする値の書き込み
   * @param value
   */
  private writeFile(value: string) {
    Events.fileEvent("save", this.filePath);
    fs.writeFileSync(this.filePath, value);
  }
}

export default new FileIO();