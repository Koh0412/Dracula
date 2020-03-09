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

  public addClass(element: HTMLElement, className: string) {
    element.classList.add(className);
  }

  /**
   * - `parent`の子要素の`target`にクラスを追加
   * - `target`以外の子要素にクラスがついている場合は削除
   *
   * @param parent
   * @param target
   * @param className
   */
  public addClassChildItem(parent: HTMLElement, target: HTMLElement, className: string) {
    parent.childNodes.forEach((node) => {
      (node as HTMLElement).classList.remove(className);
    });

    if (!target.isEqualNode(parent)) {
      target.classList.add(className);
    }
  }

  /**
   * <li>要素を生成 optionsで設定
   *
   * @param options
   */
  public createListItemElement(options: IElementOptions): HTMLLIElement {
    const li = document.createElement("li");
    li.innerHTML = options.text;
    if (options.title) {
      li.title = options.title;
    }

    return li;
  }
}

export default new Util();