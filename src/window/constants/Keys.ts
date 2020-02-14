export const ICPKeys: IICPKeys = {
  save: {
    request: "save-request",
    value: "save-value",
    path: "save-path",
  },
  open: {
    value: "open-value",
    dir: "open-dir",
  }
}

export enum shortcutKeys {
  atMark = "CmdOrCtrl+@",
  O = "CmdOrCtrl+O",
  S = "CmdOrCtrl+S",
  ShiftO = "CmdOrCtrl+Shift+O",
  ShiftS = "CmdOrCtrl+Shift+S"
}

export interface IICPKeys {
  save: ISaveFileProperty,
  open: IOpenFileProperty,
}

export interface ISaveFileProperty {
  request: string,
  value: string,
  path: string,
}

export interface IOpenFileProperty {
  value: string,
  dir: string,
}