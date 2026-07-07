import React, { useEffect, useState } from 'react';
import { Download, X, Share, Plus } from 'lucide-react';

// Detect platform
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
const isAndroid = () => /android/i.test(navigator.userAgent);
const isMobile = () => isIOS() || isAndroid() || window.innerWidth < 768;
const isInStandaloneMode = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showAndroidBanner, setShowAndroidBanner] = useState(false);
  const [showIOSBanner, setShowIOSBanner] = useState(false);

  useEffect(() => {
    // If already installed as PWA, never show banner
    if (isInStandaloneMode()) return;

    // If user dismissed this session, skip
    const dismissed = sessionStorage.getItem('pwa_dismissed');
    if (dismissed) return;

    // Android / Chrome: wait for browser's beforeinstallprompt event
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (isMobile()) setShowAndroidBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // iOS: manually show the "Add to Home Screen" instructional banner
    if (isIOS() && !isInStandaloneMode()) {
      // Slight delay so it doesn't flash on initial render
      const timer = setTimeout(() => setShowIOSBanner(true), 2500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }

    // Android fallback — if beforeinstallprompt hasn't fired after 3s
    // (e.g. site served over HTTP locally, or manifest issues), 
    // still show educational banner so user knows the app is installable
    const androidFallback = setTimeout(() => {
      if (!deferredPrompt && isAndroid()) {
        setShowAndroidBanner(true);
      }
    }, 3000);

    const handleInstalled = () => {
      setShowAndroidBanner(false);
      setShowIOSBanner(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      clearTimeout(androidFallback);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowAndroidBanner(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa_dismissed', 'true');
    setShowAndroidBanner(false);
    setShowIOSBanner(false);
  };

  // ── iOS instructional banner ───────────────────────────────────────────────
  if (showIOSBanner) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#402763] border-t-2 border-[#ffcd60]/40 px-5 py-4 shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-4 text-white/50 hover:text-white transition"
        >
          <X size={18} />
        </button>

        <div className="flex gap-4 items-start max-w-md mx-auto">
          <div className="w-12 h-12 bg-[#ffcd60] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
            <img
              src="/final/SheGo Final Colored Logo-01-01.png"
              alt="SHEGO"
              className="w-8 object-contain"
            />
          </div>

          <div className="flex-1 space-y-1">
            <h4 className="font-black text-[#ffcd60] text-sm">
              Install SHEGO on your iPhone
            </h4>
            <p className="text-white/80 text-xs leading-relaxed">
              Tap the{' '}
              <span className="inline-flex items-center gap-0.5 text-[#ffcd60] font-bold">
                <Share size={11} /> Share
              </span>{' '}
              button in Safari, then tap{' '}
              <span className="inline-flex items-center gap-0.5 text-[#ffcd60] font-bold">
                <Plus size={11} /> Add to Home Screen
              </span>{' '}
              for instant access.
            </p>
          </div>
        </div>

        {/* Arrow pointing down at the share button */}
        <div className="text-center mt-3">
          <span className="text-2xl animate-bounce inline-block">↓</span>
        </div>
      </div>
    );
  }

  // ── Android / Chrome install banner ───────────────────────────────────────
  if (showAndroidBanner) {
    return (
      <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[9999] bg-[#402763] border border-[#ffcd60]/30 rounded-3xl p-5 shadow-2xl shadow-[#402763]/40">
        <button
          onClick={handleDismiss}
          className="absolute top-3.5 right-4 text-white/40 hover:text-white transition"
        >
          <X size={16} />
        </button>

        <div className="flex gap-4">
          {/* App Icon */}
          <div className="w-12 h-12 bg-[#ffcd60] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#ffcd60]/20">
            <img
              src="/final/SheGo Final Colored Logo-01-01.png"
              alt="SHEGO"
              className="w-8 object-contain"
            />
          </div>

          {/* Content */}
          <div className="flex-1 pr-4">
            <h4 className="font-black text-[#ffcd60] text-sm mb-0.5">
              Install SHEGO App
            </h4>
            <p className="text-white/75 text-xs leading-relaxed mb-3">
              Get SOS alerts, fast bookings, and offline access by adding SHEGO to your home screen.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#ffcd60] text-[#402763] font-black rounded-xl text-xs shadow-md shadow-[#ffcd60]/20 hover:bg-white transition-all cursor-pointer"
              >
                <Download size={13} /> Install Now
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-white/50 hover:text-white text-xs font-semibold transition cursor-pointer"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PwaInstallPrompt;
