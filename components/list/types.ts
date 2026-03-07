export type CardItem = {
  slug: string;
  title: string;
  image?: string;
  tags: string[];
  description?: string;
};

export type ListItem = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  readTime: string;
  excerpt?: string;
};
