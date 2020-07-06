import { BrowserWindow, app, App } from "electron";
import { Window } from "./window";

import { initLog, stopAppLog } from "../../common/decorators";
import { MainProcess } from "../process/mainProcess";

export class Core {
  private window: BrowserWindow | null = null;
  private app: App;

  constructor(app: App) {
    this.app = app;
    this.app.on("window-all-closed", this.onWindowAllClosed.bind(this));
    this.app.on("ready", this.create.bind(this));
    this.app.on("activate", this.onActivated.bind(this));
  }

  /**
   * アプリケーションの作成
   */
  public static createApplication(): Core {
    return new Core(app);
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
    const window = new Window();
    this.window = window.create();

    MainProcess.dialog.ready(this.window);
    this.window.on("closed", () => window.dispose.bind(this));
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