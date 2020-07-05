import { ipcRenderer as renderer, MessageBoxOptions, OpenDialogReturnValue } from "electron";
import { IPCConstants } from "../../common/constants";

/** メインプロセスのダイアログの呼び出しクラス */
class CallDialog {
  /**
   * - セーブダイアログ
   * - `path`にセーブしたパスが返ってくる
   * @param callback
   */
  public save(fileName: string, callback?: (path: string) => void): void {
    renderer.send(IPCConstants.SAVE_DIALOG, fileName);
    if (callback) {
      renderer.on(IPCConstants.SAVE_PATH, (_, path) => {
        callback(path);
      });
    }
  }

  /**
   * - オープンファイルのダイアログ
   * @param callback
   */
  public open(callback?: (res: OpenDialogReturnValue) => void): void {
    renderer.send(IPCConstants.OPEN_DIALOG);
    if (callback) {
      renderer.on(IPCConstants.OPEN_PATH, (_, res) => {
        callback(res);
      });
    }
  }

  /**
   * オープンディレクトリのダイアログ
   * @param callback
   */
  public openDir(callback?: (res: OpenDialogReturnValue) => void): void {
    renderer.send(IPCConstants.DIR_DIALOG);
    if (callback) {
      renderer.on(IPCConstants.DIR_PATH, (_, res) => {
        callback(res);
      });
    }
  }

  /**
   * 注意メッセージのダイアログ
   * @param options
   * @param callback
   */
  public warning(options: MessageBoxOptions, callback?: (responseNum: number) => void): void {
    renderer.send(IPCConstants.MSG_WARNING, options);
    if (callback) {
      renderer.on(IPCConstants.MSG_WARNING_RES, (_, responseNum: number) => {
        callback(responseNum);
      });
    }
  }
}

export const callDialog = new CallDialog();