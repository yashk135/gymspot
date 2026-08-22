'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useListingForm } from '@/hooks/useListingForm';
import { Step1BasicInfoComponent } from '@/components/owner/wizard/Step1BasicInfo';
import { Step2LocationPickerComponent } from '@/components/owner/wizard/Step2LocationPicker';
import { Step3PhotoUploadComponent } from '@/components/owner/wizard/Step3PhotoUpload';
import { Step4PlansAndDetailsComponent } from '@/components/owner/wizard/Step4PlansAndDetails';
import { Step5TrainersAndReviewComponent } from '@/components/owner/wizard/Step5TrainersAndReview';
import { Building2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STEPS = [
  { id: 1, name: 'Basic Info' },
  { id: 2, name: 'Location Pin' },
  { id: 3, name: 'Photos' },
  { id: 4, name: 'Plans & Details' },
  { id: 5, name: 'Review & Submit' },
];

export default function ListingCreatePage() {
  const { currentStep, setStep } = useListingForm();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center text-white">
        <div className="animate-pulse">Loading Listing Wizard...</div>
      </div>
    );
  }

  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col">
      {/* Top Wizard Navigation Bar */}
      <header className="w-full h-16 border-b border-white/10 bg-[#161626]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/owner/dashboard">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 font-syne font-bold text-lg">
            <Building2 className="w-5 h-5 text-[#FF5722]" />
            List Your Gym
          </div>
        </div>

        <div className="text-xs text-gray-400 font-medium">
          Step <span className="text-[#FF5722] font-bold">{currentStep}</span> of 5
        </div>
      </header>

      {/* Main Wizard Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Stepper Progress Bar Header */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => currentStep > s.id && setStep(s.id)}
                disabled={currentStep < s.id}
                className={`flex items-center gap-1.5 transition-colors ${
                  currentStep === s.id
                    ? 'text-[#FF5722] font-bold'
                    : currentStep > s.id
                    ? 'text-white hover:text-[#FF5722] cursor-pointer'
                    : 'text-gray-600 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    currentStep === s.id
                      ? 'bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30'
                      : currentStep > s.id
                      ? 'bg-[#4CAF50] text-white'
                      : 'bg-white/5 border border-white/10 text-gray-500'
                  }`}
                >
                  {currentStep > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                </div>
                <span className="hidden sm:inline">{s.name}</span>
              </button>
            ))}
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF5722] to-[#FF7043] transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step Component View */}
        {currentStep === 1 && <Step1BasicInfoComponent />}
        {currentStep === 2 && <Step2LocationPickerComponent />}
        {currentStep === 3 && <Step3PhotoUploadComponent />}
        {currentStep === 4 && <Step4PlansAndDetailsComponent />}
        {currentStep === 5 && <Step5TrainersAndReviewComponent />}
      </main>
    </div>
  );
}
