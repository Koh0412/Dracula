import { dialog } from "electron";

interface IOptionProperty {
  openFile: string;
  openDirectory: string;
  multiSelections: string;
  showHiddenFiles: string;
  createDirectory: string;
  promptToCreate: string;
  noResolveAliases: string;
  treatPackageAsDirectory: string;
}

type PropertyType = keyof IOptionProperty;

class Dialog {
  private options: Electron.OpenDialogOptions = {};
  /**
   * saveDialogを生成, 返り値はセーブしたパス
   */
  public createSaveDialog(defaultPath: string): string | undefined {
    if (defaultPath) {
      this.options.defaultPath = defaultPath;
    }
    return dialog.showSaveDialogSync(this.options);
  }

  /**
   * openDialogを生成、返り値は開いたパス
   *
   * @param propertyType
   */
  public createOpenDialog(propertyType: PropertyType): string[] | undefined {
    this.options.properties = [propertyType];
    return dialog.showOpenDialogSync(this.options);
  }
}

export default new Dialog();