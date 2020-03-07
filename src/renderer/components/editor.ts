import { ipcRenderer as renderer } from "electron";

import * as ace from "brace";
import "../config/lang";
import "../config/snippets";
import "brace/theme/dracula";
import "brace/ext/language_tools";

import { IPCKeys } from "../../common/constants/Keys";
import { aceConf } from "../../common/constants/aceConf";

class Editor {
  public textarea: ace.Editor = ace.edit("textarea");

  constructor() {
    this.textarea.$blockScrolling = Infinity;
    this.textarea.setOptions(aceConf);

    this.textarea.resize();

    renderer.on(IPCKeys.save.request, (event) => {
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