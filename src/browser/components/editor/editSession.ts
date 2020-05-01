import { BaseEditor } from "./base/baseEditor";
import { acePrefix, aceLangs } from "../../../common/constants/editorConstants";

/** セッション周りのクラス */
class EditSession extends BaseEditor {
  constructor() {
    super();
  }

  /** 利用可能な言語 */
  public get availableModes(): string[] {
    return Object.values(aceLangs);
  }

  /** 現在のエディタの使用言語のフルパス */
  private get mode(): string {
    return this.textarea.getOption("mode");
  }

  /** 現在のエディタの使用言語の名前 */
  public get modeName() {
    return this.mode.substring(this.mode.lastIndexOf("/") + 1);
  }

  /**
   * モードを設定
   * @param mode
   */
  public setMode(mode: string): void {
    this.textarea.session.setMode(acePrefix.MODE + mode);
  }
}

export default new EditSession();