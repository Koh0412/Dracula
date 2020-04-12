import { BrowserWindow } from "electron";
import * as fs from "fs-extra";
import * as path from "path";

import { IOpenFile } from "../../common/definition/IOpenFile";
import { IOpenDirectory } from "../../common/definition/IOpenDirectory";
import { Elapsed } from "../../common/decorators";
import CallDialog from "./callDialog";
import Events from "../../common/events";

class FileIO {
  private filePath: string = "";

  private get isEmptyPath(): boolean {
    return this.filePath === "";
  }

  /**
   * テキストの保存
   *
   * @param value
   */
  public save(value: string): void {
    if (this.isEmptyPath) {
      CallDialog.save((path) => {
        if (!path) {
          return;
        }
        this.setPath(path);
        this.writeFile(value);
      });
    } else {
      this.writeFile(value);
    }
  }

  /**
   * 名前を付けて保存する
   *
   * @param value
   */
  public saveAs(value: string) {
    CallDialog.save((path) => {
      if (!path) {
        return;
      }
      this.setPath(path);
      this.writeFile(value);
    });
  }

  /**
   * ファイルを開いてその中身を流し込む
   *
   * @param path
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
   * - フォルダを開く
   * - `dirPath`内にあるファイル名とパスとstatsを`directoryList`に追加
   *
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
   *
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