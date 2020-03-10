import * as fs from "fs-extra";
import { ipcRenderer as renderer } from "electron";

import Editor from "./editor";

import Util from "../../common/Util";
import { IPCConstants } from "../../common/constants/Keys";

// TODO: tab数が増えた時にどうするか
// TODO: focus系はどうするか
class Tab {
  private element: HTMLElement = Util.getElement("tab");
  private list: HTMLElement[] = [];

  constructor() {
    this.element.addEventListener("click", this.openFileByClick.bind(this));
  }

  /**
   * タブの生成
   *
   * @param textContent
   * @param path
   */
  public create(textContent: string, path: string): void {
    const li: HTMLLIElement = Util.createListItemElement({
      text: textContent,
      title: path,
    });

    const isDuplicated: boolean = this.checkElementTitle(this.list, li);
    if (!isDuplicated) {
      this.list.push(li);
    }

    this.list.forEach((tab) => {
      this.element.appendChild(tab);
    });
  }

  /**
   * タブをクリックしてファイルを開く
   *
   * @param ev
   */
  private openFileByClick(ev: MouseEvent): void {
    const target: HTMLElement = ev.target as HTMLElement;
    const path: string = target.title;

    const text: string = fs.readFileSync(path, { encoding: "utf8" });
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