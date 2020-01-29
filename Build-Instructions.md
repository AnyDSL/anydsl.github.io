---
title: Building Instructions
parent: index.md
weight: 1
---

## Quick Build

```bash
~$ git clone git@github.com:AnyDSL/anydsl.git
~$ cd anydsl
~/anydsl$ cp config.sh.template config.sh
~/anydsl$ ./setup.sh
```
You may also want to fine-tune ```config.sh```.

On __Windows__ you may prefer the setup completely based on CMake
```powershell
...> git clone https://github.com/AnyDSL/anydsl.git -b cmake-based-setup
...> cd anydsl
...\anydsl> mkdir build_msvc-x64 && cd build_msvc-x64
...\anydsl\build_msvc-x64> cmake -G "Visual Studio 15 2017" -A x64 -Thost=x64 ..
```
With an pre-existing build of LLVM that matches AnyDSL's requirements, you can insert ```-DLLVM_DIR=<path to LLVMConfig.cmake>``` as first argument to cmake.
This will skip the download/configure of LLVM.
Otherwise LLVM is build on-demand as dependency of thorin.

You can fine-tune dependencies and options using ```cmake-gui```

```powershell
...\anydsl> cmake-gui build_msvc-x64
```

You'll find the generated AnyDSL.sln inside the build folder or use CMake to build AnyDSL.
```powershell
...\anydsl> cmake --build build_msvc-x64 --config Release
```

## Verify your Installation

As pointed out by the build script, ensure that ```impala``` and your build of ```clang``` is in your path:
```bash
~/anydsl$ which impala
~/anydsl$ which clang
```

## Try out *hello world*

Invoking ```impala --help``` shows available options. 
As impala currently does not ship with a standard library, ```impala``` emits LLVM files. 
We link via ```clang``` small C-wrappers to communicate with the outside world and to build the final executable. So let's compile ```hello_world.impala```:
```bash
~/anydsl$ cd impala/test
~/anydsl/impala/test$ clang lib.c -O2 -c                                # compile wrappers
~/anydsl/impala/test$ impala --emit-llvm -O2 codegen/hello_world.impala # produce hello_world.bc
# link wrapper and hello_world.ll to executable
~/anydsl/impala/test$ clang hello_world.ll lib.o       
~/anydsl/impala/test$ ./a.out
```

## Troubleshooting

* Double-check that your fresh build of llvm & clang is in your path.
* Please make sure that LLVM and clang is properly built.
If you used too many threads (see your ```config.sh```), you may run out of memory during linking.
* If you are debugging thorin/impala you may be annoyed that gdb is so slow.
    This is because thorin/impala links to LLVM.
    Use 
    ```bash
    : ${LLVM:=false}
    ``` 
    in your ```config.sh``` to disable LLVM support.

