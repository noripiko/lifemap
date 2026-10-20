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
      <div className="flex items-center justify-between pb-1 text-xs">
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
          <button
            onClick={() => setFilterRegion('all')}
            className={`p-1.5 px-2.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterRegion === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="すべて"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="tabular-nums text-[11px]">{travelGoals.length}</span>
          </button>
          <button
            onClick={() => setFilterRegion('japan')}
            className={`p-1.5 px-2.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
              filterRegion === 'japan'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="国内"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[11px]">国内</span>
          </button>
          <button
            onClick={() => setFilterRegion('overseas')}
            className={`p-1.5 px-2.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
              filterRegion === 'overseas'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="海外"
          >
            <Plane className="w-3.5 h-3.5" />
            <span className="text-[11px]">海外</span>
          </button>
        </div>

        <button
          onClick={onAddTravelGoal}
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer py-1 px-2 rounded-md hover:bg-slate-100"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>追加</span>
        </button>
      </div>

      {/* Destinations List */}
      {filteredGoals.length > 0 ? (
        <div className="space-y-1.5">
          {filteredGoals.map((goal) => {
            const isAchieved = goal.status === 'achieved';
            const isExpanded = expandedId === goal.id;

            return (
              <div
                key={goal.id}
                className={`bg-white rounded-xl border p-3 transition-all ${
                  isAchieved
                    ? 'border-slate-200 bg-slate-50/50 opacity-75'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(goal);
                    }}
                    className="mt-0.5 shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
                    style={{
                      borderColor: isAchieved ? '#10b981' : '#cbd5e1',
                      backgroundColor: isAchieved ? '#10b981' : 'transparent',
                    }}
                    title={isAchieved ? '訪問済み' : 'クリックして訪問済みにする'}
                  >
                    {isAchieved && (
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    )}
                  </button>

                  {/* Content - Click expands details, does not jump to edit screen */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer select-none"
                    onClick={() => toggleExpand(goal.id)}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-slate-800 tabular-nums shrink-0">
                        {goal.targetAge}歳
                      </span>
                      <h4
                        className={`text-sm font-medium leading-snug break-words ${
                          isAchieved ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {goal.title}
                      </h4>
                    </div>

                    {/* Location & Google Map link preview */}
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                      {goal.location && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3 h-3 text-sky-600 shrink-0" />
                          <span>{goal.location}</span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              goal.location
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-400 hover:text-sky-600 p-0.5"
                            title="Google Maps"
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

                  {/* Dedicated Edit Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditGoal(goal);
                    }}
                    className="shrink-0 p-1.5 text-slate-400 hover:text-slate-800 active:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    title="旅行目標を編集"
                    aria-label="編集"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs space-y-2">
                    {goal.notes && (
                      <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg whitespace-pre-wrap leading-relaxed">
                        {goal.notes}
                      </p>
                    )}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('この場所を削除しますか？')) {
                            onDeleteGoal(goal.id);
                          }
                        }}
                        className="text-[11px] text-rose-500 hover:text-rose-700 py-1 px-2 rounded hover:bg-rose-50 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>削除</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditGoal(goal);
                        }}
                        className="text-[11px] font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 py-1 px-2.5 rounded-md flex items-center gap-1 cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" />
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
        <div className="py-8 text-center text-xs text-slate-400">
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
