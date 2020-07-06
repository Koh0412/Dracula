import { eventEmitter } from "../../common/utils";
import { StatusMessage, EventName } from "../../common/constants";
import { IStatus } from "../../common/definition";
import { LineStatus, ModeSelectStatus, TabSizeStatus } from "modules/status";

/** ステータスバー */
class Status {
  private path: HTMLElement = document.getElement("status-path");
  private item: HTMLElement = document.getElement("status-item");

  constructor() {
    this.path.innerHTML = StatusMessage.UNTITLED;

    this.create(LineStatus, ModeSelectStatus, TabSizeStatus);

    eventEmitter.on(EventName.SAVE, (path: string) => this.addSaveMessage(path));
    eventEmitter.on(EventName.UPDATE, (path: string) => this.setPath(path));
  }

  /**
   * ステータスバーにリストを作成
   * @param statusItems
   */
  private create(...statusClasses: Array<new() => IStatus>) {
    for (const Class of statusClasses) {
      const status = new Class();
      this.item.appendChild(status.mainElement);
    }
  }

  /**
   * 取得したfilePathをfooterのstatus-pathに入れる
   * @param filePath
   */
  private addSaveMessage(filePath: string): void {
    this.path.innerHTML = StatusMessage.SAVE;

    setTimeout(() => {
      this.path.innerHTML = filePath;
    }, 1500);
  }

  /**
   * Statusのパスをセット
   * @param path
   */
  private setPath(path: string): void {
    this.path.innerHTML = path;
  }
}

export default new Status();