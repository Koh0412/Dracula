import { ipcRenderer } from "electron";

import * as ace from "brace";
import "../config/lang";
import "../config/snippets";
import "brace/theme/dracula";
import "brace/ext/language_tools";

import IPC from "../../common/IPC";
import { IPCKeys } from "../../common/constants/Keys";
import { aceConf } from "../../common/constants/aceConf";

class Editor {
  public textarea: ace.Editor = ace.edit("textarea");

  constructor() {
    this.textarea.$blockScrolling = Infinity;
    this.textarea.setOptions(aceConf);

    this.textarea.resize();

    IPC.recieve(ipcRenderer, IPCKeys.save.request, (event, _) => {
      // Main側にeditorのtextを送る
      event.sender.send(IPCKeys.save.value, this.getText);
    });
  }

  public get getText(): string {
    return this.textarea.getValue();
  }

  public setText(text: string): string {
    return this.textarea.setValue(text);
  }
}

export default new Editor();