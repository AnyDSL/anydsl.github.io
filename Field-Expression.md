---
title: Field Expression
parent: Misc.md
---

## Syntax

```
field_expr ::= expr '.' identifier
```

## Typing

If ```expr``` has the type of an [[Struct Decl]] ```S```, or is of type ```reference of type 'S'``` or ```lvalue of type 'S'``` and ```S``` has a field ```identifier``` of type ```T```, the whole expression has type ```T```/```reference of type 'T'``` or ```lvalue of type 'T'```.

## Semantics

## Examples

```rust
```
