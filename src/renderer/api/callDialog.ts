import { ipcRenderer as renderer } from "electron";
import { IPCConstants } from "../../common/constants/systemConstants";

/** メインプロセスのダイアログの呼び出しクラス */
class CallDialog {
  /**
   * セーブダイアログ
   * @param callback
   */
  public save(callback?: (path: string) => void) {
    renderer.send(IPCConstants.SAVE_DIALOG);
    if (callback) {
      renderer.on(IPCConstants.SAVE_PATH, (_, path) => {
        callback(path);
      });
    }
  }

  /**
   * オープンファイルのダイアログ
   * @param callback
   */
  public open(callback?: (path: string) => void) {
    renderer.send(IPCConstants.OPEN_DIALOG);
    if (callback) {
      renderer.on(IPCConstants.OPEN_PATH, (_, path) => {
        callback(path);
      });
    }
  }

  /**
   * オープンディレクトリのダイアログ
   * @param callback
   */
  public openDir(callback?: (path: string) => void) {
    renderer.send(IPCConstants.DIR_DIALOG);
    if (callback) {
      renderer.on(IPCConstants.DIR_PATH, (_, path) => {
        callback(path);
      });
    }
  }
}

export default new CallDialog();