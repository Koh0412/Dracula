import pathModule from "path";

import FileIO from "api/fileIO";
import CallDialog from "process/callDialog";

import Util from "../../common/util";
import { ITargetInfo } from "../../common/definition/ITargetInfo";
import { IOpenFile } from "../../common/definition/IOpenFile";
import Events from "../../common/events";
import { IFileEvent } from "../../common/definition/event/IFileEvent";
import { MessageType, Buttons } from "../../common/constants/systemConstants";
import { DialogMessage } from "../../common/constants/messageConstants";

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
      const filePath = e.detail.filePath;
      if (filePath) {
        const name = pathModule.basename(filePath);
        this.create(name, filePath);
      }
    });

    Util.addCustomEventListener<IFileEvent>("save", () => {
      if (this.current) {
        this.current.removeClass("editor-dirty");
      }
    });

    Util.addCustomEventListener<boolean>("textChange", (e) => {
      const isDirty: boolean = e.detail;
      if (this.current) {
        if (isDirty) {
          this.current.addClass("editor-dirty");
        } else {
          this.current.removeClass("editor-dirty");
        }
      }
    });
  }

  private get current() {
    return this.listItems.find((tab) => {
      return tab.classList.contains("focus-item");
    });
  }

  private get element(): HTMLElement {
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
    this.index = this.listItems.indexOf(li);
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
   * - ファイルに変更があった場合どうするかのダイアログを出す
   * - responseには返り値としてボタンのインデックスを返す
   */
  private confirmRemove(): void {
    CallDialog.warning({
      detail: DialogMessage.warn.CATION,
      type: MessageType.WARN,
      buttons: Buttons.FILE,
      message: DialogMessage.warn.MODIFY,
    }, (res) => console.log(res));
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
    this.index = this.listItems.indexOf(target.element);

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
      if (target.element.classList.contains("editor-dirty")) {
        this.confirmRemove();
        return;
      }
      FileIO.removeOpenFile(target.title);
      this.remove(target);
      return;
    }

    Util.clearFocus(this.listItems);
    this.index = this.listItems.indexOf(target.element);
    target.element.addClass("focus-item");
    Events.tabEvent("tab", target.element);
  }
}

export default new Tab();