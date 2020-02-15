import { ipcMain, BrowserWindow, App } from "electron";
import * as localShortcut from "electron-localshortcut";
import { IBaseElement } from "../definition/IBaseElement";
import { ICPKeys, shortcutKeys } from "../constants/Keys";
import FileIO from "./fileIO";

export default class Shortcut {
  private static window: BrowserWindow;
  private static app: App;
  /**
   * ショートカットキーの登録
   *
   * @param shortcut
   */
  public static resister(baseElement: IBaseElement): void {
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
  private static quit(): void {
    this.setShortcut("Ctrl+Q", () => {
      this.app.quit();
    });
  }

  // 開発用 INFO: 後で消す
  private static devTool() {
    this.setShortcut(shortcutKeys.atMark, () => {
      this.window.webContents.openDevTools();
    });
  }

  private static saveFile() {
    this.setShortcut(shortcutKeys.S, () => {
      this.window.webContents.send(ICPKeys.save.request);

      ipcMain.on(ICPKeys.save.value, (_, value: string) => {
        FileIO.save(value, this.window);
      });
    });
  }

  private static openFile() {
    this.setShortcut(shortcutKeys.O, () => {
      FileIO.open(this.window);
    });
  }

  private static openDirectory() {
    this.setShortcut(shortcutKeys.ShiftO, () => {
      FileIO.openDirectory(this.window);
    });
  }

  private static setShortcut(accelerator: string | string[], callback: () => void) {
    localShortcut.register(this.window, accelerator, () => {
      callback();
    });
  }
}