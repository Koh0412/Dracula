import * as ace from "brace";
import { BaseEditor } from "base/baseEditor";

/** カーソルに関するクラス */
class Cursor extends BaseEditor {

  /** カーソルの行 */
  public get row(): number {
    return this.cursorPosition.row;
  }

  /** カーソルの列 */
  public get column(): number {
    return this.cursorPosition.column;
  }

  /** 現在のカーソルの位置を取得 */
  private get cursorPosition(): ace.Position {
    const cursorPosition = this.textarea.getCursorPosition();
    const row = cursorPosition.row + 1;
    const column = cursorPosition.column + 1;

    return { row, column };
  }

  /**
   * カーソルが動いた時の処理
   *
   * @param callback
   */
  public change(callback: () => void): void {
    this.textarea.selection.addEventListener("changeCursor", () => {
      callback();
    });
  }
}

export const cursor = new Cursor();