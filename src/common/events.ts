import { IFileEvent } from "./definition/event/IFileEvent";

/** イベントクラス */
class Events {

  /**
   * customEventの作成
   * @param typeArg
   * @param options
   */
  public createEvent<T>(typeArg: string, options: { eventInitDict?: T, element?: HTMLElement }) {
    const event = new CustomEvent(typeArg, { detail: options.eventInitDict });
    if (!options.element) {
      options.element = document.body;
    }
    options.element.dispatchEvent(event);
  }
  /**
   * ファイルに関する操作で発火
   * @param typeArg
   * @param path
   */
  public fileEvent(typeArg: string, path: string): void {
    const fileProp: IFileEvent = {
      filePath: path,
    };
    this.createEvent<IFileEvent>(typeArg, { eventInitDict: fileProp });
  }
}

export default new Events();