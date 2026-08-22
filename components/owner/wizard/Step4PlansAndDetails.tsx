'use client';

import { useState } from 'react';
import { useListingForm } from '@/hooks/useListingForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MembershipPlan, TimingItem } from '@/lib/validators';
import {
  CreditCard,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckSquare,
  Pencil,
  X,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

const PRESET_AMENITIES = [
  'AC', 'Parking', 'Locker Room', 'Sauna', 'Steam Room',
  'Swimming Pool', 'Cafeteria', 'WiFi', 'Shower',
  'Wheelchair Accessible', 'Cardio Zone', 'Free Weights',
  'Personal Training', 'Group Classes',
];

export function Step4PlansAndDetailsComponent() {
  const { details, basicInfo, updateDetails, nextStep, prevStep } = useListingForm();

  /* ─── Plans State ─────────────────────────────────────── */
  const [plans, setPlans] = useState<MembershipPlan[]>(
    details.plans && details.plans.length > 0 ? (details.plans as MembershipPlan[]) : []
  );

  /* New plan form */
  const [newPlanName, setNewPlanName] = useState('');
  const [newDuration, setNewDuration] = useState(30);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newFeatures, setNewFeatures] = useState<string[]>([]);

  /* Edit plan state — which plan index is being edited */
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDuration, setEditDuration] = useState(30);
  const [editPrice, setEditPrice] = useState(0);
  const [editFeatureText, setEditFeatureText] = useState('');
  const [editFeatures, setEditFeatures] = useState<string[]>([]);

  /* ─── Timings State ───────────────────────────────────── */
  const [is24x7, setIs24x7] = useState<boolean>(details.is24x7 || false);
  const [timings, setTimings] = useState<TimingItem[]>(
    details.timings && details.timings.length > 0
      ? (details.timings as TimingItem[])
      : [
          { dayOfWeek: 1, dayName: 'Monday',    openTime: '', closeTime: '', isClosed: false },
          { dayOfWeek: 2, dayName: 'Tuesday',   openTime: '', closeTime: '', isClosed: false },
          { dayOfWeek: 3, dayName: 'Wednesday', openTime: '', closeTime: '', isClosed: false },
          { dayOfWeek: 4, dayName: 'Thursday',  openTime: '', closeTime: '', isClosed: false },
          { dayOfWeek: 5, dayName: 'Friday',    openTime: '', closeTime: '', isClosed: false },
          { dayOfWeek: 6, dayName: 'Saturday',  openTime: '', closeTime: '', isClosed: false },
          { dayOfWeek: 0, dayName: 'Sunday',    openTime: '', closeTime: '', isClosed: false },
        ]
  );

  /* ─── Amenities State ─────────────────────────────────── */
  const [amenities, setAmenities] = useState<string[]>(
    details.amenities && details.amenities.length > 0 ? details.amenities : []
  );
  const [customAmenityText, setCustomAmenityText] = useState('');

  /* ═══════════════ PLAN HANDLERS ═════════════════════════ */

  const handleAddPlan = () => {
    if (!newPlanName.trim()) { toast.error('Plan name is required'); return; }
    if (newPrice <= 0)       { toast.error('Price must be greater than 0'); return; }
    if (newFeatures.length === 0) { toast.error('Add at least one feature to the plan'); return; }

    const plan: MembershipPlan = {
      planName: newPlanName.trim(),
      durationDays: newDuration,
      price: newPrice,
      currency: basicInfo.country === 'India' ? 'INR' : 'USD',
      features: newFeatures,
      studentDiscount: false,
      couplesPlan: false,
      personalTrainingAvailable: true,
    };
    setPlans([...plans, plan]);
    setNewPlanName(''); setNewPrice(0); setNewFeatures([]);
    toast.success('Membership plan added!');
  };

  const handleDeletePlan = (index: number) => {
    if (plans.length === 1) { toast.error('At least 1 membership plan is required'); return; }
    setPlans(plans.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleAddNewFeature = () => {
    if (!newFeatureText.trim()) return;
    setNewFeatures([...newFeatures, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveNewFeature = (i: number) => setNewFeatures(newFeatures.filter((_, idx) => idx !== i));

  /* Edit plan */
  const startEdit = (index: number) => {
    const p = plans[index];
    setEditingIndex(index);
    setEditName(p.planName);
    setEditDuration(p.durationDays);
    setEditPrice(p.price);
    setEditFeatures([...(p.features || [])]);
    setEditFeatureText('');
  };

  const cancelEdit = () => setEditingIndex(null);

  const handleAddEditFeature = () => {
    if (!editFeatureText.trim()) return;
    setEditFeatures([...editFeatures, editFeatureText.trim()]);
    setEditFeatureText('');
  };

  const handleRemoveEditFeature = (i: number) => setEditFeatures(editFeatures.filter((_, idx) => idx !== i));

  const handleSaveEdit = () => {
    if (!editName.trim())    { toast.error('Plan name is required'); return; }
    if (editPrice <= 0)      { toast.error('Price must be greater than 0'); return; }
    if (editFeatures.length === 0) { toast.error('Add at least one feature'); return; }

    const updated = [...plans];
    updated[editingIndex!] = {
      ...updated[editingIndex!],
      planName: editName.trim(),
      durationDays: editDuration,
      price: editPrice,
      features: editFeatures,
    };
    setPlans(updated);
    setEditingIndex(null);
    toast.success('Plan updated!');
  };

  /* ═══════════════ AMENITY HANDLERS ══════════════════════ */

  const toggleAmenity = (name: string) => {
    setAmenities(amenities.includes(name)
      ? amenities.filter((a) => a !== name)
      : [...amenities, name]);
  };

  const handleAddCustomAmenity = () => {
    const val = customAmenityText.trim();
    if (!val) return;
    if (amenities.includes(val)) { toast.error('Amenity already added'); return; }
    setAmenities([...amenities, val]);
    setCustomAmenityText('');
    toast.success(`"${val}" added to amenities!`);
  };

  /* ═══════════════ TIMING HANDLERS ═══════════════════════ */

  const updateTiming = (index: number, key: keyof TimingItem, val: any) => {
    const updated = [...timings];
    updated[index] = { ...updated[index], [key]: val };
    setTimings(updated);
  };

  /* ═══════════════ NEXT ═══════════════════════════════════ */

  const handleNext = () => {
    if (plans.length === 0) { toast.error('Please add at least one membership plan'); return; }
    if (amenities.length === 0) { toast.error('Please select at least one amenity'); return; }
    updateDetails({ plans, is24x7, timings, amenities });
    nextStep();
  };

  /* ═══════════════ ALL AMENITIES (preset + custom) ═══════ */
  const allAmenityOptions = [
    ...PRESET_AMENITIES,
    ...amenities.filter((a) => !PRESET_AMENITIES.includes(a)),
  ];

  const currency = basicInfo.country === 'India' ? 'INR' : 'USD';
  const currSymbol = currency === 'INR' ? '₹' : '$';

  /* ═══════════════ RENDER ═════════════════════════════════ */
  return (
    <Card className="bg-[#161626] border-white/10 text-white">
      <CardContent className="p-6 md:p-8 space-y-8">

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2.5 bg-[#FF5722]/10 text-[#FF5722] rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-syne font-bold">Step 4 — Plans, Timings &amp; Amenities</h2>
            <p className="text-xs text-gray-400">List membership pricing, operating hours, and gym facilities</p>
          </div>
        </div>

        {/* ── SECTION 1: Membership Plans ─────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF5722]" /> Membership Plans (Verified Pricing)
            </h3>
            <Badge className="bg-white/10 text-gray-300 font-normal">{plans.length} Plans Created</Badge>
          </div>

          {/* Empty state */}
          {plans.length === 0 && (
            <div className="p-6 rounded-xl border border-dashed border-white/15 text-center text-sm text-gray-500">
              No membership plans added yet. Fill in the form below and click &ldquo;Save Plan&rdquo;.
            </div>
          )}

          {/* Plans grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan, i) =>
              editingIndex === i ? (
                /* ── INLINE EDIT CARD ── */
                <div key={i} className="p-4 rounded-xl bg-[#FF5722]/5 border border-[#FF5722]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FF5722] uppercase tracking-wider">Editing Plan</span>
                    <button type="button" onClick={cancelEdit} className="text-gray-400 hover:text-white p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-gray-400">Plan Name</Label>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)}
                      className="h-9 bg-white/5 border-white/10 text-white text-xs" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-400">Duration</Label>
                      <select value={editDuration} onChange={(e) => setEditDuration(Number(e.target.value))}
                        className="w-full h-9 rounded-md bg-white/5 border border-white/10 text-white text-xs px-2"
                        style={{ colorScheme: 'dark' }}>
                        <option value={30}>1 Month</option>
                        <option value={90}>3 Months</option>
                        <option value={180}>6 Months</option>
                        <option value={365}>1 Year</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-400">Price ({currSymbol})</Label>
                      <Input type="number" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="h-9 bg-white/5 border-white/10 text-white text-xs" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-gray-400">Features</Label>
                    <div className="flex gap-2">
                      <Input value={editFeatureText} onChange={(e) => setEditFeatureText(e.target.value)}
                        placeholder="e.g. Sauna Access"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddEditFeature()}
                        className="h-9 bg-white/5 border-white/10 text-white text-xs" />
                      <Button type="button" onClick={handleAddEditFeature} size="sm"
                        className="bg-white/10 hover:bg-white/20 text-white text-xs shrink-0">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {editFeatures.map((f, idx) => (
                        <Badge key={idx} className="bg-[#FF5722]/20 text-[#FF5722] text-xs font-normal flex items-center gap-1">
                          {f}
                          <button type="button" onClick={() => handleRemoveEditFeature(idx)}
                            className="hover:text-white ml-0.5"><X className="w-3 h-3" /></button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button type="button" onClick={handleSaveEdit}
                    className="w-full bg-[#FF5722] hover:bg-[#FF5722]/90 text-white text-xs font-bold h-9 flex items-center gap-1.5">
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </Button>
                </div>
              ) : (
                /* ── PLAN VIEW CARD ── */
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 relative group">
                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => startEdit(i)}
                      className="text-gray-400 hover:text-[#FF5722] p-1 rounded-lg hover:bg-white/5 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => handleDeletePlan(i)}
                      className="text-gray-400 hover:text-red-400 p-1 rounded-lg hover:bg-white/5 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1 pr-14">
                    <h4 className="font-bold text-white text-base">{plan.planName}</h4>
                    <p className="text-2xl font-extrabold text-[#FF5722]">
                      {currSymbol}{plan.price.toLocaleString()}
                      <span className="text-xs text-gray-400 font-normal"> / {plan.durationDays} days</span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-medium">Included Features:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {plan.features?.map((f, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-gray-300">✓ {f}</span>
                      ))}
                    </div>
                  </div>

                  {/* Hover hint */}
                  <p className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors">
                    Hover to edit or delete this plan
                  </p>
                </div>
              )
            )}
          </div>

          {/* ── Add New Plan Form ── */}
          <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/20 space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#FF5722]" />
              {plans.length === 0 ? 'Add Your First Membership Plan' : 'Add Another Membership Plan'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Plan Name</Label>
                <Input value={newPlanName} onChange={(e) => setNewPlanName(e.target.value)}
                  placeholder="e.g. 3 Months Quarterly Pass"
                  className="h-10 bg-white/5 border-white/10 text-white text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Duration</Label>
                <select value={newDuration} onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full h-10 rounded-md bg-[#161626] border border-white/10 text-white text-xs px-2"
                  style={{ colorScheme: 'dark' }}>
                  <option value={30}>1 Month (30 Days)</option>
                  <option value={90}>3 Months (90 Days)</option>
                  <option value={180}>6 Months (180 Days)</option>
                  <option value={365}>1 Year (365 Days)</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Price ({currency === 'INR' ? '₹ INR' : '$ USD'})</Label>
                <Input type="number" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))}
                  placeholder="e.g. 2500"
                  className="h-10 bg-white/5 border-white/10 text-white text-xs" />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-400">What&apos;s Included (Add Features)</Label>
              <div className="flex gap-2">
                <Input value={newFeatureText} onChange={(e) => setNewFeatureText(e.target.value)}
                  placeholder="e.g. Free Trainer Session, Steam Room"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNewFeature()}
                  className="h-10 bg-white/5 border-white/10 text-white text-xs" />
                <Button type="button" onClick={handleAddNewFeature} size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white text-xs">Add</Button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {newFeatures.map((f, i) => (
                  <Badge key={i} className="bg-[#FF5722]/20 text-[#FF5722] text-xs font-normal flex items-center gap-1">
                    {f}
                    <button type="button" onClick={() => handleRemoveNewFeature(i)}
                      className="hover:text-white ml-0.5"><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="button" onClick={handleAddPlan}
              className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white text-xs font-semibold flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Save Plan
            </Button>
          </div>
        </div>

        {/* ── SECTION 2: Timings ──────────────────────────── */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF5722]" /> Operating Hours &amp; Timings
            </h3>
            <button type="button" onClick={() => setIs24x7(!is24x7)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                is24x7 ? 'bg-[#FF5722] text-white border-[#FF5722]' : 'bg-white/5 text-gray-400 border-white/10'
              }`}>
              <CheckSquare className="w-3.5 h-3.5" /> 24x7 Open
            </button>
          </div>

          {!is24x7 && (
            <div className="space-y-2">
              {timings.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs">
                  <span className="font-medium text-white w-24">{t.dayName}</span>
                  <div className="flex items-center gap-2">
                    <input type="time" value={t.openTime} disabled={t.isClosed}
                      onChange={(e) => updateTiming(idx, 'openTime', e.target.value)}
                      className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white disabled:opacity-30" />
                    <span className="text-gray-500">to</span>
                    <input type="time" value={t.closeTime} disabled={t.isClosed}
                      onChange={(e) => updateTiming(idx, 'closeTime', e.target.value)}
                      className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white disabled:opacity-30" />
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer text-gray-400 hover:text-white">
                    <input type="checkbox" checked={t.isClosed}
                      onChange={(e) => updateTiming(idx, 'isClosed', e.target.checked)}
                      className="accent-[#FF5722]" /> Closed
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── SECTION 3: Amenities ────────────────────────── */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Check className="w-4 h-4 text-[#FF5722]" /> Gym Amenities Checklist
          </h3>

          {/* Checklist grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {allAmenityOptions.map((name) => {
              const selected = amenities.includes(name);
              const isCustom = !PRESET_AMENITIES.includes(name);
              return (
                <button type="button" key={name} onClick={() => toggleAmenity(name)}
                  className={`p-3 rounded-xl text-xs font-medium text-left border transition-all flex items-center gap-2 ${
                    selected
                      ? 'bg-[#FF5722]/20 border-[#FF5722] text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    selected ? 'bg-[#FF5722] border-[#FF5722] text-white' : 'border-gray-500'
                  }`}>
                    {selected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="flex-1">{name}</span>
                  {isCustom && (
                    <span className="text-[9px] px-1 py-0.5 rounded bg-purple-500/30 text-purple-300 font-bold uppercase">Custom</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Add Custom Amenity ── */}
          <div className="pt-2">
            <Label className="text-xs text-gray-400 mb-2 block">
              Can&apos;t find your amenity? Add a custom one:
            </Label>
            <div className="flex gap-2 max-w-sm">
              <Input
                value={customAmenityText}
                onChange={(e) => setCustomAmenityText(e.target.value)}
                placeholder="e.g. Rooftop Yoga Deck, Kids Zone..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomAmenity()}
                className="h-10 bg-white/5 border-white/10 text-white text-xs placeholder:text-gray-600"
              />
              <Button type="button" onClick={handleAddCustomAmenity}
                className="h-10 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white text-xs font-bold px-4 shrink-0 flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Add
              </Button>
            </div>
          </div>
        </div>

        {/* ── Navigation ──────────────────────────────────── */}
        <div className="flex justify-between pt-4 border-t border-white/10">
          <Button type="button" variant="outline" onClick={prevStep}
            className="h-11 px-6 border-white/10 text-white hover:bg-white/5 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button type="button" onClick={handleNext}
            className="h-11 px-8 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-semibold flex items-center gap-2">
            Next: Trainers &amp; Submit <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
