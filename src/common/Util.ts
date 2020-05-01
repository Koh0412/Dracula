import { IconName, AttributeName } from "./constants/systemConstants";
import { ITargetInfo } from "./definition/ITargetInfo";
import { IElementOptions } from "./definition/IElementOptions";
import * as eventType from "./type/eventType";

type ListItemType = "li" | "ul" | "ol";

class Util {
  /**
   * 指定の`id`属性の要素を取得
   * @param id
   */
  public getElement<T>(id: string): T {
    const element = document.getElementById(id) as unknown as T;
    return element;
  }

  /**
   * クラスの追加
   * @param element
   * @param className
   */
  public addClass(element: HTMLElement, className: string): void {
    element.classList.add(className);
  }

  /**
   * クラスの削除
   * @param element
   * @param className
   */
  public removeClass(element: HTMLElement, className: string): void {
    element.classList.remove(className);
  }

  public toggleClass(element: HTMLElement, className: string): void {
    element.classList.toggle(className);
  }

  /**
   * `list`の各アイテムのフォーカスをクリア
   * @param list
   */
  public clearFocus(list: HTMLElement[]): void {
    list.forEach((item) => {
      this.removeClass(item, "focus-item");
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
        this.addClass(item, "focus-item");
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
      this.addClass(close, "tab-close");
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
    this.addClass(italic, "material-icons");
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

  /**
   * カスタムイベントのリスナーの登録
   * @param type
   * @param callback
   */
  public addCustomEventListener<T = any>(type: eventType.all, callback: (event: CustomEvent<T>) => void) {
    document.body.addEventListener(type, (e) => {
      callback(e as CustomEvent<T>);
    });
  }
}

export default new Util();