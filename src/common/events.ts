import { IFileEvent } from "./definition/event/IFileEvent";
import { IOpenFile } from "./definition/IOpenFile";
import * as type from "./type/eventType";

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
  public fileEvent(typeArg: type.fileEvent, path: string): void {
    const fileProp: IFileEvent = {
      filePath: path,
    };
    this.createEvent<IFileEvent>(typeArg, { eventInitDict: fileProp });
  }

  /**
   * クリックに関するより詳細なイベント
   * @param typeArg
   * @param openFile
   */
  public customClickEvent(typeArg: type.customClickEvent, openFile: IOpenFile): void {
    this.createEvent<IOpenFile>(typeArg, { eventInitDict: { text: openFile.text, path: openFile.path } });
  }

  /**
   * タブに関するイベント
   * @param typeArg
   * @param info
   */
  public tabEvent(typeArg: type.tabEvent, element: HTMLElement): void {
    this.createEvent<HTMLElement>(typeArg, { eventInitDict: element });
  }

  /**
   * リサイズに関するイベント
   * @param typeArg
   * @param style
   */
  public resizeEvent(typeArg: type.resizeEvent, style: CSSStyleDeclaration) {
    this.createEvent<CSSStyleDeclaration>(typeArg, { eventInitDict: style });
  }

  /**
   * テキストエリアに関するイベント
   * @param typeArg
   * @param isDirty
   */
  public textareaEvent(typeArg: type.textareaEvent, isDirty: boolean) {
    this.createEvent<boolean>(typeArg, { eventInitDict: isDirty });
  }
}

export default new Events();