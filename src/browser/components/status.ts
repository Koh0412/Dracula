import Cursor from "./editor/cursor";

import { IFileEvent } from "../../common/definition/event/IFileEvent";
import Util from "../../common/util";
import { StatusMessage } from "../../common/constants/messageConstants";

/** ステータスバー */
class Status {
  private path: HTMLElement = Util.getElement("status-path");
  private item: HTMLElement = Util.getElement("status-item");

  constructor() {
    const lines = this.createStatusList(StatusMessage.INIT_POSITION);
    this.path.innerHTML = StatusMessage.UNTITLED;

    Cursor.change(() => {
      lines.innerHTML = `Ln ${Cursor.row}, Col ${Cursor.column}`;
    });

    Util.addCustomEventListener<IFileEvent>("save", (e) => {
      this.addSaveMessage(e.detail.filePath);
    });

    Util.addCustomEventListener<IFileEvent>("update", (e) => {
      this.setPath(e.detail.filePath);
    });
  }

  /**
   * Statusのパスをセット
   *
   * @param path
   */
  public setPath(path: string): void {
    this.path.innerHTML = path;
  }

  /**
   * - ステータスバーの各リストを1つ生成する
   * - `callback`はclickされた時の処理
   *
   * @param name
   * @param callback
   */
  public createStatusList(name: string, callback?: (event: MouseEvent) => void): HTMLElement {
    const li: HTMLElement = Util.createListItemElement("li", { text: name });

    Util.addClass(li, "status-list");
    this.item.appendChild(li);

    if (callback) {
      li.addEventListener("click", (event) => {
        callback(event);
      });
    }

    return li;
  }

  /**
   * 取得したfilePathをfooterのstatus-pathに入れる
   *
   * @param filePath
   */
  public addSaveMessage(filePath: string): void {
    this.path.innerHTML = StatusMessage.SAVE;

    setTimeout(() => {
      this.path.innerHTML = filePath;
    }, 1500);
  }
}

export default new Status();