import { ipcRenderer as renderer } from "electron";

import Util from "../../common/Util";
import { IPCKeys } from "../../common/constants/Keys";

class Status {
  private path: HTMLElement = Util.getElement("status-path");

  constructor() {
    renderer.on(IPCKeys.save.path, (_, filePath: string) => this.addSaveMessage(filePath));
  }

  public setPath(path: string) {
    this.path.innerHTML = path;
  }

  /**
   * 取得したfilePathをフッターに入れる
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