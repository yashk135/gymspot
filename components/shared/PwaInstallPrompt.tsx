'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dumbbell, Download, X } from 'lucide-react';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('GymSpot ServiceWorker Registered'))
        .catch((err) => console.log('SW Registration failed: ', err));
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-[#161626]/95 border border-[#FF5722]/50 backdrop-blur-md p-4 rounded-2xl shadow-2xl shadow-[#FF5722]/20 flex items-center justify-between gap-3 text-white">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-[#FF5722] text-white rounded-xl shrink-0">
          <Dumbbell className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-sm font-syne">Install GymSpot App</h4>
          <p className="text-xs text-gray-400">Add to Home Screen for fast offline discovery</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          onClick={handleInstall}
          className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-xs h-9 px-3 flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" /> Install
        </Button>
        <button onClick={() => setShowPrompt(false)} className="text-gray-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
