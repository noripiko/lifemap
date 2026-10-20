import React from 'react';
import { UserProfile } from '../types/lifemap';
import { Plus } from 'lucide-react';

interface NavbarProps {
  profile: UserProfile;
  onOpenSettings: () => void;
  onOpenNewGoal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenSettings,
  onOpenNewGoal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 safe-top">
      <div className="max-w-xl mx-auto px-4 h-13 flex items-center justify-between">
        {/* Brand & Age Setting Button */}
        <div className="flex items-center gap-2.5">
          <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            LifeMap
          </span>
          <button
            onClick={onOpenSettings}
            className="text-xs sm:text-[13px] text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full font-semibold tabular-nums cursor-pointer transition-colors"
            title="生年月日・年齢・寿命を変更"
          >
            {profile.currentAge}歳
          </button>
        </div>

        {/* Primary Add Goal Button */}
        <button
          onClick={onOpenNewGoal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 transition-colors cursor-pointer text-xs sm:text-sm font-semibold shadow-xs"
          title="新しい目標・予定を追加"
        >
          <Plus className="w-4 h-4" />
          <span>目標を追加</span>
        </button>
      </div>
    </header>
  );
};
