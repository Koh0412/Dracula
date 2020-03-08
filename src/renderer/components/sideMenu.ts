import * as fs from "fs-extra";
import { ipcRenderer as renderer } from "electron";

import Editor from "./editor";

import Util from "../../common/Util";
import { IPCKeys } from "../../common/constants/Keys";
import { IOpenDirectory } from "../../common/definition/IOpenDirectory";

/** サイドメニュー */
class SideMenu {
  private dirMenuItem: HTMLElement = Util.getElement("dir-menu-item");

  /** 一度でもディレクトリを開いたかどうか */
  private notOpenDir: boolean = true;

  constructor() {
    renderer.on(IPCKeys.open.dir, (_, openDirectories: IOpenDirectory[]) => {
      // 一度もフォルダを開いていなければ非表示に
      if (this.notOpenDir) {
        const msg: HTMLElement = Util.getElement("missing-message");
        msg.hidden = true;
      }
      this.notOpenDir = false;

      // 初期化
      this.dirMenuItem.innerHTML = "";

      const listItem = this.DirectoryList(openDirectories);
      // listItemをセット
      listItem.forEach((item) => {
        this.dirMenuItem.appendChild(item);
      });

      this.dirMenuItem.addEventListener("click", this.openFileByClick.bind(this));

    });
  }

  /**
   * 取得したファイルとディレクトリをlistItemにmapして配列として返す
   *
   * @param openDirectories
   */
  private DirectoryList(openDirectories: IOpenDirectory[]): HTMLElement[] {
    return openDirectories.map((opendir) => {
      const li = document.createElement("li");

      li.innerHTML = opendir.filename;
      li.title = opendir.fullPath;
      li.setAttribute("data-isDirectory", String(opendir.isDirectory));

      return li;
    });
  }

  /**
   * 要素をクリックしてファイルを開く
   *
   * @param ev
   */
  private openFileByClick(ev: MouseEvent): void {
    const target: HTMLElement = ev.target as HTMLElement;
    const isDirectory = target.getAttribute("data-isDirectory");
    const path: string = target.title;

    Util.addClassChildItem(this.dirMenuItem, target, "focus-item");

    if (isDirectory === "false") {
      const text = fs.readFileSync(path, { encoding: "utf8" });
      Editor.addOpenFileValue({text, path});

      renderer.send(IPCKeys.open.byClick, path);
    }
  }
}

export default new SideMenu();