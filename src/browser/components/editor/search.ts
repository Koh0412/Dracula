import { BaseEditor } from "./base/baseEditor";

/** 検索ボックス */
class Search extends BaseEditor {
  private search: HTMLElement = document.getElement("search-word");

  constructor() {
    super();
    this.search.addEventListener("mousedown", this.showSearchBox.bind(this));
  }

  /** 検索ボックス */
  public showSearchBox(): void {
    this.textarea.execCommand("find");
  }
}

export default new Search();