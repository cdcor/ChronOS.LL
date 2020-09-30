
Some miscellaneous notes:

- The first three test cases attempt to test most of code generation. Subsequent tests are usually
  smaller versions of these three. The first one is the code example you gave us.
- The third tests inner loops. It print 'o' followed by a number to indicate an iteration of the
  outer loop (which iterates 3 times) and 'i' followed by a number to indicate an iteration of the
  inner loop (which iterate 2 times). Hence the output is: 'i1i2o1 i1i2o2 i1i2o3 '
- I believe the only two things that are not working are subtraction and nested double-equals,
  which are recognized by the compiler and an error is generated.


Some miscellaneous notes (from Project 2):

- Click on the syntax tree display's header to switch between the AST and CST. I ran out of time to
  make that obvious.
- If a variable isn't declared, it doesn't appear in the symbol table since I moved all symbol
  stuff out of parse and lex into semantic analysis.

- Still have to work on the situation like this one where a should be marked as unused but isn't.

{
    int a
    a = 0
}


Some miscellaneous notes (from Project 1):

- I tested in both Firefox and Chrome (for Windows...)
- The symbol table and output do scroll (in case OS X hides the scroll bars and it isn't clear).
- In verbose output, "Looking for <some token> ..." without the succession of an error implies
  that the correct token was found. It seemed redundant to add a whole another 
  "Found <some token>!" message even though it does make the parser seem like it's in a better
  mood.


Credits:
IDE-ish window thanks to CodeMirror http://codemirror.net/
Syntax tree thanks to Miles Shang http://mshang.ca/syntree/