import React, { useState } from 'react';
import { UserProfile, GoalItem } from '../types/lifemap';
import { calculateCurrentAge, exportDataAsJSON } from '../utils/lifemapUtils';
import { X, Download, Upload, RotateCcw } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  profile: UserProfile;
  goals: GoalItem[];
  onSave: (updatedProfile: UserProfile) => void;
  onResetGoals: () => void;
  onImportData: () => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  profile,
  goals,
  onSave,
  onResetGoals,
  onImportData,
  onClose,
}) => {
  const [birthYear, setBirthYear] = useState<number>(profile.birthYear);
  const [birthMonth, setBirthMonth] = useState<number>(profile.birthMonth);
  const [targetLifespan, setTargetLifespan] = useState<number>(profile.targetLifespan || 85);

  if (!isOpen) return null;

  const previewAge = calculateCurrentAge(birthYear, birthMonth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      birthYear,
      birthMonth,
      currentAge: previewAge,
      targetLifespan,
      isCustomAge: false,
    });
    onClose();
  };

  const currentYear = 2026;
  const yearOptions: number[] = [];
  for (let y = currentYear; y >= 1940; y--) {
    yearOptions.push(y);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            年齢・設定
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              生まれ年 (西暦)
            </label>
            <select
              value={birthYear}
              onChange={(e) => setBirthYear(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}年
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              誕生月
            </label>
            <select
              value={birthMonth}
              onChange={(e) => setBirthMonth(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}月
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs flex items-center justify-between">
            <span className="text-teal-800 font-medium">現在の計算年齢:</span>
            <span className="text-base font-bold text-teal-950 tabular-nums">
              {previewAge} 歳
            </span>
          </div>

          {/* PWA App Icon and Home Screen installation */}
          <div className="pt-3 border-t border-slate-200 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-2">
                <img
                  src="/pwa-192x192.png"
                  alt="App Icon"
                  className="w-7 h-7 rounded-lg shrink-0 object-cover"
                />
                <div>
                  <div className="font-semibold text-slate-800">スマホアプリ化 (PWA)</div>
                  <div className="text-[10px] text-slate-500">ホーム画面からすぐ起動</div>
                </div>
              </div>
              <a
                href="#install"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  // Trigger install if available
                  const btn = document.querySelector('[data-pwa-install]') as HTMLButtonElement;
                  if (btn) btn.click();
                }}
                className="text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                追加手順
              </a>
            </div>
          </div>

          {/* Data Backup & Reset Tools */}
          <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
            <div className="text-slate-500 font-medium">データ管理</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => exportDataAsJSON(profile, goals)}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>保存</span>
              </button>
              <button
                type="button"
                onClick={onImportData}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>復元</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('初期サンプルデータに戻しますか？')) {
                    onResetGoals();
                    onClose();
                  }
                }}
                className="py-1.5 px-2 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                title="初期化"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              閉じる
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
