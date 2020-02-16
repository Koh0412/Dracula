import * as ace from "brace";
import "brace/theme/dracula";

import Util from "../../common/Util";
import { IPCKeys } from "../../common/constants/Keys";
import { IOpenFile } from "../../common/definition/IOpenFile";
import DrEvent from "../../common/DrEvent";

import "../config/lang";

class Render {
  private footer: HTMLElement = Util.getElement("footer");
  private dirMenu: HTMLElement = Util.getElement("dir-menu");
  private missingMessage: HTMLElement = Util.getElement("missing-message");

  private editor: ace.Editor = ace.edit("input");

  /** 一度でもディレクトリを開いたかどうか */
  private notOpenDir: boolean = true;

  constructor() {
    this.editorSetConfig(this.editor);

    this.init();
  }

  public init(): void {
    DrEvent.ipcResposnse(IPCKeys.save.request, (event, _) => {
      // Main側にeditorのvalueを送る
      event.sender.send(IPCKeys.save.value, this.editor.getValue());
    });

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
   * editorの設定
   *
   * @param editor
   */
  private editorSetConfig(editor: ace.Editor): ace.Editor {
    editor.setTheme("ace/theme/dracula");
    editor.session.setMode("ace/mode/typescript");

    editor.setOption("indentedSoftWrap", false);

    editor.setShowPrintMargin(false);
    editor.session.setTabSize(2);
    editor.session.setUseWrapMode(true);

    return editor;
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
    this.editor.setValue(openFile.text);
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

export { Render };