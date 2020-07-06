import { IStatus } from "../../../common/definition";
import { domUtil } from "../../../common/utils";
import { StatusMessage } from "../../../common/constants";
import { cursor } from "api/editor/cursor";

/** 行数, 列に関するステータスクラス */
export class LineStatus implements IStatus {

  public mainElement: HTMLElement;
  public textContent: string = StatusMessage.INIT_POSITION;

  constructor() {
    this.mainElement = this.create();

    cursor.change(() => {
      this.mainElement.innerHTML = `Ln ${cursor.row}, Col ${cursor.column}`;
    });
  }

  public create(): HTMLElement {
    const el = domUtil.createListItemElement("li", { text: this.textContent });
    el.addClass("status-item-list");
    return el;
  }
}