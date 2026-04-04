# Contributing

Thank you for your interest in contributing to fsharp-wasm-runtime!

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Download the [fsharp-wasm compiler](https://github.com/fsharp-wasm/fsharp-wasm/releases/tag/v0.1-experimental)

## Code Structure

- `runtime/` — JS glue modules (pure ES modules, no build step)
- `src/Browser/` — F# Browser.* API modules
- `src/Html/` — HTML DSL
- `src/Elmish/` — MVU engine
- `demos/` — Demo applications
- `tests/` — Unit + Integration tests

## Guidelines

### JS Glue Modules
- Keep modules small and focused
- Use the shared handle store from `core.js`
- Export pure functions (no classes)
- Document each export

### F# Modules
- Namespace must be `Browser.*`
- Use `[<Import>]` for FFI bindings
- Provide typed wrappers (not raw handles)
- Use active patterns and computation expressions where they improve the API

### Tests
- Add unit tests for pure F# logic
- Add Playwright tests for browser behavior
- All tests must pass before merging

## Pull Request Process

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Submit a PR with a clear description

## Coding Style

- F#: Follow standard F# formatting conventions
- JS: Use const/let, arrow functions, ES modules
- Keep the JS glue minimal — logic belongs in F#
