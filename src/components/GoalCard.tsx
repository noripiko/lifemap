import React, { useState } from 'react';
import { GoalItem } from '../types/lifemap';
import { formatYen } from '../utils/lifemapUtils';
import { Check, MapPin, ExternalLink, Pencil, Trash2 } from 'lucide-react';

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
  const hasDetails = Boolean(goal.location || goal.budget || goal.notes);

  return (
    <div
      className={`group relative bg-white rounded-xl border p-3.5 transition-all ${
        isAchieved
          ? 'border-slate-200 bg-slate-50/50 opacity-80'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs'
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
          title={isAchieved ? '達成済み（未完了に戻す）' : '達成済みにする'}
        >
          {isAchieved ? (
            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
          ) : (
            <span className="sr-only">未完了</span>
          )}
        </button>

        {/* Card Body - Clicking toggles details expansion, never jumps to edit */}
        <div
          className="flex-1 min-w-0 cursor-pointer select-none"
          onClick={() => {
            if (hasDetails) setIsExpanded((prev) => !prev);
          }}
        >
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
                  : 'text-slate-900 group-hover:text-slate-800'
              }`}
            >
              {goal.title}
            </h4>
          </div>

          {/* Quick info preview when not expanded */}
          {!isExpanded && (
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              {goal.location && (
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate max-w-[180px]">{goal.location}</span>
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
              {goal.notes && (
                <span className="text-slate-400 truncate max-w-[220px] line-clamp-1">
                  {goal.notes}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Dedicated Edit Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(goal);
          }}
          className="shrink-0 p-1.5 text-slate-400 hover:text-slate-800 active:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          title="目標を編集"
          aria-label="編集"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expanded Details when tapped */}
      {isExpanded && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs space-y-2">
          {goal.location && (
            <div className="flex items-center gap-1.5 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="font-medium">{goal.location}</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  goal.location
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sky-600 hover:underline flex items-center gap-0.5 ml-1"
              >
                <span>マップで開く</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          )}

          {goal.budget && (
            <div className="text-slate-600 font-medium">
              概算予算: <span className="tabular-nums text-slate-900">{formatYen(goal.budget)}</span>
            </div>
          )}

          {goal.notes && (
            <div className="text-slate-600 bg-slate-50 p-2.5 rounded-lg whitespace-pre-wrap leading-relaxed">
              {goal.notes}
            </div>
          )}

          {/* Action buttons inside expanded card */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('この目標を削除しますか？')) {
                  onDelete(goal.id);
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
                onEdit(goal);
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
};
