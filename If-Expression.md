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
if_expr ::= 'if' expr_c block_expr_t ['else' block_expr_f]
```

Note that in contrast to most imperative language like C/C++ or Java, an ```if```-construct is not a statement but an expression and, thus, yields a value.
The ```else``` clause is optional.

# Typing

The condition ```expr_c``` of an ```if```-expression must be of type ```bool```.
Both ```block_expr_then``` and ```block_expr_else``` must be of the same type or of type ```<no-return>```.
If the optional ```else```-clause is elided, its type is unit: ```()```.

# Semantics

If ```expr_c``` evaluates to ```true```, the whole expression evaluates to ```block_expr_t```.
Otherwise, it evaluates to ```block_expr_f```.

Note that an ```if```-expression is lazy.
This means, that ```block_expr_t``` or ```block_expr_f```, respectively, are evaluated after the whole ```if```-expression has been evaluated.

# Examples

 ```rust
fn main(x: i32) -> i32 {
    let y = if x == 0 { 23 } else { 42 };

    if y == 23 {
        1
    } else {
        0
    }
}
```
