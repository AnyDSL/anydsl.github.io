<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Contents**

- [Lexical Elements](#lexical-elements)
- [Identifiers](#identifiers)
  - [Keywords](#keywords)
- [Punctators](#punctators)
- [Literals](#literals)
  - [Integer Literals](#integer-literals)
  - [Float Literals](#float-literals)
  - [Char Literals](#char-literals)
  - [String Literals](#string-literals)
  - [Examples](#examples)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Lexical Elements

```
digit  ::= ['0'-'9']
digit_ ::= digit | '_'
hex_digit  ::= digit | ['a'-'f''A'-'F']
hex_digit  ::= hex_digit | '_'
```

# Identifiers

```
identifier ::= nondigit (nondigit | digit)*
nondigit   ::= ['_''a'-'z''A'-'Z']
```

## Keywords

Some identifiers are reserved *keywords* which have a special meaning in an Impala program:

```
as else enum extern fn for if impl in let mut static struct trait type while with
true false
bool int uint float double
i8 i16 i32 i64
u8 u16 u32 u64
f16 f32 f64
```
Furthermore, ```return```, ```continue``` and ```break``` play a special role although they are technically not keywords.

See 
* [[Function Item]]
* [[If Expression]]
* [[For Expression]]
* [[Function Expression]]
* [[While Expression]]

# Punctators

This tokens have a special meaning depending on the context they occur in:
```
[ ] ( ) { } . ->
++ -- & * + - ~ !
/ % << >> < > <= >=
== != ^ | && || 
? : ; ...
= *= /= %= += -= <<= >>= &= ^= |=
, # ##
```

# Literals

Note that you can use underscores to group your integer and float literals.

```
literal ::= int_literal
          | float_literal
          | char_literal
          | str_literal
```

## Integer Literals

```
int_literal ::= digit digit_* int_suffix
              | binary_int int_suffix
              | octal_int int_suffix
              | hex_int int_suffix

binary_int ::= '0b' digit_*
octal_int  ::= '0o' digit_*
hex_int    ::= '0x' hex_digit_*

int_suffix ::= /*empty*/
             | 'i' | 'i8' | 'i16' | 'i32' | 'i64'
             | 'u' | 'u8' | 'u16' | 'u32' | 'u64'
```

## Float Literals

```
float_literal ::= digit digit_* '.' digit_* float_suffix
                | digit digit_* '.' digit_* ['e''E'] digit_* float_suffix
                | hex_float

hex_float     ::= '0x' hex_digit_* '.' digit_* ['p''P'] digit_* float_suffix

float_suffix  ::= /*empty*/
                | 'h' | 'f' | 'f16' | 'f32' | 'f64'
```

## Char Literals

## String Literals

## Examples

```rust
fn main() -> () {
    { let u: u32  = 42u; }
    { let i: i8  = 0i8; }
    { let i: i16 = 0i16; }
    { let i: i32 = 0i32; }
    { let i: i64 = 0i64; }
    { let i: u8  = 0u8; }
    { let i: u16 = 0u16; }
    { let i: u32 = 0u32; }
    { let i: u64 = 0u64; }
    { let f: f32 = 0f32; }
    { let f: f64 = 0f64; }
    { let i: i32 = 0b01; }
    { let i: i32 = 0b0_1111; }
    { let i: i32 = 0b01_; }
    { let i: i32 = 0b01; }
    { let i: i32 = 0o0_1234567; }
    { let i: i32 = 0o01234567_; }
    { let i: i32 = 0x0_123456789abcdef; }
    { let i: i32 = 0x0123456789abcdef_; }
    { let f: f64 = 1e1; }
    { let f: f64 = 1e-1; }
    { let f: f64 = 1e+1; }
    { let f: f64 = 1.7e1; }
    { let f: f64 = 1.8e-1; }
    { let f: f64 = 1.9e+1; }
    { let f: f64 = 1.7e_4; }
    { let f: f64 = 1.8e-_5; }
    { let f: f64 = 1.9e+_6; }
    { let f: f64 = 1.1_2_3_; }
    { let f: f32 = 1.1_2_3_f32; }
    { let f: f32 = 1.1_2_3_e+16f; }
}
```
