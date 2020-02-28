import * as fs from "fs";
import { ipcRenderer } from "electron";

import Editor from "./editor";

import Util from "../../common/Util";
import DrEvent from "../../common/DrEvent";
import { IPCKeys } from "../../common/constants/Keys";
import { IOpenFile } from "../../common/definition/IOpenFile";
import { IOpenDirectory } from "../../common/definition/IOpenDirectory";


class Render {
  private footer: HTMLElement = Util.getElement("footer");
  private dirMenuItem: HTMLElement = Util.getElement("dir-menu-item");

  /** 一度でもディレクトリを開いたかどうか */
  private notOpenDir: boolean = true;

  constructor() {
    DrEvent.renderResponse<string>(IPCKeys.save.path, (_, filePath) => {
      this.addMessageToFooter(filePath);
    });

    DrEvent.renderResponse<IOpenFile>(IPCKeys.open.value, (_, openFile) => {
      this.insertOpenFileData(openFile);
    });

    DrEvent.renderResponse<IOpenDirectory[]>(IPCKeys.open.dir, (_, openDirectories) => {
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

    if (isDirectory === "false") {
      const text = fs.readFileSync(el.title, { encoding: "utf8" });
      this.insertOpenFileData({text, path: el.title});

      ipcRenderer.send(IPCKeys.save.byClick, el.title);
    }
  }
}

export default new Render();