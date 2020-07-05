import pathModule from "path";

import { IStatus } from "../../../common/definition";
import EditSession from "components/editor/editSession";
import { StatusMessage, EventName } from "../../../common/constants";
import { eventEmitter } from "../../../common/util";
import { fileExtension } from "api/fileExtension";

/** 言語の選択に関するステータスクラス */
export class ModeSelectStatus implements IStatus {
  public mainElement: HTMLSelectElement;
  private modes: string[] = EditSession.availableModes;

  constructor() {
    this.mainElement = this.create();
    this.mainElement.addEventListener("change", () => EditSession.setMode(this.mainElement.value));

    this.mainElement.value = EditSession.modeName;
    this.mainElement.title =  StatusMessage.MODE_TITLE;

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
    EditSession.setMode(fileExtension.autoJudgement(extension));
    this.mainElement.value = EditSession.modeName;
  }
}