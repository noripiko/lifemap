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
      {/* Status Filter Bar */}
      <div className="flex items-center justify-between pb-1 text-xs sm:text-sm">
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
          {/* All */}
          <button
            onClick={() => setFilter('all')}
            className={`p-1.5 px-3 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="すべて表示"
          >
            <List className="w-4 h-4" />
            <span className="tabular-nums text-xs font-semibold">{goals.length}</span>
          </button>

          {/* Pending */}
          <button
            onClick={() => setFilter('pending')}
            className={`p-1.5 px-3 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              filter === 'pending'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="未完了のみ表示"
          >
            <Circle className="w-4 h-4 text-slate-400" />
            <span className="tabular-nums text-xs font-semibold">{pendingCount}</span>
          </button>

          {/* Achieved */}
          <button
            onClick={() => setFilter('achieved')}
            className={`p-1.5 px-3 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              filter === 'achieved'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="達成済みのみ表示"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="tabular-nums text-xs font-semibold">{achievedCount}</span>
          </button>
        </div>

        {/* Quick add goal for current age */}
        <button
          onClick={() => onAddGoalForAge(profile.currentAge)}
          className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-slate-100"
        >
          <Plus className="w-4 h-4" />
          <span>追加</span>
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-8">
        {decadeGroups.map((group) => {
          const isCurrentDecade = group.isCurrentDecade;

          return (
            <section key={group.decade}>
              {/* Clean Decade Divider */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {group.label}
                  </h3>
                  {isCurrentDecade && (
                    <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      現在地
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onAddGoalForAge(group.minAge)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                  title={`${group.label}に目標を追加`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Current Age Marker */}
              {isCurrentDecade && (
                <div className="my-3 flex items-center gap-2 text-xs sm:text-sm text-teal-800 font-medium">
                  <div className="h-px bg-teal-200 flex-1" />
                  <div className="flex items-center gap-1.5 text-xs font-bold shrink-0 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    <span className="w-2 h-2 rounded-full bg-teal-600" />
                    <span>{profile.currentAge}歳（現在）</span>
                  </div>
                  <div className="h-px bg-teal-200 flex-1" />
                </div>
              )}

              {/* Goals List */}
              {group.goals.length > 0 ? (
                <div className="space-y-2">
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
                <div className="py-2.5 text-center">
                  <button
                    onClick={() => onAddGoalForAge(group.minAge)}
                    className="text-xs sm:text-sm text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1 px-2 rounded-md hover:bg-slate-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
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
