import MouseTrap from "mousetrap-ts";

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
shortCut.keyBind(shortCut.ctrlOrCmdShift("d"), () => {
  //
});