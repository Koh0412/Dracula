import { aceLangs } from "../../common/constants";

class FileExtension {

  private name: string = "";

  /**
   * 拡張子から使用言語名を判断し返す
   * @param extname
   */
  public autoJudgement(extname: string): string {
    switch (true) {
      case /^.(c|cpp|h|cc|cxx|hh|hpp|hxx|c\+\+|h\+\+)$/.test(extname):
        this.name = aceLangs.C_CPP;
        break;
      case /^.(cs)$/.test(extname):
        this.name = aceLangs.C_SHARP;
        break;
      case /^.(css)$/.test(extname):
        this.name = aceLangs.CSS;
        break;
      case /^.(dart)$/.test(extname):
        this.name = aceLangs.DART;
        break;
      case /^.(ex|exs)$/.test(extname):
        this.name = aceLangs.ELIXIR;
        break;
      case /^.(elm)$/.test(extname):
        this.name = aceLangs.ELM;
        break;
      case /^.(go)$/.test(extname):
        this.name = aceLangs.GO;
        break;
      case /^.(groovy)$/.test(extname):
        this.name = aceLangs.GROOVY;
        break;
      case /^.(haml)$/.test(extname):
        this.name = aceLangs.HAML;
        break;
      case /^.(hs)$/.test(extname):
        this.name = aceLangs.HASKELL;
        break;
      case /^.(html|htm)$/.test(extname):
        this.name = aceLangs.HTML;
        break;
      case /^.(erb)$/.test(extname):
        this.name = aceLangs.ERB;
        break;
      case /^.(eex)$/.test(extname):
        this.name = aceLangs.EEX;
        break;
      case /^.(java|jar|class)$/.test(extname):
        this.name = aceLangs.JAVA;
        break;
      case /^.(js)$/.test(extname):
        this.name = aceLangs.JS;
        break;
      case /^.(json)$/.test(extname):
        this.name = aceLangs.JSON;
        break;
      case /^.(jl)$/.test(extname):
        this.name = aceLangs.JULIA;
        break;
      case /^.(kt|kts)$/.test(extname):
        this.name = aceLangs.KOTLIN;
        break;
      case /^.(lua)$/.test(extname):
        this.name = aceLangs.LUA;
        break;
      case /^.(mk)$/.test(extname):
        this.name = aceLangs.MAKE_FILE;
        break;
      case /^.(md)$/.test(extname):
        this.name = aceLangs.MARKDOWN;
        break;
      case /^.(sql)$/.test(extname):
        this.name = aceLangs.MYSQL;
        break;
      case /^.(m|mm)$/.test(extname):
        this.name = aceLangs.OBJ_C;
        break;
      case /^.(pl|pm)$/.test(extname):
        this.name = aceLangs.PERL;
        break;
      case /^.(php)$/.test(extname):
        this.name = aceLangs.PHP;
        break;
      case /^.(py|pyw)$/.test(extname):
        this.name = aceLangs.PYTHON;
        break;
      case /^.(ps1)$/.test(extname):
        this.name = aceLangs.SHELL;
        break;
      case /^.(r)$/.test(extname):
        this.name = aceLangs.R;
        break;
      case/^.(rb|ru|ruby|rbw)$/.test(extname):
        this.name = aceLangs.RUBY;
        break;
      case/^.(rs)$/.test(extname):
        this.name = aceLangs.RUST;
        break;
      case/^.(sass)$/.test(extname):
        this.name = aceLangs.SASS;
        break;
      case/^.(scala)$/.test(extname):
        this.name = aceLangs.SCALA;
        break;
      case/^.(scss)$/.test(extname):
        this.name = aceLangs.SCSS;
        break;
      case/^.(sh|bash|zsh)$/.test(extname):
        this.name = aceLangs.SH;
        break;
      case/^.(swift)$/.test(extname):
        this.name = aceLangs.SWIFT;
        break;
      case/^.(toml)$/.test(extname):
        this.name = aceLangs.TOML;
        break;
      case /^.(ts)$/.test(extname):
        this.name = aceLangs.TS;
        break;
      case/^.(xml)$/.test(extname):
        this.name = aceLangs.XML;
        break;
      case/^.(yaml|yml)$/.test(extname):
        this.name = aceLangs.YAML;
        break;
      default:
        this.name = aceLangs.PLAIN_TEXT;
        break;
    }

    return this.name;
  }
}

export default new FileExtension();