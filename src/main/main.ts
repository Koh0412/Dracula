import { BrowserWindow, app, App } from "electron";

import Processer from "./api/processer";
import Dialog from "./api/dialog";

import { initLog, stopAppLog } from "../common/decorators";

class Main {
  private window: BrowserWindow | null = null;
  private app: App;

  private mainProcesser: Processer = new Processer();

  constructor(app: App) {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
    this.app = app;

    this.app.on("window-all-closed", this.onWindowAllClosed.bind(this));
    this.app.on("ready", this.create.bind(this));
    this.app.on("activate", this.onActivated.bind(this));
  }

  @stopAppLog()
  private onWindowAllClosed(): void {
    this.app.quit();
  }

  @initLog()
  private create(): void {

    this.window = this.mainProcesser.createWindow();
    this.mainProcesser.setBrowserWindowConfig();
    const win = this.window;

    Dialog.ready(win);
    this.window.on("closed", () => {
      this.window = null;
    });
  }

  private onActivated(): void {
      if (this.window === null) {
        this.create();
      }
  }
}

const main: Main = new Main(app);