import { ipcRenderer as renderer } from "electron";
import * as fs from "fs-extra";
import * as pathModule from "path";

import * as ace from "brace";
import "../config/lang";
import "../config/snippets";
import "brace/theme/dracula";
import "brace/ext/language_tools";

import Status from "./status";
import Tab from "./tab";
import FileIO from "../api/fileIO";

import Util from "../../common/util";
import { IPCConstants, StatusMessage } from "../../common/constants/systemConstants";
import { IAceConf } from "../../common/definition/IAceConf";
import { ShortCut } from "../lib/shortCut";

/** エディタエリア */
class Editor {
  private textarea: ace.Editor = ace.edit("textarea");
  private mode: string = "typescript";
  private shortCut = new ShortCut();

  private aceConf: IAceConf = {
    theme: "ace/theme/dracula",
    mode: `ace/mode/${this.mode}`,
    showPrintMargin: false,
    tabSize: 2,
    wrap: true,
    indentedSoftWrap: false,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true
  };

  constructor() {
    this.textarea.$blockScrolling = Infinity;
    this.textarea.setOptions(this.aceConf);
    this.textarea.resize();

    renderer.on(IPCConstants.OPEN_PATH, (_, path: string) => {
      const name = pathModule.basename(path);
      const stats = fs.statSync(path);
      const icon = Util.createMenuIcon(stats.isDirectory());

      Tab.create(icon.outerHTML + name, path);
      this.updateValue(path);
    });
    renderer.on(IPCConstants.SAVE_PATH, (_, path: string) => FileIO.save(this.value, path));

    this.shortCut.keyBind(this.shortCut.ctrlOrCmd("s"), () => {
      if (FileIO.isEmptyPath) {
        renderer.send(IPCConstants.SAVE_DIALOG);
      } else {
        FileIO.save(this.value, FileIO.filePath);
        Status.addSaveMessage(FileIO.filePath);
      }
    });

    this.changeCursor(() => {
      if (Status.lines) {
        Status.lines.innerHTML = `Ln ${this.row}, Col ${this.column}`;
      }
    });
  }

  /** エディタ内のvalueを取得 */
  private get value(): string {
    return this.textarea.getValue();
  }

  /** 現在のカーソルの位置を取得 */
  private get cursorPosition(): ace.Position {
    const row: number = this.textarea.getCursorPosition().row + 1;
    const column: number = this.textarea.getCursorPosition().column + 1;
    return { row, column };
  }

  /** カーソルの行 */
  private get row(): number {
    return this.cursorPosition.row;
  }

  /** カーソルの列 */
  private get column(): number {
    return this.cursorPosition.column;
  }

   /** 初期化処理 */
  public init(): void {
    this.updateValue("");
  }

  /**
   * `path`のファイルのデータをStatusのpathとエディター内に流し込む
   *
   * @param openFile
   */
  public updateValue(path: string): void {
    let fileText: string = "";
    FileIO.setPath(path);

    if (path) {
      fileText = fs.readFileSync(path, { encoding: "utf8" });
      Status.setPath(path);
    } else {
      Status.setPath(StatusMessage.UNTITLED);
    }
    this.setValue(fileText);

    this.textarea.gotoLine(1);
    renderer.send(IPCConstants.OPEN_BYCLICK, path);
  }

  /** エディタにvalueをセット */
  private setValue(value: string): string {
    return this.textarea.setValue(value);
  }

  /**
   * カーソルが動いた時の処理
   *
   * @param callback
   */
  private changeCursor(callback: () => void): void {
    this.textarea.selection.addEventListener("changeCursor", () => {
      callback();
    });
  }
}

export default new Editor();