import { IStatus } from "../../../common/definition";
import { domUtil } from "../../../common/utils";
import { StatusMessage } from "../../../common/constants";
import { editor } from "api/editor/provider/editorProvider";

/** 行数, 列に関するステータスクラス */
export class LineStatus implements IStatus {

  public mainElement: HTMLElement;
  public textContent: string = StatusMessage.INIT_POSITION;

  constructor() {
    this.mainElement = this.create();

    editor.cursor.change(() => {
      this.mainElement.innerHTML = `Ln ${editor.cursor.row}, Col ${editor.cursor.column}`;
    });
  }

  public create(): HTMLElement {
    const el = domUtil.createListItemElement("li", { text: this.textContent });
    el.addClass("status-item-list");
    return el;
  }
}