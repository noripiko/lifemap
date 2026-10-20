import React, { useState, useEffect } from 'react';
import { GoalItem, GoalCategory, CATEGORIES, GoalStatus } from '../types/lifemap';
import { calculateYearForAge, formatYen } from '../utils/lifemapUtils';
import { MapPin, Trash2, Check, ChevronLeft } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  goalToEdit: GoalItem | null;
  initialAge?: number;
  initialCategory?: GoalCategory;
  birthYear: number;
  currentAge: number;
  onSave: (goalData: Omit<GoalItem, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  goalToEdit,
  initialAge,
  initialCategory,
  birthYear,
  currentAge,
  onSave,
  onDelete,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [targetAge, setTargetAge] = useState<string>(String(initialAge || currentAge || 30));
  const [category, setCategory] = useState<GoalCategory>(initialCategory || 'travel');
  const [status, setStatus] = useState<GoalStatus>('planned');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setTargetAge(String(goalToEdit.targetAge));
      setCategory(goalToEdit.category);
      setStatus(goalToEdit.status || 'planned');
      setLocation(goalToEdit.location || '');
      setBudget(goalToEdit.budget ? String(goalToEdit.budget) : '');
      setNotes(goalToEdit.notes || '');
    } else {
      setTitle('');
      setTargetAge(String(initialAge || currentAge || 30));
      setCategory(initialCategory || 'travel');
      setStatus('planned');
      setLocation('');
      setBudget('');
      setNotes('');
    }
  }, [goalToEdit, initialAge, initialCategory, currentAge, isOpen]);

  if (!isOpen) return null;

  const parsedAge = parseInt(targetAge, 10);
  const isValidAge = !isNaN(parsedAge) && parsedAge > 0 && parsedAge <= 120;
  const targetYear = isValidAge ? calculateYearForAge(birthYear, parsedAge) : null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !isValidAge) return;

    const parsedBudget = budget ? parseInt(budget, 10) : undefined;

    onSave(
      {
        title: title.trim(),
        targetAge: parsedAge,
        category,
        status,
        location: location.trim() || undefined,
        isTravel: category === 'travel' || Boolean(location.trim()),
        budget: parsedBudget && !isNaN(parsedBudget) ? parsedBudget : undefined,
        priority: 'high',
        notes: notes.trim() || undefined,
        actionSteps: goalToEdit?.actionSteps || [],
      },
      goalToEdit?.id
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center sm:p-4 bg-white sm:bg-slate-900/40 sm:backdrop-blur-xs">
      <div className="flex flex-col w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:max-w-lg bg-white sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-2xl overflow-hidden">
        {/* Top Header - Always visible on mobile, never blocked by keyboard! */}
        <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 safe-top">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-0.5 py-1 px-1.5 -ml-1 rounded-lg active:bg-slate-100 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:hidden" />
            <span className="sm:hidden">戻る</span>
            <span className="hidden sm:inline">キャンセル</span>
          </button>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {goalToEdit ? '目標の編集' : '新しい目標・予定'}
          </h3>

          {/* Primary Save Button in Header */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!title.trim() || !isValidAge}
            className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors cursor-pointer"
          >
            {goalToEdit ? '保存' : '追加'}
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4"
        >
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              やりたいこと / 予定 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="例: ボリビア・ウユニ塩湖の鏡張りを見る"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors shadow-2xs"
            />
          </div>

          {/* Target Age - Direct Number Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                目標年齢 <span className="text-rose-500">*</span>
              </label>
              {targetYear && (
                <span className="text-xs font-semibold text-slate-600 font-mono">
                  {targetYear}年 (満{parsedAge}歳)
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                min="1"
                max="120"
                required
                placeholder="40"
                value={targetAge}
                onChange={(e) => setTargetAge(e.target.value)}
                className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors tabular-nums shadow-2xs pr-12 font-medium"
              />
              <span className="absolute right-3.5 text-sm font-semibold text-slate-400 pointer-events-none">
                歳
              </span>
            </div>
          </div>

          {/* Status (Planned vs Achieved) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              達成ステータス
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('planned')}
                className={`py-2 px-3 text-xs font-medium rounded-xl border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  status !== 'achieved'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>未完了 / 予定</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('achieved')}
                className={`py-2 px-3 text-xs font-medium rounded-xl border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  status === 'achieved'
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-2xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>達成済み！</span>
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              カテゴリ
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                    category === cat.id
                      ? 'bg-slate-900 text-white font-medium shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label.split('・')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span>場所・どこ行く？（任意）</span>
            </label>
            <input
              type="text"
              placeholder="例: ボリビア、屋久島、京都、ノルウェー"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2 text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors shadow-2xs"
            />
          </div>

          {/* Budget */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                概算予算（任意）
              </label>
              {budget && (
                <span className="text-xs text-slate-900 font-bold tabular-nums">
                  {formatYen(parseInt(budget, 10))}
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3.5 py-2 text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors tabular-nums shadow-2xs pr-10 font-mono"
              />
              <span className="absolute right-3.5 text-xs font-semibold text-slate-400 pointer-events-none">
                円
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              メモ・想い（任意）
            </label>
            <textarea
              rows={2}
              placeholder="時期、一緒に行く人、やってみたいことなど"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors resize-none shadow-2xs"
            />
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col gap-3 pb-8 sm:pb-0">
            <div className="flex items-center justify-between">
              {goalToEdit && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('この目標を削除しますか？')) {
                      onDelete(goalToEdit.id);
                      onClose();
                    }
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 active:bg-rose-50 py-2 px-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>この目標を削除</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || !isValidAge}
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {goalToEdit ? '保存する' : '追加する'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
