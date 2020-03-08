import Editor from "./editor";
import "./sideMenu";
import Status from "./status";

/** 全体のレンダリング */
// INFO: import順の関係上、ここを経由しないとStatus -> Editorにアクセスできないため作成
class Render {
  constructor() {
    const lines = Status.createStatusList("row 1, column 1");

    Editor.changeCursor(() => {
      Status.setLines(Editor.getCursorPosition);
      lines.innerHTML = `row ${this.row}, column ${this.column}`;
    });
  }

  private get row() {
    return Status.getLines.row;
  }

  private get column() {
    return Status.getLines.column;
  }
}

export default new Render();