import { MenuItemConstructorOptions, Menu, MenuItem, BrowserWindow } from "electron";

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
          { role: "quit" }
        ]
      },
      {
        label: "Edit",
        submenu: this.isWindows ? [
          { label: "Undo",  click: this.sendRequest("menu:undo"),  accelerator: "Ctrl+Z"       },
          { label: "Redo",  click: this.sendRequest("menu:redo"),  accelerator: "Ctrl+Shift+Z" },
          { label: "Cut",   click: this.focusAndPerform("cut"),   accelerator: "Ctrl+X"       },
          { label: "Copy",  click: this.focusAndPerform("copy"),  accelerator: "Ctrl+C"       },
          { label: "Paste", click: this.focusAndPerform("paste"), accelerator: "Ctrl+V"       },
        ] : [
          { role: "undo" },
          { role: "redo" },
          { role: "cut"  },
          { role: "copy" },
          { role: "paste" },
        ]
      }
    ];
    return template;
  }

  private focusAndPerform(methodName: string) {
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