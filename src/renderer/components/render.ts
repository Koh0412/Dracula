import * as fs from "fs-extra";
import { ipcRenderer as renderer } from "electron";

import Editor from "./editor";

import Util from "../../common/Util";
import { IPCKeys } from "../../common/constants/Keys";
import { IOpenFile } from "../../common/definition/IOpenFile";
import { IOpenDirectory } from "../../common/definition/IOpenDirectory";

class Render {
  private footer: HTMLElement = Util.getElement("footer");
  private dirMenuItem: HTMLElement = Util.getElement("dir-menu-item");

  /** 一度でもディレクトリを開いたかどうか */
  private notOpenDir: boolean = true;

  constructor() {
    renderer.on(IPCKeys.save.path, (_, filePath: string) => this.addMessageToFooter(filePath));
    renderer.on(IPCKeys.open.value, (_, openFile: IOpenFile) => this.insertOpenFileData(openFile));

    renderer.on(IPCKeys.open.dir, (_, openDirectories: IOpenDirectory[]) => {
      // 一度もフォルダを開いていなければ非表示に
      if (this.notOpenDir) {
        const msg: HTMLElement = Util.getElement("missing-message");
        msg.style.display = "none";
      }

      // 初期化
      this.dirMenuItem.innerHTML = "";

      const listItem = this.DirectoryList(openDirectories);
      // listItemをセット
      listItem.forEach((item) => {
        this.dirMenuItem.innerHTML += item.outerHTML;
      });

      this.dirMenuItem.addEventListener("click", this.openFileByClick.bind(this));

      this.notOpenDir = false;
    });
  }

  /**
   * 取得したファイルとディレクトリをlistItemにmapして配列として返す
   *
   * @param openDirectories
   */
  private DirectoryList(openDirectories: IOpenDirectory[]): HTMLElement[] {
    return openDirectories.map((opendir) => {
      const listItem = document.createElement("li");

      listItem.innerHTML = opendir.filename;
      listItem.title = opendir.fullPath;
      listItem.setAttribute("data-isDirectory", String(opendir.isDirectory));

      return listItem;
    });
  }

  /**
   * ファイルのデータをフッターとエディター内に流し込む
   *
   * @param openFile
   */
  private insertOpenFileData(openFile: IOpenFile): void {
    Editor.setText(openFile.text);
    this.footer.innerHTML = openFile.path;

    Editor.textarea.gotoLine(1);
  }

  /**
   * 取得したfilePathをフッターに入れる
   *
   * @param filePath
   */
  private addMessageToFooter(filePath: string): void {
    this.footer.innerHTML = "the file has been saved";

    setTimeout(() => {
      this.footer.innerHTML = filePath;
    }, 1500);
  }

  /**
   * 要素をクリックしてファイルを開く
   *
   * @param ev
   */
  private openFileByClick(ev: MouseEvent): void {
    const el: HTMLElement = ev.target as HTMLElement;
    const isDirectory = el.getAttribute("data-isDirectory");

    Util.addClassChildItem(this.dirMenuItem, el, "focus-item");

    if (isDirectory === "false") {
      const text = fs.readFileSync(el.title, { encoding: "utf8" });
      this.insertOpenFileData({text, path: el.title});

      renderer.send(IPCKeys.open.byClick, el.title);
    }
  }
}

export default new Render();