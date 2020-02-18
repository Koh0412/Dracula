import { dialog, BrowserWindow } from "electron";
import * as fs from "fs";
import * as path from "path";
import { IPCKeys } from "../../common/constants/Keys";
import { IOpenFile } from "../../common/definition/IOpenFile";

class FileIO {

  public filePath: string = "";

  private fileOrDirNames: string[] = [];
  private dialogOptions: Electron.OpenDialogOptions = {};

  private get emptyFilePath(): boolean {
    return this.filePath === "";
  }

  /**
   * テキストの保存
   *
   * @param value
   * @param window
   */
  public async save(value: string, window: Electron.BrowserWindow): Promise<void> {
    if (this.emptyFilePath) {
      // 保存ダイアログを生成
      const saveDialog = await this.createSaveDialog();

      // 保存ボタンを押した且つ、ファイルパスが記入されていれば保存
      if (!saveDialog.canceled && saveDialog.filePath) {
        try {
          this.filePath = saveDialog.filePath;
          fs.writeFileSync(this.filePath, value, { encoding: "utf8" });

          window.webContents.send(IPCKeys.save.path, this.filePath);
        } catch (err) {
          dialog.showErrorBox("error", `cannot save to ${this.filePath}`);
        }
      }
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

    this.addFilePath(paths[0]);
    window.webContents.send(IPCKeys.open.dir, this.fileOrDirNames);
  }

  /**
   * dirPath内にあるファイルやディレクトリを配列に挿入
   *
   * @param dirPath
   */
  private addFilePath(dirPath: string) {
    const fileAndDirs = fs.readdirSync(dirPath);

    fileAndDirs.forEach((name) => {
      this.fileOrDirNames.push(name);

      const fullPath: string = path.join(dirPath, name);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        this.addFilePath(fullPath);
      }
    });
  }

  private createSaveDialog() {
    this.dialogOptions.defaultPath = this.filePath;
    const saveDialog = dialog.showSaveDialog(this.dialogOptions);

    return saveDialog;
  }
}

export default new FileIO();