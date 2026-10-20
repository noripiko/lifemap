import React from 'react';
import { UserProfile } from '../types/lifemap';
import { Plus } from 'lucide-react';

export type ActiveTab = 'timeline' | 'travel';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  profile: UserProfile;
  onOpenSettings: () => void;
  onOpenNewGoal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  profile,
  onOpenSettings,
  onOpenNewGoal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-xl mx-auto px-4 h-12 flex items-center justify-between">
        {/* Brand & Age Button */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-slate-900 tracking-tight">
            LifeMap
          </span>
          <button
            onClick={onOpenSettings}
            className="text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-full font-medium tabular-nums cursor-pointer transition-colors"
            title="生年月日・年齢を変更"
          >
            {profile.currentAge}歳
          </button>
        </div>

        {/* View Switcher & Add Button */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => onTabChange('timeline')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              タイムライン
            </button>
            <button
              onClick={() => onTabChange('travel')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'travel'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              行きたい場所
            </button>
          </div>

          <button
            onClick={onOpenNewGoal}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="目標・予定を追加"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
