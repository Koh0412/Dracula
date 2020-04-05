import MouseTrap from "mousetrap-ts";
import CallDialog from "../api/callDialog";
import Editor from "../components/editor";
import SideMenu from "../components/sideMenu";

/** ショートカットキーの作成クラス */
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
shortCut.keyBind(shortCut.ctrlOrCmd("o"), () => CallDialog.open((path) => Editor.openfile(path)));
shortCut.keyBind(shortCut.ctrlOrCmdShift("o"), () => CallDialog.openDir((path) => SideMenu.addDirectories(path)));
shortCut.keyBind(shortCut.ctrlOrCmd("s"), () => Editor.save());