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
tuple_expr ::= '(' (expr',')* ')'
```
The last comma is optional.
However, in order to specify a 1-tuple, you have to use ```(e,)```.
That being said, 1-tuples will be removed in a future version of Impala.

# Typing

A tuple ```(e_1, ..., e_n)``` has type ```(E_1, ..., E_n)``` where ```e_i``` is of type ```E_i```.

# Semantics

All elements are evaluated from left to right and packed into a tuple value.

# Examples

```rust
let x = (true, 23, 42.f);
```
