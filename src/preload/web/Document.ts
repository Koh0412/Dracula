interface Document {
  /**
   * 指定の`id`属性の要素を取得
   * @param id
   */
  getElement<T>(id: string): T;
}

Document.prototype.getElement = function<T>(id: string): T {
  const el = this.getElementById(id) as unknown as T;
  return el;
};