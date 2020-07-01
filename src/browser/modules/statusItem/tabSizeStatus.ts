import { IStatus } from "../../../common/definition";
import EditSession from "components/editor/editSession";
import { StatusMessage } from "../../../common/constants";

/** タブサイズの選択に関するステータスクラス */
export class TabSizeStatus implements IStatus {
  public statusElement: HTMLSelectElement;
  private tabSizes: string[] = EditSession.availableTabSize;

  constructor() {
    this.statusElement = this.create();

    this.statusElement.addEventListener("change", () => {
      EditSession.setTabsize(Number(this.statusElement.value));
    });

    this.statusElement.value = EditSession.tabSize.toLocaleString();
    this.statusElement.title =  StatusMessage.TABSIZE_TITLE;
  }

  public create(): HTMLSelectElement {
    const select = document.createElement("select");
    select.addClass("status-item-select");

    for (const tabSize of this.tabSizes) {
      const option = document.createElement("option");
      option.value = option.textContent = tabSize;
      select.appendChild(option);
    }

    return select;
  }
}