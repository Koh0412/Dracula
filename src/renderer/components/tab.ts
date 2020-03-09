import * as fs from "fs-extra";
import { ipcRenderer as renderer } from "electron";

import Editor from "./editor";

import Util from "../../common/Util";
import { IPCKeys } from "../../common/constants/Keys";


// TODO: tab数が増えた時にどうするか
// TODO: focus系はどうするか
class Tab {
  private element: HTMLElement = Util.getElement("tab");
  // private list: HTMLElement[] = [];

  constructor() {
    this.element.addEventListener("click", this.openFileByClick.bind(this));
  }

  public create(textContent: string, path: string) {
    const li = Util.createListItemElement({
      text: textContent,
      title: path,
    });

    this.element.appendChild(li);
    // this.list.push(li);
  }

  private openFileByClick(ev: MouseEvent) {
    const target: HTMLElement = ev.target as HTMLElement;
    const path: string = target.title;

    const text = fs.readFileSync(path, { encoding: "utf8" });
    Editor.addOpenFileValue({text, path});

    renderer.send(IPCKeys.open.byClick, path);
  }
}

export default new Tab();