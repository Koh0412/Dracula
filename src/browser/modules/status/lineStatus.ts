import { IStatus } from "../../../common/definition";
import Util from "../../../common/util";
import { StatusMessage } from "../../../common/constants";
import Cursor from "components/editor/cursor";

/** 行数, 列に関するステータスクラス */
export class LineStatus implements IStatus {

  public mainElement: HTMLElement;
  public textContent: string = StatusMessage.INIT_POSITION;

  constructor() {
    this.mainElement = this.create();

    Cursor.change(() => {
      this.mainElement.innerHTML = `Ln ${Cursor.row}, Col ${Cursor.column}`;
    });
  }

  public create(): HTMLElement {
    const el = Util.createListItemElement("li", { text: this.textContent });
    el.addClass("status-item-list");
    return el;
  }
}