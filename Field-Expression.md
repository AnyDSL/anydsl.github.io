<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Contents**

- [Syntax](#syntax)
- [Typing](#typing)
- [Semantics](#semantics)
- [Examples](#examples)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Syntax

```
field_expr ::= expr '.' identifier
```

# Typing

If ```expr``` has the type of an [[Struct Decl]] ```S```, or is of type ```reference of type 'S'``` or ```lvalue of type 'S'``` and ```S``` has a field ```identifier``` of type ```T```, the whole expression has type ```T```/```reference of type 'T'``` or ```lvalue of type 'T'```.

# Semantics

# Examples

```rust
```
