---
title: Infix Expression
parent: Operators.md
---

## Syntax

```
infix_expr ::= expr_l op expr_r
op         ::= '*' | '/' | '%' | '+' | '-' | '<<' | '>>' | '&' | '^' | '|' 
              | '==' | '!=' | '<' | '<=' | '>' | '>='
              | '&&' | '||'
              | '=' | '*=' | '/=' | '%=' | '+=' | '-=' 
              | '<<=' | '>>=' | '&=' | '^=' | '|='
```

Also see [operator precedence](https://github.com/AnyDSL/anydsl/wiki/Expressions#precedence).

## Typing

## Semantics

Basically, the semantics of all operations are just like in [C](http://www.open-std.org/JTC1/SC22/WG14/www/docs/n1256.pdf) with a few differences:

### General

* no automatic conversions

### Assignments

* an automatic [[address-of expression|Prefix Expression]] is inserted for ```expr_r``` if ```expr_l``` is a [[Pointer Type]].
* ```expr_r``` maybe a subtype of ```expr_l```.

## Examples

```rust
TODO
```
