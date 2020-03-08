export interface IAceConf {
  // render option
  theme: string;
  showPrintMargin?: boolean;
  indentedSoftWrap?: boolean;

  // session option
  mode: string;
  tabSize: number;
  wrap?: boolean | number;

  // Hundler option
  tooltipFollowsMouse?: boolean;

  // editor option
  enableBasicAutocompletion?: boolean;
  enableLiveAutocompletion?: boolean;
  enableSnippets?: boolean;
}
