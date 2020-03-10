import * as fs from "fs-extra";
import { ipcRenderer as renderer } from "electron";

import Tab from "./tab";
import Editor from "./editor";

import Util from "../../common/Util";
import { IPCConstants } from "../../common/constants/Keys";
import { IOpenDirectory } from "../../common/definition/IOpenDirectory";

// TODO: 階層ツリーなstyleにしたい
/** サイドメニュー */
class SideMenu {
  private dirMenuItem: HTMLElement = Util.getElement("dir-menu-item");

  /** 一度でもディレクトリを開いたかどうか */
  private notOpenDir: boolean = true;

  constructor() {
    renderer.on(IPCConstants.OPEN_DIR, (_, openDirectories: IOpenDirectory[]) => {
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
      const li: HTMLLIElement = Util.createListItemElement({
        text: opendir.filename,
        title: opendir.fullPath,
      });
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
    const isDirectory: string = target.getAttribute("data-isDirectory");
    const path: string = target.title;

    Util.addClassChildItem(this.dirMenuItem, target, "focus-item");

    if (isDirectory === "false") {
      if (target.textContent && path) {
        Tab.create(target.textContent, path);
      }

      const text: string = fs.readFileSync(path, { encoding: "utf8" });
      Editor.addOpenFileValue({text, path});

      renderer.send(IPCConstants.OPEN_BYCLICK, path);
    }
  }
}

export default new SideMenu();