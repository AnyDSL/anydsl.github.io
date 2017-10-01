---
title: SIMD Expression
parent: Constructors.md
---

## Syntax

```
simd_expr ::= 'simd' '[' (expr ',')* ']'
```

The last comma is optional.

## Typing

The expression ```simd[e_1, ..., e_n]``` has type ```simd[n * T]``` if all ```e_i``` are of type ```T```. 
```T``` must be a scalar type.

## Semantics

All elements are evaluated from left to right and packed into a SIMD value.

## Examples

```rust
fn mask_store(i: simd[bool * 4], src: simd[int * 4], dst: &mut simd[int * 4]) -> () {
    if i(0) { dst(0) = src(0) }
    if i(1) { dst(1) = src(1) }
    if i(2) { dst(2) = src(2) }
    if i(3) { dst(3) = src(3) }
}

fn main() -> int {
    let mask = simd[true, false, true, false];
    let mut v = simd[1, 2, 3, 4];
    let w = simd[4, 5, 6, 7];
    mask_store(mask, w, &mut v);
    if v(0) + v(1) + v(2) + v(3) == 16 { 0 } else { 1 }
}
```
