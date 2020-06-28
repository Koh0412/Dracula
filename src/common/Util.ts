import { EventEmitter } from "events";

import { IconName, AttributeName } from "./constants";
import { ITargetInfo, IElementOptions } from "./definition";

type ListItemType = "li" | "ul" | "ol";

export const eventEmitter = new EventEmitter();

class Util {
  /**
   * `list`の各アイテムのフォーカスをクリア
   * @param list
   */
  public clearFocus(list: HTMLElement[]): void {
    list.forEach((item) => {
      item.removeClass("focus-item");
    });
  }

  /**
   * - `list`のアイテムをクリアした上で、`compareElementTitle`で各アイテムを比較して
   * - 一致するものにフォーカスを与える
   * @param list
   * @param compareElementTitle
   */
  public updateFocus(list: HTMLElement[], compareElementTitle: string): void {
    this.clearFocus(list);
    list.forEach((item) => {
      if (compareElementTitle === item.title) {
        item.addClass("focus-item");
      }
    });
  }

  /**
   * <li>要素を生成 optionsで設定
   * @param tagName
   * @param options
   */
  public createListItemElement(tagName: ListItemType, options: IElementOptions): HTMLElement {
    const li: HTMLElement = document.createElement(tagName);
    li.innerHTML = options.text;

    if (options.title) {
      li.title = options.title;
    }

    if (options.isClose) {
      const close: HTMLElement = this.createMaterialIcon(IconName.close);

      close.title = "close";
      close.setAttribute(AttributeName.DATA_TYPE, "close");
      close.addClass("tab-close");
      li.appendChild(close);

      li.addEventListener("mouseover", () => close.style.display = "block");
      li.addEventListener("mouseleave", () => close.style.display = "none");
    }

    return li;
  }

  /**
   * material iconを作成
   * @param iconName
   */
  public createMaterialIcon(iconName: IconName): HTMLElement {
    const italic = document.createElement("i");
    italic.addClass("material-icons");
    italic.textContent = iconName;

    return italic;
  }

  /**
   * クリックしたtargetの情報
   * @param click
   */
  public EventTargetInfo(click: MouseEvent): ITargetInfo {
    let target: HTMLElement = click.target as HTMLElement;
    const dataType: string | null = target.getAttribute(AttributeName.DATA_TYPE);
    // クリックした要素がiconなら親要素を参照
    if (dataType === "icon" || dataType === "close") {
      target = target.parentElement as HTMLElement;
    }

    const dataIsDirectory: string | null = target.getAttribute(AttributeName.DATA_ISDIRECTORY);
    const title: string = target.title;

    const info: ITargetInfo = {
      element: target,
      attritube: { dataType, dataIsDirectory },
      title,
    };
    return info;
  }
}

export default new Util();