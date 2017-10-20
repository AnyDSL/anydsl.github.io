---
title: For Expression
parent: Control-Related-Expressions.md
---

## Syntax

```
for_expr ::= 'for' param_list in map_expr block_expr
```

Note that in contrast to most imperative languages like C/C++ or Java, a ```for```-construct is not a statement but an expression and, thus, yields a value.

## Typing

A ```for```-expression is syntactic sugar for:
```rust
f(args, |param_list, continue| -> ! block_expr)
```

We call ```f``` the [generator](https://en.wikipedia.org/wiki/Generator_(computer_programming)).
Suppose ```f``` has type:

```rust
fn(A, fn(I) -> C) -> B
```
```args``` must be of type ```A``` and ```param_list``` of type ```I```.
Aditionally, Impala implicitly declares two continuations which are usable inside ```block_expr```:

1. ```continue``` of type ```fn(C) -> !```

   Invoking this continuation re-enters the generator because this causes the current [Function Expression] to return with a value of type ```C```.
2. ```break``` of type ```fn(B) -> !```

   This is the return-continuation of the call to the generator ```f```.
   Thus, invoking this continuation prematurely exits the whole loop.
   Since the generator's return type is ```B```, breaking must also yield something of type ```B```.

Since ```block_expr``` also calls the generator again, its type must be ```C```.
The type of the whole ```for``` expression is ```B```.

## Semantics

Since a ```for``` expression is just syntactic sugar, see [Map Expression].

## Examples

```rust
extern "C" {
    fn print_int(i32) -> ();
}

fn range(mut b: i32, e: i32, body: fn(i32) -> ()) -> () {
    while b < e {
        body(b++)
    }
}

fn sum_range(mut b: i32, e: i32, body: fn(i32) -> i32) -> i32 {
    let mut sum = 0;
    while b < e {
        sum += b;
        b += body(b)
    }
    sum
}

fn main(x: i32) -> () {
    for i in range(0, 3) {
        print_int(i); // 0 1 2
    }

    let mut step = 1;
    let sum = for i in sum_range(0, 16) { 
        if step == 3 {
            step++;
            continue(1)
        }
        print_int(i); // 0 1 4 8 13
        step++
    };
    print_int(sum); // 29
}
```

[Function Expression]: Function-Expression.md
[Map Expression]: Map-Expression.md

