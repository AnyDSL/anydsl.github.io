<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Contents**

- [Abstract](#abstract)
- [A First Tutorial](#a-first-tutorial)
- [Basics](#basics)
  - [Casts](#casts)
  - [Array and ArrayRef](#array-and-arrayref)
  - [Ranged-based `for`](#ranged-based-for)
- [Definitions](#definitions)
- [The World](#the-world)
- [The C++ `const` qualifier and mutating objects](#the-c-const-qualifier-and-mutating-objects)
  - [Mutating Lambdas](#mutating-lambdas)
  - [Mutating Primops and Parameters](#mutating-primops-and-parameters)
- [Primops and Local Optimizations](#primops-and-local-optimizations)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Abstract

This guide describes the most important classes and programming concepts in Thorin. 
Please also read Thorin's [[Language Reference Manual]]. 
This guide assumes that you are already familiar with Thorin.

# A First Tutorial

Before getting into detail, let us discuss how to manually construct a Thorin representation of the following program:

```rust
fn main(i: int) -> int {
    let a: int;
    if i == 0 {
        a = 23;
    } else {
        a = 42;
    }
    a
}
```

As outlined in the Thorin [[Language Reference Manual]] this program is represented in Thorin as follows:

```
main(i: u32, return: fn(u32))
    u1 cond = cmp_eq i, u32 0
    fn() to = select cond, if_then, if_else
    to()

if_then()
    next(23)

if_else()
    next(42)

next(a: u32)
    return(a)
```

Now let us construct this program with the C++ API:

```cpp
World world; // serves as container for our program

// create the four functions:
auto main = world.lambda(world.fn_type(
                    {world.type_u32(), world.fn_type({world.type_u32()})}));
auto if_then = world.lambda(); // defaults to 'fn()'
auto if_else = world.lambda(); // defaults to 'fn()'
auto next = world.lambda(world.fn_type({world.type_u32()}));

// create comparison:
auto cmp = world.relop_cmp_eq(main->param(0), world.literal_u32(0));

// wire lambdas
main->branch(cmp, if_then, if_else);
if_then->jump(next, {world.literal_u32(23)});
if_else->jump(next, {world.literal_u32(23)});
next->jump(main->param(1), {next->param(0)});
```

Here, we computed SSA form manually. 
However, if we look at the original example it is not directly visible where to add parameters to local functions and so forth. 
For this reason, AnyDSL offers a built-in SSA construction algorithm. 
Simply create a unique number which serves as handle for each variable.

```cpp
World world; // serves as container for our program

// create the four functions:
auto main = world.lambda(world.fn_type(
                    {world.type_u32(), world.fn_type({world.type_u32()})}));
// same as world.lambda() but this time if_then/if_else is "unsealed"
auto if_then = world.basicblock(); 
auto if_else = world.basicblock();
auto next = world.lambda(world.fn_type({world.type_u32()}));

// create comparison:
auto cmp = world.relop_cmp_eq(main->param(0), world.literal_u32(0));

// seal "basic blocks" as soon as possible, 
// i.e., you promise to not add additional predecessors later on
main->branch(cmp, if_then, if_else);
if_then->seal();
if_else->seal();

// We use handle '0' to represent variable 'a' in the original program.
// Now let us create the assignments:
if_then->set_value(0, world.literal_u32(23));
if_else->set_value(0, world.literal_u32(42));

// wire next
if_then->jump(next, {});
if_else->jump(next, {});
next->seal();
next->jump(main->param(1), {next->get_value(0, world.type_u32()}));
```

Please refer to [Braun et al.](http://www.cdl.uni-saarland.de/papers/bbhlmz13cc.pdf) for details about this algorithm.

# Basics

## Casts

Use the `as` method as static cast. 
An assertion will be raised in the debug version if this cast is not possible during runtime. 
Moreover, it is checked at compile time whether the target type of the cast is a subtype of the casted type. 
Thus, prefer the `as` method over an ordinary cast. 

Similarly, The `isa` method is a more convenient version of a `dynamic_cast`. 
It also checks subtyping like ```as```:
```cpp
// short hand for: const T* t = static_cast <const T*>(foo)
const T* a = foo->as<T>(); 
// short hand for:       T* t = static_cast <      T*>(foo)
      T* b = foo->as<T>(); 
// short hand for: const T* t = dynamic_cast<const T*>(foo)
const T* a = foo->isa<T>(); 
// short hand for:       T* t = dynamic_cast<      T*>(foo)
      T* b = foo->isa<T>(); 
```

Note that in C++ you can do the following to build a "type-if":

```cpp
void foo(Def def) {
    if (auto primop = def->isa<PrimOp>()) {
        // do sth with primop
    else if (auto param = def->isa<Param>()) {
        // do sth with param
    } else {
        // must be a Lambda; there are only three kinds of definitions
        const Lambda* lambda = def->as<Lambda>(); 
        // you can also get rid of const in the case of a Lambda (see below)
        Lambda* lambda = def->as_lambda();
        // do sth with lambda
    }
}
```


## Array and ArrayRef

An `Array` is just a fixed sized array allocated on the heap:

```cpp
Array<int> a(10); // an array of 10 ints
```

An `ArrayRef` _points_ to an `Array`, `std::vector` or a C-style array:

```cpp
// points to 'a', 
// no additional dynamic memory operations (heap operations) are performed
ArrayRef<int> ref(a); 
```

This is the preferred class when passing a list of things to functions. AnyDSL makes heavy use of this. Remember that `ArrayRef` already _is_ the reference. So pass this class _as value_ to other functions. References to an `ArrayRef` are almost always superfluous.

Note that `ArrayRef` has an constructor for [std::initializer_list](http://en.cppreference.com/w/cpp/utility/initializer_list). Thus, all functions/methods expecting `ArrayRef`s can also use C++11's brace syntax:

```cpp
// fn(u32, u32, u64)
auto fn_type = world.fn_type(
                {world.type_u32(), world.type_u32(), world.type_u64()}); 
```

## Ranged-based `for`

We highly encourage to use C++11's [range-based `for` loop](http://en.wikipedia.org/wiki/C%2B%2B11#Range-based_for_loop) whenever possible.
Note that the aforementioned `Array` and `ArrayRef` classes work just fine with range-based `for`.

# Definitions

As outlined in the Thorin [[Language Reference Manual]] there exists three possibilities to define values:

1. primops,
2. lambdas and
3. their parameters.

Each definition inherits from the [Def](http://anydsl.github.io/doxygen/thorin/classthorin_1_1_def.html) class. 
A `Primop` class inheriting from [Def](http://anydsl.github.io/doxygen/thorin/classthorin_1_1_def.html) is the base class for all primops. 
The `Lambda` class (also inheriting from [Def](http://anydsl.github.io/doxygen/thorin/classthorin_1_1_def.html)) represents a function. 
Once created, a `Lambda` instance automatically creates its parameters (represented by the `Param` class which is the third and last class inheriting from [Def](http://anydsl.github.io/doxygen/thorin/classthorin_1_1_def.html)):

```cpp
World w;
// create a lambda of type fn(u32, f32)
auto lambda = w.lambda(w.fn_type({w.type_u32(), w.type_f32());
auto uparam = lambda->param(0);
auto fparam = lambda->param(1);
```

We can later on add additional parameters if required. 
Pay attention that any potential users of this lambda are likely to become broken. 
Thus, only do this when constructing a function but never afterwards:

```cpp
lambda->append_param(w.type_u1)); // lambda is now of type fn(u32, f32, u1)
auto bparam = lambda->param(2);
```

Note that lambdas are always mutable. 
You can always modify their contents. 
In particular, you would like to fill a lambda by specifying a body. 
You do this by letting this function jump to a target:

```cpp
// creates a jump: some_function(uparam, fparam)
lambda->jump(some_function, {uparam, fparam}));
```

An assertion is raised if a type error occurs, i.e., `some_function`'s type must be `fn(u32, f32)`.
You can always update the body to your liking:

```cpp
lambda->jump(some_other_function, {a, b, c});
```

Do not worry about leaking memory. 
This is all handled by Thorin. 
Any definitions which become dead and/or unreachable will be deleted after invoking `cleanup_world`:

```cpp
// get rid of dead and unreachable code; also unused types will be destroyed.
cleanup_world(w);
```

# The World

The most important class in AnyDSL is the [World](http://anydsl.github.io/doxygen/thorin/classthorin_1_1_world.html) class. This class serves three main purposes:

* It is a factory class to construct functions, primops and types. 
  The constructor of the actual classes are private. Always use [World](http://anydsl.github.io/doxygen/thorin/classthorin_1_1_world.html)'s factory methods to retrieve an instance of your node.
* When constructing primops several local optimizations are performed (see below).
* The whole program you want to construct lives in a [World](http://anydsl.github.io/doxygen/thorin/classthorin_1_1_world.html) instance. 
  You can create several [World](http://anydsl.github.io/doxygen/thorin/classthorin_1_1_world.html) instances. 
  But these are completely independent of each other. 
  If you mix things across world instances your program is broken.

# The C++ `const` qualifier and mutating objects

Once created, primops, types and parameters are immutable. 
They are internally stored in the `world`; parameters are handled by their `Lambda`. 
For this reason you will always get `const` pointers to parameters and primops. 

## Mutating Lambdas

However as outlined above, lambdas are mutable. 
To be on the safe side you will always get immutable objects. 
If this object is in fact a `Lambda` you want to get rid of the `const` qualifier as lambdas are mutable. 
Use the `as_lambda` and `isa_lambda` for this purpose:

```cpp
void foo(Def def) {
    if (auto lambda = def->isa_lambda()) { // dynamic_cast
        // you may now mutate 'lambda'
    }
    //...
    // static_cast (checked in the debug version)
    auto lambda = def->as_lambda(); 
    // you may now mutate 'lambda'
}
```

## Mutating Primops and Parameters

Primops and Parameters cannot really be mutated. 
Instead, create a new thing and replace the old node with the new one:

```cpp
const PrimOp* old_primop = ...;
const PrimOp* new_primop = ...;
old_primop->replace(new_primop);
```

From now on, `old_primop` still lives in the [World](http://anydsl.github.io/doxygen/thorin/classthorin_1_1_world.html) but it is dead. 
Unless you create new users for `old_primop` it will be wiped out as dead code after the next invocation of `World::cleanup()`. 
Maybe you want to "update" the second operand of some primop. 
You can do this by "rebuilding" the primop in question:

```cpp
Def add = ...;
Array<Def> new_ops = add.ops();
new_ops[1] = world.literal_u32(42);
Def updated = world.rebuild(add, new_ops);
add->replace(update);
```

# Primops and Local Optimizations

When ever you construct a new primop, local optimizations are performed in order to simplify the program under construction. 
For this reason, [World](http://anydsl.github.io/doxygen/thorin/classthorin_1_1_world.html)'s factory methods always return [Def](http://anydsl.github.io/doxygen/thorin/classthorin_1_1_def.html):

```cpp
auto def = world.arithop_add(world.literal_u32(1), world.literal_u32(2));
// def is NOT an ArithOp; it is a PrimLit of value 3
```

Thus, never assume anything about `def`. 
And there really is no reason to do this. 
It may even be the case that due to the built-in common subexpression elimination you get a pointer to a definition you have already built:

```cpp
auto def1 = world.arithop_add(a, b);
// ...
auto def2 = world.arithop_add(a, b);
// def1 == def2 due to the built-in CSE
```
