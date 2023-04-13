# Abstract Syntax

---

> In the abstract syntax tree (AST) everything has a type, these types are formated like this: `<type>:<subtype>`

### expression:\<subtype>

A combination of values, variables, operators, and functions that is evaluated to a single value. Examples include arithmetic expressions, boolean expressions, and function calls.

### statement:\<subtype>

A single line or block of code that performs an action. Statements are executed in a sequence, and can include variable assignments, control flow statements (if, while, for), and function declarations.

### type:operator

A symbol or keyword that performs a specific operation on one or more values, such as arithmetic (+,-,\*,/), comparison (>, <, ==), or logical (&&, ||) operations.

### type:function

A reusable block of code that performs a specific task, and can accept inputs (arguments) and produce outputs (return values). Functions are typically declared with a name, parameter list, and body of code.

### type:literal

A specific value that is directly included in the code, such as a string ("hello"), number (42), or boolean (true/false).

### type:identifier

A name given to a variable, function, or other element in the code, which can be used to refer to that element in other parts of the code.

### statement:control

A statement that alters the sequence of execution based on a condition or loop, such as if/else statements, while/for loops, and switch statements.

### statement:assignment

A statement that assigns a value to a variable or other element in the code, using the "=" operator.

### expression:conditional 

An expression that evaluates to one of two values based on a condition, using the "?" and ":" operators.

### expression:call

An expression that invokes a function with specific arguments, and optionally returns a value.
