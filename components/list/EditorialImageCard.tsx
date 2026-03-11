import { CardList } from "./CardList";
import type { CardItem } from "./types";

type EditorialImageCardProps = {
  items: CardItem[];
  type: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  showCardTags?: boolean;
  showCardDate?: boolean;
  showCardReadTime?: boolean;
  metaInlineWithTitle?: boolean;
};

export function EditorialImageCard({
  items,
  type,
  searchPlaceholder,
  emptyMessage,
  showCardTags,
  showCardDate,
  showCardReadTime,
  metaInlineWithTitle,
}: EditorialImageCardProps) {
  return (
    <CardList
      items={items}
      type={type}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      showImage
      showCardTags={showCardTags}
      showCardDate={showCardDate}
      showCardReadTime={showCardReadTime}
      metaInlineWithTitle={metaInlineWithTitle}
    />
  );
}
