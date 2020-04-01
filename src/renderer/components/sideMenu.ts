import { ipcRenderer as renderer } from "electron";

import Tab from "./tab";
import Editor from "./editor";
import FileIO from "../api/fileIO";

import Util from "../../common/util";
import Resize from "../api/resize";
import { IPCConstants, AttributeName, SideMenuMessage } from "../../common/constants/systemConstants";
import { IOpenDirectory } from "../../common/definition/IOpenDirectory";

// TODO: 階層ツリーなstyleにしたい
/** サイドメニュー */
class SideMenu {
  private dirMenuItem: HTMLElement = Util.getElement("dir-menu-item");
  private resize: HTMLElement = Util.getElement("resize");
  private notDirContents: HTMLElement = Util.getElement("not-dir-contents");
  private listItems: HTMLElement[] = [];

  /** 一度でもディレクトリを開いたかどうか */
  private isOpenDir: boolean = false;

  constructor() {
    this.createNotDirContents();
    Tab.element.addEventListener("mousedown", this.tabClick.bind(this));
    const resize = new Resize(this.resize);

    renderer.on(IPCConstants.DIR_PATH, (_, dirPath) => {
      const openDirectories = this.openDirectory(dirPath);
      this.hideMessage();
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
   * 取得したファイルとディレクトリをlistItemにmapして配列として返す
   *
   * @param openDirectories
   */
  private DirectoryList(openDirectories: IOpenDirectory[]): HTMLElement[] {
    return openDirectories.map((opendir) => {
      const icon = Util.createMenuIcon(opendir.isDirectory);
      const li: HTMLLIElement = Util.createListItemElement({
        text: icon.outerHTML + opendir.filename,
        title: opendir.fullPath,
      });

      li.setAttribute(AttributeName.DATA_ISDIRECTORY, String(opendir.isDirectory));

      return li;
    });
  }

  /**
   * フォルダを開いたらメッセージを非表示に
   */
  private hideMessage() {
    if (!this.isOpenDir) {
      this.notDirContents.hidden = true;
    }
    this.isOpenDir = true;
  }

  /** フォルダが開かれてないときに表示するメニューの生成 */
  private createNotDirContents() {
    const missingMsg: HTMLElement = document.createElement("div");
    missingMsg.innerHTML = SideMenuMessage.MISSING_MSG;
    this.notDirContents.appendChild(missingMsg);

    const openDirBtn: HTMLElement = document.createElement("button");
    openDirBtn.innerHTML = SideMenuMessage.OPEN_DIR;
    Util.addClass(openDirBtn, "open-btn");

    // ディレクトリのダイアログを表示させる
    openDirBtn.addEventListener("mousedown", () => {
      renderer.send(IPCConstants.DIR_DIALOG);
    });

    this.notDirContents.appendChild(openDirBtn);
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
      Tab.create(target.element.innerHTML, path);
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
    const prevTab: HTMLElement | null = Tab.previousTab;

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

  /**
   * フォルダを開く
   *
   * @param window
   */
  public openDirectory(path: string): IOpenDirectory[] {
    const openDirectoies: IOpenDirectory[] = [];
    FileIO.openDirectory(path, openDirectoies);
    return openDirectoies;
  }
}

export default new SideMenu();