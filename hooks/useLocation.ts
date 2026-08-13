import { create } from 'zustand';

interface LocationState {
  lat: number | null;
  lng: number | null;
  city: string;
  isGpsAllowed: boolean;
  loading: boolean;
  setLocation: (lat: number, lng: number, city?: string) => void;
  setCity: (city: string) => void;
  requestGpsLocation: () => Promise<void>;
}

// Default to Mumbai center if GPS not available
const MUMBAI_DEFAULT = { lat: 19.076, lng: 72.8777, city: 'Mumbai' };

export const useLocationStore = create<LocationState>((set) => ({
  lat: MUMBAI_DEFAULT.lat,
  lng: MUMBAI_DEFAULT.lng,
  city: MUMBAI_DEFAULT.city,
  isGpsAllowed: false,
  loading: false,

  setLocation: (lat, lng, city) =>
    set({
      lat,
      lng,
      city: city || 'Current Location',
      isGpsAllowed: true,
      loading: false,
    }),

  setCity: (city) => {
    // City coordinate mappings for fallback
    const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
      Mumbai: { lat: 19.076, lng: 72.8777 },
      Delhi: { lat: 28.6139, lng: 77.209 },
      Bangalore: { lat: 12.9716, lng: 77.5946 },
      Hyderabad: { lat: 17.385, lng: 78.4867 },
      Pune: { lat: 18.5204, lng: 73.8567 },
      London: { lat: 51.5074, lng: -0.1278 },
      'New York': { lat: 40.7128, lng: -74.006 },
      Dubai: { lat: 25.2048, lng: 55.2708 },
    };

    const coords = CITY_COORDS[city] || MUMBAI_DEFAULT;
    set({
      city,
      lat: coords.lat,
      lng: coords.lng,
      loading: false,
    });
  },

  requestGpsLocation: async () => {
    set({ loading: true });
    return new Promise<void>((resolve) => {
      try {
        if (typeof window !== 'undefined' && 'geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              set({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                city: 'Near You (GPS)',
                isGpsAllowed: true,
                loading: false,
              });
              resolve();
            },
            () => {
              // Geolocation denied or error — fallback to Mumbai
              set({
                lat: MUMBAI_DEFAULT.lat,
                lng: MUMBAI_DEFAULT.lng,
                city: 'Mumbai',
                isGpsAllowed: false,
                loading: false,
              });
              resolve();
            },
            { timeout: 8000 }
          );
        } else {
          set({ loading: false });
          resolve();
        }
      } catch {
        // Catch any unexpected errors from geolocation API
        set({
          lat: MUMBAI_DEFAULT.lat,
          lng: MUMBAI_DEFAULT.lng,
          city: 'Mumbai',
          isGpsAllowed: false,
          loading: false,
        });
        resolve();
      }
    });
  },
}));
