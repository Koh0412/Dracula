import * as ace from "brace";
import { BaseEditor } from "./base/baseEditor";

class Cursor extends BaseEditor {
  constructor() {
    super();
  }

   /** 現在のカーソルの位置を取得 */
  public get cursorPosition(): ace.Position {
    const cursorPosition = this.textarea.getCursorPosition();
    const row = cursorPosition.row + 1;
    const column = cursorPosition.column + 1;

    return { row, column };
  }

  /** カーソルの行 */
  public get row(): number {
    return this.cursorPosition.row;
  }

  /** カーソルの列 */
  public get column(): number {
    return this.cursorPosition.column;
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

export default new Cursor();