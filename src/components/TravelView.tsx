import React, { useState } from 'react';
import { GoalItem, UserProfile } from '../types/lifemap';
import { formatYen } from '../utils/lifemapUtils';
import {
  MapPin,
  ExternalLink,
  Plus,
  Check,
  Globe,
  Plane,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface TravelViewProps {
  goals: GoalItem[];
  profile: UserProfile;
  onEditGoal: (goal: GoalItem) => void;
  onDeleteGoal: (id: string) => void;
  onToggleStatus: (goal: GoalItem) => void;
  onAddTravelGoal: () => void;
}

export const TravelView: React.FC<TravelViewProps> = ({
  goals,
  onEditGoal,
  onDeleteGoal,
  onToggleStatus,
  onAddTravelGoal,
}) => {
  const [filterRegion, setFilterRegion] = useState<'all' | 'japan' | 'overseas'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const travelGoals = goals.filter((g) => g.category === 'travel' || g.isTravel || Boolean(g.location));

  const isDomestic = (location?: string) => {
    if (!location) return true;
    const domesticKeywords = ['県', '都', '府', '道', '日本', '富士', '屋久島', '知床', '小笠原', '沖縄', '京都', '奈良', '金沢', '箱根'];
    return domesticKeywords.some((k) => location.includes(k));
  };

  const filteredGoals = travelGoals.filter((g) => {
    if (filterRegion === 'japan') return isDomestic(g.location);
    if (filterRegion === 'overseas') return !isDomestic(g.location);
    return true;
  }).sort((a, b) => a.targetAge - b.targetAge);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Icon Filter and Add button */}
      <div className="flex items-center justify-between pb-1 text-xs sm:text-sm">
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
          <button
            onClick={() => setFilterRegion('all')}
            className={`p-1.5 px-3 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterRegion === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            title="すべて"
          >
            <Globe className="w-4 h-4" />
            <span className="tabular-nums text-xs font-semibold">{travelGoals.length}</span>
          </button>
          <button
            onClick={() => setFilterRegion('japan')}
            className={`p-1.5 px-3 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
              filterRegion === 'japan'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            title="国内"
          >
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-medium">国内</span>
          </button>
          <button
            onClick={() => setFilterRegion('overseas')}
            className={`p-1.5 px-3 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
              filterRegion === 'overseas'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            title="海外"
          >
            <Plane className="w-4 h-4" />
            <span className="text-xs font-medium">海外</span>
          </button>
        </div>

        <button
          onClick={onAddTravelGoal}
          className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-slate-100"
        >
          <Plus className="w-4 h-4" />
          <span>追加</span>
        </button>
      </div>

      {/* Destinations List */}
      {filteredGoals.length > 0 ? (
        <div className="space-y-2">
          {filteredGoals.map((goal) => {
            const isAchieved = goal.status === 'achieved';
            const isExpanded = expandedId === goal.id;

            return (
              <div
                key={goal.id}
                className={`bg-white rounded-xl border p-3.5 sm:p-4 transition-all ${
                  isAchieved
                    ? 'border-slate-200 bg-slate-50/60 opacity-80'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox - larger touch area */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(goal);
                    }}
                    className="mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
                    style={{
                      borderColor: isAchieved ? '#10b981' : '#cbd5e1',
                      backgroundColor: isAchieved ? '#10b981' : 'transparent',
                    }}
                    title={isAchieved ? '訪問済み' : 'クリックして訪問済みにする'}
                  >
                    {isAchieved && (
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    )}
                  </button>

                  {/* Content - Click expands details */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer select-none"
                    onClick={() => toggleExpand(goal.id)}
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-sm font-bold text-slate-800 tabular-nums shrink-0 bg-slate-100 px-2 py-0.5 rounded text-[13px]">
                        {goal.targetAge}歳
                      </span>
                      <h4
                        className={`text-[15px] sm:text-base font-semibold leading-snug break-words ${
                          isAchieved ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {goal.title}
                      </h4>
                    </div>

                    {/* Location & Google Map link preview */}
                    <div className="mt-1.5 flex items-center gap-2.5 text-[13px] sm:text-sm text-slate-600 flex-wrap">
                      {goal.location && (
                        <span className="flex items-center gap-1 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>{goal.location}</span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              goal.location
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-400 hover:text-sky-600 p-0.5"
                            title="Google Mapsで開く"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </span>
                      )}

                      {goal.budget && (
                        <>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="tabular-nums">
                            予算 {formatYen(goal.budget)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Subtle chevron indicator */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(goal.id)}
                    className="shrink-0 p-1 text-slate-300 hover:text-slate-600 cursor-pointer"
                    aria-label={isExpanded ? '詳細を閉じる' : '詳細を開く'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 text-sm space-y-2.5">
                    {goal.notes && (
                      <p className="text-slate-700 bg-slate-50 p-3 rounded-xl whitespace-pre-wrap leading-relaxed">
                        {goal.notes}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('この場所を削除しますか？')) {
                            onDeleteGoal(goal.id);
                          }
                        }}
                        className="text-xs text-rose-500 hover:text-rose-700 py-2 px-3 rounded-lg hover:bg-rose-50 active:bg-rose-100 flex items-center gap-1.5 cursor-pointer font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>削除</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditGoal(goal);
                        }}
                        className="text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>編集する</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-slate-400">
          <p className="mb-2">行きたい場所がありません</p>
          <button
            onClick={onAddTravelGoal}
            className="text-slate-700 font-medium hover:underline cursor-pointer"
          >
            ＋ 場所を追加する
          </button>
        </div>
      )}
    </div>
  );
};
