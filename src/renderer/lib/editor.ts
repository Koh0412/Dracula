import * as ace from "brace";
import "brace/theme/dracula";

import "../config/lang";

class Editor {
  public textarea: ace.Editor = ace.edit("textarea");

  constructor() {
    this.SetConfig(this.textarea);
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