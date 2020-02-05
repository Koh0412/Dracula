import { BrowserWindow } from "electron";
import Common from "./common";

export default class Processer {
  private browserWindow: BrowserWindow | null = null;
  private windowOptions: Electron.BrowserWindowConstructorOptions = {};

  public createWindow(): BrowserWindow {
    this.windowOptions = {
      width: Common.size.width,
      height: Common.size.height,
      acceptFirstMouse: true,
      backgroundColor: Common.backgroundColor,
      icon: Common.iconPath,
      show: false,
      paintWhenInitiallyHidden: false,
      // INFO: ないとrequire is undefinedになる
      webPreferences: {
        nodeIntegration: true
      }
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
      this.browserWindow?.show();
    });
  }
}