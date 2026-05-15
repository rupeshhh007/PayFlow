import { useEffect, useState } from "react";

export const OfflineDetector = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-white backdrop-blur-sm shadow-lg shadow-red-500/10 sm:left-auto sm:right-4">
      <div className="flex items-center justify-center gap-2">
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="font-medium">You are offline.</span>
        <span className="text-slate-300">Reconnect to continue.</span>
      </div>
    </div>
  );
};
