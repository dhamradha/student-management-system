"use client";

import { useParams } from "next/navigation";

import { SubmissionsReview } from "@/features/forms/submissions-review";

export default function SubmissionsPage() {
  const params = useParams<{ id: string }>();
  return (
    <div className="space-y-6">
      <h1 className="text-primary text-2xl font-bold">Submissions</h1>
      <SubmissionsReview formId={params.id} />
    </div>
  );
}
