import * as fs from "fs-extra";
import { ipcRenderer as renderer } from "electron";

import Editor from "./editor";

import Util from "../../common/Util";
import { IPCConstants } from "../../common/constants/systemConstants";
import { ITargetInfo } from "../../common/definition/ITargetInfo";

class Tab {
  public element: HTMLElement = Util.getElement("tab");
  private index: number | null = null;
  private listItems: HTMLElement[] = [];

  constructor() {
    this.element.addEventListener("mousedown", this.openFileByClick.bind(this));
  }

  /**
   * - タブのフォーカスを全てクリア
   * - それ以降にさらに処理を入れる場合は`callback`に
   *
   * @param callback
   */
  public clearFocus(callback?: (tab: HTMLElement) => void) {
    this.listItems.forEach((tab) => {
      Util.removeClass(tab, "focus-item");
      if (callback) {
        callback(tab);
      }
    });
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

    this.clearFocus((tab) => {
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
  private focusTab(target: ITargetInfo): HTMLElement | undefined {
    this.index = this.listItems.indexOf(target.element);
    if (this.index > 0) {
      this.index--;
    } else {
      this.index++;
    }
    const previous: HTMLElement | undefined = this.listItems[this.index];

    if (previous) {
      Util.addClass(previous, "focus-item");

      const path: string = previous.title;
      this.updateEditorValue(path);
      return previous;
    } else {
      Editor.init();
      renderer.send(IPCConstants.OPEN_BYCLICK, "");
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

    this.clearFocus();
    Util.addClass(target.element, "focus-item");
    const path: string = target.title;
    this.updateEditorValue(path);
  }

  /**
   * エディタの更新
   *
   * @param path
   */
  private updateEditorValue(path: string): void {
    const text: string = fs.readFileSync(path, { encoding: "utf8" });

    Editor.addOpenFileValue({text, path});
    renderer.send(IPCConstants.OPEN_BYCLICK, path);
  }
}

export default new Tab();