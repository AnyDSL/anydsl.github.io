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
definite_array_expr ::= '[' (expr ',')* ']'
                      | '[' expr ',' '..' literal ']'
```

The last comma in the first case is optinal.

# Typing

1. The expression ```[e_1, ..., e_n]``` has type ```[T * n]``` if all ```e_i``` are of type ```T```.
2. The expression ```[e, .. n]``` has type ```[T * n]``` if all ```e_i``` are of type ```T```. ```n``` must be a constant.

# Semantics

1. All elements are evaluated from left to right and packed into a [[Definite Array]].
2. The expression is evaluated and ```n```-times duplicated in order to be packed into a [[Definite Array]].

# Examples

```rust
let a = [1, 2, 3];
let b = [[1, 2], [3, 4]];
let c = [23, .. 4];
```
