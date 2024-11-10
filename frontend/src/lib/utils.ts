import { ZodObject, ZodRawShape } from "zod";

export function validateData<T extends ZodRawShape>(
  toValidate: Record<string, string> | FormData,
  schemaRegister: ZodObject<T>
) {
  const validatedFields = schemaRegister.safeParse(
    toValidate instanceof FormData ? Object.fromEntries(toValidate) : toValidate
  );

  if (!validatedFields.success) {
    return {
      ...validatedFields,
      error: validatedFields.error.flatten().fieldErrors,
    };
  } else {
    return validatedFields;
  }
}

export function cn(classes: unknown[]) {
  return classes.filter((cssClass) => typeof cssClass === "string").join(" ");
}

export function getColorScheme() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  } else {
    return "light";
  }
}
