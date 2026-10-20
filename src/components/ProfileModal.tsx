import React, { useState } from 'react';
import { UserProfile, GoalItem } from '../types/lifemap';
import { calculateCurrentAge, exportDataAsJSON } from '../utils/lifemapUtils';
import { X, Download, Upload, RotateCcw, ChevronLeft } from 'lucide-react';

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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
    <div className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center sm:p-4 bg-white sm:bg-slate-900/40 sm:backdrop-blur-xs">
      <div className="flex flex-col w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-md bg-white sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 safe-top">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-0.5 py-1 px-1.5 -ml-1 rounded-lg active:bg-slate-100 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:hidden" />
            <span className="sm:hidden">閉じる</span>
            <span className="hidden sm:inline">キャンセル</span>
          </button>

          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            年齢・設定
          </h3>

          <button
            type="button"
            onClick={() => handleSubmit()}
            className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-xs transition-colors cursor-pointer"
          >
            保存
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              生まれ年 (西暦)
            </label>
            <select
              value={birthYear}
              onChange={(e) => setBirthYear(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono shadow-2xs"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}年 (昭和{y > 1925 && y < 1989 ? y - 1925 : ''}平成{y >= 1989 && y < 2019 ? y - 1988 : ''}令和{y >= 2019 ? y - 2018 : ''})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              誕生月
            </label>
            <select
              value={birthMonth}
              onChange={(e) => setBirthMonth(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono shadow-2xs"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}月
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-200 text-xs flex items-center justify-between">
            <span className="text-teal-800 font-medium">現在の計算年齢:</span>
            <span className="text-base font-bold text-teal-950 tabular-nums">
              {previewAge} 歳
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ロードマップの終点（目標寿命）
            </label>
            <select
              value={targetLifespan}
              onChange={(e) => setTargetLifespan(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono shadow-2xs"
            >
              {[90, 95, 100, 105, 110, 120].map((age) => (
                <option key={age} value={age}>
                  {age}歳 {age === 100 ? '（人生100年時代）' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* PWA App Icon and Home Screen installation */}
          <div className="pt-3 border-t border-slate-200 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <img
                  src="/pwa-192x192.png"
                  alt="App Icon"
                  className="w-8 h-8 rounded-lg shrink-0 object-cover shadow-2xs"
                />
                <div>
                  <div className="font-semibold text-slate-800">スマホアプリ化 (PWA)</div>
                  <div className="text-[11px] text-slate-500">ホーム画面から全画面で起動</div>
                </div>
              </div>
              <a
                href="#install"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  const btn = document.querySelector('[data-pwa-install]') as HTMLButtonElement;
                  if (btn) btn.click();
                }}
                className="text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
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
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-medium transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>データ保存</span>
              </button>
              <button
                type="button"
                onClick={onImportData}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-medium transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>データ復元</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('初期サンプルデータに戻しますか？')) {
                    onResetGoals();
                    onClose();
                  }
                }}
                className="py-2 px-2.5 text-slate-400 hover:text-rose-600 rounded-xl cursor-pointer"
                title="初期化"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2 pb-8 sm:pb-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              閉じる
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              設定を保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
