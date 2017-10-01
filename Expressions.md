---
title: Expressions
parent: Impala.md
weight: 5
---

Impala is an expression-oriented language.
This means, that [if](If Expression)-, [while](While Expression)- and [for](For Expression)-constructs are not [[Statements]] but [[Expressions]] that yield values.
It is perfectly fine and even encouraged to nest expressions.

# Syntax

```
expr ::= primary_expr
       | block_expr
       | for_expr
       | if_expr
       | while_expr
       | with_expr
       | definite_array_expr
       | function_expr
       | indefinite_array_expr
       | simd_expr
       | struct_expr
       | tuple_expr
       | infix_expr
       | postfix_expr
       | prefix_expr
       | cast_expr
       | field_expr
       | map_expr
       | type_application_expr
```

# Precedence

Nesting of expressions is disambiguated according to this table:

Operator | Description | Associativity 
---------|-------------|--------------
`++` `--` <br/> `()` <br/> `[]` <br/> `.` | [[Postfix Expression]] (increment/decrement) <br/> [[Map Expression]] <br/> [[Type Application Expression]] <br/> [[Field Expression]] | left-to-right
`++` `--` <br/> `+` `-` <br/> `!` <br/> `~` <br/> `*` <br/> `&` `&mut` <br/> `\|` `\|\|` | [[Prefix Expression]] (increment/decrement) <br/> [[Prefix Expression]] (unary plus/minus) <br/> [[Prefix Expression]] (logical/bitwise NOT) <br/> [[Prefix Expression]] (alloc) <br/> [[Prefix Expression]] (dereference) <br/> [[Prefix Expression]] (address-of/mutable address-of) <br/> [[Function Expression]] | right-to-left
`as` | [[Cast Expression]] | left-to-right
`*` `/` `%` | [[Infix Expression]] (multiplication/division/remainder) | left-to-right
`+` `-` | [[Infix Expression]] (addition/subtraction) | left-to-right
`<<` `>>` | [[Infix Expression]] (bitwise left/right shift) | left-to-right
 `&` | [[Infix Expression]] (bitwise AND) | left-to-right
 `^` | [[Infix Expression]] (bitwise XOR) | left-to-right
 `\|` | [[Infix Expression]] (bitwise  OR) | left-to-right
`==` `!=` <br/> `<` `<=` `>` `>=` | [[Infix Expression]] (equal/not equal) <br/> [[Infix Expression]] (less/less equal/greater/greater equal) | left-to-right
`&&` | [[Infix Expression]] (logical AND) | left-to-right
`\|\|` | [[Infix Expression]] (logical  OR) | left-to-right
`=` <br/> `*=` `/=` `%=`  <br/> `+=` `-=` <br/> `<<=` `>>=`  <br/> `&=` `^=` `\|=` | [[Infix Expression]] (assignment) <br/> [[Infix Expression]] (assign by sum/difference) <br/> [[Infix Expression]] (assign by product/quotient/remainder) <br/> [[Infix Expression]] (assign by bitwise left/right shift) <br/> [[Infix Expression]] (assign by bitwise AND/XOR/OR) | left-to-right

## Comparison with C

* The [as](Cast Expression) binds strongest of all binary operators. 
    This one does not exist in C.
* `&`, `^` and `|` bind stronger than assignments. This is more intuitive.
* All relations share the same precedence. This means
    
    ```rust
    a == b < c
    ```
    binds in Impala like this because all [infix operators](Infix Expression) bind from left to right:
    ```rust
    (a == b) < c
    ```
    Whereas C binds like this because ``==`` binds weaker than ``<``:
    ```rust
    a == (b < c)
    ```
    Rationale: 
    This is such a subtle thing hardly anyone knows.
    Some C-compilers emit a warning if the programmer relies on this precedence (```-Wparentheses``` implied by ```-Wall``` in ```gcc```).
* Assignments' associativity is left-to-right instead of right-to-left.

    So
    ```rust
    a += b += c
    ```
    binds in Impala like this:
    ```rust
    (a += b) += c
    ```
    Whereas C binds like this:
    ```rust
    a += (b += c)
    ```
    Rationale: 
    This makes all binary operator consistently left-to-right associative.
    However, the expression doesn't type anyway because all assignments yield unit ```()```.
    So there is not much point for complaints.