interface IElementOptions {
  text: string;
  title?: string;
}

class Util {
  /**
   * 指定の`id`属性の要素を取得
   *
   * @param id
   */
  public getElement<T>(id: string): T {
    const element = document.getElementById(id) as unknown as T;
    return element;
  }

  /**
   * クラスの追加
   *
   * @param element
   * @param className
   */
  public addClass(element: HTMLElement, className: string): void {
    element.classList.add(className);
  }

  /**
   * クラスの削除
   *
   * @param element
   * @param className
   */
  public removeClass(element: HTMLElement, className: string) {
    element.classList.remove(className);
  }

  /**
   * - `parent`の子要素の`target`にクラスを追加
   * - `target`以外の子要素にクラスがついている場合は削除
   *
   * @param parent
   * @param target
   * @param className
   */
  public addClassChildItem(parent: HTMLElement, target: HTMLElement, className: string): void {
    parent.childNodes.forEach((node) => {
      this.removeClass((node as HTMLElement), className);
    });

    if (!target.isEqualNode(parent)) {
      this.addClass(target, className);
    }
  }

  /**
   * <li>要素を生成 optionsで設定
   *
   * @param options
   */
  public createListItemElement(options: IElementOptions): HTMLLIElement {
    const li: HTMLLIElement = document.createElement("li");
    li.innerHTML = options.text;
    if (options.title) {
      li.title = options.title;
    }

    return li;
  }

  /**
   * material iconを作成
   *
   * @param iconName
   */
  public createMaterialIcon(iconName: string): HTMLElement {
    const italic = document.createElement("i");
    this.addClass(italic, "material-icons");
    italic.textContent = iconName;

    return italic;
  }
}

export default new Util();