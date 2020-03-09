import Util from "../../common/Util";

class Tab {
  private list: HTMLElement[] = [];

  public create(textContent: string, path: string) {
    const li = Util.createListItemElement({
      text: textContent,
      title: path,
    });

    this.list.push(li);
  }
}

export default new Tab();