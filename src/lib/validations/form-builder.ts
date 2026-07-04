import { z } from "zod";

import { GRADES } from "@/lib/constants/academic";
import { fieldTypeMeta } from "@/lib/constants/forms";
import type { FormField } from "@/types/forms";

const FIELD_TYPE_VALUES = [
  "short_text",
  "long_text",
  "number",
  "email",
  "phone",
  "date",
  "dropdown",
  "radio",
  "checkbox",
] as const;

/** Validates a form definition before it is saved by a teacher. */
export const formDefinitionSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string(),
    target: z.enum(["student", "teacher"]),
    grades: z.array(z.enum(GRADES)),
    classStreams: z.array(z.string()),
    status: z.enum(["draft", "published"]),
    fields: z
      .array(
        z.object({
          id: z.string(),
          label: z.string().trim().min(1, "Every field needs a label"),
          type: z.enum(FIELD_TYPE_VALUES),
          required: z.boolean(),
          helpText: z.string().optional(),
          placeholder: z.string().optional(),
          options: z.array(z.string()),
          mapTo: z.string().nullable(),
          validation: z.object({
            minLength: z.number().optional(),
            maxLength: z.number().optional(),
            min: z.number().optional(),
            max: z.number().optional(),
            pattern: z.string().optional(),
            patternMessage: z.string().optional(),
          }),
        }),
      )
      .min(1, "Add at least one field"),
  })
  .superRefine((form, ctx) => {
    if (form.target === "student" && form.grades.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["grades"],
        message: "Select at least one grade",
      });
    }
    form.fields.forEach((field, i) => {
      if (fieldTypeMeta(field.type).hasOptions) {
        const filled = field.options.filter((o) => o.trim());
        if (filled.length < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["fields", i, "options"],
            message: "Add at least one option",
          });
        }
      }
    });
  });

export type FormDefinitionInput = z.infer<typeof formDefinitionSchema>;

/**
 * Build a runtime zod schema from a form's fields, used to validate a student's
 * submission on the public page. Optional empty answers pass; filled answers
 * are checked against the field's type + validation rules.
 */
export function buildSubmissionSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    if (field.type === "checkbox") {
      const arr = z.array(z.string());
      shape[field.id] = field.required
        ? arr.min(1, "Select at least one option")
        : arr;
      continue;
    }

    shape[field.id] = z.string().superRefine((raw, ctx) => {
      const v = (raw ?? "").trim();
      const add = (message: string) =>
        ctx.addIssue({ code: z.ZodIssueCode.custom, message });

      if (!v) {
        if (field.required) add("This field is required");
        return;
      }

      const rules = field.validation;
      if (field.type === "number") {
        const n = Number(v);
        if (Number.isNaN(n)) return add("Must be a number");
        if (rules.min != null && n < rules.min) add(`Must be ≥ ${rules.min}`);
        if (rules.max != null && n > rules.max) add(`Must be ≤ ${rules.max}`);
      }
      if (field.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
        add("Enter a valid email address");
      }
      if (field.type === "phone" && !/^(?:\+94|0)[0-9]{9}$/.test(v)) {
        add("Enter a valid phone number");
      }
      if (rules.minLength != null && v.length < rules.minLength) {
        add(`Must be at least ${rules.minLength} characters`);
      }
      if (rules.maxLength != null && v.length > rules.maxLength) {
        add(`Must be at most ${rules.maxLength} characters`);
      }
      if (rules.pattern) {
        try {
          if (!new RegExp(rules.pattern).test(v)) {
            add(rules.patternMessage || "Invalid format");
          }
        } catch {
          /* ignore invalid regex authored in the builder */
        }
      }
    });
  }

  return z.object(shape);
}

/** Default answer values for a form's fields. */
export function defaultAnswers(
  fields: FormField[],
): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  for (const field of fields) {
    out[field.id] = field.type === "checkbox" ? [] : "";
  }
  return out;
}
