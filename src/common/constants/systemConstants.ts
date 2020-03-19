/** IPCで必要になる共通のキー */
export const IPCConstants = {
  SAVE_REQ: "save-request",
  SAVE_VALUE: "save-value",
  SAVE_PATH: "save-path",
  OPEN_VALUE: "open-value",
  OPEN_DIR: "open-dir",
  OPEN_BYCLICK: "open-by-click"
};

/** ステータスバーのメッセージ */
export const StatusMessage = {
  SAVE: "the file has been saved",
  INIT_POSITION: "Ln 1, Col 1",
};

export const HTMLAttribute = {
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
  FOLDER = "folder",
  INSERT_DRIVE_FILE = "insert_drive_file",
}