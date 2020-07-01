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
  MENU_COPY_LINES_UP: "menu-copy-line-up",
  MENU_COPY_LINES_DOWN: "menu-copy-line-down",
  MENU_NEW_FILE: "menu-new-file",
  MENU_FIND: "menu-find",
  MENU_REPLACE: "menu-replace",
  MSG_WARNING: "msg-warning",
  MSG_WARNING_RES: "msg-warning-res"
};

/** カスタムのhtml属性の名前 */
export const AttributeName = {
  DATA_TYPE: "data-type",
  DATA_ISDIRECTORY: "data-isDirectory",
};

/** メッセージダイアログのタイプ */
export const DialogType = {
  WARN: "warning",
  INFO: "info"
};

/** ダイアログのボタンのテキスト */
export const ButtonsText = {
  DEFAULT: ["Yes", "No"],
  FILE: ["Save", "No Save", "Cancel"],
};

/** クリックしたダイアログのボタンの値 */
export const ButtonValue = {
  File: {
    SAVE: 0,
    NO_SAVE: 1
  }
};

/** material iconの名前 */
export enum IconName {
  folder = "folder",
  insertDriveFile = "insert_drive_file",
  close = "close",
}