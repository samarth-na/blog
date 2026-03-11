import { List } from "./List";
import type { ListItem } from "./types";

type EditorialListProps = {
  items: ListItem[];
  type: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  defaultView?: "full" | "minimal";
};

export function EditorialList({
  items,
  type,
  searchPlaceholder,
  emptyMessage,
  defaultView,
}: EditorialListProps) {
  return (
    <List
      items={items}
      type={type}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      defaultView={defaultView}
    />
  );
}
