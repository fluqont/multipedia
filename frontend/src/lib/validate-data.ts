import { ZodObject, ZodRawShape } from "zod";

export function validateData<T extends ZodRawShape>(
  formData: FormData,
  schemaRegister: ZodObject<T>
) {
  const validatedFields = schemaRegister.safeParse(
    Object.fromEntries(formData)
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
