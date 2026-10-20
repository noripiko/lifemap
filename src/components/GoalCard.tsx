import React, { useState } from 'react';
import { GoalItem } from '../types/lifemap';
import { formatYen } from '../utils/lifemapUtils';
import { Check, MapPin, ExternalLink, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface GoalCardProps {
  goal: GoalItem;
  currentAge: number;
  onEdit: (goal: GoalItem) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (goal: GoalItem) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isAchieved = goal.status === 'achieved';

  return (
    <div
      className={`group relative bg-white rounded-xl border p-3.5 sm:p-4 transition-all ${
        isAchieved
          ? 'border-slate-200 bg-slate-50/60 opacity-80'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox - larger and thumb-friendly */}
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
          title={isAchieved ? '達成済み（未完了に戻す）' : '達成済みにする'}
        >
          {isAchieved ? (
            <Check className="w-4 h-4 text-white stroke-[3]" />
          ) : (
            <span className="sr-only">未完了</span>
          )}
        </button>

        {/* Card Body - tap anywhere to open/close details */}
        <div
          className="flex-1 min-w-0 cursor-pointer select-none"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <div className="flex items-baseline gap-2.5">
            {/* Target Age */}
            <span className="text-sm font-bold text-slate-800 tabular-nums shrink-0 bg-slate-100 px-2 py-0.5 rounded text-[13px]">
              {goal.targetAge}歳
            </span>

            {/* Goal Title */}
            <h4
              className={`text-[15px] sm:text-base font-semibold leading-snug break-words ${
                isAchieved
                  ? 'line-through text-slate-400'
                  : 'text-slate-900 group-hover:text-slate-800'
              }`}
            >
              {goal.title}
            </h4>
          </div>

          {/* Quick info preview when not expanded */}
          {!isExpanded && (
            <div className="mt-1.5 flex items-center gap-2.5 text-[13px] sm:text-sm text-slate-600 flex-wrap">
              {goal.location && (
                <span className="flex items-center gap-1 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate max-w-[190px]">{goal.location}</span>
                </span>
              )}
              {goal.location && goal.budget && (
                <span aria-hidden="true" className="text-slate-300">·</span>
              )}
              {goal.budget && (
                <span className="tabular-nums text-slate-600">
                  予算 {formatYen(goal.budget)}
                </span>
              )}
              {goal.notes && (
                <span className="text-slate-400 truncate max-w-[220px] line-clamp-1">
                  {goal.notes}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Subtle expand chevron indicator so user knows it can be tapped */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
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

      {/* Expanded Details when tapped */}
      {isExpanded && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 text-sm space-y-2.5">
          {goal.location && (
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="font-medium text-sm">{goal.location}</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  goal.location
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sky-600 hover:underline flex items-center gap-0.5 ml-1 text-xs"
              >
                <span>マップで開く</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {goal.budget && (
            <div className="text-slate-700 text-sm">
              <span className="text-slate-500">概算予算:</span>{' '}
              <span className="tabular-nums font-semibold text-slate-900">
                {formatYen(goal.budget)}
              </span>
            </div>
          )}

          {goal.notes && (
            <div className="text-slate-700 text-sm bg-slate-50 p-3 rounded-xl whitespace-pre-wrap leading-relaxed">
              {goal.notes}
            </div>
          )}

          {/* Action buttons inside expanded card - big comfortable touch targets */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('この目標を削除しますか？')) {
                  onDelete(goal.id);
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
                onEdit(goal);
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
};
