import { CardList } from "./CardList";
import type { CardItem } from "./types";

type EditorialCardProps = {
  items: CardItem[];
  type: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  showCardTags?: boolean;
  showCardDate?: boolean;
  showCardReadTime?: boolean;
  metaInlineWithTitle?: boolean;
};

export function EditorialCard({
  items,
  type,
  searchPlaceholder,
  emptyMessage,
  showCardTags,
  showCardDate,
  showCardReadTime,
  metaInlineWithTitle,
}: EditorialCardProps) {
  return (
    <CardList
      items={items}
      type={type}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      showImage={false}
      showCardTags={showCardTags}
      showCardDate={showCardDate}
      showCardReadTime={showCardReadTime}
      metaInlineWithTitle={metaInlineWithTitle}
    />
  );
}
