import Neon from "../src/neon.js";

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.index = 0;
    this.currentToken = this.tokens[this.index];
  }

  advance(amount = 1) {
    let lastToken = this.currentToken;
    this.index += amount;
    this.currentToken = this.tokens[this.index];
    return lastToken;
  }

  peek(amount = 1) {
    return this.tokens[this.index + amount];
  }

  parseKeyword() {
    switch (this.currentToken.value) {
      case "import":
        this.advance();
        if (
          this.currentToken.type === "identifier" &&
          this.peek().type === "EOL"
        )
          return { type: "statement:import", import: this.advance().value };
        else if (this.peek().type !== "EOL")
          Neon.error(`Expected end of line!`, "007", 0, this.index);
        Neon.error(`Expected identifier!`, "006", 0, this.index);

      case "class":
        this.advance();
        let identifier;
        let body = [];
        if (this.currentToken.type !== "identifier")
          Neon.error(`Expected identifier!`, 0, this.index);
        else if (this.peek().type !== "special")
          if (this.peek().value !== "{")
            Neon.error(
              `Expected '{' got ${this.currentToken.value}!`,
              "008",
              0,
              this.index
            );

        identifier = this.currentToken.value;
        this.advance();
        while (this.currentToken?.value !== "}") {
          this.advance();
          body.push(this.parseDeclaration(true));
        }

        return { type: "declaration:class", identifier, body };

      default:
        Neon.Error(
          `Unknown keyword ${this.currentToken.value}`,
          "004",
          0,
          this.index
        );
    }
  }

  parseCommand() {
    let out = { type: "command" };
    return out;
  }

  parseDeclaration() {
    let identifier;
    let returnType = null;
    const modifiers = [];
    const parameters = [];
    const body = [];

    // Get modifiers
    while (this.currentToken.type === "keyword")
      modifiers.push(this.advance().value);

    // Get return type
    if (this.currentToken.type === "type") returnType = this.advance().value;

    // Get the identifier
    if (this.currentToken.type === "identifier")
      identifier = this.advance().value;

    // Get parameters
    if (this.currentToken.type !== "special")
      if (this.currentToken.value !== "(")
        Neon.error(
          `Expected '(' got ${this.currentToken.value}!`,
          "010",
          0,
          this.index
        );
    this.advance();

    // Close parameters
    while (this.currentToken?.value !== ")") {
      if (this.currentToken.type !== "type")
        Neon.error(
          `Expected type got ${this.currentToken.type}!`,
          "009",
          0,
          this.index
        );

      let type = this.advance().value;

      // Handle arrays
      if (this.currentToken.type === "special")
        if (this.currentToken.value === "[") {
          type += this.advance().value;
          if (this.currentToken.type !== "special")
            Neon.error(
              `Expected ']' got ${this.currentToken.value}!`,
              "011",
              0,
              this.index
            );
          type += this.advance().value;
        }

      let identifier;
      if (this.currentToken.type !== "identifier")
        Neon.error("Expected identifier!", "006", 0, this.index);

      identifier = this.advance().value;

      parameters.push({ type, identifier });
    }

    this.advance();

    // Declare method body
    if (this.currentToken.type === "special") {
      if (this.currentToken.value !== "{")
        Neon.error(
          `Expected '{' got ${this.currentToken.value}!`,
          "008",
          0,
          this.index
        );
    } else
      Neon.error(
        `Expected '{' got ${this.currentToken.value}!`,
        "008",
        0,
        this.index
      );

    this.advance();

    // Parse inside body
    while (this.currentToken?.value !== "}") {
      if (this.peek().type === "special") body.push(this.parseExpression());
      else if (this.peek().type === "operator")
        body.push(this.parseOperation(this.advance(), this.advance()));
      else Neon.error("Unknown", "000", 0, this.index);
    }

    this.advance();

    return {
      type: "declaration:method",
      identifier,
      returnType,
      modifiers,
      parameters,
      body,
    };
  }

  parseExpression() {
    const member = this.advance().value;
    let property;
    let type;

    if (this.peek().type !== "identifier")
      Neon.error("Expected identifier after member!", "013", 0, this.index);
    this.advance();

    while (this.peek()?.value === ".") {
      member += `.${this.advance()}`;
      if (this.peek().type !== "identifier")
        Neon.error("Expected identifier after '.'!", "014", 0, this.index);
      this.advance();
    }

    if (this.currentToken.type !== "identifier")
      Neon.error("Expected identifier after member!", "013", 0, this.index);

    property = this.advance().value;

    switch (this.currentToken.type) {
      case "special":
        const args = [];
        if (this.currentToken.value === "(") {
          this.advance();

          type = "call";

          while (this.currentToken?.value !== ")") {
            if (this.currentToken.type === "string") {
              args.push({type: "string", value: this.advance().value});
              continue;
            }

            if (this.currentToken?.value === ",") this.advance();
            if (
              this.currentToken?.type !== "identifier" &&
              this.currentToken?.type !== "string"
            )
              Neon.error("Expected argument!", "015", 0, this.index);
          }
          this.advance();
          if (this.currentToken.type === "EOL") this.advance();
          else if (this.currentToken.type === "operator") this.parseOperation();
          else
            Neon.error(
              "Expected operator after method call!",
              "016",
              0,
              this.index
            );
        } else {
          Neon.error("Expected '(' after property!", "017", 0, this.index);
        }
        return { member, property, type, args };
      case "operator":
        return;
      default:
        Neon.error(
          "Expected '(' or operator after property!",
          "018",
          0,
          this.index
        );
        break;
    }

    return { member, property, type };
  }

  parseOperation(aTkn, operatorTkn) {
    this.advance();
  }

  getNextBranch() {
    let type = this.currentToken.type;
    if (type === "keyword") return this.parseKeyword();
    else if (type === "command") return this.parseCommand();
    else if (type === "type") return this.parseDeclaration();
    else if (type === "EOL") return { type: "EOL" };
    else if (type === "EOF") return { type: "EOF" };
    else
      Neon.error(
        `Unexpected token ${this.currentToken.value}`,
        "003",
        0,
        this.index
      );
  }

  parse() {
    let tree = []

    while (this.index < this.tokens.length) {
      let newBranch = this.getNextBranch();
      if (newBranch.type === "EOF") break;
      this.advance();
      if (newBranch.type === "EOL") return;
      tree.push(newBranch);
    }

    return tree;
  }
}

export default Parser;
