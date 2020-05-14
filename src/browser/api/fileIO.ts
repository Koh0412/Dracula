import * as fs from "fs-extra";
import * as path from "path";

import CallDialog from "../process/callDialog";
import Events from "../../common/events";

import { IOpenFile } from "../../common/definition/IOpenFile";
import { IOpenDirectory } from "../../common/definition/IOpenDirectory";

class FileIO {
  public currentText: string = "";
  public openFileList: IOpenFile[] = [];
  private filePath: string = "";

  /** ファイルパスが空か */
  private get isEmptyPath(): boolean {
    return this.filePath === "";
  }

  /** リストの中のopenFileが現在のパスをもっているかどうか */
  private get isOpenFilesHasPath(): boolean {
    return this.openFileList.some((prop) => {
      return prop.path === this.filePath;
    });
  }

  /** リストの中から現在ファイルパスを持っているものを見つける */
  public findOpenFile(): IOpenFile | undefined {
    return this.openFileList.find((prop) => {
      return prop.path === this.filePath;
    });
  }

  /**
   * 指定のパスを持つopenFileをリストから除去
   * @param path
   */
  public removeOpenFile(path: string) {
    this.openFileList = this.openFileList.filter((prop) => {
      return prop.path !== path;
    });
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
    this.currentText = value;
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
    if (path) {
      this.currentText = fs.readFileSync(path, { encoding: "utf8" });
    } else {
      this.currentText = "";
    }
    // ファイルの中身とパスをまとめる
    const openFileProp: IOpenFile = {
      text: this.currentText,
      path: this.filePath,
    };

    if (this.isOpenFilesHasPath) {
      const prop = this.findOpenFile();
      if (prop) {
        openFileProp.text = prop.text;
      }
    } else {
      this.openFileList.push(openFileProp);
    }

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