import MouseTrap from "mousetrap-ts";
import CallDialog from "../process/callDialog";
import Textarea from "../components/editor/textarea";
import SideMenu from "../components/sideMenu";

/** ショートカットキーの作成クラス */
export class ShortCut {
  private mouseTrap: MouseTrap;

  constructor(targetElement: HTMLElement = document.body) {
    this.mouseTrap = new MouseTrap(targetElement);
  }

  /**
   * 指定のキーのバインドを行う
   * @param keys
   * @param callback
   * @param isElementActive
   */
  public keyBind(keys: string | string[], callback: () => void, isElementActive: boolean = false): void {
    this.mouseTrap.bind(keys, () => {
      callback();
      return isElementActive;
    }, "keydown");
  }

  public ctrlOrCmd(key: string): string[] {
    return [`ctrl+${key}`, `command+${key}`];
  }

  public ctrlOrCmdShift(key: string): string[] {
    return [`ctrl+shift+${key}`, `command+shift+${key}`];
  }
}

const shortCut = new ShortCut();
// file関係
shortCut.keyBind(shortCut.ctrlOrCmd("o"), () => CallDialog.open((path) => Textarea.openfile(path)));
shortCut.keyBind(shortCut.ctrlOrCmdShift("o"), () => CallDialog.openDir((path) => {
  SideMenu.initDirectoryTree(path);
}));
shortCut.keyBind(shortCut.ctrlOrCmd("s"), () => Textarea.save());
shortCut.keyBind(shortCut.ctrlOrCmdShift("s"), () => Textarea.saveAs());