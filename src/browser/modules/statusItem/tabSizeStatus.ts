import { IStatus } from "../../../common/definition";
import EditSession from "components/editor/editSession";
import { StatusMessage } from "../../../common/constants";

/** タブサイズの選択に関するステータスクラス */
export class TabSizeStatus implements IStatus {
  public mainElement: HTMLSelectElement;
  private tabSizes: string[] = EditSession.availableTabSize;

  constructor() {
    this.mainElement = this.create();

    this.mainElement.addEventListener("change", () => {
      EditSession.setTabsize(Number(this.mainElement.value));
    });

    this.mainElement.value = EditSession.tabSize.toLocaleString();
    this.mainElement.title =  StatusMessage.TABSIZE_TITLE;
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