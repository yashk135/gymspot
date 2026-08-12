'use client';

import Link from 'next/link';
import { useCompareStore } from '@/hooks/useCompare';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scale, X, ArrowRight } from 'lucide-react';

export function CompareFloatingBar() {
  const { comparedGyms, removeGymFromCompare, clearCompare } = useCompareStore();

  if (comparedGyms.length < 2) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[92%] bg-[#161626]/95 border border-[#FF5722]/50 backdrop-blur-md rounded-2xl p-3 shadow-2xl shadow-[#FF5722]/20 flex items-center justify-between gap-3 text-white">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-2 bg-[#FF5722] text-white rounded-xl shrink-0">
          <Scale className="w-5 h-5" />
        </div>

        <div className="truncate space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-syne font-bold text-sm text-white">Compare Gyms</span>
            <Badge className="bg-[#FF5722]/20 text-[#FF5722] text-[10px] font-bold">
              {comparedGyms.length}/3 Selected
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 truncate text-xs text-gray-400">
            {comparedGyms.map((g, idx) => (
              <span key={g.id} className="inline-flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-[11px] text-gray-300">
                {g.name.split('—')[0]}
                <button onClick={() => removeGymFromCompare(g.id)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          onClick={clearCompare}
          variant="ghost"
          size="sm"
          className="text-xs text-gray-400 hover:text-white px-2 h-8"
        >
          Clear
        </Button>
        <Link href="/compare">
          <Button className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-xs h-9 px-4 flex items-center gap-1">
            Compare Side-by-Side <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
