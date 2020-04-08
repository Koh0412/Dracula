import * as fs from "fs-extra";
import * as pathModule from "path";

import * as ace from "brace";
import "../config/lang";
import "../config/snippets";
import "brace/theme/dracula";
import "brace/ext/language_tools";
import "brace/ext/searchbox";

import Status from "./status";
import Tab from "./tab";
import FileIO from "../api/fileIO";
import CallDialog from "../api/callDialog";

import Util from "../../common/util";
import { StatusMessage, EditorMessage } from "../../common/constants/messageConstants";
import { IAceConf } from "../../common/definition/IAceConf";

/** エディタエリア */
class Editor {
  private textarea: ace.Editor = ace.edit("textarea");
  private noFileMsg: HTMLElement = Util.getElement("no-file-msg");
  private search: HTMLElement = Util.getElement("search-word");

  private mode: string = "typescript";
  private filePath: string = "";

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
    this.init();

    this.search.addEventListener("mousedown", this.showSearchBox.bind(this));

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
    const cursorPosition = this.textarea.getCursorPosition();
    const row = cursorPosition.row + 1;
    const column = cursorPosition.column + 1;

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
    FileIO.setPath("");
    Status.setPath(StatusMessage.UNTITLED);
    this.setValue("");
    this.noFileMsg.innerHTML = EditorMessage.NO_FILE;

    this.textarea.container.hidden = true;
    Util.removeClass(this.noFileMsg, "hide");

    this.resize();
  }

  /** `path`からタブを生成し、エディタとステータスに`path`のデータを流し込み */
  public openfile(path: string): void {
    const name = pathModule.basename(path);
    const stats = fs.statSync(path);
    const icon = Util.createMenuIcon(stats.isDirectory());

    Tab.create(icon.outerHTML + name, path);
    this.updateValue(path);
  }

  /** エディタ内のvalueのセーブ */
  public save(): void {
    this.filePath = FileIO.filePath;

    if (FileIO.isEmptyPath) {
      CallDialog.save((path) => this.filePath = path);
    } else {
      Status.addSaveMessage(this.filePath);
    }

    FileIO.save(this.value, this.filePath);
  }

  /** 検索ボックス */
  public showSearchBox(): void {
    this.textarea.execCommand("find");
  }

  /**
   * `path`のファイルのデータをStatusのpathとエディター内に流し込む
   *
   * @param path
   */
  public updateValue(path: string): void {
    FileIO.setPath(path);
    this.textarea.container.hidden = false;
    Util.addClass(this.noFileMsg, "hide");

    const fileText = fs.readFileSync(path, { encoding: "utf8" });
    Status.setPath(path);
    this.setValue(fileText);

    this.textarea.gotoLine(1);
    this.resize();
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

  /**
   * エディタのリサイズを行う
   */
  private resize(): void {
    this.textarea.resize();
  }
}

export default new Editor();