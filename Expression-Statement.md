<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Contents**

- [Syntax](#syntax)
- [Typing](#typing)
- [Semantics](#semantics)
- [Example](#example)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Syntax

```
expr_stmnt     ::= expr;
                 | stmt_like_expr

stmt_like_expr ::= block_expr
                 | for_expr
                 | if_expr
                 | while_expr
                 | with_expr
```

An expression statement is an expression followed by a semicolon.
However, for some so-called *statement-like expressions* the semicolon can be elided.

# Typing

The ```expr``` or ```stmnt_like_expr``` may have any type except ```<no-return>```.

# Semantics

The expression evaluates while its computed value is discarded.
An expression statement is usually used in order to evaluate side-effects.
Impala emits a warning if an expression does not have a side-effect.

# Example

```rust
f();
23; // warning: expression without side-effect
if true { true } else { false } // no semicolon needed for a stmt_like_expr
```
