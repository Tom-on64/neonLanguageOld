import Neon from "./neon.js";

class Runner {
  constructor(nex) {
    this.nex = nex;
  }

  runBuiltIn(method, args) {
    method.body.forEach((c) => {
      let code = c;
      for (let i = 0; i < method.parameters.length; i++) {
        const p = method.parameters[i];
        const a = args[i];
        let v = args[i].value;

        if (a.type !== p.type) Neon.error();

        if (a.type === "string") v = `"${v}"`;
        code = code.replaceAll(`%${p.identifier}%`, v);
      }
      eval(code);
    });
  }

  runMethod(method, args, from) {
    let returnData = null;

    if (method.builtIn) {
      this.runBuiltIn(method, args);
      return;
    }

    method.body.forEach((e) => {
      if (e.type === "call") {
        const args = e.args;
        this.runMethod(this.getMethod(`${e.member}.${e.property}`), args);
      } else Neon.error();
    });

    return returnData;
  }

  getMethod(path, from) {
    const pathList = path.split(".");
    const cls = pathList.shift();
    const prop = pathList.pop();
    let method = this.nex.classes[cls];

    if (pathList.length > 0) {
      pathList.foreach((p) => {
        method = method.properties[p];
      });
    }

    method = method.methods[prop];

    if (method.modifiers.includes("private") && from !== cls) method = false;

    return method;
  }

  run(args) {
    const entryPoint = this.nex.sys.entryPoint;
    const main = this.getMethod(entryPoint, entryPoint.split(".")[0]);
    if (main) this.runMethod(main, args, entryPoint.split(".")[0]);
    else Neon.error();
  }
}

export default Runner;
