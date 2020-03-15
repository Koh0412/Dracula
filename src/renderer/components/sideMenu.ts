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
  private listItems: HTMLElement[] = [];

  /** 一度でもディレクトリを開いたかどうか */
  private notOpenDir: boolean = true;

  constructor() {
    Tab.element.addEventListener("click", this.tabClick.bind(this));

    renderer.on(IPCConstants.OPEN_DIR, (_, openDirectories: IOpenDirectory[]) => {
      // 一度もフォルダを開いていなければ非表示に
      if (this.notOpenDir) {
        const msg: HTMLElement = Util.getElement("missing-message");
        msg.hidden = true;
      }
      this.notOpenDir = false;

      // 初期化
      this.dirMenuItem.innerHTML = "";

      this.listItems = this.DirectoryList(openDirectories);
      // listItemをセット
      this.listItems.forEach((item) => {
        this.dirMenuItem.appendChild(item);
      });

      this.dirMenuItem.addEventListener("click", this.openFileByClick.bind(this));

    });
  }

  /**
   * 詳細設定をしたicon生成して返す
   *
   * @param openDir
   */
  private createMenuIcon(openDir: IOpenDirectory): HTMLElement {
    let icon: HTMLElement;

    if (openDir.isDirectory) {
      icon = Util.createMaterialIcon("folder");
    } else {
      icon = Util.createMaterialIcon("insert_drive_file");
    }

    icon.setAttribute("data-type", "icon");

    return icon;
  }

  /**
   * 取得したファイルとディレクトリをlistItemにmapして配列として返す
   *
   * @param openDirectories
   */
  private DirectoryList(openDirectories: IOpenDirectory[]): HTMLElement[] {
    return openDirectories.map((opendir) => {
      const icon = this.createMenuIcon(opendir);
      const li: HTMLLIElement = Util.createListItemElement({
        text: icon.outerHTML + opendir.filename,
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
    const target = Util.EventTargetInfo(ev);
    const path: string = target.title;

    // target要素にクラスを追加
    Util.addClassChildItem(this.dirMenuItem, target.element, "focus-item");

    // ディレクトリでなければ処理
    if (target.attritube.dataIsDirectory === "false" && path) {
      // タブを生成
      Tab.create(target.element, path);

      const text: string = fs.readFileSync(path, { encoding: "utf8" });
      Editor.addOpenFileValue({ text, path });

      renderer.send(IPCConstants.OPEN_BYCLICK, path);
    }
  }

  /**
   * タブをクリックしたときのsidemenu側での処理
   *
   * @param ev
   */
  private tabClick(ev: MouseEvent) {
    const target = Util.EventTargetInfo(ev);
    this.listItems.forEach((item) => {
      Util.removeClass(item, "focus-item");

      if (target.title === item.title) {
        Util.addClass(item, "focus-item");
      }
    });
  }
}

export default new SideMenu();