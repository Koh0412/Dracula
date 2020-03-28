export default class Resize {
  private isResize: boolean = false;
  private resizeable: HTMLElement;

  constructor(resizeable: HTMLElement) {
    this.resizeable = resizeable;
    const parent = resizeable.parentElement;
    if (parent) {
      parent.style.position = "relative";

      this.fire((e) => {
        if (this.isResize) {
          parent.style.width = `${e.clientX}px`;
        }
      });
    }
  }

  /**
   * reisze発火時の処理
   *
   * @param callback
   */
  private fire(callback: (e: MouseEvent) => void) {
    this.resizeable.addEventListener("mousedown", () => {
      this.isResize = true;
    });
    document.addEventListener("mousemove", (e) => {
      callback(e);
    });
    document.addEventListener("mouseup", () => {
      this.isResize = false;
    });
  }
}