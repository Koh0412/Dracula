import { BrowserWindow, app, App } from "electron";
import Window from "./window";

import { initLog, stopAppLog } from "../../common/decorators";

class Core {
  public window: BrowserWindow | null = null;
  public app: App;

  constructor(app: App) {
    this.app = app;
    this.app.on("window-all-closed", this.onWindowAllClosed.bind(this));
    this.app.on("ready", this.create.bind(this));
    this.app.on("activate", this.onActivated.bind(this));
  }

  /**
   * アプリケーションを終了する
   */
  @stopAppLog()
  private onWindowAllClosed(): void {
    this.app.quit();
  }

  /**
   * アプリケーション起動時にウィンドウを作成する
   */
  @initLog()
  private create(): void {
    this.window = Window.create();
    this.window.on("closed", () => Window.dispose.bind(this));
  }

  /**
   * アクティブな状態時
   */
  private onActivated(): void {
      if (this.window === null) {
        this.create();
      }
  }
}

export default new Core(app);