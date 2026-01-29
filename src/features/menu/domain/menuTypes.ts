export type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri";

export type MenuSection = {
  title: string;
  items: string[];
};

export type MenuDay = {
  weekday: WeekdayKey;
  dateText?: string;
  sections: MenuSection[];
};

export type WeeklyMenu = {
  locationName: string;
  days: Record<WeekdayKey, MenuDay>;
  fetchedAt: number;
};
