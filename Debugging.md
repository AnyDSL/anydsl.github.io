---
title: Debugging
parent: index.md
weight: 4
---

This page provides some tips how to debug Impala/Thorin.

* change log level during debugging
    ```gdb
    call thorin::Log::set_min_level(0)
    ```
* Note that you can output thorin code during debugging:
    ```gdb
    call scope.thorin()
    call scope.write_thorin("my_file_scope.thorin")
    
    call world.thorin()
    call world.write_thorin("my_file_world.thorin")
    ```
* You can also add the following to your ```~/.gdbinit``` file:
    ```gdb
    define tos
      call $arg0->to_string()
    end
    document tos
      Call to_string on an object.
    end
    define wrthorin
      call $arg0.thorin()
      call $arg0.write_thorin($arg1)
    end
    document wrthorin
      Write thorin representation to the file given as argument.
    end
    ```