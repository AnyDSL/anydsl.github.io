---
title: Coding Styles
parent: index.md
weight: 5
---

# General Hints

* Avoid [copy & paste](http://en.wikipedia.org/wiki/Copy_and_paste_programming) *at all cost*. Do whatever is necessary to avoid it! The maintainer will ban 'copy & paste' code and will not integrate any patches containing 'copy & paste' code.
* Small is beautiful. Try to reduce the code size whenever you can.
* Try to reuse the existing infrastructure whenever possible. Sometimes you can reuse the infrastructure by slightly enhancing it. Always prefer this approach instead of coding something completely new.
* In the case you really need something new, try to think how your solution can be made more general. Thus, others with slightly similar goals can reuse your solution.
* If you feel, that some of the following rules breaks the beauty/formatting of one particular code snippet, feel free to ignore the rule.
* Do not over-comment your code. See http://blog.codinghorror.com/coding-without-comments/.
* Do not comment the obvious.
Example:

```cpp
class Foo {
//...
    /// Returns the depth.        <-- BAD: elide this comment
    int get_depth() { return depth_; }
};


// clear list                     <-- BAD: elide this comment
list.clear();

// for all elements in map        <-- BAD: elide this comment
for (auto elem : map) {
    //...
}
```

As a _rough_ rule of thumb create one .cpp/.h pair for each class. However, there are several exceptions to this rule:

* Leave supporting structs/classes where they belong: In the file of their supported class.
* Some class hierarchies are pooled into one header (like impala/ast.h) or split into several logical units (anydsl/primop.h, anydsl/memop.h, anydsl/literal.h). The reason for this is, that the number of files would just explode otherwise. Having dozens and dozens of 20 lines long files makes maintaining a pain.

# General Formatting

* We do not impose a stupid horizontal line width limit; feel free to break your line wherever you feel it is applicable. If in doubt, don't break the line. 100 or 120 chars per line are still considered fine.
* Use spaces instead of tabs
* Indentation width is 4 spaces
* You may want to set these options in your `~/.vimrc` if you are a Vim user:

```vim
set expandtab
set autoindent
set shiftround
set backspace=indent,eol,start
set ts=4
set softtabstop=4
set shiftwidth=4
```

# Preprocessor

## Includes

* include corresponding header in the case of a cpp file + new line (you can elide this step if the corresponding header file is not necessary for building the cpp file)
* include all C/C++ headers + new line
* include all other third party headers seperated by new lines (boost, llvm, ...)
* include anydsl headers + new line
* include impala headers + new line

Sort several headers of one group alphabetically

Example (from `impala/parser.cpp`):

```cpp
#include "impala/parser.h"

#include <algorithm>
#include <sstream>

#include "thorin/util/array.h"
#include "thorin/util/assert.h"
#include "thorin/util/push.h"

#include "impala/ast.h"
#include "impala/lexer.h"
#include "impala/prec.h"
#include "impala/type.h"
```

## Misc

* Add Guards for Header Files. Use the pattern `IMPALA_FOO_H` or `THORIN_FOO_H` for a file `impala/foo.h` or `thorin/foo.h`
* Do *not* comment your `#else`, `#endif` with the matching `#ifdef`/`#ifndef` tag.
With a proper editor this comment is useless and superfluous. On the contrary, I've seen too much code where those comments were simply wrong.
Example:

```cpp
#ifndef _NDEBUG
    foo();
#else
    bar();
#endif
```
* *Never ever* put `using` declaratives into a header file
* Favor forward declarations and implementations in the cpp file instead of additional includes
* Favor templates and inline functions over macros. Unfortunately, macros are nevertheless often necessary.

# Source Code Formatting

This is best shown by example:

```cpp
#ifndef THORIN_FOO_H
#define THORIN_FOO_H

namespace thorin {

class Foo {
public:
    Foo(int i, float f)
        : i_(i)
        , f_(f)
    {}

    bool is_zero() const { return i_ == 0; }
    float do_something() { return f_ += i_; }
    int do_something_more_involved();
    int do_something_simple();

private:
    int i_;
    float f_;
};

}

#endif
```

In the cpp file:

```cpp
#include "thorin/foo.h"

namespace thorin {

int Foo::do_somthing_more_involved() {
    while (i_ < 0) {
        for (size_t i = 0, e = num(); i != e; ++i)
            some_array[i]++; // some comment
    }

    switch (i_) {
        case 0:
            f();
            break;
        case 1:
            g();
            break;
        default:
            h();
            break;
    }

    return 23;
}

int Foo::do_somthing_simple() { return ++i_; }

}
```

## General

* Use Java-style braces except for constructors (due to the weird init-list syntax).
* Make use of [const correctness](http://en.wikipedia.org/wiki/Const-correctness).
* One-liners should be one-liners (see `is_zero`/`do_something`). This is also true for cpp files (see `do_somthing_simple`).
* Use spaces after `//`-style comments.
* Use C++11's [range-based for](http://en.cppreference.com/w/cpp/language/range-for).
* Use C++11's `auto` if the type can be easily inferred as human or the exact underlying type is not that important (useful when dealing with containters and iterators).

## Statements

* Use spaces to separate while/if/for/switch from the head
* Use spaces after the semicolon in a `for` head
* Elide superfluous braces in the innermost control flow statement; keep them otherwise.
* Note how, switch/case is indented.
* Often, you want to emphasize the similarities and differences in the case branches. You can also do this:

```cpp
switch (i_) {
    case  0: f(); break;
    case  1: g(); break;
    default: h(); break;
}
```

* If you need unorthodox control-flow (like [multi-level break](http://stackoverflow.com/questions/5670051/java-multi-level-break)) use `goto`. Introducing obscure boolean flags is harder to read, more code, less efficient, more error-prone and less robust than the goto variant.

## Expressions

* If in doubt, use spaces between operators. However, sometimes you may want to group an expression in a certain way. Then, it's OK to elide spaces.
* Do not fear to use `a ? b : c`. It can really make code shorter.

## Types

* Use `void* p` and _not_ `void *p`. Same for references.
* Use `size_t` when accessing arrays or std::vector
* Name iterators `i` if possible; do not name them `it` or `iter` or whatever unless there exists already another variable called `i`.

## Classes

* `UseCamelCaseForClassNames`
* `use_snake_case_for_method_names`
* `use_an_underscore_suffix_for_private_member_variables_`
* Name methods returning a `bool` with a starting `is_` or `has_` as appropriate
* Use one line per item in an init list starting with the colon or comma character
* Start in a class with the constructor
* Then the destructor
* Then all other methods
* Then all member variables
