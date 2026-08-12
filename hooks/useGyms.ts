import { useQuery } from '@tanstack/react-query';
import { useLocationStore } from './useLocation';
import { useFilterStore } from './useFilters';

export function useNearbyGyms() {
  const { lat, lng } = useLocationStore();
  const { searchQuery, radiusKm, maxPrice, gymType, genderPolicy, minRating, sortBy } = useFilterStore();

  return useQuery({
    queryKey: ['nearby_gyms', lat, lng, searchQuery, radiusKm, maxPrice, gymType, genderPolicy, minRating, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (lat) params.set('lat', lat.toString());
      if (lng) params.set('lng', lng.toString());
      if (searchQuery) params.set('query', searchQuery);
      params.set('radiusKm', radiusKm.toString());
      params.set('maxPrice', maxPrice.toString());
      if (gymType !== 'All') params.set('gymType', gymType);
      if (genderPolicy !== 'All') params.set('genderPolicy', genderPolicy);
      if (minRating > 0) params.set('minRating', minRating.toString());
      params.set('sortBy', sortBy);

      const res = await fetch(`/api/gyms/nearby?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch nearby gyms');
      return res.json();
    },
    enabled: !!lat && !!lng,
  });
}
