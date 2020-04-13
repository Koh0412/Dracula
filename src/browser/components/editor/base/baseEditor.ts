import * as ace from "brace";
import FileIO from "../../../api/fileIO";
import "../../../config/editorconfig";

import Util from "../../../../common/util";
import Events from "../../../../common/events";
import { EditorMessage, StatusMessage } from "../../../../common/constants/messageConstants";
import { aceDefault } from "../../../../common/constants/editorConstants";
import { IAceConf } from "../../../../common/definition/IAceConf";
import { IOpenFile } from "../../../../common/definition/IOpenFile";

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

    Util.addCustomEventListener<IOpenFile>("fileClick", (e) => {
      this.updateValue(e.detail.path);
    });

    Util.addCustomEventListener<HTMLElement>("tab", (e) => {
      if (e.detail) {
        this.updateValue(e.detail.title);
      } else {
        this.init();
      }
    });
  }

  /** テキストエリアがhiddenかどうか */
  protected get hidden(): boolean {
    return this.textarea.container.hidden;
  }

  /** エディタ内のvalueを取得 */
  private get value(): string {
    return this.textarea.getValue();
  }

  /**
   * `path`からタブを生成し、エディタとステータスに`path`のデータを流し込み
   * @param path
   */
  public openfile(path: string): void {
    Events.fileEvent("open", path);
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

   /** 初期化処理 */
  private init(): void {
    FileIO.setPath("");
    this.setValue("");
    this.noFileMsg.innerHTML = EditorMessage.NO_FILE;
    Events.fileEvent("update", StatusMessage.UNTITLED);

    this.textarea.container.hidden = true;
    Util.removeClass(this.noFileMsg, "hide");

    this.resize();
  }

  /**
   * `path`のファイルのデータをStatusのpathとエディター内に流し込む
   *
   * @param path
   */
  private updateValue(path: string): void {
    this.textarea.container.hidden = false;
    Util.addClass(this.noFileMsg, "hide");

    const openFile = FileIO.open(path);
    this.setValue(openFile.text);

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