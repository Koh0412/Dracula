import { ICPKeys } from "../../window/constants/Keys"
import { ipcRenderer } from "electron";

import * as ace from "brace";
import "brace/theme/dracula";

import "./lang";

class Render {
  private footer: HTMLElement = document.getElementById("footer")!;
  private editor: ace.Editor = ace.edit("input");

  public init(): void {

    this.editorSetConfig(this.editor);

    ipcRenderer.on(ICPKeys.save.request, (event, _) => {
      event.sender.send(ICPKeys.save.value, this.editor.getValue());
    });

    ipcRenderer.on(ICPKeys.save.path, (_, filePath: string) => {
      this.footer.innerHTML = "the file has been saved";
      setTimeout(() => {
        this.footer.innerHTML = filePath;
      }, 1500);
    });

    ipcRenderer.on(ICPKeys.open.value, (_, params: string[]) => {
      this.editor.setValue(params[0]);
      this.footer.innerHTML = params[1];
    });

    ipcRenderer.on(ICPKeys.open.dir, (event, fileOrDirName: string) => {
      console.log(fileOrDirName);
    });
  }

  private editorSetConfig(editor: ace.Editor): ace.Editor {
    editor.setTheme("ace/theme/dracula");
    editor.setShowPrintMargin(false);

    editor.session.setMode("ace/mode/typescript");
    editor.session.setTabSize(2);

    return editor;
  }
}

export { Render }