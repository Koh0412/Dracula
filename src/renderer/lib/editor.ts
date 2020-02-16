import * as ace from "brace";
import "brace/theme/dracula";

import DrEvent from "../../common/DrEvent";
import { IPCKeys } from "../../common/constants/Keys";

import "../config/lang";

class Editor {
  public textarea: ace.Editor = ace.edit("textarea");

  constructor() {
    this.SetConfig(this.textarea);

    DrEvent.ipcResposnse(IPCKeys.save.request, (event, _) => {
      // Main側にeditorのtextを送る
      event.sender.send(IPCKeys.save.value, this.getText());
    });
  }

  public setText(text: string): string {
    return this.textarea.setValue(text);
  }

  public getText(): string {
    return this.textarea.getValue();
  }

  /**
   * editorの設定
   *
   * @param editor
   */
  private SetConfig(editor: ace.Editor): ace.Editor {
    editor.setTheme("ace/theme/dracula");
    editor.session.setMode("ace/mode/typescript");

    editor.setOption("indentedSoftWrap", false);

    editor.setShowPrintMargin(false);
    editor.session.setTabSize(2);
    editor.session.setUseWrapMode(true);

    return editor;
  }
}

export default new Editor();