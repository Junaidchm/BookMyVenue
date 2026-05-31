export type Venue = {
  id: string;
  title: string;
  location: string;
  pricePerDay: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
};

export type VenueCategory = {
  id: string;
  label: string;
  icon: "heart" | "briefcase" | "cake" | "camera";
};

export const FEATURED_VENUES: Venue[] = [
  {
    id: "1",
    title: "The Glass Pavilion",
    location: "San Francisco, CA",
    pricePerDay: 2400,
    rating: 4.97,
    reviewCount: 128,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD0cmtFtqQDxCCb8cbolHEKsH-g0aC7KDk6A5mEbBqspfIdywH408161WwZfApMRXr1cvH_bD__hbY7IDRZbCsBaIJKS0UjHt2WlVhfSP3O5WVAQMopYHwvlIA0kKVKPRz-Z2WcCL-dbmb21d9whOM5d4jtpv4dUPNm60wC9FhjRLsCDf0iFGsyi2-HFz8vgQoVFSekqOLVKVOX-carvQz-nTvIr65N14u98FUm343L3KTP1tqF4uJ_flGGWFlSFvJVaMvti0HFhgq_",
    category: "Corporate",
  },
  {
    id: "2",
    title: "Sunset Terrace Estate",
    location: "Napa Valley, CA",
    pricePerDay: 3800,
    rating: 4.95,
    reviewCount: 94,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCtpOecp2RqmATdEgb5T0YSkFsiNuMXfE24BGpuSyO1KiErj6D2KCWMfRRURc7LaPQfS4U7KBcALvRxIvgauopLFL5ZC1WnrUruzuCy5OzSkLLjGROeH1U1H_HCnYasH4ImkGD0Cl6vLNKVWHL2oR7SO5pKgSenyB8Uy284LSUFpmQIFOzRtvhAjtx1DBtMsdjD9qeSvoei1nF3BY5rJMyKTZ5OY0iqJdA_BpAungPgIFniZdNdaDXJB-PWUf57XV77e468awusxa1O",
    category: "Weddings",
  },
  {
    id: "3",
    title: "Urban Loft Studio",
    location: "Brooklyn, NY",
    pricePerDay: 1200,
    rating: 4.88,
    reviewCount: 76,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBibvpo-lF8BCRfgGCk6QbyBK1H9VujIS7MJM6FzIGe2v9neX8ko3K0eDG2X2fqLZfemRdhGoJ3iCbnd7e6SfwkerPRUD6LWM7zrkSVz5YlXd_fvnKriXmcZPunqiBQUiNJlf2wr85dyBVSg5sJD6HCJuirg4XQqBtx8BTv-qg-q41Ga7xYrWrLMk2m5iy7arkADM_teNqza84cqckpWvqtFhrS__7zSz0Vuzbc_Lo4yAz7aZ8rHSFH05ffeQbWrlCx0XON9THwiqGk",
    category: "Studios",
  },
  {
    id: "4",
    title: "Garden House Retreat",
    location: "Austin, TX",
    pricePerDay: 1850,
    rating: 4.92,
    reviewCount: 112,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA4TkKZJ7pfQDJsGMbm0aGTWPiNP3C_TkcmpZf2jYq_pavW-wZfjvuljoiWuBmA8qnjJghwxJoX1ejk_MN7DCjphewVo7kVa2i-S4FE5KQKvY4VibY2DTZFLE8AAU9q1lI7hCWdGUX4BT4m9ci6JX65QKdU9LCH6eELKJDYf2mKRfEE4Q7yZnBV-oxr5Fo3cQJExCDHufuNlfytXhpYFXqRuqZkZ_wTn1iyWqqmmi3H38vcNkxSs9QoJ5-0ydQ1FB-ietUC7yxwsf9a",
    category: "Birthdays",
  },
];

export const VENUE_CATEGORIES: VenueCategory[] = [
  { id: "weddings", label: "Weddings", icon: "heart" },
  { id: "corporate", label: "Corporate", icon: "briefcase" },
  { id: "birthdays", label: "Birthdays", icon: "cake" },
  { id: "studios", label: "Studios", icon: "camera" },
];
