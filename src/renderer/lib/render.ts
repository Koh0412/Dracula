import Util from "../../common/Util";
import { IPCKeys } from "../../common/constants/Keys";
import { IOpenFile } from "../../common/definition/IOpenFile";
import DrEvent from "../../common/DrEvent";
import Editor from "./editor";

class Render {
  private footer: HTMLElement = Util.getElement("footer");
  private dirMenu: HTMLElement = Util.getElement("dir-menu");

  /** 一度でもディレクトリを開いたかどうか */
  private notOpenDir: boolean = true;

  constructor() {
    DrEvent.ipcResposnse<string>(IPCKeys.save.path, (_, filePath) => {
      this.RenderFooter(filePath);
    });

    DrEvent.ipcResposnse<IOpenFile>(IPCKeys.open.value, (_, openFile) => {
      this.insertOpenFileData(openFile);
    });

    // TODO: argsにfileOrDirNameとfullpathが必要
    DrEvent.ipcResposnse<string[]>(IPCKeys.open.dir, (_, fileOrDirNames) => {
      if (this.notOpenDir) {
        const msg: HTMLElement = Util.getElement("missing-message");
        msg.style.display = "none";
      }

      this.dirMenu.innerHTML = "";

      const listItem = this.DirectoryList(fileOrDirNames);
      listItem.forEach((item) => {
        this.dirMenu.innerHTML += item.outerHTML;
      });

      // 各リストアイテムのにfullpathを入れて、
      // el.titleをfsに使う
      // this.dirMenu.addEventListener("click", (e) => {
      //   const el: HTMLElement = e.target as HTMLElement;
      // });

      this.notOpenDir = false;
    });
  }

  /**
   * 取得したファイルとディレクトリの配列
   *
   * @param fileOrDirNames
   */
  private DirectoryList(fileOrDirNames: string[]): HTMLElement[] {
    return fileOrDirNames.map((name) => {
      const listItem = document.createElement("li");

      listItem.innerHTML = name;
      // 仮データ TODO: fullpathを入れるようにする
      listItem.title = name;

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
  }

  /**
   * 取得したfilePathをフッターに入れる
   *
   * @param filePath
   */
  private RenderFooter(filePath: string): void {
    this.footer.innerHTML = "the file has been saved";

    setTimeout(() => {
      this.footer.innerHTML = filePath;
    }, 1500);
  }
}

export default new Render();