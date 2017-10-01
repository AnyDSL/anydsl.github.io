<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Contents**

- [Quick Build](#quick-build)
- [Verify your Installation](#verify-your-installation)
- [Try out *hello world*](#try-out-hello-world)
- [Troubleshooting](#troubleshooting)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Quick Build

```bash
git clone git@github.com:AnyDSL/anydsl.git
cd anydsl
cp config.sh.template config.sh
./setup.sh
```
You may also want to fine-tune ```config.sh```.
In particular, if you don't have a GitHub account with a working [SSH key](https://help.github.com/articles/generating-ssh-keys), set ```: ${HTTPS:=true}```.
This will clone all repositories via https.

# Verify your Installation

As pointed out by the build script, ensure that ```impala``` and your build of ```clang``` is in your path:
```bash
which impala
which clang
```

# Try out *hello world*

Invoking ```impala --help``` shows available options. 
As impala currently does not ship with a standard library, ```impala``` emits LLVM files. 
We link via ```clang``` small C-wrappers to communicate with the outside world and to build the final executable. So let's compile ```hello_world.impala```:
```bash
cd impala/test
clang infrastructure/lib.c -O2 -c                 # compile wrappers
impala --emit-llvm -O2 codegen/hello_world.impala # produce hello_world.bc
# link wrapper and hello_world.ll to executable
clang hello_world.ll lib.o       
./a.out
```

# Troubleshooting

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

