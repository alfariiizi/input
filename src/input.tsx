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
  trim?: boolean;
}

const trimValueBasedOnType: InputType[] = [
  "text",
  "email",
  "tel",
  "url",
  "search",
];

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
    trim = true,
    // onSubmit,
    onBlur,
    onKeyDown,
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
      console.debug("ordinary string");
      onValueChange?.(
        (rawValue.length !== 0 ? rawValue : undefined) as InputValue<T, M>,
      );
    }
  };

  // React.useEffect(() => {
  //   if (typeof value === "string" && trim && value.length === 0) {
  //     onValueChange?.(undefined as InputValue<T, M>);
  //   }
  // }, [value, trim, onValueChange]);

  console.log({ value });

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
          console.debug({ trimValue });
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
        onChange?.(e);
      }}
      {...props}
    />
  );
};

Input.displayName = "Input";

export { Input };
export default Input;
