export function typeToUrl(type: string): string {
  return `/${type}`;
}

export function typeToLabel(type: string): string {
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
