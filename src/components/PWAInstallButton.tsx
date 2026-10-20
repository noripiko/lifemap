import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X, Share } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (compact) {
      return (
        <button
          onClick={install}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
          title="アプリとしてインストール"
        >
          <Download className="w-3.5 h-3.5" />
          <span>アプリ保存</span>
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl shadow-xs text-xs mb-3">
        <div className="flex items-center gap-2.5">
          <img
            src="/pwa-192x192.png"
            alt="LifeMap Icon"
            className="w-8 h-8 rounded-lg shrink-0 object-cover"
          />
          <div>
            <div className="font-bold">LifeMapをアプリとして追加</div>
            <div className="text-[11px] text-slate-300">ホーム画面から素早く開けます</div>
          </div>
        </div>
        <button
          data-pwa-install="true"
          onClick={install}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>インストール</span>
        </button>
      </div>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        {compact ? (
          <button
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-full font-medium transition-colors cursor-pointer"
            title="ホーム画面に追加"
          >
            <Download className="w-3 h-3" />
            <span>アプリ化</span>
          </button>
        ) : (
          <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl shadow-xs text-xs mb-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/pwa-192x192.png"
                alt="LifeMap Icon"
                className="w-8 h-8 rounded-lg shrink-0 object-cover"
              />
              <div>
                <div className="font-bold">LifeMapをホーム画面に追加</div>
                <div className="text-[11px] text-slate-300">Safariから全画面アプリとして使えます</div>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            >
              <span>手順を見る</span>
            </button>
          </div>
        )}

        {/* iOS installation guide modal */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl text-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <img
                    src="/pwa-192x192.png"
                    alt="LifeMap Icon"
                    className="w-7 h-7 rounded-lg"
                  />
                  <h3 className="text-sm font-bold">iPhone / iPad でのアプリ追加</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-700 leading-relaxed">
                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    Safari下部（iPadは上部）の
                    <strong className="text-slate-900 flex items-center gap-1 my-1">
                      <Share className="w-3.5 h-3.5 inline text-sky-600" />
                      「共有」ボタン
                    </strong>
                    をタップします。
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    メニューを少しスクロールして
                    <strong className="text-slate-900 block my-1">
                      「ホーム画面に追加」
                    </strong>
                    をタップすると、専用アイコンで起動できるようになります。
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                閉じる
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
