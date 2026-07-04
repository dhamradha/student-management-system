"use client";

import { useState } from "react";
import { FilePlus2, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { FormBuilder } from "@/features/forms/form-builder";
import { buildDefaultStudentFields } from "@/lib/constants/forms";
import type { FormDoc } from "@/types/forms";

function templateForm(): FormDoc {
  return {
    id: "",
    title: "",
    description: "",
    grades: [],
    classStreams: [],
    status: "draft",
    fields: buildDefaultStudentFields(),
    createdBy: "",
    createdByName: "",
    createdAt: "",
    updatedAt: "",
  };
}

export default function NewFormPage() {
  const [mode, setMode] = useState<null | "blank" | "template">(null);
  const [initial, setInitial] = useState<FormDoc | undefined>(undefined);

  if (mode === null) {
    return (
      <div className="space-y-6">
        <h1 className="text-primary text-2xl font-bold">New Form</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setInitial(templateForm());
              setMode("template");
            }}
            className="text-left"
          >
            <Card className="hover:ring-primary/40 h-full transition-shadow hover:shadow-md">
              <CardContent className="space-y-2 pt-6">
                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                  <Sparkles className="size-5" />
                </div>
                <h2 className="font-semibold">Student intake template</h2>
                <p className="text-muted-foreground text-sm">
                  Pre-filled with the standard student fields (name, admission,
                  DOB, gender, guardian & emergency contacts), already mapped.
                </p>
              </CardContent>
            </Card>
          </button>

          <button
            type="button"
            onClick={() => {
              setInitial(undefined);
              setMode("blank");
            }}
            className="text-left"
          >
            <Card className="hover:ring-primary/40 h-full transition-shadow hover:shadow-md">
              <CardContent className="space-y-2 pt-6">
                <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-lg">
                  <FilePlus2 className="size-5" />
                </div>
                <h2 className="font-semibold">Blank form</h2>
                <p className="text-muted-foreground text-sm">
                  Start from scratch and add your own questions.
                </p>
              </CardContent>
            </Card>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-primary text-2xl font-bold">New Form</h1>
      <FormBuilder initial={initial} />
    </div>
  );
}
