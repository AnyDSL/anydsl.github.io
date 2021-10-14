---
title: Cross Compilation
parent: Impala.md
weight: 3
excerpt: "This document describes how to emit target llvm code for cross compilation in Impala."
---

## Cross Compilation

For cross compilation, Impala supports flags to specify the target triple and target cpu:
```
impala --emit-llvm --host-triple aarch64-unknown-linux-gnu --host-cpu cortex-a53
```
In addition, individual target features can be enabled/disabled:
```
impala --emit-llvm --host-triple aarch64-unknown-linux-gnu --host-cpu cortex-a53 --host-attr +crc,+crypto,+fp-armv8,+neon,+sve,+sve2
```
Target features are only considered if the target triple and target cpu are also specified.

Using the CMake support from AnyDSL, the ```--host-triple```, ```--host-cpu```, and ```--host-attr``` flags can be passed via ```IMPALA_FLAGS``` to the ```anydsl_runtime_wrap``` function.
