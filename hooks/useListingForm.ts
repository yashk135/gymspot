import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Step1BasicInfo,
  Step2Location,
  Step3Photos,
  Step4Details,
  Step5Trainers,
} from '@/lib/validators';

interface ListingFormState {
  currentStep: number;
  basicInfo: Partial<Step1BasicInfo>;
  location: Partial<Step2Location>;
  photos: Partial<Step3Photos>;
  details: Partial<Step4Details>;
  trainers: Partial<Step5Trainers>;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateBasicInfo: (data: Partial<Step1BasicInfo>) => void;
  updateLocation: (data: Partial<Step2Location>) => void;
  updatePhotos: (data: Partial<Step3Photos>) => void;
  updateDetails: (data: Partial<Step4Details>) => void;
  updateTrainers: (data: Partial<Step5Trainers>) => void;
  resetForm: () => void;
}

const initialTimings = [
  { dayOfWeek: 1, dayName: 'Monday', openTime: '06:00', closeTime: '22:00', isClosed: false },
  { dayOfWeek: 2, dayName: 'Tuesday', openTime: '06:00', closeTime: '22:00', isClosed: false },
  { dayOfWeek: 3, dayName: 'Wednesday', openTime: '06:00', closeTime: '22:00', isClosed: false },
  { dayOfWeek: 4, dayName: 'Thursday', openTime: '06:00', closeTime: '22:00', isClosed: false },
  { dayOfWeek: 5, dayName: 'Friday', openTime: '06:00', closeTime: '22:00', isClosed: false },
  { dayOfWeek: 6, dayName: 'Saturday', openTime: '07:00', closeTime: '21:00', isClosed: false },
  { dayOfWeek: 0, dayName: 'Sunday', openTime: '08:00', closeTime: '18:00', isClosed: false },
];

export const useListingForm = create<ListingFormState>()(
  persist(
    (set) => ({
      currentStep: 1,
      basicInfo: {
        country: 'India',
        gymType: 'General',
        genderType: 'Co-ed',
      },
      location: {
        lat: 19.076,
        lng: 72.8777,
      },
      photos: {
        photos: [],
        coverPhotoIndex: 0,
      },
      details: {
        plans: [],
        is24x7: false,
        timings: initialTimings,
        amenities: [],
        equipment: [],
      },
      trainers: {
        trainers: [],
      },
      setStep: (step) => set({ currentStep: Math.min(Math.max(step, 1), 5) }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
      updateBasicInfo: (data) => set((state) => ({ basicInfo: { ...state.basicInfo, ...data } })),
      updateLocation: (data) => set((state) => ({ location: { ...state.location, ...data } })),
      updatePhotos: (data) => set((state) => ({ photos: { ...state.photos, ...data } })),
      updateDetails: (data) => set((state) => ({ details: { ...state.details, ...data } })),
      updateTrainers: (data) => set((state) => ({ trainers: { ...state.trainers, ...data } })),
      resetForm: () =>
        set({
          currentStep: 1,
          basicInfo: { country: 'India', gymType: 'General', genderType: 'Co-ed' },
          location: { lat: 19.076, lng: 72.8777 },
          photos: { photos: [], coverPhotoIndex: 0 },
          details: { plans: [], is24x7: false, timings: initialTimings, amenities: [], equipment: [] },
          trainers: { trainers: [] },
        }),
    }),
    {
      name: 'gymspot_listing_draft',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
