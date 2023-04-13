import { readFileSync, writeFileSync } from "fs";
import Compiler from "./compiler.js";
import Lexer from "./lexer.js";
import Parser from "./parser.js";
import Runner from "./runner.js";
import errors from "./errors.js";

class Neon {
  /**
   * The Neon Programing Language
   */
  constructor() {}

  static lib = {
    Base: {
      properties: {},
      methods: {
        Log: {
          builtIn: true,
          returnType: "void",
          modifiers: ["public", "static"],
          parameters: [{ type: "string", identifier: "msg" }],
          body: ["console.log(%msg%)"],
        },
      },
    },
  };

  /**
   * Compile provided code
   * @param {string} codePath Path to .ne
   * @param {string?} outDir Output file directory (Default './')
   * @param {string?} outFile Output file (Default 'out.nex')
   * @param {object?} config Configuration object
   * @returns Neon Executable
   */
  static compile(codePath, outPath = "./", outFile = "out.nex", config) {
    const code = readFileSync(codePath, "utf-8");
    // Tokenize
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize(true);
    // Parse
    const parser = new Parser(tokens);
    const tree = parser.parse(true);
    console.log(tree[1]);
    /*/ Compile
    const compiler = new Compiler(tree, config);
    const nex = compiler.compile();
    // Output file
    writeFileSync(`${outPath}/${outFile}`, nex);
    return outPath; */
  }

  /**
   * Log an error to the console
   * @param {number} errCode Error code
   * @param {Array?} line Arguments for the error code
   */
  static error(errCode, args = []) {
    let msg = errors[errCode];

    for (let i = 0; i < args.length; i++) msg = msg.replace(`$${i}`, args[i]);

    throw new Error(
      `\u001b[31m[ERR] ${msg} \u001b[33m[\u001b[1m${errCode}\u001b[0m\u001b[33m]\u001b[0m`
    );
  }

  /**
   * Execute a NEX (Neon Executable)
   * @param {string} filePath Neon executable to execute
   * @param {Array} args Program arguments
   */
  static execute(filePath, args = []) {
    const nex = readFileSync(filePath);
    const exe = JSON.parse(nex.toString());

    const runner = new Runner(exe);
    runner.run(args);
  }
}

export default Neon;
