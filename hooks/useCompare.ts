import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GymCardData } from '@/components/gym/GymCard';
import { toast } from 'sonner';

interface CompareState {
  comparedGyms: GymCardData[];
  addGymToCompare: (gym: GymCardData) => void;
  removeGymFromCompare: (gymId: string) => void;
  clearCompare: () => void;
  isInCompare: (gymId: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      comparedGyms: [],

      addGymToCompare: (gym) => {
        const { comparedGyms } = get();
        if (comparedGyms.some((g) => g.id === gym.id)) {
          toast.info(`${gym.name} is already in comparison list`);
          return;
        }
        if (comparedGyms.length >= 3) {
          toast.error('You can compare a maximum of 3 gyms side-by-side');
          return;
        }
        set({ comparedGyms: [...comparedGyms, gym] });
        toast.success(`Added "${gym.name}" to comparison! (${comparedGyms.length + 1}/3)`);
      },

      removeGymFromCompare: (gymId) => {
        const { comparedGyms } = get();
        set({ comparedGyms: comparedGyms.filter((g) => g.id !== gymId) });
        toast('Removed gym from comparison');
      },

      clearCompare: () => set({ comparedGyms: [] }),

      isInCompare: (gymId) => {
        return get().comparedGyms.some((g) => g.id === gymId);
      },
    }),
    {
      name: 'gymspot_compare_store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
