import pathModule from "path";

import FileIO from "../api/fileIO";
import CallDialog from "../api/callDialog";
import Resize from "../lib/resize";

import Util from "../../common/util";
import { AttributeName } from "../../common/constants/systemConstants";
import { SideMenuMessage } from "../../common/constants/messageConstants";
import { IOpenDirectory } from "../../common/definition/IOpenDirectory";
import { IElementOptions } from "../../common/definition/IElementOptions";
import Events from "../../common/events";

// TODO: 階層ツリーのスタイルを直す
/** サイドメニュー */
class SideMenu {
  private dirMenuItem: HTMLElement = Util.getElement("dir-menu-item");
  private resize: HTMLElement = Util.getElement("resize");
  private notDirContents: HTMLElement = Util.getElement("not-dir-contents");

  private listItems: HTMLElement[] = [];
  private dirPath: string = "";

  /** 一度でもディレクトリを開いたかどうか */
  private isOpenDir: boolean = false;

  constructor() {
    this.createNotDirContents();
    this.dirMenuItem.addEventListener("mousedown", this.openFileByClick.bind(this));

    const resize = new Resize(this.resize);
  }

  /**
   * `dirPath`のフォルダとファイルを`parent`内に追加
   * @param dirPath
   * @param parent
   */
  public addDirectories(dirPath: string, parent: HTMLElement): void {
    this.listItems = [];

    const openDirectories = this.openDirectory(dirPath);
    const directoryList = this.DirectoryList(openDirectories);

    directoryList.forEach((list) => {
      this.listItems.push(list);
      parent.appendChild(list);
    });
  }

  /**
   * ディレクトリツリーの初期化
   * @param dirPath
   */
  public initDirectoryTree(dirPath: string) {
    this.dirPath = dirPath;
    const currentDir: HTMLElement = Util.getElement("current-dir");
    currentDir.innerHTML = pathModule.basename(dirPath).toUpperCase();

    this.hideMessage();
    // 初期化
    this.dirMenuItem.textContent = "";
    this.addDirectories(dirPath, this.dirMenuItem);
  }

  /** フォルダが開かれてないときに表示するメニューの生成 */
  private createNotDirContents(): void {
    const missingMsg: HTMLElement = document.createElement("div");
    missingMsg.innerHTML = SideMenuMessage.MISSING_MSG;
    this.notDirContents.appendChild(missingMsg);

    const openDirBtn: HTMLElement = document.createElement("button");
    openDirBtn.innerHTML = SideMenuMessage.OPEN_DIR;
    Util.addClass(openDirBtn, "open-btn");

    // ディレクトリのダイアログを表示させる
    openDirBtn.addEventListener("mousedown", () => CallDialog.openDir((path) => this.initDirectoryTree(path)));

    this.notDirContents.appendChild(openDirBtn);
  }

  /**
   * 取得したファイルとディレクトリをlistItemにmapして配列として返す
   * @param openDirectories
   */
  private DirectoryList(openDirectories: IOpenDirectory[]): HTMLElement[] {
    return openDirectories.map((opendir) => {
      const elementOptions: IElementOptions = {
        text: opendir.filename,
        title: opendir.fullPath,
      };

      let element: HTMLElement;

      if (opendir.isDirectory) {
        element = Util.createListItemElement("ul", elementOptions);
        Util.addClass(element, "directory");
      } else {
        element = Util.createListItemElement("li", elementOptions);
        Util.addClass(element, "file");
      }
      element.setAttribute(AttributeName.DATA_ISDIRECTORY, String(opendir.isDirectory));

      return element;
    });
  }

  /**
   * フォルダを開いたらメッセージを非表示に
   */
  private hideMessage(): void {
    if (!this.isOpenDir) {
      this.notDirContents.hidden = true;
    }
    this.isOpenDir = true;
  }

  /**
   * `searchElement`がディレクトリかどうか
   * @param searchElement
   */
  private isDirectory(searchElement: HTMLElement): boolean {
    const isDirectory = searchElement.getAttribute("data-isDirectory");
    return isDirectory === "true";
  }

  /**
   * - 要素をクリックしてファイルもしくはディレクトリを開く
   * @param ev
   */
  private openFileByClick(ev: MouseEvent): void {
    const target = Util.EventTargetInfo(ev);
    const children = target.element.children;
    const path: string = target.title;

    if (this.isDirectory(target.element)) {
      Util.toggleClass(target.element, "open-directory");
      if (children.length === 0) {
        this.addDirectories(path, target.element);
      } else {
        for (let i: number = 0; i < children.length; i++) {
          Util.toggleClass(children[i] as HTMLElement, "hide");
        }
      }
    } else {
      Events.clickTypeEvent("fileClick", { text: target.element.innerHTML, path });
    }
  }

  /**
   * フォルダを開く
   * @param path
   */
  private openDirectory(path: string): IOpenDirectory[] {
    const openDirectoies: IOpenDirectory[] = [];
    FileIO.openDirectory(path, openDirectoies);
    return openDirectoies;
  }
}

export default new SideMenu();