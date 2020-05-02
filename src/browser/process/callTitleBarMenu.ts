import { ipcRenderer as renderer } from "electron";
import Textarea from "../components/editor/textarea";

class CallTitleBarMenu {
  constructor() {
    renderer.on("menu:undo", () => Textarea.undo());
    renderer.on("menu:redo", () => Textarea.redo());
  }
}

export default new CallTitleBarMenu();