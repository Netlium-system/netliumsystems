export function readRequiredField(formData: FormData, field: string): string | null {
  const value = formData.get(field);
  return typeof value === "string" && value.length > 0 ? value : null;
}
