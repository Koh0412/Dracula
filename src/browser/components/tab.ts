import pathModule from "path";

import Util from "../../common/util";
import { ITargetInfo } from "../../common/definition/ITargetInfo";
import { IOpenFile } from "../../common/definition/IOpenFile";
import Events from "../../common/events";
import { IFileEvent } from "../../common/definition/event/IFileEvent";

/** タブに関するクラス */
class Tab {
  private previous: HTMLElement | null = null;
  private index: number | null = null;
  private listItems: HTMLElement[] = [];

  constructor() {
    this.element.addEventListener("mousedown", this.openFileByClick.bind(this));

    Util.addCustomEventListener<IOpenFile>("fileClick", (e) => {
      this.create(e.detail.text, e.detail.path);
    });

    Util.addCustomEventListener<IFileEvent>("open", (e) => {
      const name = pathModule.basename(e.detail.filePath);
      this.create(name, e.detail.filePath);
    });
  }

  public get element(): HTMLElement {
    const element: HTMLElement = document.getElement("tab");
    return element;
  }

  /**
   * - タブの生成
   * - `text`をinnerHTMLに、`path`をtitleに流す
   * @param text
   * @param path
   */
  private create(text: string, path: string): void {
    const li: HTMLElement = Util.createListItemElement("li", {
      text,
      title: path,
      isClose: true,
    });
    li.addClass("file");

    const isDuplicated: boolean = this.checkElementTitle(this.listItems, li);
    if (!isDuplicated) {
      this.listItems.push(li);
    }
    Util.clearFocus(this.listItems);

    this.listItems.forEach((tab) => {
      if (tab.title === path) {
        tab.addClass("focus-item");
      }
      this.element.appendChild(tab);
    });
  }

  /**
   * `checkList`の中に`newNode`との重複がないかをチェック
   * @param ckeckList
   * @param newNode
   */
  private checkElementTitle(ckeckList: HTMLElement[], newNode: HTMLElement): boolean {
    return ckeckList.some((item) => item.title === newNode.title);
  }

  /**
   * 前のタブにフォーカスを移す, ただし、最初のタブの場合は後ろにフォーカスを当てる
   * @param target
   */
  private focusTab(target: ITargetInfo): void {
    this.index = this.listItems.indexOf(target.element);
    if (this.index > 0) {
      this.index--;
    } else {
      this.index++;
    }
    this.previous = this.listItems[this.index];
    Events.tabEvent("tab", this.previous);

    if (this.previous) {
      this.previous.addClass("focus-item");
    }
    return;
  }

  /**
   * `target`のタブを削除
   * @param target
   */
  private remove(target: ITargetInfo): void {
    this.element.textContent = "";
    if (target.element.classList.contains("focus-item")) {
      // removeするタブがフォーカスを持っている場合の処理
      this.focusTab(target);
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

    Util.clearFocus(this.listItems);
    target.element.addClass("focus-item");
    Events.tabEvent("tab", target.element);
  }
}

export default new Tab();