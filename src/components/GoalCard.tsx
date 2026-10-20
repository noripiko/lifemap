import React from 'react';
import { GoalItem } from '../types/lifemap';
import { formatYen } from '../utils/lifemapUtils';
import { Check, Circle, MapPin, ExternalLink, MoreHorizontal } from 'lucide-react';

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
  const isAchieved = goal.status === 'achieved';

  return (
    <div
      className={`group relative bg-white rounded-xl border p-3.5 transition-all flex items-start gap-3 ${
        isAchieved
          ? 'border-slate-200 bg-slate-50/50 opacity-75'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggleStatus(goal)}
        className="mt-0.5 shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
        style={{
          borderColor: isAchieved ? '#10b981' : '#cbd5e1',
          backgroundColor: isAchieved ? '#10b981' : 'transparent',
        }}
        title={isAchieved ? '達成済み（クリックで未完了に戻す）' : 'クリックして完了にする'}
      >
        {isAchieved ? (
          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
        ) : (
          <span className="sr-only">未完了</span>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0" onClick={() => onEdit(goal)}>
        <div className="flex items-baseline gap-2">
          {/* Target Age */}
          <span className="text-xs font-bold text-slate-800 tabular-nums shrink-0">
            {goal.targetAge}歳
          </span>

          {/* Goal Title */}
          <h4
            className={`text-sm font-medium leading-snug break-words ${
              isAchieved
                ? 'line-through text-slate-400'
                : 'text-slate-900 group-hover:text-slate-700'
            }`}
          >
            {goal.title}
          </h4>
        </div>

        {/* Quiet subtext: only if location, budget, or short note exists */}
        {(goal.location || goal.budget) && (
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            {goal.location && (
              <span className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate max-w-[200px]">{goal.location}</span>
              </span>
            )}
            {goal.location && goal.budget && (
              <span aria-hidden="true" className="text-slate-300">·</span>
            )}
            {goal.budget && (
              <span className="tabular-nums text-slate-500">
                予算 {formatYen(goal.budget)}
              </span>
            )}
          </div>
        )}

        {goal.notes && (
          <p className="mt-1 text-xs text-slate-500 line-clamp-1">
            {goal.notes}
          </p>
        )}
      </div>

      {/* Quick Edit */}
      <button
        onClick={() => onEdit(goal)}
        className="shrink-0 p-1 text-slate-300 hover:text-slate-600 rounded transition-colors"
        title="編集"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
};
