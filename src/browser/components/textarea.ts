import { BaseEditor } from "base/baseEditor";

import { fileIO } from "api/file/fileIO";
import { editor } from "api/editor/provider/editorProvider";
import aceConf from "../../../aceconfig.json";

import { EditorMessage, StatusMessage, EventName, TEXTAREA_DEFAULT_HEIGHT } from "../../common/constants";
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
    this.textarea.renderer.lineHeight = TEXTAREA_DEFAULT_HEIGHT;

    this.textarea.on("change", () => {
      if (this.isFocus) {
        const file = fileIO.openedFile;
        if (file) {
          file.text = this.value;
        }
        eventEmitter.emit(EventName.TEXT_CHANGE, this.isDirty);
      }
    });
    editor.search.icon.addEventListener("mousedown", editor.search.showFindBox.bind(this));

    eventEmitter.on(EventName.FILE_CLICK, (clickFile: IOpenFile) => this.updateValue(clickFile.path));
    eventEmitter.on(EventName.OPEN, (path: string) => {
      if (!path) {
        return;
      }
      this.updateValue(path);
    });

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
  private get isDirty(): boolean {
    return this.value !== fileIO.currentText;
  }

   /** 初期化処理 */
  private init(): void {
    fileIO.setPath("");
    this.setValue("");
    this.noFileMsg.innerHTML = EditorMessage.NO_FILE;
    eventEmitter.emit(EventName.UPDATE, StatusMessage.UNTITLED);

    this.textarea.container.hidden = true;
    this.noFileMsg.removeClass("hide");

    editor.resize();
  }

  /**
   * `path`のファイルのデータをを使用して更新処理を行う
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
    editor.resize();
  }
}

export default new Textarea();