"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSubDivisions } from "@/lib/constants/academic";
import { createSubmission } from "@/lib/services/submissions";
import {
  buildSubmissionSchema,
  defaultAnswers,
} from "@/lib/validations/form-builder";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import type { FieldType, FormDoc, FormField } from "@/types/forms";

function inputType(type: FieldType): string {
  return (
    { number: "number", email: "email", phone: "tel", date: "date" } as Record<
      string,
      string
    >
  )[type] ?? "text";
}

export function PublicForm({
  form,
  preview = false,
}: {
  form: FormDoc;
  preview?: boolean;
}) {
  const { t } = useTranslation();
  const [done, setDone] = useState(false);

  const isStudent = form.target === "student";
  const askGrade = isStudent && form.grades.length > 1;
  const askClass = isStudent && form.classStreams.length > 1;
  const [grade, setGrade] = useState(form.grades.length === 1 ? form.grades[0] : "");
  const [classStream, setClassStream] = useState(
    form.classStreams.length === 1 ? form.classStreams[0] : "",
  );
  const [metaError, setMetaError] = useState("");

  const classOptions = grade
    ? form.classStreams.filter((c) =>
        (getSubDivisions(grade) as readonly string[]).includes(c),
      )
    : form.classStreams;

  const rhf = useForm({
    resolver: zodResolver(buildSubmissionSchema(form.fields)),
    defaultValues: defaultAnswers(form.fields),
  });

  async function onSubmit(values: Record<string, unknown>) {
    if (askGrade && !grade) {
      setMetaError("Please select your grade.");
      return;
    }
    if (askClass && !classStream) {
      setMetaError("Please select your class.");
      return;
    }
    setMetaError("");

    if (preview) {
      toast.info("Preview only — responses are not saved.");
      return;
    }

    try {
      await createSubmission(
        form,
        values as Record<string, string | string[]>,
        isStudent ? (askGrade ? grade : form.grades[0]) : "",
        isStudent
          ? form.classStreams.length === 0
            ? null
            : classStream || null
          : null,
      );
      setDone(true);
    } catch {
      toast.error("Could not submit. Please try again.");
    }
  }

  if (done) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <CheckCircle2 className="size-12 text-green-600" />
          <h2 className="text-xl font-semibold">Thank you!</h2>
          <p className="text-muted-foreground text-sm">
            Your response has been submitted for review.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary border-t-4">
      <CardHeader className="gap-2 pb-2">
        <CardTitle className="text-primary text-2xl">{form.title}</CardTitle>
        {form.description && (
          <CardDescription>{form.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={rhf.handleSubmit(onSubmit)} className="space-y-6">
          {(askGrade || askClass) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {askGrade && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    {t("form1.grade")}
                    <span className="text-destructive"> *</span>
                  </label>
                  <Select
                    value={grade}
                    onValueChange={(v) => {
                      setGrade(v ?? "");
                      setClassStream("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("common.selectPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {form.grades.map((g) => (
                        <SelectItem key={g} value={g}>
                          Grade {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {askClass && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    {t("form1.classStream")}
                    <span className="text-destructive"> *</span>
                  </label>
                  <Select
                    value={classStream}
                    onValueChange={(v) => setClassStream(v ?? "")}
                    disabled={askGrade && !grade}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("common.selectPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {classOptions.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {form.fields.map((field) => {
            const error = rhf.formState.errors[field.id]?.message as
              | string
              | undefined;
            return (
              <div key={field.id} className="space-y-1.5">
                <label className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-destructive"> *</span>}
                </label>
                {field.helpText && (
                  <p className="text-muted-foreground text-xs">
                    {field.helpText}
                  </p>
                )}
                <FieldControl field={field} control={rhf.control} />
                {error && <p className="text-destructive text-sm">{error}</p>}
              </div>
            );
          })}

          {metaError && <p className="text-destructive text-sm">{metaError}</p>}

          <Button
            type="submit"
            className="w-full"
            disabled={rhf.formState.isSubmitting}
          >
            {preview ? "Preview" : t("btn.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function FieldControl({
  field,
  control,
}: {
  field: FormField;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
}) {
  if (field.type === "long_text") {
    return (
      <Controller
        control={control}
        name={field.id}
        render={({ field: f }) => (
          <Textarea rows={3} placeholder={field.placeholder} {...f} />
        )}
      />
    );
  }

  if (field.type === "dropdown") {
    return (
      <Controller
        control={control}
        name={field.id}
        render={({ field: f }) => (
          <Select value={f.value} onValueChange={f.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    );
  }

  if (field.type === "radio") {
    return (
      <Controller
        control={control}
        name={field.id}
        render={({ field: f }) => (
          <div className="space-y-2">
            {field.options.map((o) => (
              <label key={o} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  className="accent-primary size-4"
                  checked={f.value === o}
                  onChange={() => f.onChange(o)}
                />
                {o}
              </label>
            ))}
          </div>
        )}
      />
    );
  }

  if (field.type === "checkbox") {
    return (
      <Controller
        control={control}
        name={field.id}
        render={({ field: f }) => {
          const values: string[] = Array.isArray(f.value) ? f.value : [];
          return (
            <div className="space-y-2">
              {field.options.map((o) => (
                <label key={o} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="accent-primary size-4"
                    checked={values.includes(o)}
                    onChange={(e) =>
                      f.onChange(
                        e.target.checked
                          ? [...values, o]
                          : values.filter((v) => v !== o),
                      )
                    }
                  />
                  {o}
                </label>
              ))}
            </div>
          );
        }}
      />
    );
  }

  return (
    <Controller
      control={control}
      name={field.id}
      render={({ field: f }) => (
        <Input
          type={inputType(field.type)}
          placeholder={field.placeholder}
          className={cn(field.type === "date" && "w-fit")}
          {...f}
        />
      )}
    />
  );
}
