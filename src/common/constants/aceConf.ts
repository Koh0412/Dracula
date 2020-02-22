interface IAceConf {
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

export const aceConf: IAceConf = {
  theme: "ace/theme/dracula",
  mode: "ace/mode/typescript",
  showPrintMargin: false,
  tabSize: 2,
  wrap: true,
  indentedSoftWrap: false
};
