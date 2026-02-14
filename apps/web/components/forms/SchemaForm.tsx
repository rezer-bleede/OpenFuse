"use client";

import type { ConnectorSchema } from "@/app/lib/connectors";

type SchemaFormProps = {
  schema: ConnectorSchema;
  value: Record<string, unknown>;
  onChange: (nextValue: Record<string, unknown>) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
  idPrefix: string;
};

const toLabel = (name: string, fallback?: string): string => {
  if (fallback && fallback.trim().length > 0) {
    return fallback;
  }
  return name
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export function SchemaForm({ schema, value, onChange, errors = {}, disabled = false, idPrefix }: SchemaFormProps) {
  const properties = Object.entries(schema.properties ?? {});
  const requiredSet = new Set(schema.required ?? []);

  const updateField = (field: string, fieldValue: unknown) => {
    const next = { ...value };
    if (
      fieldValue === undefined ||
      fieldValue === null ||
      (typeof fieldValue === "string" && fieldValue.trim().length === 0) ||
      (Array.isArray(fieldValue) && fieldValue.length === 0)
    ) {
      delete next[field];
    } else {
      next[field] = fieldValue;
    }
    onChange(next);
  };

  if (properties.length === 0) {
    return <p className="text-sm text-[var(--muted)]">No additional fields required for this connector.</p>;
  }

  return (
    <div className="space-y-4">
      {properties.map(([fieldName, config]) => {
        const fieldId = `${idPrefix}-${fieldName}`;
        const fieldLabel = toLabel(fieldName, config.title);
        const fieldValue =
          value[fieldName] ?? (config.default !== undefined ? config.default : config.type === "boolean" ? false : "");
        const required = requiredSet.has(fieldName);
        const error = errors[fieldName];
        const commonInputClass =
          "w-full rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none transition focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-500/30";

        return (
          <div className="space-y-1" key={fieldName}>
            <label className="block text-sm font-medium text-[var(--text-soft)]" htmlFor={fieldId}>
              {fieldLabel}
              {required ? <span className="ml-1 text-[var(--danger)]">*</span> : null}
            </label>
            {config.enum && config.enum.length > 0 ? (
              <select
                className={commonInputClass}
                disabled={disabled}
                id={fieldId}
                onChange={(event) => updateField(fieldName, event.target.value)}
                value={String(fieldValue ?? "")}
              >
                <option value="">Select an option</option>
                {config.enum.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : config.type === "boolean" ? (
              <label className="flex items-center gap-2 rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text-strong)]">
                <input
                  checked={Boolean(fieldValue)}
                  className="h-4 w-4"
                  disabled={disabled}
                  id={fieldId}
                  onChange={(event) => updateField(fieldName, event.target.checked)}
                  type="checkbox"
                />
                Enable
              </label>
            ) : config.type === "integer" || config.type === "number" ? (
              <input
                className={commonInputClass}
                disabled={disabled}
                id={fieldId}
                onChange={(event) => {
                  const rawValue = event.target.value;
                  if (rawValue.trim().length === 0) {
                    updateField(fieldName, undefined);
                    return;
                  }
                  updateField(fieldName, Number(rawValue));
                }}
                type="number"
                value={String(fieldValue ?? "")}
              />
            ) : config.type === "array" && config.items?.type === "string" ? (
              <textarea
                className={`${commonInputClass} min-h-[84px]`}
                disabled={disabled}
                id={fieldId}
                onChange={(event) => {
                  const list = event.target.value
                    .split(/[\n,]/g)
                    .map((item) => item.trim())
                    .filter((item) => item.length > 0);
                  updateField(fieldName, list);
                }}
                placeholder="Comma or newline separated values"
                value={Array.isArray(fieldValue) ? fieldValue.join(", ") : ""}
              />
            ) : (
              <input
                className={commonInputClass}
                disabled={disabled}
                id={fieldId}
                onChange={(event) => updateField(fieldName, event.target.value)}
                type={config.format === "password" ? "password" : config.format === "uri" ? "url" : "text"}
                value={String(fieldValue ?? "")}
              />
            )}
            {config.description ? <p className="text-xs text-[var(--muted)]">{config.description}</p> : null}
            {error ? <p className="text-xs text-[var(--danger)]">{error}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
