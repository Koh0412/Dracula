import pathModule from "path";

import { fileIO } from "api/file/fileIO";
import { callDialog } from "process/callDialog";

import { eventEmitter, domUtil } from "../../common/utils";
import { SideMenu } from "base/sideMenu";
import { AttributeName, SideMenuMessage, EventName } from "../../common/constants";
import { IOpenDirectory, IElementOptions, IOpenFile } from "../../common/definition";

/** エクスプローラー */
class Explorer extends SideMenu {
  private dirMenuItem: HTMLElement = document.getElement("dir-menu-item");
  private notDirContents: HTMLElement = document.getElement("not-dir-contents");

  private listItems: HTMLElement[] = [];

  /** 一度でもディレクトリを開いたかどうか */
  private isOpenDir: boolean = false;

  constructor() {
    super();
    this.createNotDirContents();
    this.dirMenuItem.addEventListener("mousedown", this.openFileByClick.bind(this));

    eventEmitter.on(EventName.DIR_OPEN, (path: string) => this.initDirectoryTree(path));
  }

  /**
   * ディレクトリツリーの初期化
   * @param dirPath
   */
  private initDirectoryTree(dirPath: string) {
    if (!dirPath) {
      return;
    }
    const currentDir: HTMLElement = document.getElement("current-dir");
    currentDir.innerHTML = pathModule.basename(dirPath).toUpperCase();

    if (!this.isOpenDir) {
      this.hideMessage();
    }
    // 初期化
    this.dirMenuItem.textContent = "";
    this.addDirectories(dirPath, this.dirMenuItem);
  }

  /**
   * `dirPath`のフォルダとファイルを`parent`内に追加
   * @param dirPath
   * @param parent
   */
  private addDirectories(dirPath: string, parent: HTMLElement): void {
    this.listItems = [];

    const openDirectories = this.openDirectory(dirPath);
    const directoryList = this.DirectoryList(openDirectories);
    this.listItems.push(...directoryList);

    for (const list of directoryList) {
      parent.appendChild(list);
    }
  }

  /** フォルダが開かれてないときに表示するメニューの生成 */
  private createNotDirContents(): HTMLElement {
    const missingMsg: HTMLElement = document.createElement("div");
    missingMsg.innerHTML = SideMenuMessage.MISSING_MSG;
    this.notDirContents.appendChild(missingMsg);

    const openDirBtn: HTMLButtonElement = document.createElement("button");
    openDirBtn.innerHTML = SideMenuMessage.OPEN_DIR;
    openDirBtn.addClass("open-btn");

    // ディレクトリのダイアログを表示させる
    openDirBtn.addEventListener("mousedown", () => {
      openDirBtn.disabled = true;
      callDialog.openDir((res) => {
        if (res.canceled) {
          openDirBtn.disabled = false;
        } else {
          this.initDirectoryTree(res.filePaths[0]);
        }
      });
    });

    this.notDirContents.appendChild(openDirBtn);
    return this.notDirContents;
  }

  /**
   * 取得したファイルとディレクトリをlistItemにmapして配列として返す
   * @param openDirectories
   */
  private DirectoryList(openDirectories: IOpenDirectory[]): HTMLElement[] {
    const files: HTMLElement[] = [];
    const directories: HTMLElement[] = [];

    for (const opendir of openDirectories) {
      const elementOptions: IElementOptions = {
        text: opendir.filename,
        title: opendir.fullPath,
      };

      let element: HTMLElement;

      if (opendir.isDirectory) {
        element = domUtil.createListItemElement("ul", elementOptions);
        element.addClass("directory");
        directories.push(element);
      } else {
        element = domUtil.createListItemElement("li", elementOptions);
        element.addClass("file");
        files.push(element);
      }

      element.setAttribute(AttributeName.DATA_ISDIRECTORY, String(opendir.isDirectory));
    }

    directories.push(...files);
    return directories;
  }

  /**
   * フォルダを開いたらメッセージを非表示に
   */
  private hideMessage(): void {
    this.notDirContents.hidden = true;
    this.isOpenDir = true;
  }

  /**
   * `searchElement`がディレクトリかどうか
   * @param searchElement
   */
  private isDirectory(searchElement: HTMLElement): boolean {
    const isDirectory = searchElement.getAttribute(AttributeName.DATA_ISDIRECTORY);
    return isDirectory === "true";
  }

  /**
   * - 要素をクリックしてファイルもしくはディレクトリを開く
   * @param ev
   */
  private openFileByClick(ev: MouseEvent): void {
    const target = domUtil.EventTargetInfo(ev);
    const children = target.element.children;
    const path: string = target.title;

    if (this.isDirectory(target.element)) {
      target.element.toggleClass("open-directory");
      if (children.length === 0) {
        this.addDirectories(path, target.element);
      } else {
        for (let i: number = 0; i < children.length; i++) {
          (children[i] as HTMLElement).toggleClass("hide");
        }
      }
    } else {
      const openFile: IOpenFile = { text: target.element.innerHTML, path };
      eventEmitter.emit(EventName.FILE_CLICK, openFile);
    }
  }

  /**
   * フォルダを開く
   * @param path
   */
  private openDirectory(path: string): IOpenDirectory[] {
    const openDirectoies: IOpenDirectory[] = [];
    fileIO.openDirectory(path, openDirectoies);
    return openDirectoies;
  }
}

export default new Explorer();