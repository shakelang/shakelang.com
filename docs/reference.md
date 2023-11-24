# Shake Programming Language Features

## 1 Introduction

Shake is a high level, object-oriented, multi-targeting, modern programming
language. It can be compiled into different languages (targets), such as `C`,
`C++`, `C#`, `Java`, `JavaScript` and binary executables as well as interpreted
(currently the only implemented target is `JavaScript`).
It also provides a scripting language for faster and more efficient creation
of small projects.

### 1.2 Overview

The following code is an example for a simple program written in Shake.

```shake
function main() {
  println("Hello World!")

  int i = 10;
  int j = 5;
  int k = i + j;
  println(k);
}
```

This code will print "Hello World!" to the console, then calculate the sum
of the two integers `i=10` and `j=5` and print the result (15) also to the
console.

<!-- It already contains many features we will learn in the next chapters. -->

## 2 Primitive Datatypes

There are 8 primitive datatypes in Shake:

| Type    | # of Bytes | Range                                            | Description                   |
| ------- | ---------- | ------------------------------------------------ | ----------------------------- |
| byte    | 1          | Whole numbers from -2^7 to 2^ - 1                | Signed 8-bit integer          |
| short   | 2          | Whole numbers from -2^15 to 2^15 - 1             | Signed 16-bit integer         |
| int     | 4          | Whole numbers from -2^31 to 2^31 - 1             | Signed 32-bit integer         |
| long    | 8          | Whole numbers from -2^63 to 2^63 - 1             | Signed 64-bit integer         |
| float   | 4          | Floating point numbers from ±3.402823e38         | 32-bit floating point number  |
| double  | 8          | Floating point numbers from ±1.7976931348623e308 | 64-bit floating point number  |
| boolean | 1 [*]      | True or False                                    | Boolean, either true or false |
| char    | 2          | Unicode characters                               | 16-bit Unicode character      |

_\* A boolean behaves like 1 bit, but it occupies 8 bits (one byte) in RAM_

additionally there is one unsigned variant of each integer type.

| Type   | # of Bytes | Range                           | Description             |
| ------ | ---------- | ------------------------------- | ----------------------- |
| ubyte  | 1          | Whole numbers from 0 - 2^8 - 1  | Unsigned 8-bit integer  |
| ushort | 2          | Whole numbers from 0 - 2^16 - 1 | Unsigned 16-bit integer |
| uint   | 4          | Whole numbers from 0 - 2^32 - 1 | Unsigned 32-bit integer |
| ulong  | 8          | Whole numbers from 0 - 2^64 - 1 | Unsigned 64-bit integer |

## 3 Operators

### 3.1 Mathematical Operators

_Shake has 6 different types of mathematical operators_

```shake
10 + 3   // plus (=13)
10 – 3   // minus (=7)
10 * 3   // multiply (=30)
10 / 3   // divide (=3)
10 % 3   // modulo (=1)
10 ** 3  // power (>> 10 * 10 * 10) (=1000)
```

### 3.2 Comparison Operators

_These are Shake's comparison-operators_

```shake
9 == 8  // equals (false)
9 != 8  // not equals (true)
9 >= 8  // bigger Equals (true)
9 <= 8  // lower Equals (false)
9 > 8   // bigger (true)
9 < 8   // lower (false)
```

### 3.3 Logical Operators

```shake
true || false  // or (at least one of them has to be correct)
true && false  // and (both of them have to be correct)
true ^^ false   // xor (either one, but not both have to be correct)
```

_NOTE: All binary operators will work on booleans as well. Via operator overloading they do exactly the same as logical operators on booleans, so true ^ false will work the same as true ^^ false. It is better practice to use the logical operators though!_

### 3.4 Bitwise operators

#### 3.4.1 Understanding binary numbers

_You can skip this paragraph if you understand the basic concept of binary numbers
which is necessary for sections `2.4.2` and `2.4.3`_

Binary operators can manipulate individual bits of values.
To understand binary operations, you first have to understand binary numbers.
In binary numbers, each digit is represented as either 0 or 1. You can write each number
as base 2, which is very similar to decimal numbers (base 10), but with only 2 instead of 10 (0 through 9) possible characters per digit. Since some humans previously decided to use 0 and 1 as these two numbers, we would count like this:

```text
0 (0), 1 (1), 10 (2), 11 (3), 100 (4), 101 (5), 110 (6), 111 (7)... (and so on)
```

for a negative number you can use the same principle, but start with a minus sign.

to convert a binary number to decimal you can use the following formula:

```text
decimal = binary * 2^0 + binary * 2^1 + ... + binary * 2^n
```

and to convert a decimal number to binary you can use the following formula:

```text
binary = decimal / 2^0 + decimal / 2^1 + ... + decimal / 2^n
```

This is how most primitive datatypes work. They just have a differing number of bits.

These data types also have to be able to store negative values. So the first digit is used to store the sign.
So for negative numbers the first digit is 1 and the rest of the digits are 0.
The formula to convert a binary number to decimal is the same as positive numbers, but we calculate (-1) + `[positive amount]` because we don't need a negative zero.

Now that we know how to convert numbers to binary and back we can start to understand the different operators.

#### 3.4.2 Bitwise and, or, xor

```shake
0b1010 & 0b0101  // 0b0000 Binary AND
0b1010 | 0b0101  // 0b1101 Binary OR
0b1010 ^ 0b0101  // 0b1011 Binary XOR
```

If we just think about the bits as boolean values, we can use the AND, OR and XOR operators to manipulate the bits.
so bit 1 from the first number is ANDed with bit 1 from the second number, bit 2 from the first number is ANDed with bit 2 from the second number and so on.

#### 3.4.3 Bitwise shift

```shake
0b1010 << 1  // 0b1010 Binary left shift
0b1010 >> 1  // 0b0101 Binary right shift
```

Using `lshift` and `rshift` we can shift the bits of a number to the left or right by a certain amount.

### 3.5 Brackets & Priorities

#### 3.5.1 Brackets

As the standard math rules still apply, Shake first performs all multiplications (and divisions) in the term and then any additions or subtractions.
Hence, to multiply the sum of some numbers, brackets have to be placed around the numbers to be added up before they are then multiplied, eg.

```shake
4 * 10 + 3    // >> 43
4 * (10 + 3)  // >> 52
```

_(Hint: Brackets can be placed inside other brackets, inner brackets are always calculated first)_

As seen above, Shake "prioritizes" certain operations over others. For a complete overview of these priorities, take a look at the list below.

#### 3.5.2 Priorities

1. [brackets](#2.5.1-Brackets) `(`, `)`
2. [bitwise and, or, xor](#2.4.2-Bitwise-and-or-xor) `&`, `|`, `^`
3. [bitwise shift](#2.4.3-Bitwise-shift) `<<`, `>>`
4. [mathematical](#2.1-Mathematical-operators) \> power `**`
5. [mathematical](#2.1-Mathematical-operators) \> mul, div, mod `*` `/` `%`
6. [mathematical](#2.1-Mathematical-operators) \> add, sub `+` `-`
7. [logical operators](#2.3-Logical-Operators) \> and `&&`
8. [logical operators](#2.3-Logical-Operators) \> or `||`
9. [comparison](#2.2-Comparison-Operators) `>` `<` `>=` `<=` `==`
