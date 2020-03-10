import { ipcRenderer as renderer } from "electron";

import Util from "../../common/Util";
import { IPCConstants } from "../../common/constants/Keys";
import * as ace from "brace";

/** ステータスバー */
class Status {
  private path: HTMLElement = Util.getElement("status-path");
  private item: HTMLElement = Util.getElement("status-item");

  private cursorPosition: ace.Position = {row: 1, column: 1};

  constructor() {
    renderer.on(IPCConstants.SAVE_PATH, (_, filePath: string) => this.addSaveMessage(filePath));
  }

  public get getLines() {
    return this.cursorPosition;
  }

  public setPath(path: string): void {
    this.path.innerHTML = path;
  }

  public setLines(pos: ace.Position) {
    this.cursorPosition = pos;
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

  /**
   * - ステータスバーの各リストを1つ生成する
   * - `callback`はclickされた時の処理
   *
   * @param name
   * @param callback
   */
  public createStatusList(name: string, callback?: (event: MouseEvent) => void): HTMLLIElement {
    const li = Util.createListItemElement({ text: name });

    Util.addClass(li, "status-list");
    this.item.appendChild(li);

    if (callback) {
      li.addEventListener("click", (event) => {
        callback(event);
      });
    }

    return li;
  }
}

export default new Status();