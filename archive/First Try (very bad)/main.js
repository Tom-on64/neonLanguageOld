import neon from "./neon.js";

let code = `
class Main {
    private int a = 9;
    private int b = 10;

    private void Main() {
        Math.Add($a, $b);
        Base.Log($a)
    }
}
`

neon(code, "Main.Main");