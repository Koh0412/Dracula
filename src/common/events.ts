import { IFileEvent } from "./definition/event/IFileEvent";

/** イベントクラス */
class Events {
  /**
   * ファイルに関する操作で発火
   * @param typeArg
   * @param path
   */
  public fileEvent(typeArg: string, path: string): void {
    const fileProp: IFileEvent = {
      filePath: path,
    };
    const event = new CustomEvent(typeArg, { detail: fileProp });
    document.body.dispatchEvent(event);
  }
}

export default new Events();