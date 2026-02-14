interface BlockquoteProps {
  text: string;
  cite?: string;
}

export function BlogBlockquote({ text, cite }: BlockquoteProps) {
  return (
    <blockquote className="pl-4 border-l-2 border-primary py-1">
      <p className="text-sm italic">"{text}"</p>
      {cite && <p className="text-xs text-muted-foreground mt-2">— {cite}</p>}
    </blockquote>
  );
}
