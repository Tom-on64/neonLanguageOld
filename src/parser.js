import Neon from "./neon.js";

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.index = 0;
    this.currentToken = this.tokens[this.index];
  }

  nextBranch() {
    if (this.#match("keyword")) return this.parseKeyword();
    else if (this.#match("modifier")) return this.parseModifier()

    return this.#advance();
  }

  parseModifier() {
    
  }

  parseKeyword() {
    switch (this.currentToken.value) {
      case "import":
        this.#advance();
        const imports = [this.#consume("identifier").value];
        this.#consume("EOL");
        return { type: "statement:import", imports };
      case "class":
        this.#advance();
        const identifier = this.#consume("identifier").value;

        let inherits = null;
        if (this.#match("keyword", "extends")) {
          this.#advance();
          inherits = this.#consume("identifier").value;
        }

        const body = this.parseClassBody();

        return {
          type: "statement:declaration",
          declares: "class",
          identifier,
          extends: inherits,
          body,
        };
      default:
        Neon.error(201, [this.currentToken.value]);
    }
  }

  parseClassBody() {
    this.#consume("special", "{");

    const body = [];

    while (!this.#match("special", "}")) body.push(this.nextBranch());

    this.#consume("special", "}");

    return body;
  }

  parse() {
    const ast = [];

    while (this.currentToken.type !== "EOF") ast.push(this.nextBranch());

    return ast;
  }

  // Helper
  #advance(amount = 1) {
    const lastToken = this.currentToken;
    this.index += amount;
    this.currentToken = this.tokens[this.index];
    return lastToken;
  }

  #peek(amount = 1) {
    return this.tokens[this.index + amount];
  }

  #match(type, value) {
    if (
      this.currentToken.type === type &&
      (value === undefined || this.currentToken.value === value)
    )
      return true;
    else return false;
  }

  #expect(type, value) {
    if (this.#match(type, value)) return true;
    else Neon.error(200, [type, this.currentToken.type]);
  }

  #consume(type, value) {
    if (this.#expect(type, value)) return this.#advance();
  }
}

export default Parser;
