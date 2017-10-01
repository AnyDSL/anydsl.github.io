---
title: Tutorial
parent: Impala.md
weight: 1
excerpt: "Impala is an imperative language with functional flavoured constructs. This document is a user guide for the Impala language: it features a step by step introduction to Impala, with a lot of examples."
---

## Basics

Impala is a language that is designed to write DSLs. As such, it comes with no standard library. You can, however, interface Impala code with C/C++ code easily. The first thing you might want to write is a "Hello, world" program:

```rust
extern "C" {
    fn println(&[u8]) -> ();
}

extern
fn hello() -> () {
    println("Hello, world !");
}
```

This snippet of Impala code declares two functions:

  * _println_, which is declared as **extern "C"**, that is, not implemented in Impala but in C, in another source file. It has the signature **(&[u8]) -> ()**, which means it takes a pointer to an array of unsigned bytes, and returns nothing (void).

  * _hello_, which is declared **extern**, that is, callable from C, outside Impala. It has the signature **() -> ()**, which means it takes no argument and returns nothing.

To actually run this impala code, you need a host program in C. This is how a typical C program would call the "hello" function from Impala:

```c
#include <stdio.h>

void hello();

void println(const char* str) {
    puts(str);
}

int main(int arc, char** argv) {
    hello();
    return 0;
}
```

Now, to compile and run this code, you can type in a console:

```shell
impala hello.impala -emit-llvm
llvm-as hello.ll
clang hello.c hello.bc -o hello
```

The equivalent C++ program requires ```hello``` and ```println``` to be declared as ```extern "C"``` to avoid C++ name mangling:

```cpp
#include <stdio.h>

extern "C" void hello();

extern "C"
void println(const char* str) {
    puts(str);
}

int main(int arc, char** argv) {
    hello();
    return 0;
}
```

The compilation works as before:

```shell
impala hello.impala -emit-llvm
llvm-as hello.ll
clang hello.cpp hello.bc -o hello
```

The impala compiler will generate:

  * "hello.ll": a file that contains the LLVM assembly in a human readable format

From this, llvm-as will generate:

  * "hello.bc": a file that contains the corresponding LLVM bytecode

You can use either of these files to link the impala code with the C program using clang.

In case you want to compile your C/C++ using gcc, you need to generate an object file from the .ll:
```shell
impala hello.impala -emit-llvm
llc -filetype=obj hello.ll
gcc hello.c hello.o -o hello
```

## Runtime

