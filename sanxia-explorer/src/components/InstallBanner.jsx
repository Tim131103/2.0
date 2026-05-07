import { useEffect, useState } from 'react';

export default function InstallBanner() {
  const [prompt, setPrompt] = useState(null);   // Android deferred prompt
  const [show, setShow] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Already installed / dismissed
    if (localStorage.getItem('installDismissed')) return;
    // Already running standalone
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (window.navigator.standalone) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIos(ios);

    if (ios) {
      setShow(true);
      return;
    }

    function onBeforeInstall(e) {
      e.preventDefault();
      setPrompt(e);
      setShow(true);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  function dismiss() {
    localStorage.setItem('installDismissed', '1');
    setShow(false);
  }

  async function install() {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed top-16 left-3 right-3 z-50 bg-[#2B2D6E] text-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
      <img src="/icon.svg" alt="" className="w-10 h-10 rounded-xl flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm leading-tight">Install the app</p>
        {isIos ? (
          <p className="text-white/70 text-xs mt-0.5">
            Tap <span className="font-bold">Share</span> → <span className="font-bold">Add to Home Screen</span> to hide the browser bar
          </p>
        ) : (
          <p className="text-white/70 text-xs mt-0.5">
            Add to your home screen — no browser bar, feels native
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {!isIos && (
          <button
            onClick={install}
            className="bg-[#C9933A] text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
          >
            Install
          </button>
        )}
        <button onClick={dismiss} className="text-white/50 text-lg leading-none px-1">×</button>
      </div>
    </div>
  );
}
