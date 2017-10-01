---
title: While Expression
parent: Control-Related-Expressions.md
---

## Syntax

```
while_expr ::= 'while' expr_c block_expr
```

Note that in contrast to most imperative languages like C/C++ or Java, a ```while```-construct is not a statement but an expression and, thus, yields a value.

## Typing

The condition ```expr_c``` of an ```while```-expression must be of type ```bool```.
The body ```block_expr``` must be of type unit ```()``` or of type ```<no-return>```.

## Semantics

If ```expr_c``` evaluates to ```true```, the body expression ```block_expr``` evaluates and the ```while```-expression is evalulated again.
Additionally, impala implicitly declares two continuations which are usable inside ```block_expr```:

1. ```continue``` of type ```fn() -> !```

    Invoking this continuation jumps to the next iteration of this loop.
2. ```break``` of type ```fn() -> !```

    Invoking this continuation jumps to the pointer *after* the loop.

These continuations are first-class citizens and can be passed to other functions.

## Examples

```rust
fn main(mut x: int) -> () {
    while x < 23 {
        ++x
    }

    while x < 42 {
        let outer_break = break;
        let outer_continue = continue;
        while x < 42 {
            if x == 1 {
                continue()
            }
            if x == 2 {
                outer_continue()
            }
            if x == 3 {
                break()
            }
            if x == 4 {
                outer_break()
            }
        }
        ++x
    }

```
