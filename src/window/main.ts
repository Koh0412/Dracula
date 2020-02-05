import { BrowserWindow, app, App } from "electron";
import Processer from "./lib/processer";
import Shortcut from "./lib/shortcut";
import { IShortcut } from "./definition/IShortcut";


class Main {
  private window: BrowserWindow | null = null;
  private app: App;

  private mainProcesser: Processer = new Processer();

  constructor(app: App) {
    this.app = app;

    this.app.on("window-all-closed", this.onWindowAllClosed.bind(this));
    this.app.on("ready", this.create.bind(this));
    this.app.on("activate", this.onActivated.bind(this));
  }

  private onWindowAllClosed(): void {
    this.app.quit();
  }

  private create(): void {

    this.window = this.mainProcesser.createWindow();
    this.mainProcesser.setBrowserWindowConfig();

    const shortcut: IShortcut = {
      window: this.window,
      app: this.app,
    };
    Shortcut.resister(shortcut);

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