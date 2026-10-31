export function isValidId(id: number): boolean {
  return Number.isFinite(id) && id > 0;
}
