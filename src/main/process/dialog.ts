import { dialog, ipcMain as ipc, BrowserWindow, MessageBoxOptions } from "electron";

import { IPCConstants } from "../../common/constants/systemConstants";

interface IOptionProperty {
  openFile: string;
  openDirectory: string;
  multiSelections: string;
  showHiddenFiles: string;
  createDirectory: string;
  promptToCreate: string;
  noResolveAliases: string;
  treatPackageAsDirectory: string;
}

type PropertyType = keyof IOptionProperty;

export class Dialog {
  private options: Electron.OpenDialogOptions = {};

  /**
   * ダイアログをIPCから受け取れるように準備状態にする
   *
   * @param win
   */
  public ready(win: BrowserWindow | null): void {
    if (!win) {
      return;
    }
    ipc.on(IPCConstants.OPEN_DIALOG, async () => {
      const response = await this.createOpenDialog("openFile");
      if (response) {
        win.webContents.send(IPCConstants.OPEN_PATH, response);
      }
    });

    ipc.on(IPCConstants.SAVE_DIALOG, (_, fileName: string) => {
      const path = this.createSaveDialog(fileName);
      if (path) {
        win.webContents.send(IPCConstants.SAVE_PATH, path);
      }
    });

    ipc.on(IPCConstants.DIR_DIALOG, async () => {
      const response = await this.createOpenDialog("openDirectory");
      if (response) {
        win.webContents.send(IPCConstants.DIR_PATH, response);
      }
    });

    ipc.on(IPCConstants.MSG_WARNING, (_, options: MessageBoxOptions) => {
      const messageDialog = this.createMessageDialog(win, options);
      messageDialog.then((res) => {
        win.webContents.send(IPCConstants.MSG_WARNING_RES, res.response);
      }).catch((err) => console.log(err));
    });
  }
  /**
   * saveDialogを生成, 返り値はセーブしたパス
   */
  private createSaveDialog(defaultPath?: string): string | undefined {
    if (defaultPath) {
      this.options.defaultPath = defaultPath;
    }
    return dialog.showSaveDialogSync(this.options);
  }

  /**
   * openDialogを生成、返り値は開いたパス
   *
   * @param propertyType
   */
  private createOpenDialog(propertyType: PropertyType): Promise<Electron.OpenDialogReturnValue> | undefined {
    this.options.properties = [propertyType];
    this.options.defaultPath = "";
    return dialog.showOpenDialog(this.options);
  }

  private createMessageDialog(win: BrowserWindow, options: MessageBoxOptions) {
    if (!options.message) {
      dialog.showErrorBox("No message body Error", "please check your message property");
    }
    options.title = "Dracula";
    return dialog.showMessageBox(win, options);
  }
}