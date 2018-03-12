---
title: Just-In-Time Compilation
parent: Runtime.md
excerpt: "Describes how jit-compilation and execution of Impala code works from within C/C++."
show_toc: false
---

The runtime provides first support jit-compilation of Impala code from within C++.
This is currently limited to code executed on the CPU.

By default, the AnyDSL runtime is built without jit support.
To enable jit, enable the CMake option ```RUNTIME_JIT``` of the runtime.
Similarly, in C++ ```RUNTIME_ENABLE_JIT``` needs to be defined before including the AnyDSL runtime header.

The following example shows how a simple function is jit-compiled and executed using ```anydsl_compile()```.
```anydsl_compile()``` will load all Impala files of the runtime and add the user-provided Impala code: 
```c++
#include <iostream>
#include <string>

#define RUNTIME_ENABLE_JIT
#include <anydsl_runtime.h>

int main(int argc, char** argv) {
    int opt = 3;
    std::string str = "extern fn get_value() -> int { 42 }";
    if (auto ptr = anydsl_compile(str.c_str(), str.size(), "get_value", opt)) {
        auto fn = reinterpret_cast<int (*)()>(ptr);
        std::cout << "value: " << fn() << std::endl;
        return 0;
    }
    return 1;
}
```

External functions defined by the AnyDSL runtime are supported, custom external functions need to be linked as a shared library using ```anydsl_link(lib)```: 
```c++
anydsl_link("libcustom.so");
anydsl_compile(...);
```

```anydsl_link()``` and ```anydsl_compile()``` are provided by the AnyDSL runtime library, which needs to be linked when compiling.
