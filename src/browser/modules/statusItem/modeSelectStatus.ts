import pathModule from "path";

import { IStatus } from "../../../common/definition";
import EditSession from "components/editor/editSession";
import { StatusMessage, EventName } from "../../../common/constants";
import { eventEmitter } from "../../../common/util";
import FileExtension from "api/fileExtension";

/** 言語の選択に関するステータスクラス */
export class ModeSelectStatus implements IStatus {
  public statusElement: HTMLSelectElement;
  private modes: string[] = EditSession.availableModes;

  constructor() {
    this.statusElement = this.create();
    this.statusElement.addEventListener("change", () => EditSession.setMode(this.statusElement.value));

    this.statusElement.value = EditSession.modeName;
    this.statusElement.title =  StatusMessage.MODE_TITLE;

    eventEmitter.on(EventName.UPDATE, (path: string) => this.setLanguage(path));
  }

  public create(): HTMLSelectElement {
    const select = document.createElement("select");
    select.addClass("status-item-select");

    for (const mode of this.modes) {
      const option = document.createElement("option");
      option.value = option.textContent = mode;
      select.appendChild(option);
    }

    return select;
  }

  private setLanguage(path: string): void {
    const extension = pathModule.extname(path);
    EditSession.setMode(FileExtension.autoJudgement(extension));
    this.statusElement.value = EditSession.modeName;
  }
}