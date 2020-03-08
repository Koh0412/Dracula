import { BrowserWindow } from "electron";
import Common from "../constants/common";

export default class Processer {
  private browserWindow: BrowserWindow | null = null;
  private windowOptions: Electron.BrowserWindowConstructorOptions = {};

  public createWindow(): BrowserWindow {
    this.windowOptions = {
      acceptFirstMouse: true,
      backgroundColor: Common.backgroundColor,
      icon: Common.iconPath,
      show: false,
      paintWhenInitiallyHidden: false,
      // INFO: ないとrequire is undefinedになる
      webPreferences: {
        nodeIntegration: true
      },
      frame: false,
      minWidth: Common.minWidth,
      minHeight: Common.minHeight
    };

    this.browserWindow = new BrowserWindow(this.windowOptions);

    return this.browserWindow;
  }

  public setBrowserWindowConfig(): void {
    if (!this.browserWindow) {
      return;
    }

    this.browserWindow.loadURL(Common.mainURL);

    this.browserWindow.webContents.on("did-finish-load", () => {
      this.browserWindow?.maximize();
      this.browserWindow?.show();
    });
  }
}