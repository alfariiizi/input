# @alfarizi/react-input

A highly flexible and type-safe React input component that supports multiple
input types, including `file`, `number`, and `tel`, with extended customization
options and strong TypeScript support.

## Features

- Supports all standard HTML input types (`text`, `number`, `email`, `file`,
  etc.).
- Strong TypeScript typing for `value` and `onValueChange`.
- Custom handling for `file`, `number`, and `tel` input types.
- Provides default and optional props for better flexibility.

## Installation

Install the package using npm or yarn:

```bash
npm install @alfarizi/react-input
```

or

```bash
yarn add @alfarizi/react-input
```

## Usage

### Basic Usage

```tsx
import React, { useState } from "react";
import { Input } from "@alfarizi/react-input";

const App = () => {
  const [textValue, setTextValue] = useState<string | undefined>("");

  return (
    <div>
      <Input
        type="text"
        value={textValue}
        onValueChange={setTextValue}
        placeholder="Enter text"
      />
    </div>
  );
};

export default App;
```

### Handling Numbers

```tsx
import React, { useState } from "react";
import { Input } from "@alfarizi/react-input";

const App = () => {
  const [numberValue, setNumberValue] = useState<number | undefined>(undefined);

  return (
    <div>
      <Input
        type="number"
        value={numberValue}
        onValueChange={setNumberValue}
        placeholder="Enter a number"
      />
    </div>
  );
};

export default App;
```

### Handling File Inputs

```tsx
import React, { useState } from "react";
import { Input } from "@alfarizi/react-input";

const App = () => {
  const [file, setFile] = useState<File | undefined>(undefined);

  return (
    <div>
      <Input type="file" value={file} onValueChange={setFile} />
    </div>
  );
};

export default App;
```

### Handling Telephone Numbers

```tsx
import React, { useState } from "react";
import { Input } from "@alfarizi/react-input";

const App = () => {
  const [telValue, setTelValue] = useState<string | undefined>("");

  return (
    <div>
      <Input
        type="tel"
        value={telValue}
        onValueChange={setTelValue}
        placeholder="Enter a phone number"
      />
    </div>
  );
};

export default App;
```

## Props

| Prop Name       | Type                                          | Default     | Description                                                          |
| --------------- | --------------------------------------------- | ----------- | -------------------------------------------------------------------- |
| `type`          | `InputType`                                   | `"text"`    | The input type (e.g., `text`, `number`, `file`, etc.).               |
| `value`         | `InputValue<T, M>`                            | `undefined` | The controlled value of the input.                                   |
| `onValueChange` | `(value: InputValue<T, M>) => void`           | `undefined` | Callback triggered when the value changes.                           |
| `multiple`      | `boolean`                                     | `undefined` | Determines if multiple files can be selected (only for `file` type). |
| `...props`      | `React.InputHTMLAttributes<HTMLInputElement>` | -           | Additional input attributes.                                         |

## Development

### Build the Package

To build the package, run:

```bash
npm run build
```

### Run Tests

To run tests, use:

```bash
npm test
```

## License

MIT License. See [LICENSE](./LICENSE) for more details.
