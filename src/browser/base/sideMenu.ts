import { Resize } from "modules/resize";

/** サイドメニュー */
export class SideMenu {
  private resize: HTMLElement = document.getElement("resize");

  constructor() {
    const resize = new Resize(this.resize);
    resize.apply();
  }
}