import { BrowserWindow } from "electron";
import { Common } from "../constants/common";

export class Window {
  private instance: BrowserWindow | null = null;

  private get options(): Electron.BrowserWindowConstructorOptions {
    const options = {
      acceptFirstMouse: true,
      backgroundColor: Common.backgroundColor,
      icon: Common.iconPath,
      show: false,
      paintWhenInitiallyHidden: false,
      webPreferences: {
        nodeIntegration: true
      },
      frame: false,
      minWidth: Common.minWidth,
      minHeight: Common.minHeight
    };

    return options;
  }

  /**
   * ウィンドウを作成し、各種設定をする
   */
  public create(): BrowserWindow {
    this.instance = new BrowserWindow(this.options);

    this.instance.loadURL(Common.mainURL);

    this.instance.webContents.on("did-finish-load", () => {
      if (this.instance) {
        this.instance.maximize();
        this.instance.show();
      }
    });

    return this.instance;
  }

  /**
   * ウィンドウのインスタンスを閉じる
   *
   */
  public dispose(): void {
    this.instance = null;
  }
}