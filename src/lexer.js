import Neon from "./neon.js";

class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.currentChar = this.input[this.position];
    this.keywords = [
      "import",
      "if",
      "else",
      "for",
      "while",
      "try",
      "chatch",
      "break",
      "continue",
      "class",
      "return",
      "this",
      "super",
      "null",
      "true",
      "false",
      "new",
    ];
    this.modifiers = [
      "public",
      "private",
      "static",
      "abstract",
      "virtual",
      "override",
      "protected",
    ];
    this.types = ["bool", "int", "float", "string", "void", "class", "object"];
    this.operators = [
      "!",
      "=",
      "==",
      ">",
      ">=",
      "<",
      "<=",
      "+",
      "+=",
      "++",
      "-",
      "-=",
      "--",
      "/",
      "/=",
      "*",
      "*=",
      "**",
      "%",
      "&",
      "|",
      "^",
      "~",
      "<<",
      ">>",
      "&&",
      "||",
      "?:",
      "is",
      "as",
    ];
    this.special = ["{", "}", "(", ")", "[", "]", ",", "."];

    // For error messages and such :)
    this.line = 0;
    this.coll = 0;
  }

  advance(amount = 1) {
    this.position += amount;
    this.coll += amount;
    if (this.position >= this.input.length) this.currentChar = null;
    else this.currentChar = this.input[this.position];
  }

  skipWhitespace() {
    while (this.currentChar !== null && /\s/.test(this.currentChar))
      this.advance;
  }

  peek(amount = 1) {
    return this.input[this.position + amount];
  }

  string() {
    this.advance();
    if (this.currentChar === '"') {
      this.advance();
      return { type: "string", value: "" };
    }
    let characters = this.currentChar;
    this.advance();

    while (this.currentChar !== '"') {
      characters += this.currentChar;
      this.advance();
    }

    this.advance();
    return { type: "string", value: characters };
  }

  number() {
    let number = this.currentChar;
    this.advance();

    let dotCount = 0;
    while (this.currentChar !== null && /[0-9]|\./.test(this.currentChar)) {
      if (this.currentChar === ".") {
        dotCount++;
        if (dotCount > 1) {
          Neon.error(101);
          break;
        }
      }
      number += this.currentChar;
      this.advance();
    }

    if (dotCount === 0) return { type: "int", value: parseInt(number) };
    else if (this.currentChar === "f") {
      return { type: "float", value: parseFloat(number) };
    } else {
      Neon.error(
        `Unexpected ${this.currentChar} while declaring float`,
        "102",
        this.line,
        this.coll
      );
      return { type: "Neon.error", value: 2 };
    }
  }

  getNextToken() {
    while (this.currentChar !== null) {
      if (/[0-9]/.test(this.currentChar)) {
        return this.number();
      }

      if (/\w/.test(this.currentChar)) {
        let identifier = "";
        while (this.currentChar !== null && /\w/.test(this.currentChar)) {
          identifier += this.currentChar;
          this.advance();
        }

        if (this.keywords.includes(identifier)) {
          return { type: "keyword", value: identifier };
        } else if (this.modifiers.includes(identifier)) {
          return { type: "modifier", value: identifier };
        } else if (this.types.includes(identifier))
          return { type: "type", value: identifier };

        return { type: "identifier", value: identifier };
      }

      if (this.special.includes(this.currentChar)) {
        let tkn = this.currentChar;
        this.advance();
        return { type: "special", value: tkn };
      }

      if (this.currentChar == ";") {
        this.advance();
        this.line++;
        this.coll = 0;
        return { type: "EOL" };
      }

      if (this.currentChar == ":") {
        this.advance();
        return { type: "keyword", value: "extends" };
      }

      if (this.operators.includes(this.currentChar + this.peek())) {
        let tkn = this.currentChar + this.peek();
        this.advance(2);
        return { type: "operator", value: tkn };
      } else if (this.operators.includes(this.currentChar)) {
        let tkn = this.currentChar;
        this.advance();
        return { type: "operator", value: tkn };
      }

      if (this.currentChar === '"') {
        return this.string();
      }

      this.advance();
    }
    return { type: "EOF" };
  }

  tokenize(logToken = false) {
    const tokens = [];
    let token = this.getNextToken();

    while (token.type !== "EOF") {
      tokens.push(token);
      if (logToken) console.log(token);
      token = this.getNextToken();
    }

    tokens.push({ type: "EOF" });

    return tokens;
  }
}

export default Lexer;
