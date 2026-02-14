interface CodeBlockProps {
  code: string;
  language?: string;
}

export function BlogCodeBlock({ code, language }: CodeBlockProps) {
  return (
    <pre className="bg-muted p-4 rounded-none text-xs overflow-x-auto border border-border">
      <code>{code}</code>
    </pre>
  );
}
