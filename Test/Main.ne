import Base;

private class Test {
    protected static string Message;
}

public class Program : Test {
    private int a = 5;
    private int b;

    public static void Main() {
        Message = "Hello, World!";
        b = 8;
        Base.Log(Message);
        Base.Log(a + b);
    }
}
