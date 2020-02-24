import { ipcRenderer, IpcRendererEvent, ipcMain, IpcMainEvent } from "electron";

class DrEvent {
  /**
   * - ipcRenderのonメソッドの実行
   * - そのままだと第二引数がanyになってしまうためメソッド化
   *
   * @param eventName
   * @param listener
   */
  public renderResponse<T>(
    eventName: string,
    listener: (event: IpcRendererEvent, param: T) => void,
    ): Electron.IpcRenderer {
    return ipcRenderer.on(eventName, listener);
  }

  /**
   * - ipcMainのonメソッドの実行
   * - そのままだと第二引数がanyになってしまうためメソッド化
   * @param eventName
   * @param listener
   */
  public mainResponse<T>(
    eventName: string,
    listener: (event: IpcMainEvent, param: T) => void,
    ): Electron.IpcMain {
    return ipcMain.on(eventName, listener);
  }
}

export default new DrEvent();