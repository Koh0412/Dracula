import pathModule from "path";

import { IStatus } from "../../../common/definition";
import { editor } from "api/editor/provider/editorProvider";
import { StatusMessage, EventName } from "../../../common/constants";
import { eventEmitter } from "../../../common/utils";
import { fileExtension } from "api/file/fileExtension";

/** 言語の選択に関するステータスクラス */
export class ModeSelectStatus implements IStatus {
  public mainElement: HTMLSelectElement;
  private modes: string[] = editor.session.availableModes;

  constructor() {
    this.mainElement = this.create();
    this.mainElement.addEventListener("change", () => editor.session.setMode(this.mainElement.value));

    this.mainElement.value = editor.session.modeName;
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
    editor.session.setMode(fileExtension.autoJudgement(extension));
    this.mainElement.value = editor.session.modeName;
  }
}