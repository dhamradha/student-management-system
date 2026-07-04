"use client";

import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FIELD_TYPES,
  NONE_MAP,
  fieldTypeMeta,
  mappableFields,
} from "@/lib/constants/forms";
import type {
  FieldType,
  FormField,
  FormTarget,
  MapKey,
} from "@/types/forms";

interface Props {
  field: FormField;
  index: number;
  total: number;
  target: FormTarget;
  onChange: (patch: Partial<FormField>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}

export function FieldEditor({
  field,
  index,
  total,
  target,
  onChange,
  onRemove,
  onMove,
}: Props) {
  const meta = fieldTypeMeta(field.type);
  const mapOptions = mappableFields(target);

  function setValidation(patch: Partial<FormField["validation"]>) {
    onChange({ validation: { ...field.validation, ...patch } });
  }

  function numOrUndef(v: string): number | undefined {
    return v === "" ? undefined : Number(v);
  }

  return (
    <div className="bg-card space-y-4 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <GripVertical className="text-muted-foreground size-4 shrink-0" />
        <span className="text-muted-foreground text-sm font-medium">
          Field {index + 1}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            aria-label="Move up"
          >
            <ChevronUp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            aria-label="Move down"
          >
            <ChevronDown className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label="Remove field"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Question label</Label>
          <Input
            value={field.label}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="e.g. Full Name"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select
            value={field.type}
            onValueChange={(v) =>
              onChange({
                type: (v ?? "short_text") as FieldType,
                options: fieldTypeMeta((v ?? "short_text") as FieldType)
                  .hasOptions
                  ? field.options.length
                    ? field.options
                    : ["Option 1"]
                  : [],
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FIELD_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Maps to student field</Label>
          <Select
            value={field.mapTo ?? NONE_MAP}
            onValueChange={(v) =>
              onChange({
                mapTo: !v || v === NONE_MAP ? null : (v as MapKey),
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_MAP}>None (extra info)</SelectItem>
              {mapOptions.map((m) => (
                <SelectItem key={m.key} value={m.key}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {meta.hasOptions && (
        <div className="space-y-2">
          <Label>Options</Label>
          {field.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={opt}
                onChange={(e) => {
                  const next = [...field.options];
                  next[i] = e.target.value;
                  onChange({ options: next });
                }}
                placeholder={`Option ${i + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  onChange({
                    options: field.options.filter((_, j) => j !== i),
                  })
                }
                aria-label="Remove option"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() =>
              onChange({
                options: [...field.options, `Option ${field.options.length + 1}`],
              })
            }
          >
            <Plus className="size-4" /> Add option
          </Button>
        </div>
      )}

      {(meta.numeric || meta.textual) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {meta.numeric && (
            <>
              <div className="space-y-1.5">
                <Label>Min value</Label>
                <Input
                  type="number"
                  value={field.validation.min ?? ""}
                  onChange={(e) =>
                    setValidation({ min: numOrUndef(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Max value</Label>
                <Input
                  type="number"
                  value={field.validation.max ?? ""}
                  onChange={(e) =>
                    setValidation({ max: numOrUndef(e.target.value) })
                  }
                />
              </div>
            </>
          )}
          {meta.textual && (
            <>
              <div className="space-y-1.5">
                <Label>Min length</Label>
                <Input
                  type="number"
                  value={field.validation.minLength ?? ""}
                  onChange={(e) =>
                    setValidation({ minLength: numOrUndef(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Max length</Label>
                <Input
                  type="number"
                  value={field.validation.maxLength ?? ""}
                  onChange={(e) =>
                    setValidation({ maxLength: numOrUndef(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Pattern (regex, optional)</Label>
                <Input
                  value={field.validation.pattern ?? ""}
                  onChange={(e) =>
                    setValidation({ pattern: e.target.value || undefined })
                  }
                  placeholder="e.g. ^[A-Z]{2}[0-9]+$"
                />
              </div>
            </>
          )}
        </div>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => onChange({ required: e.target.checked })}
          className="accent-primary size-4"
        />
        Required
      </label>
    </div>
  );
}
