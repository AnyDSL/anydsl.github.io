---
title: Tuple Expression
parent: Constructors.md
---

## Syntax

```
tuple_expr ::= '(' (expr',')* ')'
```
The last comma is optional.
However, in order to specify a 1-tuple, you have to use ```(e,)```.
That being said, 1-tuples will be removed in a future version of Impala.

## Typing

A tuple ```(e_1, ..., e_n)``` has type ```(E_1, ..., E_n)``` where ```e_i``` is of type ```E_i```.

## Semantics

All elements are evaluated from left to right and packed into a tuple value.

## Examples

```rust
let x = (true, 23, 42.f);
```
