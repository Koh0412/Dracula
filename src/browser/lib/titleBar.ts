import pathModule from "path";
import * as customBar from "custom-electron-titlebar";

import Util from "../../common/util";
import { IFileEvent } from "../../common/definition/event/IFileEvent";

class TitleBar {
  private instance: customBar.Titlebar | null = null;
  constructor() {
    this.instance = this.create();

    Util.addCustomEventListener<IFileEvent>("update", (e) => {
      const name = pathModule.basename(e.detail.filePath);
      this.updateTitle(name);
    });
  }

  private readonly bgColor: string = "#24232d";
  private readonly iconPath: string = "../../resources/image/dr.png";

  /** タイトルバーのオプション */
  private get options(): customBar.TitlebarOptions {
    const titlebarOptions: customBar.TitlebarOptions = {
      backgroundColor: customBar.Color.fromHex(this.bgColor),
      icon: this.iconPath,
    };

    return titlebarOptions;
  }

  /** タイトルバーを生成 */
  private create(): customBar.Titlebar {
    return new customBar.Titlebar(this.options);
  }

  private updateTitle(add: string) {
    if (!this.instance) {
      return;
    }
    this.instance.updateTitle(`Dracula - ${add}`);
  }
}

export default new TitleBar();