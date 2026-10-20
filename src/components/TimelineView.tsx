import React, { useState } from 'react';
import { GoalItem, UserProfile } from '../types/lifemap';
import { GoalCard } from './GoalCard';
import { groupGoalsByDecade } from '../utils/lifemapUtils';
import { Plus, List, Circle, CheckCircle2 } from 'lucide-react';

interface TimelineViewProps {
  goals: GoalItem[];
  profile: UserProfile;
  onEditGoal: (goal: GoalItem) => void;
  onDeleteGoal: (id: string) => void;
  onToggleStatus: (goal: GoalItem) => void;
  onAddGoalForAge: (targetAge: number) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  goals,
  profile,
  onEditGoal,
  onDeleteGoal,
  onToggleStatus,
  onAddGoalForAge,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'achieved'>('all');

  const pendingCount = goals.filter((g) => g.status !== 'achieved').length;
  const achievedCount = goals.filter((g) => g.status === 'achieved').length;

  const filteredGoals = goals.filter((g) => {
    if (filter === 'pending') return g.status !== 'achieved';
    if (filter === 'achieved') return g.status === 'achieved';
    return true;
  });

  const decadeGroups = groupGoalsByDecade(filteredGoals, profile.currentAge, profile.targetLifespan);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Icon-Only Status Filter Bar */}
      <div className="flex items-center justify-between pb-1 text-xs">
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
          {/* All */}
          <button
            onClick={() => setFilter('all')}
            className={`p-1.5 px-2.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="すべて表示"
          >
            <List className="w-3.5 h-3.5" />
            <span className="tabular-nums text-[11px]">{goals.length}</span>
          </button>

          {/* Pending */}
          <button
            onClick={() => setFilter('pending')}
            className={`p-1.5 px-2.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              filter === 'pending'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="未完了のみ表示"
          >
            <Circle className="w-3.5 h-3.5 text-slate-400" />
            <span className="tabular-nums text-[11px]">{pendingCount}</span>
          </button>

          {/* Achieved */}
          <button
            onClick={() => setFilter('achieved')}
            className={`p-1.5 px-2.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              filter === 'achieved'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="達成済みのみ表示"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="tabular-nums text-[11px]">{achievedCount}</span>
          </button>
        </div>

        {/* Quick add goal for current age */}
        <button
          onClick={() => onAddGoalForAge(profile.currentAge)}
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer py-1 px-2 rounded-md hover:bg-slate-100"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>追加</span>
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-7">
        {decadeGroups.map((group) => {
          const isCurrentDecade = group.isCurrentDecade;

          return (
            <section key={group.decade}>
              {/* Clean Decade Divider */}
              <div className="flex items-center justify-between pb-1.5 mb-2.5 border-b border-slate-200">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    {group.label}
                  </h3>
                  {isCurrentDecade && (
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                      現在地
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onAddGoalForAge(group.minAge)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 cursor-pointer"
                  title={`${group.label}に目標を追加`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Minimal Current Age Marker */}
              {isCurrentDecade && (
                <div className="my-2.5 flex items-center gap-2 text-xs text-teal-700">
                  <div className="h-px bg-teal-200 flex-1" />
                  <div className="flex items-center gap-1 text-[11px] font-medium shrink-0 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    <span>{profile.currentAge}歳</span>
                  </div>
                  <div className="h-px bg-teal-200 flex-1" />
                </div>
              )}

              {/* Goals List */}
              {group.goals.length > 0 ? (
                <div className="space-y-1.5">
                  {group.goals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      currentAge={profile.currentAge}
                      onEdit={onEditGoal}
                      onDelete={onDeleteGoal}
                      onToggleStatus={onToggleStatus}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-2 text-center">
                  <button
                    onClick={() => onAddGoalForAge(group.minAge)}
                    className="text-xs text-slate-300 hover:text-slate-500 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{group.label}を追加</span>
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
