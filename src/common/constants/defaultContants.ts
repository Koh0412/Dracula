import { DialogMessage } from "./messageConstants";
import { DialogType, ButtonsText } from "./systemConstants";

export const DefaultConst: IDefaultConst = {
  dialog: {
    FILE: {
      detail: DialogMessage.warn.CATION,
      type: DialogType.WARN,
      buttons: ButtonsText.FILE,
      message: DialogMessage.warn.MODIFY,
    }
  }
};

interface IDefaultConst {
  dialog: {
    FILE: Electron.MessageBoxOptions;
  };
}

