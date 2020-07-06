/** cssに関わるurilクラス */
class CSSUtil {
  /**
   * - cssのcalcメソッドの実行
   * - パーセント - lengthで、パーセントのデフォルト値は100
   *
   * @param length
   * @param percent
   */
  public calc(length: number, percent: number = 100) {
    return `calc(${percent}% - ${length})`;
  }
}

export const cssUtil = new CSSUtil();