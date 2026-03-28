# Gaussian Elimination

A browser game for solving systems of linear equations by hand — or at least, by drag-and-drop.

---

## What it is

You get an augmented matrix. You reduce it to row echelon form using three operations: multiply a row by a scalar, add a multiple of one row to another, or swap rows. That's it. That's the whole game.

The math hasn't changed since 1800. The interface has.

---

## Why it exists

Linear algebra is one of those things where the gap between "I understand it conceptually" and "I can actually do it" is embarrassingly large. Most people hit a wall not at the theory but at the arithmetic — keeping track of fractions, remembering which row you were operating on, losing your place halfway through.

This is an attempt to close that gap by making the operations tactile. You drag. You drop. You watch numbers disappear. Hopefully something clicks.

---

## How to use it

Open `index.html` in a browser. No build step, no bundler, no `npm install`. It's HTML, CSS, and a single JavaScript file.

If you want to serve it locally:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

---

## Features

- **2×2, 3×3, and 4×4 systems** — pick your poison
- **Difficulty levels** — affects coefficient range and sparsity
- **Custom matrix input** — paste in your own system, including multiple augmented columns for things like finding inverses
- **Drag-and-drop row operations** — select a row, set a scalar, drag the preview onto the target
- **Hints** — suggests the next logical step if you're stuck
- **Move counter and timer** — with a par target so you have something to chase
- **Exact arithmetic** — everything is computed with fractions internally, so `1/3 + 2/3` is `1`, not `0.9999999...`
- **Auto-fill on RREF** — when the matrix is fully reduced, the solution populates automatically

---

## The fraction thing

Floating point arithmetic is fine for a lot of things. It is not fine here. A single rounding error mid-elimination snowballs into garbage, and there's no satisfying way to tell a student "yes, your answer of 2.9999998 is technically correct."

All arithmetic uses an exact `Fraction` class. Every operand is stored as a numerator/denominator pair, reduced via GCD. The display shows `1/3` as `1/3`, not `0.333`.

---

## Custom matrices

Click **Custom Matrix** during a game. You can set the number of variables (rows/columns of the coefficient matrix) and the number of augmented columns on the right side.

One augmented column is the standard `Ax = b` setup. Two or more lets you do things like solve for multiple right-hand sides simultaneously, or reduce `[A | I]` to find `A⁻¹`. The solution checker is disabled for multi-column augmented matrices since the answer is a matrix, not a vector.

---

## No framework, no dependencies

Vanilla JS. The only external asset is the font stack, which is just the system font cascade.

This is partly a constraint, partly a preference. The math is the interesting part. The rest should be invisible.

---

## Contributing

It's a small project. If something is broken or missing, open an issue or send a patch. Fraction edge cases (zero denominators, negative fractions from string input) are the most likely source of bugs.

---

## License

MIT. Do what you want with it.
