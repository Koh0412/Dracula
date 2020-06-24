import { Dialog } from "./dialog";
import { TitleBarMenu } from "./titleBarMenu";

export class MainProcess {

  public static get dialog(): Dialog {
    return new Dialog();
  }

  public static get titlebarMenu(): TitleBarMenu {
    return new TitleBarMenu();
  }
}