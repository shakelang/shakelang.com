# Shake Programming Language Features

## 1 Operators

### 1.0 Mathematical Operators

_Shake has 6 different types of simple mathematical operators_

```shake
10 + 3   // plus
10 – 3   // minus
10 * 3   // multiply
10 / 3   // divide
10 % 3   // modulo
10 ** 3  // power (>> 10 * 10 * 10)
```

### 1.1 Comparison Operators

_These are Shake's comparison-operators_

```shake
9 == 8  // equals
9 >= 8  // bigger Equals
9 <= 8  // lower Equals
9 > 8   // bigger
9 < 8   // lower
```

### 1.2 Logical Operators

```shake
true || false  // or (at least one of them has to be correct) 
true && false  // and (both of them have to be correct)
true ^ false   // xor (either one, but not both have to be correct)
```

### 1.3 Bitwise operators

#### 1.3.0 Understanding binary numbers

Binary operators can manipulate the bits of values.
To understand binary operations you first have to understand binary numbers.
In binary numbers, each digit is either 0 or 1. You can just write each number to the base 2
like you would in decimal. We would count like this:

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

| Datatype | Amount of bits |
|:--------:|:--------------:|
| Byte    | 8               |
| Short   | 16              |
| Integer | 32              |
| Long    | 64              |

These data types also have to be able to store negative values. So the first digit is used to store the sign.
So for negative numbers the first digit is 1 and the rest of the digits are 0.
The formula to convert a binary number to decimal is the same as positive numbers, but we calculate (-1) + `[positive amount]` because we don't need a negative zero.

Following this concept we have these ranges:

| Datatype | Amount of bits | Range           |
|:--------:|:--------------:|:---------------:|
| Byte    | 8               | -128 to 127     |
| Short   | 16              | -2^15 to 2^15-1 |
| Integer | 32              | -2^31 to 2^31-1 |
| Long    | 64              | -2^63 to 2^63-1 |

Now that we know how to convert numbers to binary and back we can start to understand the different operators.

#### 1.3.1 Bitwise and, or, xor

```shake
0b1010 & 0b0101  // 0b0000 Binary AND
0b1010 | 0b0101  // 0b1101 Binary OR
0b1010 ^ 0b0101  // 0b1011 Binary XOR
```

If we just think about the bits as boolean values, we can use the AND, OR and XOR operators to manipulate the bits.
so bit 1 from the first number is ANDed with bit 1 from the second number, bit 2 from the first number is ANDed with bit 2 from the second number and so on.

#### 1.3.2 Bitwise shift

```shake
0b1010 << 1  // 0b1010 Binary left shift
0b1010 >> 1  // 0b0101 Binary right shift
```

Using `lshift` and `rshift` we can shift the bits of a number to the left or right by a certain amount.

### 1.4 Brackets & Priorities

#### 1.4.0 Brackets

If you are working with bigger terms, there are priorities, e.g.
multiplication and divisions are preferred before plus and minus.

If you want to prefer plus over multiply you can use brackets around
the addition to give it a higher priority

eg.

```shake
4 * 10 + 3    // >> 43
4 * (10 + 3)  // >> 52
```

#### 1.4.1 Priorities

1. [brackets](#1.4.0-Brackets) `(`, `)`
2. [bitwise and, or, xor](#1.3.1-Bitwise-and-or-xor) `&`, `|`, `^`
3. [bitwise shift](#1.3.2-Bitwise-shift) `<<`, `>>`
4. [mathematical](#1.0-Mathematical-operators) \> power `**`
5. [mathematical](#1.0-Mathematical-operators) \> mul, div, mod `*` `/` `%`
6. [mathematical](#1.0-Mathematical-operators) \> add, sub `+` `-`
7. [logical operators](#1.2-Logical-Operators) \> and `&&`
8. [logical operators](#1.2-Logical-Operators) \> or `||`
9. [comparison](#1.1-Comparison-Operators) `>` `<` `>=` `<=` `==`
