---
title: Language Reference Manual
parent: Thorin.md
---

# Abstract

Thorin is an intermediate representation based on continuation-passing style (CPS). 
For an introduction to CPS please refer to [Wikipedia](http://en.wikipedia.org/wiki/Continuation_passing_style). 
This article also suggests [further reading](http://en.wikipedia.org/wiki/Continuation_passing_style#References) about CPS.
Please refer to [A Graph-Based Higher-Order Intermediate Representation](http://www.cdl.uni-saarland.de/papers/lkh15_cgo.pdf) for a more scientific introduction to Thorin.

# Definitions

There exist three ways to define values in Thorin, called definitions:

1. Functions are definitions,
2. their parameters are definitions and
3. Primops are definitions.

Primops are a way to express simple acyclic calculations without using continuations. 
Primops induce an acyclic, functional data-flow graph which allows for simple code analyses and transformations. 
Primops are not explicitly scheduled in functions. 
Instead, they are \"floating\", i.e., their data dependencies determine certain constraints where a primop may be scheduled.

# Type System

## Primitive Types

### Integer Types

Thorin supports *signed* (`s`) and *unsigned* (`u`) two-complement integer types of the bit widths 8, 16, 32 and 64. 
Additionally, each type comes in two flavors: 
Precise (`p`) types using wrap-around arithmetic and so-called quick (`q`) types which will yield `bottom` if an overflow or underflow occurs.
Consequently, the following types are available:

* `ps8`
* `ps16`
* `ps32`
* `ps64`
* `pu8`
* `pu16`
* `pu32`
* `pu64`
* `qs8`
* `qs16`
* `qs32`
* `qs64`
* `qu8`
* `qu16`
* `qu32`
* `qu64`

Additionally, there is a boolean type:

* `bool`

### Floating-point Types

Thorin knows two floating-point types - each of them in a *precise* (`p`) and a *quick* (`q`) flavor:

* `pf32` (`float` in many C implementations)
* `pf64` (`double` in many C implementations)
* `qf32` (`float` with `-ffast-math` in many C implementations)
* `qf64` (`double` with `-ffast-math` in many C implementations)

### Compound Types

### Tuple Types

Two tuple types `(t1, ..., tn)` which are syntactically equivalent, are considered equal.

### Struct Types

TODO

### Function Types

As function never return in CPS, function types do not posses a return type. 
The type `fn(t1, ... tn)` denotes the type of a function taking arguments of types `t1`, ..., `tn`.

## Memory-Related Types

### Frame type

The type of a stack frame `frame` is created by `enter` or destroyed by escaping a function.
<!--TODO: say what this means-->

### Memory monad type

Thorin uses a memory [monad](http://en.wikipedia.org/wiki/Monad*28functional_programming29) to capture changes in memory and side effects. 
The type of this monad is `mem`.

### Pointer type

A pointer of type `T` is referred to as `T*`.

## Generics

Thorin features [impredicative polymorphism](http://en.wikipedia.org/wiki/Parametric_polymorphism#Impredicative_polymorphism) based on [System F](http://en.wikipedia.org/wiki/System_F). 
Programmers not familiar with System F can think of function templates in C++ while type checking is performed on the templated version of a function (as opposed to type checking just each template instantiation as in C++).
Generic types (or just *generics*) are Thorin's vehicle to express this parametric polymorphism. 
<!--A generic `generic(f, i)` references its function `f`, which introduces the implicit for-all quantifier, and a number `i` in order to distinguish two or more generics introduces by the same function `f`.-->

# Functions and Parameters

The main ingredient of all Thorin programs are functions. 
In a classical compiler framework, there exist basic blocks and (usually first-order) functions. In Thorin, both concepts are represented by functions and yet Thorin's functions are more powerful than classic first-order representations: 
Thorin allows higher-order functions, i.e., you can pass functions as parameters to other functions.

Each lambda consists of a head and a body:

```
name(param_1: type_1, ..., param_n: type_n): pi(type_1, ..., type_n)
    target(arg_1, ..., arg_m)
```

## Function Head

The head is essentially just a parameter list `param_1`, ..., `param_n` of type `type_1`, ..., `type_n`. 
The type of this function is then `fn(type_1, ..., type_n)`.

## Function Body

The body of a function just consists of an invocation of `target` while passing `arg_1`, ..., `arg_m` as arguments. 
The arguments `arg_1`, ..., `arg_n` may be arbitrary definitions.

The `target` may either be 

* another function,
* a parameter (of function type) or
* a `select cond, t, f` where `cond` is of type `bool` and `t` and `f` are again functions of type `fn()`. Note that neither `t` nor `f` are allowed to be parameters.

The latter construct allows to create branches. For example, the following Impala program

```rust
fn main(i: int) -> int {
    let a: int;
    if (i == 0) {
        a = 23;
    } else {
        a = 42;
    }

    a
}
```

translates to the following Thorin program:


```
main(i: qs32, return: fn(qs32))
    u1 cond = cmp_eq i, qs32 0
    fn() to = select cond, if_then, if_else
    to()

if_then()
    next(23)

if_else()
    next(42)

next(a: qs32)
    return(a)
```

As already mentioned, primops are not explicitly scheduled in Thorin. 
Due to data dependencies of primops, several possible schedules are implied.
In order to make the Thorin output textual representable, AnyDSL decides on a schedule. 
This means, that a code placement algorithm places all primops into functions. 
The output we can see at the top is a scheduled version of the actual program representation. 
For this reason, it looks as if Thorin explicitly knows that `u1 cond = cmp_eq i, qs32 0` must be within `main`. 
But again: This is not true. 
Only the code placement algorithm decided on a schedule. 
This is what we see.

# Primops

Thorin's primops are by design very similar to [LLVM's instructions](http://llvm.org/docs/LangRef.html).
The reason for this is twofold: 
First, AnyDSL uses LLVM under the hood to generate code. 
Similar design allows us to simplify our backend. 
Second, LLVM is a well-designed compiler IR. 
Many thoughts and ideas back LLVM. 
Hence, it is reasonable to build on top of this design.

## Literals

Literals are modelled by nullary primops, i.e., primops taking no further arguments.

### PrimLit

Primitive literals exist for all primitive types.

### Bottom

A value which is not a value. 
Sounds contradictory but useful for [data-flow analysis](http://en.wikipedia.org/wiki/Data_flow_analysis).

## Arithmetic Primops

All arithmetic primops work on two definitions of the same *primitive* type. The same type is also the result type.

### add
```
add a, b
```
Addition: `a + b`

### sub
```
sub a, b
```
Subtraction: `a + b`

### mul
```
mul a, b
```
Multiplication: `a + b`

### div
```
div a, b
```
Division: `a / b`. 
Dividing by zero creates a `bottom` value.

### rem
```
urem a, b
```
Remainder (aka modulo): `a % b`. 
Dividing by zero creates a `bottom` value.

### and
```
and a, b
```
Bitwise AND: `a & b`

### or
```
or a, b
```
Bitwise OR: `a | b`

### xor
```
xor a, b
```
Bitwise XOR: `a ^ b`

### shl
```
shl a, b
```
Shifts bits in `a` by `b` positions to the left: `a << b`. 
The least significant `b` bits are filled with `0`. If `b` is equal to or larger then the number of bits of `a`, the result will be `bottom`.

### shr
```
shr a, b
```
Shifts bits in `a` by `b` positions to the right: `a >> b`. 
The most significant `b` bits are filled with `0` in the case of unsigned operands or with `1` in the case of signed operands. 
If `b` is equal to or larger then the number of bits of `a`, the result will be `bottom`.

## Comparisons

All comparisons work on two definitions of the same primitive type. 
The result type is always `bool`. 
Comparisons between precise floats are always ordered; comparisons between quick floats are always unordered.

```
eq a, b
```
Yields `1` if the operands are equal, `0` otherwise.

### ne
```
ne a, b
```
Yields `1` if the operands are unequal, `0` otherwise.

### gt
```
gt a, b
```
Yields `1` if `a` is greater than `b`.

### ge
```
ge a, b
```
Yields `1` if `a` is greater than or equal to `b`.

### lt
```
lt a, b
```
Yields `1` if `a` is less than `b`.

### le
```
le a, b
```
Yields `1` if `a` is less than or equal to `b`.

## Conversion Primops

### cast
```
cast a to T
```
Converts `a` to T. 
Both the type of `a` and `T` must be primitive or pointer types.

### bitcast
```
bitcast a to T
```
Converts `a` to T by reinterpreting the bits of `a`. 
No computation is performed. 
Both the type of `a` and `T` must have the same bit width.

## Aggregate-Related Primops

### tuple
```
tuple v1, ..., vn
```
Constructs a tuple with values `v1` till `vn`. 
The result will be of type `(typeof(v1), ..., typeof(vn))`. 
It is allowed to construct the empty tuple. 
<!--Note that a tuple containing constant definitions is considered constant.-->

### extract
```
extract t, i
```
Extracts from `t`, which must be of tuple, array or vector type, the (i-1)th value. 
The argument `i` must be a PrimLit of integer type and it must hold 0 \<= `i` \< num\_elems\_of(t). 
The result type is the type of the (i-1)th element in `t`.

### insert
```
insert t, i, v
```
Constructs a new value of the same type as `t` (which must be of sigma, array or vector type) by inserting `v` into the (i-1)th position in `t`. 
The argument `i` must be a PrimLit of integer type and it must hold 0 \<= `i` \< num\_elems\_of(t). 
Moreover, the type of `v` must be equal to the type of the (i-1)th element in `t`.

## Memory-Related Primops

The following primops deal with memory accesses. 
Thereby, we assume that `p` is of pointer, `m` of monad and `f` of frame type.

### load
```
load m, p
```
Loads from monad `m` the value pointed to by `p`: `*p`. 
The new monad value and the loaded value is yielded.
Thus, the type of a `load` is `(mem, typeof(*p))`.

### store
```
store m, p, v
```
Stores `v` at the location pointed to by `p` in the monad `m`. 
It must hold that `typeof(*p) = typeof(v)`. 
A new monad is returned.

### enter
```
enter m
```
Creates a stack frame. 
A pair of a new monad and a frame is returned.
Thus, the type of a `enter` is `(mem, frame)`.

### slot
```
slot f, i of T
```
Creates a stack slot of number `i` in frame `f` of type `T`. 
A pointer to this slot (of type `T*`) is returned. 
The purpose of index `i` is to make stack slots unique. 
Dereferencing a pointer pointing to a slot which has been destroyed yields undefined behavior.
<!--TODO say exactly when a slot is destroyed-->
