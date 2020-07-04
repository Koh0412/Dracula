import * as ace from "brace";
import "config/editorconfig";

/** エディタ基底クラス */
export class BaseEditor {
  protected textarea: ace.Editor = ace.edit("textarea");

  /** テキストエリアがhiddenかどうか */
  protected get hidden(): boolean {
    return this.textarea.container.hidden;
  }

  /** テキストエリアをフォーカスしているかどうか */
  protected get isFocus(): boolean {
    return this.textarea.container.classList.contains("ace_focus");
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

  /**
   * エディタコンテナのhiddenプロパティに値をセット
   * @param isHidden
   */
  protected setHidden(isHidden: boolean): boolean {
    return this.textarea.container.hidden = isHidden;
  }
}

export default new BaseEditor();