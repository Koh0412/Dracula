import { ICPKeys } from "../../window/constants/Keys"
import { ipcRenderer } from "electron";

import * as ace from "brace";
import "brace/theme/dracula";

import "./lang";

class Render {
  private footer: HTMLElement = this.getElement("footer");
  private dirMenu: HTMLElement = this.getElement("dir-menu");
  private missingMessage: HTMLElement = this.getElement("missing-message");

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

    ipcRenderer.on(ICPKeys.open.dir, (event, fileOrDirNames: string[]) => {
      this.missingMessage.innerHTML = "";
      this.missingMessage.style.display = "none";

      fileOrDirNames.forEach((item) => {
        this.dirMenu.innerHTML += "<li>" + item + "</li>";
      });
    });
  }

  private editorSetConfig(editor: ace.Editor): ace.Editor {
    editor.setTheme("ace/theme/dracula");
    editor.session.setMode("ace/mode/typescript");

    editor.setOption("indentedSoftWrap", false);

    editor.setShowPrintMargin(false);
    editor.session.setTabSize(2);
    editor.session.setUseWrapMode(true);

    return editor;
  }

  private getElement<T>(id: string): T {
    const element = document.getElementById(id) as unknown as T;
    return element;
  }
}

export { Render }