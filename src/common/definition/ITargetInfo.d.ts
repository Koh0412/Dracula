/** クリックした要素の情報 */
export interface ITargetInfo {
  element: HTMLElement;
  attritube: IAttribute;
  title: string;
}

export interface IAttribute {
  dataType: DataType;
  dataIsDirectory: string | null;
}

export type DataType = "close" | "icon";