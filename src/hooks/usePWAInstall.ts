import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    console.log('[PWA] Hook mounted. Listening for beforeinstallprompt event.');

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      console.log('[PWA] beforeinstallprompt event fired. App is installable.');
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const appInstalledHandler = () => {
      console.log('[PWA] App was installed.');
      setInstallPrompt(null);
    };

    window.addEventListener('appinstalled', appInstalledHandler);

    return () => {
      console.log('[PWA] Hook unmounted. Cleaning up listeners.');
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) {
      console.log('[PWA] Install function called, but no prompt is available.');
      return;
    }
    console.log('[PWA] Showing install prompt.');
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt.');
      setInstallPrompt(null);
    } else {
      console.log('[PWA] User dismissed the install prompt.');
    }
  };

  const canInstall = !!installPrompt;
  console.log(`[PWA] canInstall status: ${canInstall}`);

  return { canInstall, install };
};


