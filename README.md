# @mapbox/expression-jamsession

[![Build Status](https://travis-ci.com/mapbox/expression-jamsession.svg?token=SEyDg5xudiyx521kB7Cy&branch=master)](https://travis-ci.com/mapbox/expression-jamsession)

Write [Mapbox GL expressions](https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions) in a more familiar, handwritable, spreadsheet-like, programming-like syntax.
This library translates these handwritten formulas into valid spec-compliant Mapbox GL expressions that you can use in a Mapbox style.


## Formula syntax features

- Most expressions are represented like function invocations in programming, e.g. `get("population")`, `log2(get("population"))`.
- Symbolic math operators (`+ - * / %`) and parentheses work like in high school math, e.g. `((3 + 4) * 2) / 7`.
  That is, the formula should contain `3 + 4` instead of `+(3, 4)`.
- Symbolic decision operators also work with operands on both sides, instead of like function invocations.
  So `get("foo") != 4` instead of `!=(get("foo"), 4)`.
- Strings must always be wrapped in quotation marks, e.g. `concat("egg", "s")` not `concat(egg, s)`.
- `&` operator concatenates strings, as in spreadsheet programs.

```js
// Input
2 + 2

// Output
["+", 2, 2]
```

```js
// Input
max(3, log2(6))

// Output
["max", 3, ["log2", 6]]
```

```js
// Input
((3 + get("num")) * 2) / 7

// Output
["/", ["*", ["+", 3, get("num")], 2], 7]
```

```js
// Input
"name: " & get("name")

// Output
["concat", ["name ", ["get", "name"]]]
```

## Usage

The module exports two functions so you can transform in both directions:

- `formulaToExpression` transforms (string) formulas to (array) expressions.
- `expressionToFormula` transforms expressions to formulas.

```js
import jamsession from '@mapbox/expression-jamsession';

jamsession.formulaToExpression("3 + 4"); // ["+", 3, 4]

jamsession.expressionToFormula(["+", 3, 4]); // "3 + 4"
```

## Browser compatibility

This library should work in IE11+. It uses a `Set`, so you might get it working in older browsers by adding a polyfill.

## Caveats

- You can use this library to create expressions that are syntactically acceptable but invalid as Mapbox GL expressions, e.g. `get(true)` outputs `["get", true]`, which fails.
- You cannot use JSON object literal arguments to [the `literal` expression](https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-types-literal).
  This is allowed in the spec; but objects are not supported by jsep and the use case for this type of expression is kind of an edge case — so it's probably not worth trying to adjust the parser to support this edge case.
  If you disagree, please consider filing an issue and/or PR.
