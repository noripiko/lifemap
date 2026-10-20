import React, { useState, useEffect } from 'react';
import { GoalItem, GoalCategory, CATEGORIES } from '../types/lifemap';
import { calculateYearForAge, formatYen } from '../utils/lifemapUtils';
import { X, MapPin, Trash2 } from 'lucide-react';

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
  const [targetAge, setTargetAge] = useState<number>(initialAge || currentAge || 30);
  const [category, setCategory] = useState<GoalCategory>(initialCategory || 'travel');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setTargetAge(goalToEdit.targetAge);
      setCategory(goalToEdit.category);
      setLocation(goalToEdit.location || '');
      setBudget(goalToEdit.budget ? String(goalToEdit.budget) : '');
      setNotes(goalToEdit.notes || '');
    } else {
      setTitle('');
      setTargetAge(initialAge || currentAge);
      setCategory(initialCategory || 'travel');
      setLocation('');
      setBudget('');
      setNotes('');
    }
  }, [goalToEdit, initialAge, initialCategory, currentAge, isOpen]);

  if (!isOpen) return null;

  const targetYear = calculateYearForAge(birthYear, targetAge);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedBudget = budget ? parseInt(budget, 10) : undefined;

    onSave(
      {
        title: title.trim(),
        targetAge: Number(targetAge),
        category,
        status: goalToEdit ? goalToEdit.status : 'planned',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            {goalToEdit ? '目標の編集' : '目標・予定の追加'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              やりたいこと / 予定
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="例: 北欧でオーロラを見る、富士山登頂"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900"
            />
          </div>

          {/* Target Age */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">何歳でやる？</label>
              <div className="text-sm font-bold text-slate-900 tabular-nums">
                {targetAge}歳 <span className="text-xs text-slate-500 font-normal font-mono">({targetYear}年)</span>
              </div>
            </div>
            <input
              type="range"
              min="18"
              max="85"
              value={targetAge}
              onChange={(e) => setTargetAge(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              カテゴリ
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                    category === cat.id
                      ? 'bg-slate-900 text-white font-medium'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label.split('・')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span>場所・どこ行く？（任意）</span>
            </label>
            <input
              type="text"
              placeholder="例: 屋久島、ノルウェー、京都"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              概算予算（任意）
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 tabular-nums"
              />
              {budget && (
                <span className="text-xs text-slate-500 shrink-0 font-medium">
                  {formatYen(parseInt(budget, 10))}
                </span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              メモ（任意）
            </label>
            <input
              type="text"
              placeholder="想いや具体的な内容"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
            />
          </div>

          {/* Footer Submit & Delete */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            {goalToEdit && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(goalToEdit.id);
                  onClose();
                }}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>削除</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {goalToEdit ? '保存' : '追加する'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
