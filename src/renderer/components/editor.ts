import { ipcRenderer as renderer } from "electron";

import * as ace from "brace";
import "../config/lang";
import "../config/snippets";
import "brace/theme/dracula";
import "brace/ext/language_tools";

import Status from "./status";

import { IPCConstants } from "../../common/constants/systemConstants";
import { IAceConf } from "../../common/definition/IAceConf";
import { IOpenFile } from "../../common/definition/IOpenFile";

/** エディタエリア */
class Editor {
  public textarea: ace.Editor = ace.edit("textarea");
  private mode: string = "typescript";

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
    renderer.on(IPCConstants.OPEN_VALUE, (_, openFile: IOpenFile) => this.addOpenFileValue(openFile));

    renderer.on(IPCConstants.SAVE_REQ, (event) => {
      // Main側にeditorのtextを送る
      event.sender.send(IPCConstants.SAVE_VALUE, this.getText);
    });

    this.changeCursor(() => {
      if (Status.lines) {
        Status.lines.innerHTML = `Ln ${this.row}, Col ${this.column}`;
      }
    });
  }

  /** エディタ内のtextを取得 */
  public get getText(): string {
    return this.textarea.getValue();
  }

  /** 現在のカーソルの位置を取得 */
  public get getCursorPosition(): ace.Position {
    const row: number = this.textarea.getCursorPosition().row + 1;
    const column: number = this.textarea.getCursorPosition().column + 1;
    return { row, column };
  }

  public get row(): number {
    return this.getCursorPosition.row;
  }

  public get column(): number {
    return this.getCursorPosition.column;
  }

  /** エディタにtextをセット */
  public setText(text: string): string {
    return this.textarea.setValue(text);
  }

  /**
   * ファイルのデータをStatusのpathとエディター内に流し込む
   *
   * @param openFile
   */
  public addOpenFileValue(openFile: IOpenFile): void {
    this.setText(openFile.text);
    Status.setPath(openFile.path);

    this.textarea.gotoLine(1);
  }

  /**
   * カーソルが動いた時の処理
   *
   * @param callback
   */
  public changeCursor(callback: () => void): void {
    this.textarea.selection.addEventListener("changeCursor", () => {
      callback();
    });
  }
}

export default new Editor();