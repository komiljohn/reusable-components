import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useFormContext } from "react-hook-form";
import { Input, InputProps } from "../ui/input";
import { cn } from "@/lib/utils";
import { useMaskito } from "@maskito/react";

import { maskitoPhoneOptionsGenerator } from "@maskito/phone";
import metadata from "libphonenumber-js/min/metadata";

const options = maskitoPhoneOptionsGenerator({
  countryIsoCode: "UZ",
  metadata,
  separator: "-",
});

import type { RefCallback } from "react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

const withMaskitoRegister = (
  registerResult: ControllerRenderProps<FieldValues, string>,
  maskitoRef: RefCallback<HTMLElement | null>
): ControllerRenderProps<FieldValues, string> & {
  onInput: ControllerRenderProps<FieldValues, string>["onChange"];
} => {
  const ref: RefCallback<HTMLElement | null> = (node): void => {
    registerResult.ref(node);
    maskitoRef(node);
  };

  return {
    ...registerResult,
    ref,
    onInput: registerResult.onChange,
    onChange: registerResult.onChange,
  };
};

interface Props extends InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
}

export default function FormPhoneInput({ name, type, label, placeholder, className, ...props }: Props) {
  const { control } = useFormContext();
  const maskitoRef = useMaskito({ options });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col items-start w-full", className)}>
          {label && <FormLabel className="font-medium text-[#344054] dark:text-white">{label}</FormLabel>}
          <FormControl className="w-full">
            <Input
              type={type ?? "text"}
              className="w-full"
              placeholder={placeholder}
              {...props}
              {...withMaskitoRegister(field, maskitoRef)}
            />
          </FormControl>
          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  );
}
