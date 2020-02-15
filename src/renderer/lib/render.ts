import { ipcRenderer } from "electron";
import * as ace from "brace";
import "brace/theme/dracula";

import Util from "./Util";
import { ICPKeys } from "../../constants/Keys";
import { IOpenFile } from "../../definition/IOpenFile";

import "../config/lang";

class Render {
  private footer: HTMLElement = Util.getElement("footer");
  private dirMenu: HTMLElement = Util.getElement("dir-menu");
  private missingMessage: HTMLElement = Util.getElement("missing-message");

  private editor: ace.Editor = ace.edit("input");

  private notOpenDir: boolean = true;

  constructor() {
    this.editorSetConfig(this.editor);

    this.init();
  }

  public init(): void {
    ipcRenderer.on(ICPKeys.save.request, (event, _) => {
      event.sender.send(ICPKeys.save.value, this.editor.getValue());
    });

    ipcRenderer.on(ICPKeys.save.path, (_, filePath: string) => {
      this.footer.innerHTML = "the file has been saved";
      setTimeout(() => {
        this.footer.innerHTML = filePath;
      }, 1500);
    });

    ipcRenderer.on(ICPKeys.open.value, (_, openFile: IOpenFile) => {
      this.editor.setValue(openFile.text);
      this.footer.innerHTML = openFile.path;
    });

    ipcRenderer.on(ICPKeys.open.dir, (event, fileOrDirNames: string[]) => {
      this.orderDirectoryList(fileOrDirNames);
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

  private orderDirectoryList(fileOrDirNames: string[]) {
    if (this.notOpenDir) {
      this.missingMessage.style.display = "none";
    }

    this.dirMenu.innerHTML = "";

    fileOrDirNames.forEach((item) => {
      this.dirMenu.innerHTML += "<li>" + item + "</li>";
    });

    this.notOpenDir = false;
  }
}

export { Render }