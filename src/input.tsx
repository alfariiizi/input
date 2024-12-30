import { convertToNumber } from "@alfarizi/convert-to-number";
import * as React from "react";

export type InputType =
  | "text"
  | "password"
  | "email"
  | "tel"
  | "url"
  | "search"
  | "number"
  | "date"
  | "month"
  | "week"
  | "time"
  | "datetime-local"
  | "file"
  | "color";

export type InputValue<
  T extends InputType,
  M extends boolean | undefined,
> = T extends "file"
  ? M extends true
    ? FileList | undefined
    : File | undefined
  : T extends "number"
    ? number | undefined
    : string | undefined;

export interface InputProps<
  T extends InputType = "text",
  M extends boolean | undefined = undefined,
> extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "multiple"
  > {
  type?: T;
  multiple?: M;
  value?: InputValue<T, M>;
  onValueChange?: (value: InputValue<T, M>) => void;
  trim?: boolean;
}

const trimValueBasedOnType: InputType[] = [
  "text",
  "email",
  "tel",
  "url",
  "search",
];

const InputComponent = <
  T extends InputType = "text",
  M extends boolean | undefined = undefined,
>(
  {
    multiple,
    type = "text" as T,
    value,
    onValueChange,
    onChange,
    trim = true,
    onBlur,
    onKeyDown,
    ...props
  }: InputProps<T, M>,
  ref: React.ForwardedRef<HTMLInputElement>,
) => {
  const isControlled =
    (value !== undefined && onValueChange !== undefined) ||
    (value !== undefined && onChange !== undefined);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;

    if (type === "file") {
      if (multiple) {
        onValueChange?.(event.target.files as InputValue<T, M>);
      } else {
        const file = event.target.files?.[0] || null;
        onValueChange?.(file as InputValue<T, M>);
      }
    } else if (type === "number") {
      const parsedValue =
        rawValue === ""
          ? (undefined as any)
          : convertToNumber(rawValue, undefined);
      onValueChange?.(parsedValue as InputValue<T, M>);
    } else if (type === "tel") {
      const isValidTel = /^[0-9\-+\s()]*$/.test(rawValue);
      if (isValidTel || rawValue === "") {
        onValueChange?.(
          (rawValue.length !== 0 ? rawValue : undefined) as InputValue<T, M>,
        );
      }
    } else {
      onValueChange?.(
        (rawValue.length !== 0 ? rawValue : undefined) as InputValue<T, M>,
      );
    }

    onChange?.(event);
  };

  return (
    <input
      ref={ref}
      type={type}
      value={
        !isControlled
          ? undefined
          : type === "tel"
            ? value && /^[0-9\-+\s()]*$/.test(value as string)
              ? (value as string)
              : ""
            : value !== undefined && value !== null
              ? type === "file"
                ? undefined
                : type === "number"
                  ? String(value ?? "")
                  : (value as string)
              : ""
      }
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (
          e.key === "Enter" &&
          trim &&
          trimValueBasedOnType.includes(type) &&
          typeof value === "string"
        ) {
          const trimValue = value.trim();
          onValueChange?.(
            (trimValue.length !== 0 ? trimValue : undefined) as InputValue<
              T,
              M
            >,
          );
        }
      }}
      onBlur={(e) => {
        onBlur?.(e);
        if (
          trim &&
          trimValueBasedOnType.includes(type) &&
          typeof value === "string"
        ) {
          const trimValue = value.trim();
          onValueChange?.(
            (trimValue.length !== 0 ? trimValue : undefined) as InputValue<
              T,
              M
            >,
          );
        }
      }}
      onChange={(e) => {
        handleChange(e);
      }}
      {...props}
    />
  );
};

export const Input = React.forwardRef(InputComponent) as <
  T extends InputType = "text",
  M extends boolean | undefined = undefined,
>(
  props: InputProps<T, M> & { ref?: React.ForwardedRef<HTMLInputElement> },
) => React.ReactElement;

export default Input;
