export type Trip = {
  id: string;
  title: string;
  dateLabel: string;
  description: string;
  coverUri: string;
  /** Рік / період для групування (навчальні секції пізніше). */
  region: string;
};

export type Place = {
  id: string;
  tripId: string;
  name: string;
  city: string;
  note: string;
};
