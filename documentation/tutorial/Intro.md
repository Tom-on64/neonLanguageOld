# Welcome to Neon!

---

## My first program

So let's write our first program in Neon!

```neon
import Base;

public class Program {
  public static void Main(string[] args) {
    Base.Log("Hello, World!");
  }
}
```

The output should be `Hello, World!`.

How does this code work?

We start by declaring a `public class` named `Main`.
A `class` is like a blueprint: you can create multiple instances of the same class and access them individually.
The `public` keyword means that we can access this class from outside this file. \
On the second line, we declare a `public static void` method named `Main`.
A method is indicated by the brackets after it.
Inside the first pair of parentheses, we can put arguments for the method
Inside the pair of curly brackets, we can put code that the method will execute when run. \
`public` means that this method can be accessed from outside the class.
If it were `private`, we could only run it from inside the class. \
`static` means that this method belongs to this class and not to a specific instance of the class. \
`void` is the return type of the method. This type doesn't return anything of value. \
Inside the method, we have some code. This code gets executed when the method is run.
We only have one line of code: `Log("Hello, World!");`.
This is a method from the standard library.
All it does is print its arguments to the standard output (in this case, your console). \
Finally, we have `#RUN Main.Main();`. This line runs the `Main` method inside our `Main` class. \
That's it! This program just prints out `Hello, World!`.
You'll learn more about return types and other concepts later in this tutorial.
