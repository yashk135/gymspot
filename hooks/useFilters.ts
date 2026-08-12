import { create } from 'zustand';

export type SortOption = 'distance' | 'price_low' | 'rating' | 'newest';

interface FilterState {
  searchQuery: string;
  radiusKm: number;
  maxPrice: number;
  gymType: string;
  genderPolicy: string;
  amenities: string[];
  minRating: number;
  is24x7: boolean;
  sortBy: SortOption;

  setSearchQuery: (query: string) => void;
  setRadiusKm: (radius: number) => void;
  setMaxPrice: (price: number) => void;
  setGymType: (type: string) => void;
  setGenderPolicy: (policy: string) => void;
  toggleAmenity: (amenity: string) => void;
  setMinRating: (rating: number) => void;
  setIs24x7: (val: boolean) => void;
  setSortBy: (sort: SortOption) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  radiusKm: 10,
  maxPrice: 20000,
  gymType: 'All',
  genderPolicy: 'All',
  amenities: [],
  minRating: 0,
  is24x7: false,
  sortBy: 'distance',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setRadiusKm: (radiusKm) => set({ radiusKm }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setGymType: (gymType) => set({ gymType }),
  setGenderPolicy: (genderPolicy) => set({ genderPolicy }),
  toggleAmenity: (amenity) =>
    set((state) => ({
      amenities: state.amenities.includes(amenity)
        ? state.amenities.filter((a) => a !== amenity)
        : [...state.amenities, amenity],
    })),
  setMinRating: (minRating) => set({ minRating }),
  setIs24x7: (is24x7) => set({ is24x7 }),
  setSortBy: (sortBy) => set({ sortBy }),

  resetFilters: () =>
    set({
      searchQuery: '',
      radiusKm: 10,
      maxPrice: 20000,
      gymType: 'All',
      genderPolicy: 'All',
      amenities: [],
      minRating: 0,
      is24x7: false,
      sortBy: 'distance',
    }),
}));
