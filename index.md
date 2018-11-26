---
title: AnyDSL - A Partial Evaluation Framework for Programming High-Performance Libraries
weight: -1
menu: Home
show_toc: false
---

AnyDSL is a framework for domain-specific libraries (DSLs).
These are implemented in our language [Impala]({% link Impala.md %}).
In order to achieve high-performance, Impala *partially evaluates* any abstractions these libraries might impose.
Partial evaluation and other optimizations are performed on AnyDSL's intermediate representation [Thorin]({% link Thorin.md %}).

## AnyDSL Architecture

![AnyDSL Architecture](images/anydsl-architecture.svg)

## Embedding of DSLs in Impala

When developing a DSL, people from different areas come together:
- The *application developer* who just wants to use the DSL,
- the *DSL designer* who develops domain-specific abstractions, and
- the machine expert who knows the target machine very well and how to massage the code in order to achieve good performance.

AnyDSL allows a *separation of these concerns* using
- Higher-order functions,
- Partial evaluation and,
- triggered code generation.

### Application Developer

```rust
fn main() {
    let img = load("dragon.png");
    let blurred = gaussian_blur(img);
}
```

### DSL Designer

```rust
fn gaussian_blur(field: Field) -> Field {
    let stencil: Stencil = { /* ... */ };
    let mut out: Field   = { /* ... */ };

    for x, y in @iterate(out) {
        out.data(x, y) = apply_stencil(x, y, field, stencil);
    }

    out
}
```

### Machine Expert

```rust
fn iterate(field: Field, body: fn(int, int) -> ()) -> () {
    let grid  = (field.cols, field.rows, 1);
    let block = (128, 1, 1);

    with nvvm(grid, block) {
        let x = nvvm_tid_x() + nvvm_ntid_x() * nvvm_ctaid_x();
        let y = nvvm_tid_y() + nvvm_ntid_y() * nvvm_ctaid_y();
        body(x, y);
    }
}
```

## Talk

<div class="article__video article__video--16by9">
<iframe src="https://www.youtube.com/embed/pIJga3ioFBs" frameborder="0" allowfullscreen></iframe>
</div>

## Selected Results

### Stincilla: [https://github.com/anydsl/stincilla](https://github.com/anydsl/stincilla)

*Stincilla* is a DSL for stencil codes.
We used the Gaussian blur filter as example and compared against the implementations in OpenCV 3.0 as reference.
Thereby, we achieved the following results:
- Intel CPU: 40% faster
- Intel GPU: 25% faster
- AMD GPU: 50% faster
- NVIDIA GPU: 45% faster
- Up to 10x shorter code

### RaTrace: [https://github.com/anydsl/traversal](https://github.com/anydsl/traversal)

*RaTrace* is a DSL for ray traversal.
- 17% faster on NVIDIA GTX 970 (reference: Aila et al.)
- 11% faster on Intel Core i7-4790 using type inference (reference: Embree)
- 10% slower on Intel Core i7-4790 using auto-vectorization (reference: Embree)
- 1/10th of coding time according to Halstead measures
