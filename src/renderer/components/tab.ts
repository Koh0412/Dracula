import * as fs from "fs-extra";
import { ipcRenderer as renderer } from "electron";

import Editor from "./editor";

import Util from "../../common/Util";
import { IPCConstants } from "../../common/constants/systemConstants";
import { ITargetInfo } from "../../common/definition/ITargetInfo";

// TODO: tab数が増えた時にどうするか
// TODO: focus系はどうするか
class Tab {
  public element: HTMLElement = Util.getElement("tab");
  private listItems: HTMLElement[] = [];
  private index: number | null = null;

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
      isClose: true,
    });

    const isDuplicated: boolean = this.checkElementTitle(this.listItems, li);
    if (!isDuplicated) {
      if (this.index) {
        this.listItems.splice(this.index, 0, li);
        this.index++;
      } else {
        this.listItems.push(li);
      }
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
   * `target`のタブを削除
   *
   * @param target
   */
  private remove(target: ITargetInfo): void {
    this.element.innerHTML = "";
    if (target.element.classList.contains("focus-item")) {
      // removeするタブがフォーカスを持っている場合の処理
    }

    this.listItems = this.listItems.filter((tab) => {
      return target.title !== tab.title;
    });

    this.listItems.forEach((tab) => {
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
    if (!target.title) {
      return;
    }

    if (target.attritube.dataType === "close") {
      this.remove(target);
      return;
    }

    const path: string = target.title;
    const text: string = fs.readFileSync(path, { encoding: "utf8" });

    this.index = this.listItems.indexOf(target.element) + 1;
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