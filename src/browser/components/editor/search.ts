import { BaseEditor } from "./base/baseEditor";
import Util from "../../../common/util";

class Search extends BaseEditor {
  private search: HTMLElement = Util.getElement("search-word");

  constructor() {
    super();
    if (!this.hidden) {
      this.search.addEventListener("mousedown", this.showSearchBox.bind(this));
    }
  }

  /** 検索ボックス */
  public showSearchBox(): void {
    this.textarea.execCommand("find");
  }
}

export default new Search();