A minimal runtime that provides functionality for allocating memory on different devices (CPU / GPU) is provided by the [runtime](https://github.com/AnyDSL/runtime). The runtime provides also functionality for [device code generation and execution](AnyDSL/anydsl/wiki/Device-Code-Generation-and-Execution).


## Language Syntax

### Variables

Variables are declated with **let**, and are immutable by default. Mutables variables are declared with **let mut**. Impala has a type inference system, but the variable can be explicitly typed to resolve ambiguities.

```rust
fn main() -> () {
    let x = 2;      // inferred type: int
    let y = 3u;     // inferred type: uint
    let mut z = x;  // inferred type: mut int
    let mut w: u32; // explicit type: u32

    z = 4;          // permitted: z is mutable
    w = 8u;         // permitted: w is mutable
    // Assignment to x or y is forbidden since they are immutable
}
```

Built-in variables types are:



 |  Name     |                Type                      |   Size   |
 |-----------|------------------------------------------|----------|
 |    i8     | Signed integer                           | 1 bytes  |
 |    i16    | Signed integer                           | 2 bytes  |
 |    i32    | Signed integer                           | 4 bytes  |
 |    i64    | Signed integer                           | 8 bytes  |
 |    u8     | Unsigned integer                         | 1 bytes  |
 |    u16    | Unsigned integer                         | 2 bytes  |
 |    u32    | Unsigned integer                         | 4 bytes  |
 |    u64    | Unsigned integer                         | 8 bytes  |
 |    f16    | Floating point number (half precision)   | 2 bytes  |
 |    f32    | Floating point number (single precision) | 4 bytes  |
 |    f64    | Floating point number (double precision) | 8 bytes  |
 |    int    | Signed integer (alias for i32)           | 4 bytes  |
 |    uint   | Unsigned integer (alias for u32)         | 4 bytes  |
 |    half   | Floating point number (alias for f16)    | 2 bytes  |
 |    float  | Floating point number (alias for f32)    | 4 bytes  |
 |    double | Floating point number (alias for f64)    | 8 bytes  |
 |    bool   | Boolean value                            | 1 bit    |
 |    ()     | Unit type (void)                         | 0 byte   |

Constant literals use a suffix to distinguish their types: `3u` is of type **uint**, whereas `5i8` is of type **i8**. Definite arrays have type **[type * size]**, and indefinite arrays have type **[type]**.

```rust
fn some_arrays() -> () {
    let a = [1, 2, 3, 4]; // has type [int * 4]
    let b = [[1, 2, 3], [1, 2, 3], [1, 2, 3]]; // has type [[int * 3] * 3]
}
```

### Functions
    
Function declarations are introduced with the keyword **fn**. Declarations do not need to be global, you can declare a function inside another function.

```rust
fn add_two(i: int) -> int {
    fn give_me_two(sure: bool) -> int {
        if sure {
            2
        } else {
            42
        }
    }
    i + give_me_two(true)
}
```

In Impala, the last expression of a block is the return value of that block. In the previous example, the function "add_two" returns "i + 2".

Anonymous functions (closures) can be declared with the **||** symbol. The arguments with their respective types must be mentioned between the **|**, and an arrow with the return type must follow.

```rust
fn add_two(i: int) -> int {
    let give_me_two =
        |sure: bool| -> int
            if sure {
                2
            } else {
                42
            };
    i + give_me_two(true)
}
```

You can also use the keyword **return** to exit from the function early with a given value. For example, the following code is valid Impala code:

```rust
fn safe_division(i: int, j: int) -> int {
    if j == 0 {
        return(0)
    }
        
    i / j
}
```

Since Impala has functional features, it is possible to pass functions around, as parameters or variables. See this example:

```rust
fn safe_division2(i: int, j: int) -> int {
    let f = safe_division; // type of f is inferred: fn(int, int) -> int
    let g: fn(int, int) -> int = safe_division2; // explicit type annotation
    f(i, j)
}
```

```rust
fn apply_function(f: fn(int) -> int, i: int) -> int {
    f(i)
}
```

> Impala also uses CPS (continuation-passing style) internally, and the previous example is actually syntactic sugar for:
> ```rust
> fn safe_division(i: int, j: int, return: fn(int) -> !) -> ! {
>     if j == 0 {
>         return(0)
>     }
>        
>     return(i / j)
> }
> ```
> That is, ```safe_division``` is a function that never returns and takes a function called `return` with one integer parameter as last argument.

### Structures

Records are present in Impala, and take the form of _structures_:

```rust
struct Vector {
    x: float,
    y: float,
    z: float
}

fn x_axis_vector() -> Vector {
    let foo = Vector {
            x : 1.0f,
            y : 0.0f,
            z : 0.0f
    };
    let forty_two = Vector {
            x : 42.0f,
            y : 42.0f,
            z : 42.0f
    };
    
    foo
}
```

The dot operator (**.**) is used to access to one member of a structure:

```rust
fn add_vectors(a: Vector, b: Vector) -> Vector {
    Vector {
        x : a.x + b.x,
        y : a.y + b.y,
        z : a.z + b.z
    }
}
```

### Pointers

Impala also features pointers that can be used to interface Impala code with C/C++ or to dynamically allocate memory. In this context, the **&** operator is used in two different places: in a type declaration, where it defines a pointer type, and in an address-taking expression, where it takes the address of some variable. The star operator (__*__) plays the same role as in C: it dereferences the pointer.

```rust
fn main() -> () {
    // variables have to be declared mutable if you want to take their address
    let mut x = 5;
    let p0 = &x;
    let p1 = &mut x;

    // p0 has only read access to the variable pointed
    let y = *p0;
    *p1 = 8;
}
```

Memory allocation is controlled by the tilde operator (**~**), which allocates one element of the given type and initializes it with the given value:

```rust
fn alloc_test() -> () {
    // x is of type mut ~int
    let mut x = ~5;
    // y is of type mut ~Vector
    let y = ~Vector { x : 0.0f, y : 0.0f, z : 1.0f };   
    x = ~3;
    y.x = 1.0f;
}
```

Memory allocated in that manner is only accessible through the host (i.e. not valid on a GPU). Using this feature requires to link against the [runtime](https://github.com/AnyDSL/runtime).

### Control Structures

Various imperative control flow structures are available in Impala: **for**, **while**, **if**/**else**. Here are some examples of how to use them:

```rust
fn sign(a: int) -> int {
    if a > 0 {
        1
    } else if a < 0 {
        -1
    } else {
        0
    }
}

fn log(a: int) -> int {
    let mut p = 1;
    let mut q = 0;

    while p < a {
        p *= 2;
        q += 1;
    }

    q
}
```

Impala provides syntactic sugar for the **for** protocol. This allows to define custom iterating functions that can be used with the **for** construct: a user-defined iterating function which takes as last parameter the body of the for loop, can be expressed using the **for** construct. See this example:

```rust
fn range(mut a: int, b: int, body: fn(int) -> ()) -> () {
    while a < b {
        body(a);
        a += 1;
    }
}

fn sum() -> int {
    let mut s = 0;
    // this is syntactic sugar for:
    // range(0, 128, |i| {
    //     s += s * 2 + 1;
    // });
    for i in range(0, 128) {
        s += s * 2 + 1;
    }
    s
}
```

### Casts

Impala supports type conversions using the cast expression:

```rust
// Converts an integer to a floating point value
fn int_to_float(i: int) -> float {
    i as float 
}
```

Converting from floating point to integer truncates the value. Conversions can also happen from definite to indefinite array types.

The `bitcast` intrinsic allows to cast binary data of one type into another. Here is an example:

```rust
extern "thorin" {
    fn bitcast[D, S](S) -> D;
}

// Reinterprets the integer data as floating point
fn int_as_float(i: int) -> float {
    bitcast[float](i);
}
```

### Inline Assembly

It is possible to write inline assembly in Impala by using the **asm** statement.
Consider the following example in LLVM-flavored x86 assembly:

```rust
fn mov_and_add(a: int) -> int {
    let mut b: int;
    asm ("movl $1, %eax\n\t"    /* assembly */
        "movl %eax, $0\n\t"     /* template */
        "addl $$4, $0\n\t"
        : "=r"(b)               /* outputs */
        : "r"(a)                /* inputs */
        : "{eax}"               /* clobbers */
        //: options here, e.g. "volatile", "alignstack"
        );
    // b == a + 4
    b
}
```

In the assembly template **$i** is substituted by the i-th output or input operand, counting first the outputs and then the inputs.
**%eax** references the **eax** register in x86 and **$$4** emits 4 as a constant.
The strings in the assembly statement get passed through to the backend so the syntax used is either that of [LLVM](http://llvm.org/docs/LangRef.html#inline-assembler-expressions) or [GCC](https://gcc.gnu.org/onlinedocs/gcc/Extended-Asm.html), depending on which backend is used.
The most important difference is that in GCC-syntax **%i** references the i-th operand, **%%reg** references a certain register and **$c** emits the constant c.

The inputs and outputs are comma-separated lists of **"constraint"(expression)**.
The expressions must have primitive-, pointer- or SIMD-type and output expressions must be lvalues.
See the LLVM and GCC documentation for an explanation of the constraints.

The clobber list declares registers not mentioned as inputs or outputs that are modified in the assembly code, **{memory}** is also possible.

Additionaly the options **volatile**, **alignstack** and **intel** are possible, the latter two only if the LLVM backend is used.
They should be used if the assembly code has sideeffects, if the function containing it should align its stack or if the assembly code uses the Intel dialect for x86 instead of the default AT&T dialect respectively.
Note that in the AT&T dialect source and target of an instruction are switched compared to the Intel dialect, i.e. the target is the last operand.

The order of the constituents of the **asm** statement may not be changed and if one of them is missing but there are others present after it, the respective colons must be there, e.g.

``` asm("mov $0, [$1]": "=r"(b): "r"(a) :: "intel"); ```

