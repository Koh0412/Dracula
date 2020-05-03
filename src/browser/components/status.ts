import pathModule from "path";

import Cursor from "./editor/cursor";
import EditSession from "../components/editor/editSession";
import FileExtension from "../api/fileExtension";

import { IFileEvent } from "../../common/definition/event/IFileEvent";
import Util from "../../common/util";
import { StatusMessage } from "../../common/constants/messageConstants";

/** ステータスバー */
class Status {
  private path: HTMLElement = document.getElement("status-path");
  private item: HTMLElement = document.getElement("status-item");

  constructor() {
    const lines = this.createStatusItem(StatusMessage.INIT_POSITION);
    this.path.innerHTML = StatusMessage.UNTITLED;

    const modeSelect = this.createStatusSelectItem(EditSession.availableModes, () => {
      EditSession.setMode(modeSelect.value);
    });
    modeSelect.value = EditSession.modeName;
    modeSelect.title = StatusMessage.MODE_TITLE;

    const tabSelect = this.createStatusSelectItem(EditSession.availableTabSize, () => {
      EditSession.setTabsize(Number(tabSelect.value));
    });
    tabSelect.value = EditSession.tabSize.toLocaleString();
    tabSelect.title = StatusMessage.TABSIZE_TITLE;

    Cursor.change(() => {
      lines.innerHTML = `Ln ${Cursor.row}, Col ${Cursor.column}`;
    });

    Util.addCustomEventListener<IFileEvent>("save", (e) => {
      this.addSaveMessage(e.detail.filePath);
    });

    Util.addCustomEventListener<IFileEvent>("update", (e) => {
      this.setPath(e.detail.filePath);

      const extension = pathModule.extname(e.detail.filePath);
      EditSession.setMode(FileExtension.autoJudgement(extension));
      modeSelect.value = EditSession.modeName;
    });
  }

  /**
   * 取得したfilePathをfooterのstatus-pathに入れる
   * @param filePath
   */
  private addSaveMessage(filePath: string): void {
    this.path.innerHTML = StatusMessage.SAVE;

    setTimeout(() => {
      this.path.innerHTML = filePath;
    }, 1500);
  }

  /**
   * - ステータスバーの各アイテムを1つ生成する(listItem形式)
   * - `callback`はclickされた時の処理
   * @param name
   * @param callback
   */
  private createStatusItem(name: string, callback?: (event: MouseEvent) => void): HTMLElement {
    const li: HTMLElement = Util.createListItemElement("li", { text: name });

    li.addClass("status-item-list");
    this.item.appendChild(li);

    if (callback) {
      li.addEventListener("click", (event) => {
        callback(event);
      });
    }

    return li;
  }

  /**
   * - ステータスバーの各アイテムを1つ生成する(select形式)
   * - `callback`は選択肢が変更された時の処理
   * @param callback
   */
  private createStatusSelectItem(optionItems: string[], callback: (e: Event) => void) {
    const select = document.createElement("select");
    select.addClass("status-item-select");

    optionItems.forEach((item) => {
      const option = document.createElement("option");
      option.value = option.textContent = item;
      select.appendChild(option);
    });

    this.item.appendChild(select);
    select.addEventListener("change", (e) => {
      callback(e);
    });
    return select;
  }

  /**
   * Statusのパスをセット
   * @param path
   */
  private setPath(path: string): void {
    this.path.innerHTML = path;
  }
}

export default new Status();