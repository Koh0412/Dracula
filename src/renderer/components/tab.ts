import * as fs from "fs-extra";
import { ipcRenderer as renderer } from "electron";

import Editor from "./editor";

import Util from "../../common/Util";
import { IPCConstants } from "../../common/constants/systemConstants";

// TODO: tab数が増えた時にどうするか
// TODO: focus系はどうするか
class Tab {
  public element: HTMLElement = Util.getElement("tab");
  private listItems: HTMLElement[] = [];

  constructor() {
    this.element.addEventListener("mousedown", this.openFileByClick.bind(this));
  }

  /**
   * タブの生成
   *
   * @param textContent
   * @param path
   */
  public create(target: HTMLElement, path: string): void {
    const li: HTMLLIElement = Util.createListItemElement({
      text: target.innerHTML,
      title: path,
    });

    const isDuplicated: boolean = this.checkElementTitle(this.listItems, li);
    if (!isDuplicated) {
      this.listItems.push(li);
    }

    this.listItems.forEach((tab) => {
      Util.removeClass(tab, "focus-item");

      if (tab.title === target.title) {
        Util.addClass(tab, "focus-item");
      }
      this.element.appendChild(tab);
    });
  }

  /**
   * タブをクリックしてファイルを開く
   *
   * @param ev
   */
  private openFileByClick(ev: MouseEvent): void {
    const target = Util.EventTargetInfo(ev);
    const path: string = target.title;
    const text: string = fs.readFileSync(path, { encoding: "utf8" });

    this.listItems.forEach((tab) => {
      Util.removeClass(tab, "focus-item");
    });

    Util.addClass(target.element, "focus-item");
    Editor.addOpenFileValue({text, path});

    renderer.send(IPCConstants.OPEN_BYCLICK, path);
  }

  /**
   * `checkList`の中に`newNode`との重複がないかをチェック
   *
   * @param ckeckList
   * @param newNode
   */
  private checkElementTitle(ckeckList: HTMLElement[], newNode: HTMLElement): boolean {
    return ckeckList.some((item) => item.title === newNode.title);
  }
}

export default new Tab();