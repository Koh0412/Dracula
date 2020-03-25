import { ipcRenderer as renderer } from "electron";

import Util from "../../common/util";
import { IPCConstants, StatusMessage } from "../../common/constants/systemConstants";

/** ステータスバー */
class Status {
  public lines: HTMLElement | null = null;

  private path: HTMLElement = Util.getElement("status-path");
  private item: HTMLElement = Util.getElement("status-item");

  constructor() {
    this.lines = this.createStatusList(StatusMessage.INIT_POSITION);
    renderer.on(IPCConstants.SAVE_PATH, (_, filePath: string) => this.addSaveMessage(filePath));
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
  public createStatusList(name: string, callback?: (event: MouseEvent) => void): HTMLLIElement {
    const li: HTMLLIElement = Util.createListItemElement({ text: name });

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
  private addSaveMessage(filePath: string): void {
    this.path.innerHTML = StatusMessage.SAVE;

    setTimeout(() => {
      this.path.innerHTML = filePath;
    }, 1500);
  }
}

export default new Status();