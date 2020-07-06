import { BaseEditor } from "base/baseEditor";

import { Cursor } from "../cursor";
import { Session } from "../session";
import { Search } from "../search";
import { fileIO } from "api/file/fileIO";

class EditorProvider extends BaseEditor {
  /** カーソルの取得 */
  public get cursor(): Cursor {
    return new Cursor();
  }

  /** セッションの取得 */
  public get session(): Session {
    return new Session();
  }

  /** 検索クラスの取得 */
  public get search(): Search {
    return new Search();
  }

  /** 行を上へコピー */
  public copyLinesUp(): number {
    return this.textarea.copyLinesUp();
  }

  /** 行を下へコピー */
  public copyLinesDown(): number {
    return this.textarea.copyLinesDown();
  }

  /** redoを行う */
  public redo(): void {
    this.textarea.redo();
  }

  /** エディタ内のvalueのセーブ */
  public save(): void {
    if (!this.hidden) {
      fileIO.save(this.value);
    }
  }

  /** 名前を付けて保存 */
  public saveAs(): void {
    if (!this.hidden) {
      fileIO.saveAs(this.value);
    }
  }

  // TODO: 後々作る
  public newFile(): void {
    //
  }

  /** undoを行う */
  public undo(): void {
    this.textarea.undo();
  }

  /**
   * エディタのリサイズを行う
   */
  public resize(): void {
    this.textarea.resize();
  }
}

export const editor = new EditorProvider();