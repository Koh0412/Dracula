import Editor from "../components/editor";
import "../components/sideMenu";
import "../components/tab";
import Status from "../components/status";

/** 全体のレンダリング */
// INFO: import順の関係上、ここを経由しないとStatus -> Editorにアクセスできないため作成
class Render {
  constructor() {
    const lines: HTMLLIElement = Status.createStatusList("row 1, column 1");

    Editor.changeCursor(() => {
      Status.setLines(Editor.getCursorPosition);
      lines.innerHTML = `row ${this.row}, column ${this.column}`;
    });
  }

  private get row(): number {
    return Status.getLines.row;
  }

  private get column(): number {
    return Status.getLines.column;
  }
}

export default new Render();