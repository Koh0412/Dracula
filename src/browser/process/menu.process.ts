import { ipcRenderer as renderer } from "electron";

import Textarea from "../components/editor/textarea";
import Search from "../components/editor/search";
import SideMenu from "../components/sideMenu";

import CallDialog from "./callDialog";
import { IPCConstants } from "../../common/constants";

// ファイル関係
// renderer.on(IPCConstants.MENU_NEW_FILE, () => Textarea.newFile());
renderer.on(IPCConstants.MENU_FILE_OPEN, () => CallDialog.open((res) => Textarea.openfile(res.filePaths[0])));
renderer.on(IPCConstants.MENU_DIR_OPEN, () => CallDialog.openDir((res) => {
  SideMenu.initDirectoryTree(res.filePaths[0]);
}));
renderer.on(IPCConstants.MENU_SAVE, () => Textarea.save());
renderer.on(IPCConstants.MENU_SAVE_AS, () => Textarea.saveAs());
// 編集関係
renderer.on(IPCConstants.MENU_UNDO, () => Textarea.undo());
renderer.on(IPCConstants.MENU_REDO, () => Textarea.redo());
renderer.on(IPCConstants.MENU_FIND, () => Search.showFindBox());
renderer.on(IPCConstants.MENU_REPLACE, () => Search.showReplaceBox());
// 選択関係
renderer.on(IPCConstants.MENU_COPY_LINES_UP, () => Textarea.copyLinesUp());
renderer.on(IPCConstants.MENU_COPY_LINES_DOWN, () => Textarea.copyLinesDown());