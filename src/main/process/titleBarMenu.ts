import { MenuItemConstructorOptions, Menu, MenuItem, BrowserWindow } from "electron";

import { IPCConstants } from "../../common/constants/systemConstants";
import { MethodType } from "../../common/type/menuMethodType";

class TitleBarMenu {

  constructor() {
    const menu: Menu = Menu.buildFromTemplate(this.template);
    Menu.setApplicationMenu(menu);
  }

  /** windowsかどうか */
  private get isWindows(): boolean {
    return process.platform === "win32";
  }

  /** タイトルメニューテンプレート */
  private get template(): MenuItemConstructorOptions[] {
    const template: MenuItemConstructorOptions[] = [
      {
        label: "File",
        submenu: [
          {
            label: "New File",
            click: this.sendRequest(IPCConstants.MENU_NEW_FILE),
            accelerator: "CmdOrCtrl+N",
          },
          { type: "separator" },
          {
            label: "Open File",
            click: this.sendRequest(IPCConstants.MENU_FILE_OPEN),
            accelerator: "CmdOrCtrl+O",
          },
          {
            label: "Open Folder",
            click: this.sendRequest(IPCConstants.MENU_DIR_OPEN),
            accelerator: "CmdOrCtrl+Shift+O"
          },
          { type: "separator" },
          {
            label: "Save",
            click: this.sendRequest(IPCConstants.MENU_SAVE),
            accelerator: "CmdOrCtrl+S",
          },
          {
            label: "Save As...",
            click: this.sendRequest(IPCConstants.MENU_SAVE_AS),
            accelerator: "CmdOrCtrl+Shift+S",
          },
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
          { type: "separator" },
          { role: "cut"  },
          { role: "copy" },
          { role: "paste" },
        ]
      },
      {
        label: "Select",
        submenu: this.isWindows ? [
          { label: "SelectAll", click: this.focusAndPerform("selectAll"), accelerator: "Ctrl+A" },
          { type: "separator" },
          { label: "Copy Line Up", click: this.sendRequest(IPCConstants.MENU_COPY_LINES_UP) },
          {
            label: "Copy Line Down",
            click: this.sendRequest(IPCConstants.MENU_COPY_LINES_DOWN),
            accelerator: "CmdOrCtrl+Shift+D",
          }
        ] : [
          { role: "selectAll" },
          { type: "separator" },
          { label: "Copy Line Up", click: this.sendRequest(IPCConstants.MENU_COPY_LINES_UP) },
          {
            label: "Copy Line Down",
            click: this.sendRequest(IPCConstants.MENU_COPY_LINES_DOWN),
            accelerator: "CmdOrCtrl+Shift+D",
          }
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

  /**
   * エディタにフォーカスし、特定のアクションを行う
   * @param methodName
   */
  private focusAndPerform(methodName: MethodType) {
    return function(menuItem: MenuItem, window: any) {
      window.webContents.focus();
      // TODO: anyじゃなくしたい
      window.webContents[methodName]();
    };
  }

  /**
   * browser側にリクエストを送る
   * @param channel
   */
  private sendRequest(channel: string) {
    return function(menuItem: MenuItem, window: BrowserWindow) {
      window.webContents.send(channel);
    };
  }
}

export default new TitleBarMenu();