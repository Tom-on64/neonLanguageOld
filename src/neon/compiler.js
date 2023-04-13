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
  }

  generateClasses() {
    const classes = {};

    this.ast.forEach((c) => {
      const type = c.type.split(":");

      if (type[0] === "statement") {
        if (type[1] === "import") {
          c.imports.forEach((i) => (classes[i] = Neon.lib[i]));
        } else if (type[1] === "declaration") {
          if (c.declares === "class") {
            classes[c.identifier] = this.generateClass(c.body);
            if (c.extends !== null) {
              if (!classes[c.extends].properties)
                Neon.error(300, [c.identifier, c.extends]);
              classes[c.identifier].properties = {
                ...classes[c.identifier].properties,
                ...classes[c.extends].properties,
              };
              classes[c.identifier].methods = {
                ...classes[c.identifier].methods,
                ...classes[c.extends].methods,
              };
            }
          }
        }
      }
    });

    return classes;
  }

  generateClass(body) {
    const c = {
      properties: {},
      methods: {},
    };

    body.forEach((i) => {
      const type = i.type.split(":");

      if (type[0] === "statement") {
        if (type[1] === "import") {
          i.imports.forEach((i) => (classes[i] = Neon.lib[i]));
        } else if (type[1] === "declaration") {
          if (i.declares === "class") {
            classes[i.identifier] = this.generateClass(i.body);
          } else if (i.declares === "property") {
            c.properties[i.identifier] = {
              type: i.propType,
              modifiers: i.modifiers,
              value: i.value,
            };
          } else if (i.declares === "method") {
          }
        }
      }
    });

    return c;
  }

  generateNex() {
    const sys = {
      entryPoint: this.config.entryPoint,
    };

    const classes = this.generateClasses();

    return { sys, classes };
  }

  compile(logNex) {
    const nex = this.generateNex();
    const bin = this.generateBinary(nex);

    if (logNex) console.log(nex);

    return this.config.outputJson ? nex : bin;
  }

  generateBinary(nex) {
    return Buffer.from(JSON.stringify(nex));
  }
}

export default Compiler;
