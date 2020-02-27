## Coding Standards
### In short:
Egg Party is an [idiomatic](#idiomatic) TypeScript codebase that embraces functional programming paradigms,
and uses `gts` as a starting point for linting and formatting configuration.

#### Idiomatic
- Use `T | undefined` over `Nullable<T>` <sup>[[1]](#expl-1)</sup>
- Use `(val: T) => R` over generic delegate types like `Func<T, R>` <sup>[[2]](#expl-2)</sup>
    - If brevity is a concern, consider using a parameter name of `_` in the type literal (**not in the implementation**)
        - e.g. `const toString: (_: number) => string = n => n.toString()`

#### Functional
- todo

### Explain
- [1]<a name="expl-1"></a> Using a type union leaves no guesswork as to which "null value" type is in use (null or undefined)
- [2]<a name="expl-2"></a> Arrow function types are terse enough that using named types like `Func` and `Action` aren't necessary.
