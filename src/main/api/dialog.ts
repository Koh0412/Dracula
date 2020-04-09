import { dialog, ipcMain as ipc, BrowserWindow } from "electron";
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

class Dialog {
  private options: Electron.OpenDialogOptions = {};

  /**
   * ダイアログをIPCから受け取れるように準備状態にする
   *
   * @param win
   */
  public ready(win: BrowserWindow): void {
    ipc.on(IPCConstants.OPEN_DIALOG, () => {
      const paths = this.createOpenDialog("openFile");
      if (paths) {
        win.webContents.send(IPCConstants.OPEN_PATH, paths[0]);
      }
    });

    ipc.on(IPCConstants.SAVE_DIALOG, () => {
      const path = this.createSaveDialog();
      if (path) {
        win.webContents.send(IPCConstants.SAVE_PATH, path);
      }
    });

    ipc.on(IPCConstants.DIR_DIALOG, () => {
      const paths = this.createOpenDialog("openDirectory");
      if (paths) {
        win.webContents.send(IPCConstants.DIR_PATH, paths[0]);
      }
    });
  }
  /**
   * saveDialogを生成, 返り値はセーブしたパス
   */
  public createSaveDialog(defaultPath?: string): string | undefined {
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
  public createOpenDialog(propertyType: PropertyType): string[] | undefined {
    this.options.properties = [propertyType];
    return dialog.showOpenDialogSync(this.options);
  }
}

export default new Dialog();