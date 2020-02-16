import { ipcRenderer, IpcRendererEvent } from "electron";

class DrEvent {
  /**
   * - ipcRenderのonメソッドの実行
   * - そのままだと第二引数がanyになってしまうためメソッド化
   *
   * @param emitter
   * @param eventName
   * @param listener
   */
  public ipcResposnse<T>(
    eventName: string,
    listener: (event: IpcRendererEvent, param: T) => void,
    ): Electron.IpcRenderer {
    return ipcRenderer.on(eventName, listener);
  }
}

export default new DrEvent();