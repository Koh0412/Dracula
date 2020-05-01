import { BaseEditor } from "./base/baseEditor";

import FileIO from "../../api/fileIO";
import aceConf from "../../../../aceconfig.json";

import { EditorMessage, StatusMessage } from "../../../common/constants/messageConstants";
import { IOpenFile } from "../../../common/definition/IOpenFile";
import Events from "../../../common/events";
import Util from "../../../common/util";

/** テキストエリア */
class Textarea extends BaseEditor {
  private noFileMsg: HTMLElement = Util.getElement("no-file-msg");

  constructor() {
    super();
    this.textarea.$blockScrolling = Infinity;
    this.textarea.setOptions(aceConf);
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
    const editorMainArea: HTMLElement = Util.getElement("editor-main");

    Util.addCustomEventListener<CSSStyleDeclaration>("resize", (e) => {
      editorMainArea.style.width = `calc(100% - ${e.detail.width})`;
    });
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
   * エディタのリサイズを行う
   */
  private resize(): void {
    this.textarea.resize();
  }
}

export default new Textarea();