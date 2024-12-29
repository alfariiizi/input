# @alfarizi/react-input

A highly customizable, type-safe, and strict React input component. It
simplifies form handling with enhanced DX (Developer Experience).

> Note: If you use this component in Nextjs App Dir, you only can use this
> component in client component.

## Demo

- React-input demo:
  [Demo](https://reactjs-components-five.vercel.app/?path=/docs/input-primitive--docs)
- You can also wrap this component to create your custom style component. You
  can see the example result in here:
  [Input Customization Demo](https://reactjs-components-five.vercel.app/?path=/docs/input--docs)

## Features

- **Type Safety**: The `value` and `onValueChange` props are strictly typed
  based on the `type` prop.
- **Strict Handling**: Automatically converts empty strings to `undefined`.
- **Trimming**: Optional `trim` prop to trim string values.
- **File Input**: Handles single and multiple file uploads.
- **Number Input**: Returns `number | undefined` for numeric input types.
- **Tel Input**: Validates common phone number formats.
- **Customizable**: Easily styled and extended.

## Installation

```bash
npm install @alfarizi/react-input
```

or

```bash
yarn add @alfarizi/react-input
```

or

```bash
pnpm add @alfarizi/react-input
```

or

```bash
bun add @alfarizi/react-input
```

## Motivation

### First Reason

The default `onChange` prop often falls short in terms of developer experience.
To address this, I introduced a custom `onValueChange` prop, which provides a
strictly typed `value` parameter based on the `type` prop. For example:

- For `type="number"`, it uses my package:
  [@alfarizi/convert-to-number](https://www.npmjs.com/package/@alfarizi/convert-to-number)
  to convert strings to numbers.
- For `type="file"`, it ensures type-safe handling of file inputs.
- For `type="tel"`, it validates input based on common phone number formats.

This improves DX and ensures robust handling of various input types.

### Second Reason

I frequently use
[Shadcn components for creating forms](https://ui.shadcn.com/docs/components/form),
often in combination with `react-hook-form` and `zod`. When defining a required
string in a Zod schema, I often write:

```javascript
z.string().trim().min(1);
```

By default, empty input fields are treated as empty strings. Because this
component will return "undefined" if the string is empty, and by default this
component will trim the value, you can simplify the schema to:

```javascript
z.string(); // to require a string
```

### Third Reason

Handling numbers in forms can be tricky. A common client-side validation error I
encounter is: _"expected number but received string"._ In Zod, this can be
addressed using:

```javascript
z.coerce.number().optional();
```

However, another issue arises. If the input is an empty string (`""`), Zod's
coercion converts it to `0`. I don't want to submit `0`; I want to submit
`undefined` or `null`.

With this component, the `onValueChange` prop receives `number | undefined` for
numeric input types. If the input is empty, it is treated as `undefined`. When
passing this to `z.coerce.number().optional()`, the result is `null`. If you
prefer `undefined` over `null`, you can use my other package:
[@alfarizi/convert-undefined-null](https://www.npmjs.com/package/@alfarizi/convert-undefined-null)
to convert between `null` and `undefined`.

## Usage

### Basic Example

```tsx
import React, { useState } from "react";
import { Input } from "@alfarizi/react-input";

const App = () => {
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <Input
      type="text"
      value={value}
      onValueChange={setValue}
      placeholder="Enter your text"
    />
  );
};

export default App;
```

### Number Input Example

```tsx
import React, { useState } from "react";
import { Input } from "@alfarizi/react-input";

const NumberInput = () => {
  const [value, setValue] = useState<number | undefined>(undefined);

  return (
    <Input
      type="number"
      value={value}
      onValueChange={setValue}
      placeholder="Enter a number"
    />
  );
};

export default NumberInput;
```

## You want to Custom it? Yes you can

Example of custom input component based on `@alfarizi/react-input`. Result of
this example custom input component can be seen here:
<https://reactjs-components-five.vercel.app/?path=/docs/input--docs>

If you often use [shadcn-ui](https://ui.shadcn.com), you will love this custom component:

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type * as InputPrimitive from "@alfarizi/react-input";

export const inputVariants = cva(
  "flex items-center h-10 w-full text-sm bg-transparent file:border-0 file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border border-transparent focus-within:outline-none aria-invalid:ring-1 aria-invalid:ring-destructive aria-invalid:focus-within:ring-2 aria-invalid:focus-within:ring-destructive",
  {
    variants: {
      rounded: {
        none: "rounded-none",
        md: "rounded-md",
      },
      variant: {
        outline:
          "border-border focus-within:border-primary focus-within:shadow-[0_0px_0px_1px_hsl(var(--primary))] aria-invalid:border-transparent",
        filled:
          "border-2 bg-background focus-within:border-primary focus-within:bg-transparent",
        underlined:
          "rounded-none border-b-border focus-within:border-b-primary focus-within:shadow-[0_1px_0px_0px_hsl(var(--primary))]",
        unstyled: "",
      },
    },
    defaultVariants: {
      rounded: "md",
      variant: "outline",
    },
  },
);

export interface InputProps<
  T extends InputPrimitive.InputType = "text",
  M extends boolean | undefined = undefined,
> extends InputPrimitive.InputProps<T, M>,
    VariantProps<typeof inputVariants> {
  containerClassName?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  startAdornmentClassName?: string;
  endAdornmentClassName?: string;
}

const Input = <
  T extends InputPrimitive.InputType = "text",
  M extends boolean | undefined = undefined,
>(
  {
    className,
    containerClassName,
    rounded,
    variant,
    type = "text" as T,
    value,
    startAdornment,
    endAdornment,
    startAdornmentClassName,
    endAdornmentClassName,
    ...props
  }: InputProps<T, M>,
  ref: React.Ref<HTMLInputElement>,
) => {
  return (
    <div
      className={cn(
        inputVariants({ variant, rounded, className: containerClassName }),
        "relative flex items-center",
      )}
    >
      {startAdornment && (
        <div
          className={cn(
            "inline-flex h-full items-center text-muted-foreground",
            "py-2 pl-3 pr-1.5",
            "rounded-l-md has-[+input:focus]:rounded-l-sm has-[+input:focus]:border-l-0", // this must be same with default value of variant
            {
              "rounded-l-md": rounded === "md",
              "rounded-l-none": rounded === "none",
            },
            startAdornmentClassName,
          )}
        >
          {startAdornment}
        </div>
      )}
      <input
        ref={ref}
        type={type}
        value={
          value !== undefined && value !== null
            ? type === "file"
              ? undefined
              : type === "number"
                ? String(value ?? "")
                : (value as string)
            : undefined
        }
        className={cn(
          "w-full overflow-clip bg-transparent px-3 py-2 outline-none focus-visible:outline-none",
          {
            "pl-1.5": !!startAdornment,
            "pr-1.5": !!endAdornment,
          },
          className,
        )}
        {...props}
      />
      {endAdornment && (
        <div
          className={cn(
            "inline-flex items-center text-muted-foreground",
            "py-2 pl-1.5 pr-3",
            "rounded-r-md has-[+input:focus]:rounded-r-sm has-[+input:focus]:border-r-0", // this must be same with default value of variant
            {
              "rounded-r-md": rounded === "md",
              "rounded-r-none": rounded === "none",
            },
            endAdornmentClassName,
          )}
        >
          {endAdornment}
        </div>
      )}
    </div>
  );
};

Input.displayName = "Input";

export { Input };
export default Input;
```

## Props

### InputProps

| Name            | Type                                | Default     | Description                                        |
| --------------- | ----------------------------------- | ----------- | -------------------------------------------------- |
| `type`          | `InputType`                         | `"text"`    | The type of the input.                             |
| `multiple`      | `boolean`                           | `false`     | Enables multiple file selection for `type="file"`. |
| `value`         | `InputValue<T, M>`                  | `undefined` | The value of the input.                            |
| `onValueChange` | `(value: InputValue<T, M>) => void` | `undefined` | Callback for when the value changes.               |
| `trim`          | `boolean`                           | `true`      | Trims string inputs on blur or enter key press.    |

## License

This project is licensed under the MIT License.
