export type fileEvent = "save" | "open" | "update" | "new";
export type customClickEvent = "fileClick";
export type tabEvent = "tab";
export type resizeEvent = "resize";
export type textareaEvent = "textChange";

export type all = fileEvent | customClickEvent | tabEvent | resizeEvent | textareaEvent;