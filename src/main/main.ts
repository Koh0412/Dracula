import { Core } from "./core/core";
import { Menu } from "electron";
import { MainProcess } from "./process/mainProcess";

/**
 * 起動処理
 */
function boot() {
  Core.createApplication();

  const menu: Menu = Menu.buildFromTemplate(MainProcess.titlebarMenu.template);
  Menu.setApplicationMenu(menu);

  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
}

boot();