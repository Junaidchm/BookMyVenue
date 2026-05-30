export type VenueAmenity = {
  label: string;
  icon: "wifi" | "kitchen" | "parking" | "speaker";
};

export type VenueReview = {
  author: string;
  initials: string;
  date: string;
  text: string;
};

export type Venue = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  pricePerDay: number;
  rating: number;
  reviewCount: number;
  description: string;
  images: {
    main: string;
    gallery: string[];
  };
  amenities: VenueAmenity[];
  reviews: VenueReview[];
};

export const VENUES: Record<string, Venue> = {
  "glass-pavilion": {
    id: "glass-pavilion",
    name: "The Glass Pavilion",
    location: "Malibu, CA",
    capacity: 200,
    pricePerDay: 1200,
    rating: 4.9,
    reviewCount: 124,
    description:
      "Experience unparalleled elegance at The Glass Pavilion. Nestled in the hills of Malibu, this architectural masterpiece offers panoramic ocean views through its signature floor-to-ceiling glass walls. The seamless integration of indoor and outdoor spaces creates a breathtaking, sunlit atmosphere perfect for premium events, weddings, and exclusive corporate retreats. Designed with minimalist aesthetics and warm natural materials, the venue provides a blank canvas of sophisticated luxury, allowing your event to shine in a truly airy, modern setting.",
    images: {
      main: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZVaLCu_F4y5WibwiWnM4CJIrXmF7N7ZCzdhskxj69ztYwg5DW6z6AHxiWNAIQ1YogUKY5np1YWQiFHdNPpBFgeWAKqixlgXZO_DoblJvENIjsqIdV7vv60HhSSMF0wTQ8p0WXApwU3xndBxwS1NlvFcwee16gk0vXlBWDR0c-_XoViqA6XHVFtqwOnzAImanTew0cMY--_YEj9db9Mf0CLUOv_oLPUSnmek4SOb6MpYJM_MieSW8YTz73Q02DsGhoCWQZuYnxSmJj",
      gallery: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC2fxS1NhDqBvALDxDHvwxR4tP6C6YFCEPRBAiqXq3Ga9Viyu_AoQSVlsxyNeG1q4i0MZXtJ7cuRNbQ0-1QPRUYhXrJs65C-ZDqLm-0Rlop8leF5dZWrj1vzu-mDItf2UnhPcAcHnDhzU2lunis89lYmKA7JNu3Og0RAB5kHlXLZRd1LW8POzEWiDiDhDNsroPZRwiyj8LfExdpuRlir-58KeEbOX0ks-zo29M1oaPePPgmWeWWZ5v3ckTYYsDwaP6YWV9nHBTS77rE",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA1c41gnAmVDsbOVFhdnDk1x1dH0HoxnHrpuXyf97VjukJo6hCWLzLJuB-ezrUVlBiJSvCuyipD60TX7ffVoTq8UBoqZoSTmDpE_i0C0rAXoVhkLDDEnqtFhl0QBBfCFq-nq0SunRATEIcWQZcbH5jTrBauA-k68AXTO0ASlg6LTASjYbUR5LtYyCF9QNEdyMbqF8BK4J8JBtmkRnSACwjN0pSI7JYW1Vh0qataw12-nPAnCWh8vFFs7rRyEpo5doEza9IXxUscsHNe",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA5ED0PF3-u7ejVzCyRfqZiL5j3rfLoID0Jc38kffDORhW0m6ch2w5jDTK3qJmAegBk8h-7zRf9io2yFbFLg0gDozn_VicMFh7P8jXTkItGEqY-ZlmtNUxQJwA_MpllZushxjw9hPGwd9mN0fczS_fLn0Z3FsPekronIXFn8zhrn6FUGgLo5hYFRqfWOMHV6MtRuajVzBJa64Ib5cPWGdssfGPYQymtqhgI7kiUiDN6W3hMxHKcxB0Q88f75lh6Qsz47hIslcllc4MC",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCgYqpoywjw4N865RNkeei2rj-8F1DLDcontZxF5tdu7JNZPn1efnYhRoUJZIPt6lvPNEA2jQX6OsQeStr0UY2swqbb9QmDQveDAlcpq4td8mfyZzXDr5PqN7H_PKfz_IP2bdioL9vNj7PDKtlHqPf9TqPhqpqgGGT7WXsW52iICo1tE1tJ7gXgc4P-j9A2RSG0aUZq_QI9xoEluYqea567vEUlOKurJVnlJm1up6ck6_Rgd71PfNE946ygtd76MzQbGK5fZHvmX_-k",
      ],
    },
    amenities: [
      { label: "High-Speed WiFi", icon: "wifi" },
      { label: "Chef's Kitchen", icon: "kitchen" },
      { label: "Valet Parking", icon: "parking" },
      { label: "AV Equipment", icon: "speaker" },
    ],
    reviews: [
      {
        author: "Sarah Jenkins",
        initials: "SJ",
        date: "October 2023",
        text: "Absolutely stunning. The natural light in this venue is incredible. Our guests couldn't stop talking about the views and the architecture. Worth every penny.",
      },
      {
        author: "Michael Rodriguez",
        initials: "MR",
        date: "August 2023",
        text: "The perfect backdrop for our corporate retreat. Clean lines, modern, and extremely accommodating staff. The AV setup was flawless.",
      },
    ],
  },
};

export function getVenue(id: string): Venue | undefined {
  return VENUES[id];
}

export function getAllVenueIds(): string[] {
  return Object.keys(VENUES);
}
