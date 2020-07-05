import * as path from "path";

export class Common {
  public static backgroundColor: string = "#23282f";
  public static mainURL: string = path.join(__dirname, "../../index.html");
  public static iconPath: string = path.join(__dirname, "../../../../resources/image/dr.png");

  public static minWidth: number = 450;
  public static minHeight: number = 400;
}