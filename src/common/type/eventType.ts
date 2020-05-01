export type fileEvent = "save" | "open" | "update";
export type customClickEvent = "fileClick";
export type tabEvent = "tab";
export type resizeEvent = "resize";

export type all = fileEvent | customClickEvent | tabEvent | resizeEvent;