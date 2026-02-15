interface CodeBlockProps {
  code: string;
}

export function BlogCodeBlock({ code }: CodeBlockProps) {
  return (
    <pre className="bg-muted p-4 rounded-none text-xs overflow-x-auto border border-border">
      <code>{code}</code>
    </pre>
  );
}
