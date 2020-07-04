import { BaseEditor } from "base/baseEditor";
import { acePrefix, aceLangs, aceTabSize } from "../../../common/constants";

/** セッション周りのクラス */
class EditSession extends BaseEditor {
  constructor() {
    super();
  }

  /** 利用可能な言語 */
  public get availableModes(): string[] {
    return Object.values(aceLangs);
  }

  /** 利用可能なタブサイズ */
  public get availableTabSize(): string[] {
    const tabSizes = Object.values(aceTabSize);
    return tabSizes.map((size) => {
      return size.toLocaleString();
    });
  }

  /** 現在のエディタの使用言語の名前 */
  public get modeName(): string {
    return this.mode.substring(this.mode.lastIndexOf("/") + 1);
  }

  /** 現在のエディタのタブサイズを取得 */
  public get tabSize(): number {
    return this.textarea.session.getTabSize();
  }

  /** 現在のエディタの使用言語のフルパス */
  private get mode(): string {
    return this.textarea.getOption("mode");
  }

  /**
   * モードを設定
   * @param mode
   */
  public setMode(mode: string): void {
    this.textarea.session.setMode(acePrefix.MODE + mode);
  }

  /**
   * タブサイズを設定
   * @param size
   */
  public setTabsize(size: number): void {
    this.textarea.session.setTabSize(size);
  }
}

export default new EditSession();