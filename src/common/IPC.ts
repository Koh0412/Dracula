import { IpcRendererEvent, IpcMainEvent } from "electron";

interface EventEmitter {
  on(event: string | symbol, listener: Function): this;
}

class IPC {
  /**
   * - ipcRenderのonメソッドの実行
   * - そのままだと第二引数がanyになってしまうためメソッド化
   *
   * @param emitter
   * @param eventName
   * @param listener
   */
  public recieve<T>(
    emitter: EventEmitter,
    eventName: string,
    listener: (event: IpcRendererEvent | IpcMainEvent, param: T) => void,
    ) {
    return emitter.on(eventName, listener);
  }
}

export default new IPC();