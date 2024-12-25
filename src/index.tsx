import * as React from "react";
import { convertToNumber } from "@alfarizi/convert-to-number";

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
}

const Input = <
  T extends InputType = "text",
  M extends boolean | undefined = undefined,
>(
  {
    multiple,
    type = "text" as T,
    value,
    onValueChange,
    onChange,
    ...props
  }: InputProps<T, M>,
  ref: React.Ref<HTMLInputElement>,
) => {
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
      const isValidTel = /^[0-9\-+\s()]*$/.test(rawValue); // Allow digits, spaces, hyphens, plus, and parentheses
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
  };

  return (
    <input
      ref={ref}
      type={type}
      value={
        type === "tel"
          ? value && /^[0-9\-+\s()]*$/.test(value as string)
            ? (value as string)
            : "" // If the value is invalid, render an empty string
          : value !== undefined && value !== null
            ? type === "file"
              ? undefined
              : type === "number"
                ? String(value ?? "")
                : (value as string)
            : undefined
      }
      onChange={(e) => {
        handleChange(e);
        onChange?.(e);
      }}
      {...props}
    />
  );
};

Input.displayName = "Input";

export { Input };
export default Input;
