## Coding Standards
### In short:
Egg Party is an [idiomatic](#idiomatic) TypeScript codebase that embraces functional programming paradigms,
and uses `gts` as a starting point for linting and formatting configuration.

#### Idiomatic
- Use `T | undefined` over `Nullable<T>` <sup>[[1]](#expl-1)</sup>
- Use `(val: T) => R` over generic delegate types like `Func<T, R>`
    - If brevity is a concern, consider using a parameter name of `_` in the type literal (**not in the implementation**)
        - e.g. `const toString: (_: number) => string = n => n.toString()`
    - _Arrow function types are terse enough that using named types like <code>Func</code> and <code>Action</code> aren't necessary._

### Explain
- [1]<a name="expl-1"></a> Using a type union leaves no guesswork as to which "null value" type is in use (null or undefined)
