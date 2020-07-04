import { BaseEditor } from "base/baseEditor";

/** 検索ボックス */
class Search extends BaseEditor {
  private search: HTMLElement = document.getElement("search-word");

  constructor() {
    super();
    this.search.addEventListener("mousedown", this.showFindBox.bind(this));
  }

  /** 検索ボックス */
  public showFindBox(): void {
    this.textarea.execCommand("find");
  }

  /** 置換ボックス */
  public showReplaceBox(): void {
    this.textarea.execCommand("replace");
  }
}

export default new Search();