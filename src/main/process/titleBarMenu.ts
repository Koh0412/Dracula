import { MenuItemConstructorOptions, Menu, MenuItem, BrowserWindow } from "electron";

import { IPCConstants } from "../../common/constants/systemConstants";
import { MethodType } from "../../common/type/menuMethodType";

class TitleBarMenu {
  constructor() {
    const menu: Menu = Menu.buildFromTemplate(this.template);
    Menu.setApplicationMenu(menu);
  }

  private get isWindows(): boolean {
    return process.platform === "win32";
  }

  private get template(): MenuItemConstructorOptions[] {
    const template: MenuItemConstructorOptions[] = [
      {
        label: "File",
        submenu: [
          { label: "Open file", click: this.sendRequest(IPCConstants.MENU_FILE_OPEN), accelerator: "Ctrl+O" },
          { label: "Open folder", click: this.sendRequest(IPCConstants.MENU_DIR_OPEN), accelerator: "Ctrl+Shift+O" },
          { type: "separator" },
          { label: "Save", click: this.sendRequest(IPCConstants.MENU_SAVE), accelerator: "Ctrl+S" },
          { label: "Save as...", click: this.sendRequest(IPCConstants.MENU_SAVE_AS), accelerator: "Ctrl+Shift+S" },
          { type: "separator" },
          { role: "quit" },
        ]
      },
      {
        label: "Edit",
        submenu: this.isWindows ? [
          { label: "Undo", click: this.sendRequest(IPCConstants.MENU_UNDO), accelerator: "Ctrl+Z" },
          { label: "Redo", click: this.sendRequest(IPCConstants.MENU_REDO), accelerator: "Ctrl+Shift+Z" },
          { type: "separator" },
          { label: "Cut", click: this.focusAndPerform("cut"), accelerator: "Ctrl+X" },
          { label: "Copy", click: this.focusAndPerform("copy"), accelerator: "Ctrl+C" },
          { label: "Paste", click: this.focusAndPerform("paste"), accelerator: "Ctrl+V" },
        ] : [
          { role: "undo" },
          { role: "redo" },
          { role: "cut"  },
          { role: "copy" },
          { role: "paste" },
        ]
      },
      {
        label: "View",
        submenu: [
          { role: "reload" },
          { role: "forceReload" },
          { type: "separator" },
          { role: "togglefullscreen" },
        ]
      },
      {
        label: "Help",
        submenu: [
          { role: "toggleDevTools" }
        ]
      }
    ];
    return template;
  }

  private focusAndPerform(methodName: MethodType) {
    return function(menuItem: MenuItem, window: any) {
      window.webContents.focus();
      // TODO: anyじゃなくしたい
      window.webContents[methodName]();
    };
  }

  private sendRequest(channel: string) {
    return function(menuItem: MenuItem, window: BrowserWindow) {
      window.webContents.send(channel);
    };
  }
}

export default new TitleBarMenu();