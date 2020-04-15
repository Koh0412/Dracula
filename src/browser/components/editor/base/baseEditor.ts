import * as ace from "brace";
import "../../../config/editorconfig";

/** エディタ基底クラス */
export class BaseEditor {
  protected textarea: ace.Editor = ace.edit("textarea");

  /** テキストエリアがhiddenかどうか */
  protected get hidden(): boolean {
    return this.textarea.container.hidden;
  }

  /** エディタ内のvalueを取得 */
  protected get value(): string {
    return this.textarea.getValue();
  }

  /**
   * エディタにvalueをセット
   * @param value
   */
  protected setValue(value: string): string {
    return this.textarea.setValue(value);
  }
}

export default new BaseEditor();