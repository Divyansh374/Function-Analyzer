# Function Analyzer

Function Analyzer is a React and TypeScript web application for exploring a real-valued function of one variable. Enter an expression for `f(x)`, then inspect its graph, basic properties, roots, and symbolic derivative.

## Features

- Parse arithmetic expressions containing numbers and the variable `x`.
- Evaluate expressions using addition, subtraction, multiplication, division, powers, and unary negation.
- Plot the function over the interval `[-10, 10]`.
- Detect discontinuities and values outside the graph's visible y-range instead of drawing misleading connecting lines.
- Identify whether an expression is polynomial and show its degree.
- Show the y-intercept when the function is defined at `x = 0`.
- Find linear and quadratic polynomial roots analytically.
- Search for real roots of non-polynomial functions numerically.
- Calculate and display symbolic derivatives using the product, quotient, chain, and power rules where supported.
- Simplify derivative expressions through constant folding and basic algebraic identities.
- Display expressions with mathematical formatting, including fractions, superscripts, and multiplication dots.
- Use quick example buttons for `sin(x)`, `tan(x)`, `cos(x)`, and `log(x)`.

## Getting Started

### Requirements

- Node.js with npm

### Install and run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The default development command starts the application with hot module replacement.

### Other commands

```bash
npm run build    # Type-check and create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

## Expression Syntax

The parser accepts one variable, `x`, and the following operators:


| Operator | Meaning                       | Example             |
| -------- | ----------------------------- | ------------------- |
| `+`      | Addition                      | `x + 2`             |
| `-`      | Subtraction or unary negation | `x - 2`, `-x`       |
| `*`      | Multiplication                | `2 * x`             |
| `/`      | Division                      | `x / 2`             |
| `^`      | Power                         | `x^2`               |
| `()`     | Grouping or function argument | `(x + 1)`, `sin(x)` |

Supported function names are:


| Function  | Meaning           |
| --------- | ----------------- |
| `sin(x)`  | Sine              |
| `cos(x)`  | Cosine            |
| `tan(x)`  | Tangent           |
| `sqrt(x)` | Square root       |
| `log(x)`  | Natural logarithm |
| `abs(x)`  | Absolute value    |

### Valid examples

```text
x^2 - 4*x + 3
sin(x) + x/2
sqrt(x^2 + 1)
log(x + 5)
```

## Input Rules and Limitations

The expression parser is intentionally small and strict:

1. **Explicit operators are required.** Write `2*x`, not `2x`. Implicit multiplication is not supported.
2. **Type powers with `^`.** Subscript, superscript, or other visual exponent notation is not accepted as input. Write `x^2` explicitly.
3. **Function arguments need parentheses.** Write `sin(x)`, not `sinx`.
4. **Only a limited set of mathematical functions is available.** The supported names are `sin`, `cos`, `tan`, `sqrt`, `log`, and `abs`; constants such as `pi` and other functions are not recognized.
5. **Function names are case-sensitive.** Use lowercase names exactly as listed. For example, `sin(x)` is valid but `Sin(x)` is not.
6. **Variable exponents are not supported by differentiation.** Expressions such as `x^x` can be parsed and evaluated, but their derivative cannot be calculated.
7. **`abs(x)` cannot be differentiated.** It can be evaluated and graphed, but the derivative panel reports an error for expressions containing `abs`.
8. **Roots are limited to a fixed interval.** Numerical root searching is performed only from `x = -10` to `x = 10`, so roots outside that interval are not reported. Numerical searches can also miss roots that do not produce a detectable sign change.

Additional analysis boundaries:

- Exact polynomial roots are currently calculated for linear and quadratic polynomials. Higher-degree polynomials are identified as polynomials, but their roots are not solved by the exact analyzer.
- The graph displays y-values only between `-10` and `10`. Non-finite values, such as those at undefined points, are omitted.
- `sqrt`, `log`, division, and powers follow JavaScript numeric behavior during evaluation. Inputs outside their real-valued domains may therefore produce undefined or non-finite graph points.

## How Analysis Works

After selecting **Analyze**, the application:

1. Tokenizes and parses the expression.
2. Generates graph samples from `x = -10` through `x = 10` in increments of `0.1`.
3. Classifies polynomial expressions and calculates their degree, y-intercept, roots, and quadratic vertex where applicable.
4. Uses a numerical bisection search for non-polynomial roots over `[-10, 10]`.
5. Builds and simplifies a symbolic derivative for the derivative panel.

An invalid expression leaves the previous successful analysis visible and shows the parser error below the input.

## Technology

- React 19
- TypeScript
- Vite
- Recharts

The application source is organized into UI components under `src/components` and expression parsing, evaluation, analysis, differentiation, and graphing modules under `src/math`.
