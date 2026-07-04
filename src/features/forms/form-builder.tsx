"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AlertTriangle, Eye, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/auth-provider";
import { FieldEditor } from "@/features/forms/field-editor";
import { PublicForm } from "@/features/forms/public-form";
import { GRADES, getSubDivisions } from "@/lib/constants/academic";
import { createForm, updateForm, type FormInput } from "@/lib/services/forms";
import { formDefinitionSchema } from "@/lib/validations/form-builder";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import type { FormDoc, FormField, FormStatus, FormTarget } from "@/types/forms";

function newField(): FormField {
  return {
    id: crypto.randomUUID(),
    label: "",
    type: "short_text",
    required: false,
    options: [],
    mapTo: null,
    validation: {},
  };
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function FormBuilder({
  initial,
  formId,
}: {
  initial?: FormDoc;
  formId?: string;
}) {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [target, setTarget] = useState<FormTarget>(initial?.target ?? "student");
  const [grades, setGrades] = useState<string[]>(initial?.grades ?? []);
  const [classStreams, setClassStreams] = useState<string[]>(
    initial?.classStreams ?? [],
  );
  const [fields, setFields] = useState<FormField[]>(initial?.fields ?? []);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    grades.forEach((g) => getSubDivisions(g).forEach((s) => set.add(s)));
    return [...set];
  }, [grades]);

  function toggleGrade(g: string) {
    setGrades((prev) => {
      const next = prev.includes(g)
        ? prev.filter((x) => x !== g)
        : [...prev, g];
      // Drop class selections no longer valid for the chosen grades.
      const valid = new Set<string>();
      next.forEach((gr) => getSubDivisions(gr).forEach((s) => valid.add(s)));
      setClassStreams((cs) => cs.filter((c) => valid.has(c)));
      return next;
    });
  }

  function toggleClass(c: string) {
    setClassStreams((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }

  function switchTarget(nextTarget: FormTarget) {
    if (nextTarget === target) return;
    setTarget(nextTarget);
    // Field mappings differ per target, so clear them on switch.
    setFields((prev) => prev.map((f) => ({ ...f, mapTo: null })));
    if (nextTarget === "teacher") {
      setGrades([]);
      setClassStreams([]);
    }
  }

  function patchField(id: string, patch: Partial<FormField>) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  function moveField(index: number, dir: -1 | 1) {
    setFields((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  const previewForm: FormDoc = {
    id: "preview",
    title: title || "Untitled form",
    description,
    target,
    grades,
    classStreams,
    status: "published",
    fields,
    createdBy: "",
    createdByName: "",
    createdAt: "",
    updatedAt: "",
  };

  async function handleSave(status: FormStatus) {
    const input: FormInput = {
      title,
      description,
      target,
      grades: target === "student" ? grades : [],
      classStreams: target === "student" ? classStreams : [],
      status,
      fields,
    };
    const parsed = formDefinitionSchema.safeParse(input);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please fix the form.");
      return;
    }
    if (!user || !profile) return;

    setSaving(true);
    try {
      if (formId) await updateForm(formId, input);
      else await createForm(input, user.uid, profile.displayName);
      toast.success(status === "published" ? "Form published." : "Draft saved.");
      router.push("/forms");
    } catch {
      toast.error("Could not save the form.");
    } finally {
      setSaving(false);
    }
  }

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Preview — this is what students see. Responses are not saved.
          </p>
          <Button variant="outline" onClick={() => setPreview(false)}>
            Back to editing
          </Button>
        </div>
        <PublicForm key={fields.length} form={previewForm} preview />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {initial?.status === "published" && (
        <div className="border-gold/40 bg-gold/10 text-gold-foreground flex items-start gap-2 rounded-lg border p-3 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>
            This form is <strong>published</strong> and may already have student
            responses. Changing or removing fields can affect existing
            submissions.
          </span>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Form details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>This form collects</Label>
            <div className="flex flex-wrap gap-2">
              <Chip
                active={target === "student"}
                onClick={() => switchTarget("student")}
              >
                Student details
              </Chip>
              <Chip
                active={target === "teacher"}
                onClick={() => switchTarget("teacher")}
              >
                Teacher details
              </Chip>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. O/L Admission 2026"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Shown to students at the top of the form."
            />
          </div>
          {target === "student" && (
            <>
              <div className="space-y-2">
                <Label>Grades</Label>
                <div className="flex flex-wrap gap-2">
                  {GRADES.map((g) => (
                    <Chip
                      key={g}
                      active={grades.includes(g)}
                      onClick={() => toggleGrade(g)}
                    >
                      Grade {g}
                    </Chip>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Classes / Streams</Label>
                {availableClasses.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Select one or more grades first.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableClasses.map((c) => (
                      <Chip
                        key={c}
                        active={classStreams.includes(c)}
                        onClick={() => toggleClass(c)}
                      >
                        {c}
                      </Chip>
                    ))}
                  </div>
                )}
                <p className="text-muted-foreground text-xs">
                  Leave empty to skip asking the class. Pick several to reuse
                  this form across classes — students choose theirs.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {fields.map((field, i) => (
          <FieldEditor
            key={field.id}
            field={field}
            index={i}
            total={fields.length}
            target={target}
            onChange={(patch) => patchField(field.id, patch)}
            onRemove={() =>
              setFields((prev) => prev.filter((f) => f.id !== field.id))
            }
            onMove={(dir) => moveField(i, dir)}
          />
        ))}
        {fields.length === 0 && (
          <p className="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-sm">
            No fields yet. Add your first question below.
          </p>
        )}
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={() => setFields((prev) => [...prev, newField()])}
        >
          <Plus className="size-4" /> Add field
        </Button>
      </div>

      <div className="bg-background/80 sticky bottom-0 flex flex-wrap justify-end gap-3 border-t py-4 backdrop-blur">
        <Button
          variant="ghost"
          className="mr-auto gap-2"
          disabled={fields.length === 0}
          onClick={() => setPreview(true)}
        >
          <Eye className="size-4" /> Preview
        </Button>
        <Button
          variant="outline"
          disabled={saving}
          onClick={() => handleSave("draft")}
        >
          Save draft
        </Button>
        <Button disabled={saving} onClick={() => handleSave("published")}>
          {saving ? t("common.loading") : "Save & publish"}
        </Button>
      </div>
    </div>
  );
}
