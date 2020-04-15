import { BaseEditor } from "./base/baseEditor";
import { acePrefix } from "../../../common/constants/editorConstants";

/** セッション周りのクラス */
class EditSession extends BaseEditor {
  constructor() {
    super();
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