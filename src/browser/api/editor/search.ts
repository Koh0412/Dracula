import { BaseEditor } from "base/baseEditor";

/** エディタに付随する検索に関するクラス */
export class Search extends BaseEditor {
  public icon: HTMLElement = document.getElement("search-word");

  /** 検索ボックス */
  public showFindBox(): void {
    this.textarea.execCommand("find");
  }

  /** 置換ボックス */
  public showReplaceBox(): void {
    this.textarea.execCommand("replace");
  }
}