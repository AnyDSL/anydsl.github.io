---
title: Statements
parent: Impala.md
weight: 6
show_toc: false
---

Impala only supports a few statements.
Most constructs are [Expressions]({% link Expressions.md %}).
Use a [Block Expression]({% link Block-Expression.md %}) in order to group a list of statements.

## Syntax

```
stmnt ::== asm_stmt
         | expr_stmt
         | item_stmt
         | let_stmt
```
