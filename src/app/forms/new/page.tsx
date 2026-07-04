"use client";

import { useState } from "react";
import { FilePlus2, GraduationCap, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { FormBuilder } from "@/features/forms/form-builder";
import {
  buildDefaultStudentFields,
  buildDefaultTeacherFields,
} from "@/lib/constants/forms";
import type { FormDoc, FormTarget } from "@/types/forms";

function templateForm(target: FormTarget): FormDoc {
  return {
    id: "",
    title: "",
    description: "",
    target,
    grades: [],
    classStreams: [],
    status: "draft",
    fields:
      target === "teacher"
        ? buildDefaultTeacherFields()
        : buildDefaultStudentFields(),
    createdBy: "",
    createdByName: "",
    createdAt: "",
    updatedAt: "",
  };
}

export default function NewFormPage() {
  const [started, setStarted] = useState(false);
  const [initial, setInitial] = useState<FormDoc | undefined>(undefined);

  function start(value: FormDoc | undefined) {
    setInitial(value);
    setStarted(true);
  }

  if (!started) {
    return (
      <div className="space-y-6">
        <h1 className="text-primary text-2xl font-bold">New Form</h1>
        <div className="grid gap-4 sm:grid-cols-3">
          <ChoiceCard
            icon={<Sparkles className="size-5" />}
            title="Student intake template"
            body="Standard student fields (name, admission, DOB, gender, guardian & emergency contacts), pre-mapped."
            onClick={() => start(templateForm("student"))}
            accent
          />
          <ChoiceCard
            icon={<GraduationCap className="size-5" />}
            title="Teacher details template"
            body="Standard teacher fields (name, NIC, contact, subject, qualifications, etc.), pre-mapped."
            onClick={() => start(templateForm("teacher"))}
            accent
          />
          <ChoiceCard
            icon={<FilePlus2 className="size-5" />}
            title="Blank form"
            body="Start from scratch and add your own questions."
            onClick={() => start(undefined)}
          />
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

function ChoiceCard({
  icon,
  title,
  body,
  onClick,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} className="text-left">
      <Card className="hover:ring-primary/40 h-full transition-shadow hover:shadow-md">
        <CardContent className="space-y-2 pt-6">
          <div
            className={
              accent
                ? "bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg"
                : "bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-lg"
            }
          >
            {icon}
          </div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-muted-foreground text-sm">{body}</p>
        </CardContent>
      </Card>
    </button>
  );
}
