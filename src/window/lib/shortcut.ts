import { ipcMain, BrowserWindow, App } from "electron";
import * as localShortcut from "electron-localshortcut";
import { IShortcut } from "../definition/IShortcut";
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
  public static resister(shortcut: IShortcut): void {
    this.window = shortcut.window;
    this.app = shortcut.app;

    if (!this.window || !this.app) {
      return;
    }

    this.quit();
    this.devTool();
    this.saveFile();
    this.openFile();
  }

  private static quit(): void {
    localShortcut.register(this.window, "Ctrl+Q", () => {
      this.app.quit();
    });
  }

  // デバッグ用
  private static devTool() {
    localShortcut.register(this.window, shortcutKeys.atMark, () => {
      this.window.webContents.openDevTools();
    });
  }

  private static saveFile() {
    localShortcut.register(this.window, shortcutKeys.S, () => {
      this.window.webContents.send(ICPKeys.save.request);

      ipcMain.on(ICPKeys.save.value, (_, value: string) => {
        FileIO.save(value, this.window);
      })
    });
  }

  private static openFile() {
    localShortcut.register(this.window, shortcutKeys.O, () => {
      FileIO.open(this.window);
    });
  }
}