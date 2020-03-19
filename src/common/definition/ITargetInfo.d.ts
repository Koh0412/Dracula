/** クリックした要素の情報 */
export interface ITargetInfo {
  element: HTMLElement;
  attritube: {
    dataType: string | null;
    dataIsDirectory: string | null;
  };
  title: string;
}