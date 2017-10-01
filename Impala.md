---
title: Impala
weight: 5
show_toc: false
---

Impala is an imperative and functional programming language which targets the Thorin intermediate representation. Its syntax heavily borrows from Rust, with some noticeable changes: it allows user-directed partial evaluation of code, and continuation passing style constructs.

## Example of Impala's Partial Evaluation

Below is a simple example showing how Impala can partially evaluate a dot product function and generate efficient specialized code.
More advanced examples can be found in the [AnyDSL GitHub organization](https://github.com/AnyDSL).

```rust
fn dot(a: &[i32], b: &[i32], n: i32) -> i32 {
    let mut sum = 0;

    for i in range(0, n) {
        sum += a(i) * b(i);
    }

    sum
}

fn main() -> i32 {
    let a = /* ... */;
    let b = /* ... */;

    // The @ marks partial evaluation.
    let c = @dot(a, b, 4);

    // In this case, it will generate an equivalent of the following code:
    // let mut c = 0;
    // c += a(0) * b(0);
    // c += a(1) * b(1);
    // c += a(2) * b(2);
    // c += a(3) * b(3);
}
```