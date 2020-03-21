import * as fs from "fs-extra";
import { ipcRenderer as renderer } from "electron";

import Tab from "./tab";
import Editor from "./editor";

import Util from "../../common/Util";
import { IPCConstants, IconName, AttributeName } from "../../common/constants/systemConstants";
import { IOpenDirectory } from "../../common/definition/IOpenDirectory";

// TODO: 階層ツリーなstyleにしたい
/** サイドメニュー */
class SideMenu {
  private dirMenuItem: HTMLElement = Util.getElement("dir-menu-item");
  private listItems: HTMLElement[] = [];

  /** 一度でもディレクトリを開いたかどうか */
  private notOpenDir: boolean = true;

  constructor() {
    Tab.getElement.addEventListener("mousedown", this.tabClick.bind(this));

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

      this.dirMenuItem.addEventListener("mousedown", this.openFileByClick.bind(this));

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
      icon = Util.createMaterialIcon(IconName.folder);
    } else {
      icon = Util.createMaterialIcon(IconName.insertDriveFile);
    }

    icon.setAttribute(AttributeName.DATA_TYPE, "icon");

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

      li.setAttribute(AttributeName.DATA_ISDIRECTORY, String(opendir.isDirectory));

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
      Editor.updateValue(path);
    }
  }

  /**
   * タブをクリックしたときのsidemenu側での処理
   *
   * @param ev
   */
  private tabClick(ev: MouseEvent) {
    const target = Util.EventTargetInfo(ev);
    const prevTab: HTMLElement | null = Tab.getPreviousTab;

    // tabのクローズを押したかどうか
    if (target.attritube.dataType === "close") {
      if (prevTab) {
        Util.updateFocus(this.listItems, prevTab.title);
      } else {
        Util.clearFocus(this.listItems);
      }
    } else {
      if (target.title) {
        Util.updateFocus(this.listItems, target.title);
      }
    }
  }
}

export default new SideMenu();