import Neon from "./neon.js";

class Compiler {
  /**
   * Neon Compiler
   * @param {Array} ast Abstract Syntax Tree
   * @param {object} config Configuration object
   */
  constructor(ast, config = { entryPoint: "Program.Main", outputJson: false }) {
    this.ast = ast;
    this.config = config;

    this.currentContext = this.ast[0];
  }

  compileClass(body) {
    const classData = {
      properties: {},
      methods: {},
    };

    body.forEach((c) => {
      const type = c.type.split(":");

      if (type[0] === "declaration") {
        if (type[1] === "method") {
          classData.methods[c.identifier] = {
            returnType: c.returnType,
            modifiers: c.modifiers,
            parameters: c.parameters,
            body: c.body,
          };
        } else if (type[1] === "property") {
        } else Neon.error();
      } else if (type[0] === "command") {
      } else Neon.error();
    });

    return classData;
  }

  generateClasses() {
    const classes = {};

    for (let i = 0; i < this.ast.length; i++) {
      this.currentContext = this.ast[i];
      const type = this.currentContext.type.split(":");

      if (type[0] === "statement") {
        if (type[1] === "import")
          classes[this.currentContext.import] =
            Neon.lib[this.currentContext.import];
      } else if (type[0] === "declaration") {
        if (type[1] === "class")
          classes[this.currentContext.identifier] = this.compileClass(
            this.currentContext.body
          );
      } else if (type[0] === "command") {
      } else Neon.error();
    }

    return classes;
  }

  generateNex() {
    const classes = this.generateClasses();

    const nex = {
      sys: {
        entryPoint: this.config.entryPoint,
      },
      classes,
    };

    return nex;
  }

  compile() {
    const nex = this.generateNex();
    const bin = this.generateBinary(nex);

    return this.config.outputJson ? nex : bin;
  }

  generateBinary(nex) {
    return Buffer.from(JSON.stringify(nex));
  }
}

export default Compiler;
