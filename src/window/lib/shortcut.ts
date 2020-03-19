import { ipcMain, BrowserWindow, App } from "electron";
import * as localShortcut from "electron-localshortcut";
import { IBaseElement } from "../../common/definition/IBaseElement";
import { Keybind, IPCConstants } from "../../common/constants/systemConstants";
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
    this.setShortcut(Keybind.Q, () => {
      this.app.quit();
    });
  }

  // 開発用 INFO: 後で消す
  private devTool() {
    this.setShortcut(Keybind.atMark, () => {
      this.window.webContents.openDevTools();
    });
  }

  private saveFile() {
    this.setShortcut(Keybind.S, () => {
      this.window.webContents.send(IPCConstants.SAVE_REQ);

      ipcMain.on(IPCConstants.SAVE_VALUE, (_, value: string) => {
        FileIO.save(value, this.window);
      });
    });
  }

  private openFile() {
    this.setShortcut(Keybind.O, () => {
      FileIO.open(this.window);
    });
  }

  private openDirectory() {
    this.setShortcut(Keybind.ShiftO, () => {
      FileIO.openDirectory(this.window);
    });
  }

  private setShortcut(accelerator: Keybind | Keybind[], callback: () => void) {
    localShortcut.register(this.window, accelerator, () => {
      callback();
    });
  }
}