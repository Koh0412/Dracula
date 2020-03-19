import { BrowserWindow, app, App, ipcMain as ipc } from "electron";

import Processer from "./api/processer";
import Shortcut from "./lib/shortcut";
import FileIO from "./api/fileIO";

import { IBaseElement } from "../common/definition/IBaseElement";
import { IPCConstants } from "../common/constants/systemConstants";


class Main {
  private window: BrowserWindow | null = null;
  private app: App;

  private mainProcesser: Processer = new Processer();

  constructor(app: App) {
    this.app = app;

    this.app.on("window-all-closed", this.onWindowAllClosed.bind(this));
    this.app.on("ready", this.create.bind(this));
    this.app.on("activate", this.onActivated.bind(this));

    ipc.on(IPCConstants.OPEN_BYCLICK, (_, path: string) => FileIO.setPath(path));
  }

  private onWindowAllClosed(): void {
    this.app.quit();
  }

  private create(): void {

    this.window = this.mainProcesser.createWindow();
    this.mainProcesser.setBrowserWindowConfig();

    const baseElement: IBaseElement = {
      window: this.window,
      app: this.app,
    };

    this.shortcut(baseElement);

    this.window.on("closed", () => {
      this.window = null;
    });
  }

  private onActivated(): void {
      if (this.window === null) {
        this.create();
      }
  }

  private shortcut(baseElement: IBaseElement): Shortcut {
    return new Shortcut(baseElement);
  }
}

const main: Main = new Main(app);