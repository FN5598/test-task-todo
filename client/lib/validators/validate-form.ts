import { z } from "zod";

export type FieldErrors = Record<string, string>;

type ValidationResult<TSchema extends z.ZodType> =
  | { success: true; data: z.output<TSchema> }
  | { success: false; errors: FieldErrors };

export function validateForm<TSchema extends z.ZodType>(
  schema: TSchema,
  formData: FormData,
): ValidationResult<TSchema> {
  const result = schema.safeParse(Object.fromEntries(formData));

  if (result.success) {
    return result;
  }

  const errors = result.error.issues.reduce<FieldErrors>((fieldErrors, issue) => {
    const field = issue.path[0];

    if (typeof field === "string" && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }

    return fieldErrors;
  }, {});

  return { success: false, errors };
}
