import { ipcMain, BrowserWindow, App } from "electron";
import * as localShortcut from "electron-localshortcut";
import { IBaseElement } from "../../common/definition/IBaseElement";
import { shortcutKeys, IPCConstants } from "../../common/constants/Keys";
import FileIO from "../api/fileIO";

export default class Shortcut {
  private window: BrowserWindow;
  private app: App;
  /**
   * ショートカットキーの登録
   *
   * @param shortcut
   */
  constructor(baseElement: IBaseElement) {
    this.window = baseElement.window;
    this.app = baseElement.app;

    if (!this.window || !this.app) {
      return;
    }

    this.quit();
    this.devTool();
    this.saveFile();
    this.openFile();
    this.openDirectory();
  }

  // 開発用 INFO: 後で消す
  private quit(): void {
    this.setShortcut("Ctrl+Q", () => {
      this.app.quit();
    });
  }

  // 開発用 INFO: 後で消す
  private devTool() {
    this.setShortcut(shortcutKeys.atMark, () => {
      this.window.webContents.openDevTools();
    });
  }

  private saveFile() {
    this.setShortcut(shortcutKeys.S, () => {
      this.window.webContents.send(IPCConstants.SAVE_REQ);

      ipcMain.on(IPCConstants.SAVE_VALUE, (_, value: string) => {
        FileIO.save(value, this.window);
      });
    });
  }

  private openFile() {
    this.setShortcut(shortcutKeys.O, () => {
      FileIO.open(this.window);
    });
  }

  private openDirectory() {
    this.setShortcut(shortcutKeys.ShiftO, () => {
      FileIO.openDirectory(this.window);
    });
  }

  private setShortcut(accelerator: string | string[], callback: () => void) {
    localShortcut.register(this.window, accelerator, () => {
      callback();
    });
  }
}