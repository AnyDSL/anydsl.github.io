---
title: Just-In-Time Compilation
parent: Runtime.md
excerpt: "Describes how jit-compilation and execution of Impala code works from within C/C++."
show_toc: false
---

The runtime provides support for jit-compilation of Impala code from within C++.

By default, the AnyDSL runtime is built without jit support.
To enable jit, enable the CMake option ```RUNTIME_JIT``` of the runtime.

The following example shows how a simple function is jit-compiled and executed using ```anydsl_compile()``` and ```anydsl_lookup_function()```.
```anydsl_compile()``` will load all Impala files of the runtime and add the user-provided Impala code, ```anydsl_lookup_function()``` will return the pointer to a given function:
```c++
#include <iostream>
#include <string>

#include <anydsl_jit.h>

typedef int(*exec_fn)();

int main(int argc, char** argv) {
    int opt = 3;
    std::string program_str = "extern fn get_42() -> i32 { 42 }";
    auto key = anydsl_compile(program_str.c_str(), (uint32_t)program_str.size(), opt);
    if (auto ptr = anydsl_lookup_function(key, "get_42")) {
        auto fun = reinterpret_cast<exec_fn>(ptr);
        std::cout << "value: " << fun() << std::endl;
    } else {
        std::cout << "Compilation failed!" << std::endl;
        return EXIT_FAILURE;
    }

    return EXIT_SUCCESS;
}
```

External functions defined by the AnyDSL runtime are supported, custom external functions need to be linked as a shared library using ```anydsl_link(lib)```:
```c++
anydsl_link("libcustom.so");
anydsl_compile(...);
```

```anydsl_compile()```, ```anydsl_link()```, and ```anydsl_lookup_function()``` are provided by the AnyDSL runtime jit library, which needs to be linked when compiling.
