import { BaseEditor } from "../../base/baseEditor";

import FileIO from "../../api/fileIO";
import aceConf from "../../../../aceconfig.json";

import { EditorMessage, StatusMessage, EventName } from "../../../common/constants";
import { IOpenFile } from "../../../common/definition/IOpenFile";
import Util, { eventEmitter } from "../../../common/util";

/** テキストエリア */
class Textarea extends BaseEditor {
  private noFileMsg: HTMLElement = document.getElement("no-file-msg");

  constructor() {
    super();
    this.textarea.$blockScrolling = Infinity;
    this.textarea.setOptions(aceConf);
    this.init();

    this.textarea.on("change", () => {
      if (this.isFocus) {
        const file = FileIO.openedFile;
        if (file) {
          file.text = this.value;
        }
        eventEmitter.emit(EventName.TEXT_CHANGE, this.isDirty);
      }
    });

    eventEmitter.on(EventName.FILE_CLICK, (openFile: IOpenFile) => this.updateValue(openFile.path));

    eventEmitter.on(EventName.TAB, (tab: HTMLElement) => {
      if (tab) {
        this.updateValue(tab.title);
      } else {
        this.init();
      }
    });

    const editorMainArea: HTMLElement = document.getElement("editor-main");
    eventEmitter.on(EventName.RESIZE, (width: number) => editorMainArea.style.width = Util.calc(width));
  }

  /** valueが書き換えられているかどうか */
  private get isDirty() {
    return this.value !== FileIO.currentText;
  }

  /** 行を上へコピー */
  public copyLinesUp() {
    this.textarea.copyLinesUp();
  }

  /** 行を下へコピー */
  public copyLinesDown() {
    this.textarea.copyLinesDown();
  }

  // TODO: 後々作る
  public newFile() {
    //
  }

  /**
   * `path`からタブを生成し、エディタとステータスに`path`のデータを流し込み
   * @param path
   */
  public openfile(path: string): void {
    eventEmitter.emit(EventName.OPEN, path);
    this.updateValue(path);
  }

  /** redoを行う */
  public redo() {
    this.textarea.redo();
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

  /** undoを行う */
  public undo() {
    this.textarea.undo();
  }

   /** 初期化処理 */
  private init(): void {
    FileIO.setPath("");
    this.setValue("");
    this.noFileMsg.innerHTML = EditorMessage.NO_FILE;
    eventEmitter.emit(EventName.UPDATE, StatusMessage.UNTITLED);

    this.textarea.container.hidden = true;
    this.noFileMsg.removeClass("hide");

    this.resize();
  }

  /**
   * `path`のファイルのデータをStatusのpathとエディター内に流し込む
   * @param path
   */
  private updateValue(path: string): void {
    if (!this.noFileMsg.classList.contains("hide")) {
      this.setHidden(false);
    }
    this.noFileMsg.addClass("hide");

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