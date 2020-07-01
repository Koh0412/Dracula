/** ステータスを作るインターフェース */
export interface IStatus {
  statusElement: HTMLElement;
  /** ステータス要素の作成 */
  create(): HTMLElement;
  textContent?: string;
}