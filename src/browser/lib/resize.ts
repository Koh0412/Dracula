import { eventEmitter } from "../../common/util";

export class Resize {
  private isResize: boolean = false;
  private resizeable: HTMLElement;

  constructor(resizeable: HTMLElement) {
    this.resizeable = resizeable;
  }

  /**
   * リサイズの適用
   */
  public apply(): HTMLElement | null {
    const parent = this.resizeable.parentElement;
    if (parent) {
      parent.style.position = "relative";
      const css = getComputedStyle(parent);

      this.fire((e) => {
        if (this.isResize) {
          document.body.style.cursor = "ew-resize";
          if (parseInt(css.minWidth, 10) < e.clientX && e.clientX < parseInt(css.maxWidth, 10)) {
            parent.style.width = `${e.clientX}px`;
            eventEmitter.emit("resize", parent.style.width);
          }
        }
      });
    }
    return parent;
  }

  /**
   * reisze発火時の処理
   * @param callback
   */
  private fire(callback: (e: MouseEvent) => void): void {
    this.resizeable.addEventListener("mousedown", () => {
      this.isResize = true;
    });
    document.addEventListener("mousemove", (e) => {
      callback(e);
    });
    document.addEventListener("mouseup", () => {
      this.isResize = false;
      document.body.style.cursor = "default";
    });
  }
}