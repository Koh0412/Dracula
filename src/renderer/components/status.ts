import { ipcRenderer as renderer } from "electron";

import Util from "../../common/Util";
import { IPCConstants } from "../../common/constants/Keys";

/** ステータスバー */
class Status {
  public lines: HTMLElement = null;

  private path: HTMLElement = Util.getElement("status-path");
  private item: HTMLElement = Util.getElement("status-item");

  constructor() {
    this.lines = this.createStatusList("Ln 1, Col 1");
    renderer.on(IPCConstants.SAVE_PATH, (_, filePath: string) => this.addSaveMessage(filePath));
  }

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
    this.path.innerHTML = "the file has been saved";

    setTimeout(() => {
      this.path.innerHTML = filePath;
    }, 1500);
  }
}

export default new Status();