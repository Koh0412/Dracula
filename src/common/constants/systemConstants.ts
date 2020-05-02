/** IPCで必要になる共通のキー */
export const IPCConstants = {
  SAVE_DIALOG: "save-dialog",
  SAVE_PATH: "save-path",
  OPEN_DIALOG: "open-dialog",
  OPEN_PATH: "open-path",
  DIR_DIALOG: "dir-dialog",
  DIR_PATH: "dir-path",
  MENU_SAVE: "menu-save",
  MENU_SAVE_AS: "menu-save-as",
  MENU_FILE_OPEN: "menu-open",
  MENU_DIR_OPEN: "menu-dir-open",
  MENU_REDO: "menu-redo",
  MENU_UNDO: "menu-undo",
};

/** カスタムのhtml属性の名前 */
export const AttributeName = {
  DATA_TYPE: "data-type",
  DATA_ISDIRECTORY: "data-isDirectory",
};

/** キーコード */
export enum Keybind {
  atMark = "CmdOrCtrl+@",
  O = "CmdOrCtrl+O",
  S = "CmdOrCtrl+S",
  Q = "CmdOrCtrl+Q",
  ShiftO = "CmdOrCtrl+Shift+O",
  ShiftS = "CmdOrCtrl+Shift+S"
}

/** material iconの名前 */
export enum IconName {
  folder = "folder",
  insertDriveFile = "insert_drive_file",
  close = "close",
}