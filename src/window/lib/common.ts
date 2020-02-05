import { ISize } from "../definition/ISize";
import * as path from "path";

export default class Common {
  public static size: ISize = {
    width: 800,
    height: 640
  };

  public static backgroundColor: string = "#23282f";
  public static mainURL: string = path.join(__dirname, "../../index.html");
  public static iconPath: string = path.join(__dirname, "../../../../resources/image/pen-icon.png");
}