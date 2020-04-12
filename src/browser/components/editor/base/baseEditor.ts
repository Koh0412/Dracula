import * as fs from "fs-extra";
import * as pathModule from "path";

import * as ace from "brace";
import "../../../config/editorconfig";

import Tab from "../../tab";
import FileIO from "../../../api/fileIO";

import Util from "../../../../common/util";
import Events from "../../../../common/events";
import { EditorMessage, StatusMessage } from "../../../../common/constants/messageConstants";
import { aceDefault } from "../../../../common/constants/editorConstants";
import { IAceConf } from "../../../../common/definition/IAceConf";

/** エディタエリア */
export class BaseEditor {
  protected textarea: ace.Editor = ace.edit("textarea");
  private noFileMsg: HTMLElement = Util.getElement("no-file-msg");

  private aceConf: IAceConf = {
    theme: aceDefault.THEME,
    mode: aceDefault.MODE,
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
  }

  /** テキストエリアがhiddenかどうか */
  protected get hidden(): boolean {
    return this.textarea.container.hidden;
  }

  /** エディタ内のvalueを取得 */
  private get value(): string {
    return this.textarea.getValue();
  }

   /** 初期化処理 */
  public init(): void {
    FileIO.setPath("");
    this.setValue("");
    this.noFileMsg.innerHTML = EditorMessage.NO_FILE;
    Events.fileEvent("update", StatusMessage.UNTITLED);

    this.textarea.container.hidden = true;
    Util.removeClass(this.noFileMsg, "hide");

    this.resize();
  }

  /**
   * `path`からタブを生成し、エディタとステータスに`path`のデータを流し込み
   * @param path
   */
  public openfile(path: string): void {
    const name = pathModule.basename(path);
    Tab.create(name, path);
    this.updateValue(path);
  }

  /** エディタ内のvalueのセーブ */
  public save(): void {
    if (!this.hidden) {
      FileIO.save(this.value);
    }
  }

  /** 名前を付けて保存 */
  public saveAs(): void {
    if (!this.hidden) {
      FileIO.saveAs(this.value);
    }
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
    Events.fileEvent("update", path);
    this.setValue(fileText);

    this.textarea.gotoLine(1);
    this.resize();
  }

  /**
   * エディタにvalueをセット
   * @param value
   */
  private setValue(value: string): string {
    return this.textarea.setValue(value);
  }

  /**
   * エディタのリサイズを行う
   */
  private resize(): void {
    this.textarea.resize();
  }
}

export default new BaseEditor();