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
}

export default new Util();