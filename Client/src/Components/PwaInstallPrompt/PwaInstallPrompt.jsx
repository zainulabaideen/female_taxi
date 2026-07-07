import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed the prompt during this session
    const isDismissed = sessionStorage.getItem('pwa_prompt_dismissed') === 'true';
    if (isDismissed) return;

    // Check if the app is already running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the install banner
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also check if app is installed to hide prompt
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsVisible(false);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-[#402763] text-white border border-[#ffcd60]/30 rounded-3xl p-5 shadow-2xl z-50 animate-bounce-short">
      <div className="flex gap-4">
        {/* App Logo Emblem */}
        <div className="w-12 h-12 bg-[#ffcd60] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#ffcd60]/20">
          <img src="/final/SheGo Final Colored Logo-01-01.png" alt="SHEGO" className="w-8 object-contain" />
        </div>

        {/* Text */}
        <div className="flex-1 space-y-1">
          <h4 className="font-bold text-sm text-[#ffcd60] flex items-center gap-1.5">
            Install SHEGO Web App
          </h4>
          <p className="text-[#e1cfe6]/80 text-xs leading-relaxed">
            Get instant safety alerts, rapid SOS parent triggers, and offline support by adding SHEGO to your home screen.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#ffcd60] text-[#402763] font-black rounded-xl hover:bg-white transition-all text-xs shadow-md shadow-[#ffcd60]/20 cursor-pointer"
            >
              <Download size={13} /> Install Now
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 text-[#e1cfe6]/70 hover:text-white transition-all text-xs font-semibold cursor-pointer"
            >
              Not Now
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="text-[#e1cfe6]/50 hover:text-white transition-all self-start cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default PwaInstallPrompt;
