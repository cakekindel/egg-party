### Coding Standards
#### In short:
Egg Party is an [idiomatic](#idiomatic) TypeScript codebase that embraces functional programming paradigms,
and uses `gts` as a starting point for linting and formatting configuration.

##### Idiomatic
- Use `T | undefined` over `Nullable<T>`
    - <details><summary>Explain (click to expand)</summary>
      <i>Using an undefined type intersection leaves no guesswork as to the type in question.</i>
      </details>
- Use `(val: T) => R` over generic delegate types like `Func<T, R>`
    - If brevity is a concern, consider using a parameter name of `_`
        - e.g. `const toString: (_: number) => string;`
    - If the type literal is long or confusing, abstract parts or all
      of the type into a named type alias
        - e.g. implementing the `Functor` pattern for `PromiseLike`:
      ```ts
      // an example where I would CONSIDER using type aliases
      const map: <A, B>(mapFn: (val: A) => B) => (p: PromiseLike<A>) => Promise<B>; 
      
      // with type aliases
      type Mapper<A, B> = (v: A) => B;
      type PromiseMapper<A, B> = Mapper<PromiseLike<A>, Promise<B>>;
      
      const map: <A, B>(mapFn: Mapper<A, B>) => PromiseMapper<A, B>;
      ```
    - <details><summary>Explain (click to expand)</summary>
      <i>Arrow function types are terse enough that using named types like <code>Func</code> and <code>Action</code> aren't necessary.
      <br/>If you are in the codebase making changes, you may notice some examples of those types still in use.
      <br/>Replacing them with the equivalent Arrow Function type literal <b>or</b> a named type alias is a great way to get on the maintainers' good sides.</i>
      </details>