import { ICPKeys } from "../../window/constants/Keys"
import { ipcRenderer } from "electron";

class Render {
  private footer = document.getElementById("footer")!;

  private get input(): HTMLInputElement {
    const input = document.getElementById("input")! as HTMLInputElement;
    return input;
  }

  public init(): void {
    ipcRenderer.on(ICPKeys.save.request, (event, _) => {
      event.sender.send(ICPKeys.save.value, this.input.value);
    });

    ipcRenderer.on(ICPKeys.save.path, (_, filePath: string) => {
      this.footer.innerHTML = "the file has been saved";
      setTimeout(() => {
        this.footer.innerHTML = filePath;
      }, 1500);
    });

    ipcRenderer.on(ICPKeys.open.value, (_, params: string[]) => {
      this.input.value = params[0];
      this.footer.innerHTML = params[1];
    });

    ipcRenderer.on(ICPKeys.open.dir, (event, fileOrDirName: string) => {
      console.log(fileOrDirName);
    });
  }
}

export { Render }