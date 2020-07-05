import * as fs from "fs-extra";
import * as path from "path";

import CallDialog from "process/callDialog";
import { eventEmitter } from "../../common/util";

import { IOpenFile, IOpenDirectory } from "../../common/definition";
import { EventName } from "../../common/constants";

class FileIO {
  public currentText: string = "";
  public openFileList: IOpenFile[] = [];
  private filePath: string = "";

  /** リストの中から現在開かれているファイルを取得 */
  public get openedFile(): IOpenFile | undefined {
    return this.openFileList.find((file) => {
      return file.path === this.filePath;
    });
  }

  /** ファイルパスが空か */
  private get isEmptyPath(): boolean {
    return this.filePath === "";
  }

  /** リストの中のopenFileが現在のパスをもっているかどうか */
  private get isOpenFilesHasPath(): boolean {
    return this.openFileList.some((file) => {
      return file.path === this.filePath;
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
   * 指定のパスを持つopenFileをリストから除去
   * @param path
   */
  public removeOpenFile(path: string) {
    this.openFileList = this.openFileList.filter((file) => {
      return file.path !== path;
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
      const file = this.openedFile;
      if (file) {
        openFileProp.text = file.text;
      }
    } else {
      this.openFileList.push(openFileProp);
    }

    eventEmitter.emit(EventName.UPDATE, path);
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

    for (const name of fileNames) {
      const fullPath: string = path.join(dirPath, name);
      const stats = fs.statSync(fullPath);

      const prop: IOpenDirectory = {
        filename: name,
        fullPath,
        isDirectory: stats.isDirectory(),
      };

      directoryList.push(prop);
    }
  }

  /**
   * セーブする値の書き込み
   * @param value
   */
  private writeFile(value: string) {
    eventEmitter.emit(EventName.SAVE, this.filePath);
    fs.writeFileSync(this.filePath, value);
  }
}

export const fileIO = new FileIO();