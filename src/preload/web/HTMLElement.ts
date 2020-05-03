interface HTMLElement {
  /**
   * クラスの追加
   * @param element
   * @param className
   */
  addClass(className: string): void;
  /**
   * クラスの削除
   * @param element
   * @param className
   */
  removeClass(className: string): void;
  /**
   * トグルクラスを追加
   * @param className
   */
  toggleClass(className: string): void;
}

HTMLElement.prototype.addClass = function(className: string): void {
  this.classList.add(className);
};

HTMLElement.prototype.removeClass = function(className: string): void {
  this.classList.remove(className);
};

HTMLElement.prototype.toggleClass = function(className: string): void {
  this.classList.toggle(className);
};