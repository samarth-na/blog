export function typeToUrl(type: string): string {
  const typePathMap: Record<string, string> = {
    weeklog: "/weeklogs",
  };

  return typePathMap[type] ?? `/${type}`;
}

export function urlSegmentToType(segment: string): string {
  const segmentTypeMap: Record<string, string> = {
    weeklogs: "weeklog",
  };

  return segmentTypeMap[segment] ?? segment;
}

export function typeToLabel(type: string): string {
  const typeLabelMap: Record<string, string> = {
    weeklog: "Weeklogs",
  };

  if (typeLabelMap[type]) {
    return typeLabelMap[type];
  }

  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
