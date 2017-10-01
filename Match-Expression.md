---
title: Match Expression
parent: Control-Related-Expressions.md
---

## Syntax

```
arms ::= single_arm[',']
       | single_arm ',' arms

single_arm ::= ptrn '=>' expr

match_expr ::= 'match' expr '{' arms '}'
```

A match expression consists of the keyword `match` followed by an expression and a comma-separated list of arms enclosed by braces. The last comma in the arm list is optional. A match expression arm consists of a pattern and an associated expression with a fat arrow (`=>`) in between.

## Typing

The type of all the right-hand sides of the arms of a match expression must agree, and form the type of the match expression itself. The type of the patterns must match that of `expr`. A pattern that handles all possible forms for `expr` must be present. Patterns containing identifiers always introduce new variables in a new scope, even if variables with the same name exist in the outer scope.

## Semantics

A match expression tests whether a given expression corresponds to each of the patterns listed in its arms. The first pattern to match will be chosen, and consequently, any pattern following a pattern that is always true will be ignored.

## Example

```rust
let x = (5, 6, 6);
let z = match x {
    (5, 7, 6) => 8,
    (_, x, 6) => x, // x is 6 here, and not (5, 6, 6)
    _ => 4          // all cases must be handled
};
// z = 6
```
