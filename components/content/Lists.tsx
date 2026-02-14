interface ListItem {
  content: string;
}

interface UnorderedListProps {
  items: ListItem[];
}

export function BlogUnorderedList({ items }: UnorderedListProps) {
  return (
    <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
      {items.map((item, i) => (
        <li key={i}>{item.content}</li>
      ))}
    </ul>
  );
}

interface OrderedListProps {
  items: ListItem[];
}

export function BlogOrderedList({ items }: OrderedListProps) {
  return (
    <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
      {items.map((item, i) => (
        <li key={i}>{item.content}</li>
      ))}
    </ol>
  );
}
