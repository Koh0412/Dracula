/** ステータスを作るインターフェース */
export interface IStatus {
  /** 軸となる要素 */
  mainElement: HTMLElement;
  /** ステータス要素の作成 */
  create(): HTMLElement;
  /** 要素のtextContent */
  textContent?: string;
}