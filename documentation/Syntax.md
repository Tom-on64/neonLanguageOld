# Syntax

---

## EBNF

```EBNF
SYNTAX ::= statement*

statement ::= classDeclaration | importStatement | commandStatement

classDeclaration ::= modifiers? 'class' identifier baseClass? classContent
modifiers ::= modifier*
modifier ::= 'public' | 'private' | 'protected' | 'internal' | 'static' | 'abstract' | 'virtual' | 'final' | 'transistent' | 'volatile' | 'unsigned' | 'sealed' | 'unsafe' | 'partial' | 'new'
baseClass ::= ':' identifier (',' identifier)
classContent ::= '{' expressions? '}'

importStatement ::= 'import' imports
imports ::= ((importList | import) | '*') 'from' path ('as' identifier)?
importList ::= '{' import (',' import)* '}'
import ::= identifier

commandStatement ::= '#' command commandArgs* ';'
command ::= 'RUN' | 'LOG' | 'END'
commandArgs = string | int | float | bool

path ::= (('.' | '..')? '/')? identifier ('/' (identifier | '..'))* ('.' string)?
identifier ::= char string?
string ::= (char | digit | '_' | '-')*
char ::= 'A'..'Z' | 'a'..'z'
float ::= int ('.' int int*)? 'f'
int ::= ('-'? digitNoZero digit*) | '0'
digit ::= digitNoZero | '0'
digitNoZero ::= '1'..'9'
bool ::= 'true' | 'false'
```

```neon
public static class Test : Idk {
  private static bool isWorking = true

  private void Main(float number) {
    if (isWorking && number > 10) isWorking = false;
  }
}

#RUN Test.Main(6)
```
