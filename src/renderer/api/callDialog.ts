import { ipcRenderer as renderer } from "electron";
import { IPCConstants } from "../../common/constants/systemConstants";

/** ダイアログの呼び出し */
class CallDialog {
  public save() {
    renderer.send(IPCConstants.SAVE_DIALOG);
  }

  public open() {
    renderer.send(IPCConstants.OPEN_DIALOG);
  }

  public openDir() {
    renderer.send(IPCConstants.DIR_DIALOG);
  }
}

export default new CallDialog();