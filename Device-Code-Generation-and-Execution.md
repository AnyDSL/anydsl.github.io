---
title: Device Code Generation and Execution
parent: Runtime.md
excerpt: "Describes how device code generation and execution works in Impala."
---

The runtime provides convenience functions that are required in order to execute code on different devices:
- allocate, copy, and release memory on a device
- code generation and execution for different devices
- intrinsics for different devices

## Platforms

When building the runtime, it looks for the following platforms and builds the platform if it is found:

0. Host CPU (default, always present)
1. CUDA
2. OpenCL
3. HSA

Each platform will have devices associated at runtime. Devices are enumerated starting with 0.
For example, properly configured system with a NVIDIA GPU A will result in the following configuration:

- Platform 0: Host
- Platform 1: CUDA
  - Device 0: GPU A
- Platform 2: OpenCL
  - Device 0: GPU A
- Platform 3: HSA
  - dummy platform, no device

Calling runtime functions for a platform or device that is not present terminates the program.

Note: HSA platform is tested on a system using the [ROCm](https://github.com/RadeonOpenCompute/ROCm) 2.9 software stack provided by AMD.

## Memory Management

Memory management functions work on ```Buffers``` that track the device & platform (```device```) and the allocated memory (```data```):
```rust
struct Buffer {
    data : &[i8],
    size : i64,
    device : i32
}
```

Convenience functions are provided to allocate, copy, and release memory. These work on Buffers and the platform will be implicitly injected and derived when needed.

```rust
fn alloc_cpu(size: i32) -> Buffer;
fn alloc_cuda(dev: i32, size: i32) -> Buffer;
fn alloc_opencl(dev: i32, size: i32) -> Buffer;
fn alloc_hsa(dev: i32, size: i32) -> Buffer;

fn release(buf: Buffer) -> ();

fn copy(src: Buffer, dst: Buffer) -> ();
fn copy_offset(src: Buffer, off_src: i32, dst: Buffer, off_dst: i32, size: i32) -> ();
```

## Code Generation and Execution

Code generation and execution for a platform is exposed via functions in Impala:
0. Host CPU: by default all code will be generate for the host CPU
1. CUDA: ```cuda``` and ```nvvm```
2. OpenCL: ```opencl```
3. HSA: ```amdgpu```
The signature for the code generations backends is as follows:
```rust
backend(device, grid, block, fun);
```
- device: the device of the corresponding platform
- grid & block: blocking of the problem into sub-problems
- fun: function for which code will be generated

Note that the grid configuration is provided as in OpenCL.
That is, it defines the total number of threads to be launched, which needs to be a multiple of the block size.

A typical example will look like this:
```rust
let grid   = (1024, 1024, 1);
let block  = (32, 1, 1);
let device = 0;
cuda(device, grid, block, || { ... out(idx) = in(idx); });
synchronize_cuda(device);
```

Using the ```with``` syntax results in a more pleasing syntax:
```rust
let grid   = (1024, 1024, 1);
let block  = (32, 1, 1);
let device = 0;
with cuda(device, grid, block) {
    let idx = cuda_threadIdx_x();
    out(idx) = in(idx);
}
synchronize_cuda(device);
```

The ```Accelerator``` struct is provided to abstract over different compute devices:
```rust
struct Accelerator {
    exec          : fn((i32, i32, i32), // grid
                       (i32, i32, i32), // block
                       fn(WorkItem) -> ()) -> (),
    sync          : fn() -> (),
    alloc         : fn(i32) -> Buffer,
    alloc_unified : fn(i32) -> Buffer,
    barrier       : fn() -> ()
}
```

It uses the ```WorkItem``` struct to provide functions for thread index or block index retrieval:
```rust
struct WorkItem {
    tidx  : fn() -> i32,
    tidy  : fn() -> i32,
    tidz  : fn() -> i32,
    bidx  : fn() -> i32,
    bidy  : fn() -> i32,
    bidz  : fn() -> i32,
    gidx  : fn() -> i32,
    gidy  : fn() -> i32,
    gidz  : fn() -> i32,
    bdimx : fn() -> i32,
    bdimy : fn() -> i32,
    bdimz : fn() -> i32,
    gdimx : fn() -> i32,
    gdimy : fn() -> i32,
    gdimz : fn() -> i32,
    nblkx : fn() -> i32,
    nblky : fn() -> i32,
    nblkz : fn() -> i32
}
```

Using one of the pre-defined accelerators allows to use the same code for different devices:
```rust
let device = 0;
let acc    = cuda_accelerator(device);
let grid   = (1024, 1, 1);
let block  = (32, 1, 1);

for work_item in acc.exec(grid, block) {
    let idx = work_item.gidx();
    out(idx) = in(idx);
}
acc.sync();
```

## Device Intrinsics

The ```Intrinsics``` struct is provided to abstract over device-specific intrinsics, similar to the ```Accelerator``` struct:
```rust
struct Intrinsics {
    expf  : fn(f32) -> f32,
    sinf  : fn(f32) -> f32,
    cosf  : fn(f32) -> f32,
    logf  : fn(f32) -> f32,
    sqrtf : fn(f32) -> f32,
    powf  : fn(f32, f32) -> f32,
    ...
}
```

Using one of the pre-defined intrinsics allows to use the same code for different devices:
```rust
let math = cuda_intrinsics;
...
for work_item in acc.exec(grid, block) {
    let idx = work_item.gidx();
    out(idx) = math.sinf(in(idx));
}
...
```

## Address Spaces

Each GPU memory type has an address space associated, which needs to be annotated.
In Impala, the following address spaces are supported:
- default -> host memory
- 1 -> global memory
- 3 -> shared memory

Correct code will only be emitted in case the address space is valid.
Read-only arrays in global GPU memory are of type ```&[1][T]``` and write-able arrays ```&mut[1][T]```.
```rust
let arr = alloc_cuda(dev, size);
let out = alloc_cuda(dev, size);
...
for work_item in acc.exec(grid, block) {
    let idx = work_item.gidx();
    let arr_ptr = bitcast[   &[1][f32]](arr.data);
    let out_ptr = bitcast[&mut[1][f32]](out.data);
    out_ptr(idx) = arr_ptr(idx);
}
...
```
The address space annotation is manual at the moment, but will be automated with the new upcoming type system.

Memory of compile-time known size in shared (CUDA), local (OpenCL), or group (HSA) memory can be requested using ```reserve_shared```.
```rust
...
for work_item in acc.exec(grid, block) {
    ...
    let shared = reserve_shared[f32](32);
    shared(tidx) = arr_ptr(idx);
}
...
```

## Profiling

Profiling of kernels is disabled by default. To enable profiling, set the ```ANYDSL_PROFILE``` environment variable to ```FULL```:
```bash
ANYDSL_PROFILE=FULL ./binary
```

## NVVM Code Generation Optimization
When generating target code using the ```nvvm``` backend, we emit NVVM IR.
Target ptx code will be generated from the NVVM IR at runtime using the llvm nvptx code generator.
nvptx code generation optimizations can be specified by the ```ANYDSL_LLVM_ARGS``` environment variable:
```bash
ANYDSL_LLVM_ARGS="-nvptx-sched4reg -nvptx-fma-level=2 -nvptx-prec-divf32=0 -nvptx-prec-sqrtf32=0 -nvptx-f32ftz=1"
```

As an alternative to the nvptx code generator, we offer target ptx code generation via NVIDIA's libnvvm interface.
To make use of this backend, the nvvm file needs to be in bitcode format as required by the CUDA installation.
For the current [NVVM](https://docs.nvidia.com/cuda/nvvm-ir-spec/index.html) IR version 1.5, this means LLVM 5.0 based bitcode.


## AMDGPU Code Generation Optimization
When generating target code using the ```amdgpu``` backend, we emit AMDGPU IR.
Target gcn code will be generated from the AMDGPU IR at runtime using the llvm gcn code generator.
gcn code generation optimizations can be specified by the ```ANYDSL_LLVM_ARGS``` environment variable:
```bash
ANYDSL_LLVM_ARGS="-amdgpu-sroa -amdgpu-load-store-vectorizer -amdgpu-scalarize-global-loads -amdgpu-internalize-symbols -amdgpu-early-inline-all -amdgpu-sdwa-peephole -amdgpu-dpp-combine -enable-amdgpu-aa -amdgpu-late-structurize=0 -amdgpu-function-calls -amdgpu-simplify-libcall -amdgpu-ir-lower-kernel-arguments -amdgpu-atomic-optimizations -amdgpu-mode-register"
```

## Example

A simple example that shows how to generate code for different GPUs can be found in [Stincilla](https://github.com/AnyDSL/stincilla/blob/master/test/alloc_gpu.impala).


## Cross Compilation

For cross compilation, the target triple and target cpu can be set via the environment variables ```ANYDSL_TARGET_TRIPLE``` and ```ANYDSL_TARGET_CPU```:
```
ANYDSL_TARGET_TRIPLE=aarch64-unknown-linux-gnu
ANYDSL_TARGET_CPU=cortex-a53
```
In addition, individual target features can be enabled/disabled by specifying the environment variable ```ANYDSL_TARGET_FEATURES```:
```
ANYDSL_TARGET_FEATURES="+armv8-a,+crc,+crypto,+dsp,+fp-armv8,+hwdiv,+hwdiv-arm,+neon,-thumb-mode"
```
Target features are only considered if the target triple and target cpu are also specified.
