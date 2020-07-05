import { IStatus } from "../../../common/definition";
import { editorSession } from "api/editor/editSession";
import { StatusMessage } from "../../../common/constants";

/** タブサイズの選択に関するステータスクラス */
export class TabSizeStatus implements IStatus {
  public mainElement: HTMLSelectElement;
  private tabSizes: string[] = editorSession.availableTabSize;

  constructor() {
    this.mainElement = this.create();

    this.mainElement.addEventListener("change", () => {
      editorSession.setTabsize(Number(this.mainElement.value));
    });

    this.mainElement.value = editorSession.tabSize.toLocaleString();
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