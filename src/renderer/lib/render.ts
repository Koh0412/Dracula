import Util from "../../common/Util";
import { IPCKeys } from "../../common/constants/Keys";
import { IOpenFile } from "../../common/definition/IOpenFile";
import DrEvent from "../../common/DrEvent";
import Editor from "./editor";

class Render {
  private footer: HTMLElement = Util.getElement("footer");
  private dirMenu: HTMLElement = Util.getElement("dir-menu");
  private missingMessage: HTMLElement = Util.getElement("missing-message");

  /** 一度でもディレクトリを開いたかどうか */
  private notOpenDir: boolean = true;

  constructor() {
    this.init();
  }

  public init(): void {
    DrEvent.ipcResposnse<string>(IPCKeys.save.path, (_, filePath) => {
      this.RenderFooter(filePath);
    });

    DrEvent.ipcResposnse<IOpenFile>(IPCKeys.open.value, (_, openFile) => {
      this.insertOpenFileData(openFile);
    });

    DrEvent.ipcResposnse<string[]>(IPCKeys.open.dir, (_, fileOrDirNames) => {
      this.orderDirectoryList(fileOrDirNames);
    });
  }

  /**
   * 取得したファイルとディレクトリを並べる
   *
   * @param fileOrDirNames
   */
  private orderDirectoryList(fileOrDirNames: string[]): void {
    if (this.notOpenDir) {
      this.missingMessage.style.display = "none";
    }

    this.dirMenu.innerHTML = "";

    fileOrDirNames.forEach((item) => {
      this.dirMenu.innerHTML += "<li>" + item + "</li>";
    });

    this.notOpenDir = false;
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
  private RenderFooter(filePath: string) {
    this.footer.innerHTML = "the file has been saved";

    setTimeout(() => {
      this.footer.innerHTML = filePath;
    }, 1500);
  }
}

export default new Render();