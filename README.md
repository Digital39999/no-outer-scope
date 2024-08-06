# eslint-plugin-no-outer-scope

A custom ESLint plugin that disallows accessing variables from outer scopes in specified callback functions. This can help prevent unintended side effects and improve code readability.

## Installation

To install this plugin, run:

```bash
npm install eslint eslint-plugin-no-outer-scope --save-dev
```

## Usage

To use this plugin, you need to configure ESLint to include it in your configuration file. Below are examples of how to do this in various configuration formats.

### ESLint Configuration

#### 1. In your `.eslintrc.json`:

```json
{
  "plugins": ["no-outer-scope"],
  "rules": {
    "no-outer-scope/no-outer-scope": ["error", { "functions": ["callbackFunction", "anotherFunction"] }]
  }
}
```

#### 2. In your `.eslintrc.js`:

```javascript
module.exports = {
  plugins: ["no-outer-scope"],
  rules: {
    "no-outer-scope/no-outer-scope": ["error", { functions: ["callbackFunction", "anotherFunction"] }]
  }
};
```

### Options

The rule accepts a single options object:

- `functions` (Array<String>): An array of function names to check for outer scope variable access.

### Example

Here’s an example of how the rule works:

#### Invalid Code

```javascript
const variable = 1;

callbackFunction(() => {
    return variable; // Error: Variable "variable" is accessed from outer scope.
});
```

#### Valid Code

```javascript
callbackFunction(({ v }) => {
    return v; // No error
}, { v: 1 });
```

### Running Tests

To run the tests for this plugin, make sure you have the necessary testing framework installed. You can run:

```bash
npm test
```

### License

This project is licensed under the [MIT License](LICENSE).

### Contributing

If you would like to contribute to this project, feel free to open an issue or submit a pull request.