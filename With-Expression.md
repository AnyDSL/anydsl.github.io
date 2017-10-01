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
'with' param_list 'in' map_expr block_expr
```

Note that in contrast to most imperative languages like C/C++ or Java, a ```with```-construct is not a statement but an expression and, thus, yields a value.

# Typing

A ```with```-expression is syntactic sugar for:
```rust
f(args, |param_list, break| -> ! block_expr)
```

Suppose ```f``` has type:
```rust
fn(A, fn(I) -> B) -> R
```
```args``` must be of type ```A``` and ```param_list``` of type ```I```.
Additionally, Impala implicitly declares the following continuation which is usable inside ```block_expr```:

* ```break``` of type ```fn(B) -> !```

   This is the return-continuation of the call to ```f```.
   Thus, invoking this continuation returns from the current [[Function Expression]] with a value of type ```B```.

Since ```block_expr``` also exits the current [[Function Expression]],  its type must be ```B```, too.
The type of the whole ```with``` expression is ```R``` - whatever is yielded by invoking ```f```.

# Semantics

Since a ```with``` expression is just syntactic sugar, see [[Map Expression]].

# Examples

```rust
TODO
```
