---
title: Block Expression
parent: Control-Related-Expressions.md
---

# Syntax

```
block_expr ::=  '{' statement* [ expr ] '}'
             | '@{' statement* [ expr ] '}'
```
A block expression consists of zero or more statements enclosed with a pair of braces.
Optionally, a block expression may end with an [[Expression|Expressions]].
Additionally, a block expression may start with ```@```.

# Typing

The type of a block expression is the type of ```expr```.
Note that the type of ```expr``` may be ```<no-return>```.
If ```expr``` is elidid the type is unit: ```()```.

# Semantics

All [item statements](Item Statement) within a block exrpression's statement list are bound.
This is similar to a ```letrec``` in functional languages.
Then, all statements consecutively evaluate.
Finally, the closing ```expr``` (if present) evaluates.
This is the evaluation of the whole block expression.
If ```expr``` is elided, unit ```()``` is yielded.

# Examples

```rust
TODO
```
