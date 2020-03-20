import * as customBar from "custom-electron-titlebar";

class TitleBar {
  constructor() {
    this.create();
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
}

export default new TitleBar();