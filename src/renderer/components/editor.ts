import { ipcRenderer as renderer } from "electron";

import * as ace from "brace";
import "../config/lang";
import "../config/snippets";
import "brace/theme/dracula";
import "brace/ext/language_tools";

import Status from "./status";

import { IPCKeys } from "../../common/constants/Keys";
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
    renderer.on(IPCKeys.open.value, (_, openFile: IOpenFile) => this.addOpenFileValue(openFile));

    renderer.on(IPCKeys.save.request, (event) => {
      // Main側にeditorのtextを送る
      event.sender.send(IPCKeys.save.value, this.getText);
    });
  }

  /** エディタ内のtextを取得 */
  public get getText(): string {
    return this.textarea.getValue();
  }

  /** 現在のカーソルの位置を取得 */
  public get getCursorPosition(): ace.Position {
    const row = this.textarea.getCursorPosition().row + 1;
    const column = this.textarea.getCursorPosition().column + 1;
    return { row, column };
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