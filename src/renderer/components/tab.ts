import Editor from "./editor";

import Util from "../../common/Util";
import { ITargetInfo } from "../../common/definition/ITargetInfo";

class Tab {
  private element: HTMLElement = Util.getElement("tab");
  private previous: HTMLElement | null = null;
  private index: number | null = null;
  private listItems: HTMLElement[] = [];

  constructor() {
    this.element.addEventListener("mousedown", this.openFileByClick.bind(this));
  }

  public get getElement(): HTMLElement {
    return this.element;
  }

  /** フォーカスのあるタブの一個前のタブ */
  public get getPreviousTab(): HTMLElement | null {
    return this.previous;
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
      this.listItems.push(li);
    }
    Util.clearFocus(this.listItems);

    this.listItems.forEach((tab) => {
      if (tab.title === target.title) {
        Util.addClass(tab, "focus-item");
      }
      this.element.appendChild(tab);
    });
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

  /**
   * 前のタブにフォーカスを移す, ただし、最初のタブの場合は後ろにフォーカスを当てる
   *
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

    if (this.previous) {
      Util.addClass(this.previous, "focus-item");
      const path: string = this.previous.title;
      Editor.updateValue(path);
    } else {
      Editor.init();
    }
    return;
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

    Util.clearFocus(this.listItems);
    Util.addClass(target.element, "focus-item");
    Editor.updateValue(target.title);
  }
}

export default new Tab();