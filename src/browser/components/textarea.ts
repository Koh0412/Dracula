import { BaseEditor } from "base/baseEditor";

import { fileIO } from "api/file/fileIO";
import { search } from "api/editor/search";
import aceConf from "../../../aceconfig.json";

import { EditorMessage, StatusMessage, EventName } from "../../common/constants";
import { IOpenFile } from "../../common/definition/IOpenFile";
import { eventEmitter, cssUtil } from "../../common/utils";

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
        const file = fileIO.openedFile;
        if (file) {
          file.text = this.value;
        }
        eventEmitter.emit(EventName.TEXT_CHANGE, this.isDirty);
      }
    });
    search.icon.addEventListener("mousedown", search.showFindBox.bind(this));

    eventEmitter.on(EventName.FILE_CLICK, (openFile: IOpenFile) => this.updateValue(openFile.path));

    eventEmitter.on(EventName.TAB, (tab: HTMLElement) => {
      if (tab) {
        this.updateValue(tab.title);
      } else {
        this.init();
      }
    });

    const editorMainArea: HTMLElement = document.getElement("editor-main");
    eventEmitter.on(EventName.RESIZE, (width: number) => editorMainArea.style.width = cssUtil.calc(width));
  }

  /** valueが書き換えられているかどうか */
  private get isDirty() {
    return this.value !== fileIO.currentText;
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
    if (!path) {
      return;
    }
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
      fileIO.save(this.value);
    }
  }

  /** 名前を付けて保存 */
  public saveAs(): void {
    if (!this.hidden) {
      fileIO.saveAs(this.value);
    }
  }

  /** undoを行う */
  public undo() {
    this.textarea.undo();
  }

   /** 初期化処理 */
  private init(): void {
    fileIO.setPath("");
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

    const openFile = fileIO.open(path);
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