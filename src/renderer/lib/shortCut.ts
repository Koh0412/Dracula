import MouseTrap from "mousetrap-ts";
import CallDialog from "../api/callDialog";

export class ShortCut {
  private mouseTrap: MouseTrap;

  constructor(targetElement: HTMLElement = document.body) {
    this.mouseTrap = new MouseTrap(targetElement);
  }

  /**
   * 指定のキーのバインドを行う
   *
   * @param keys
   * @param callback
   * @param isElementActive
   */
  public keyBind(keys: string | string[], callback: () => void, isElementActive: boolean = false) {
    this.mouseTrap.bind(keys, () => {
      callback();
      return isElementActive;
    }, "keydown");
  }

  public ctrlOrCmd(key: string) {
    return [`ctrl+${key}`, `command+${key}`];
  }

  public ctrlOrCmdShift(key: string) {
    return [`ctrl+shift+${key}`, `command+shift+${key}`];
  }
}

const shortCut = new ShortCut();
// file関係
shortCut.keyBind(shortCut.ctrlOrCmd("o"), () => CallDialog.open());
shortCut.keyBind(shortCut.ctrlOrCmdShift("o"), () => CallDialog.openDir());