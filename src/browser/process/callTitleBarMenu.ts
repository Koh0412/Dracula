import { ipcRenderer as renderer } from "electron";

import { editor } from "api/editor/provider/editorProvider";
import { callDialog } from "./callDialog";
import { IPCConstants, EventName } from "../../common/constants";
import { eventEmitter } from "../../common/utils";

// ファイル関係
// renderer.on(IPCConstants.MENU_NEW_FILE, () => Textarea.newFile());
renderer.on(IPCConstants.MENU_FILE_OPEN, () => callDialog.open((res) => {
  eventEmitter.emit(EventName.OPEN, res.filePaths[0]);
}));
renderer.on(IPCConstants.MENU_DIR_OPEN, () => callDialog.openDir((res) => {
  eventEmitter.emit(EventName.DIR_OPEN, res.filePaths[0]);
}));

renderer.on(IPCConstants.MENU_SAVE, () => editor.save());
renderer.on(IPCConstants.MENU_SAVE_AS, () => editor.saveAs());
// 編集関係
renderer.on(IPCConstants.MENU_UNDO, () => editor.undo());
renderer.on(IPCConstants.MENU_REDO, () => editor.redo());
renderer.on(IPCConstants.MENU_FIND, () => editor.search.showFindBox());
renderer.on(IPCConstants.MENU_REPLACE, () => editor.search.showReplaceBox());
// 選択関係
renderer.on(IPCConstants.MENU_COPY_LINES_UP, () => editor.copyLinesUp());
renderer.on(IPCConstants.MENU_COPY_LINES_DOWN, () => editor.copyLinesDown());