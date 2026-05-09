import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function SessionMonitor() {
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.expires_at) {
        const expiryDate = new Date(session.expires_at * 1000);
        setSessionExpiry(expiryDate);

        // Show warning 5 minutes before expiry
        const warningTime = new Date(expiryDate.getTime() - 5 * 60 * 1000);
        const now = new Date();

        if (now >= warningTime && now < expiryDate) {
          setShowWarning(true);
        } else {
          setShowWarning(false);
        }
      }
    };

    checkSession();

    // Check session every minute
    const interval = setInterval(checkSession, 60 * 1000);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setSessionExpiry(null);
          setShowWarning(false);
        } else if (session?.expires_at) {
          const expiryDate = new Date(session.expires_at * 1000);
          setSessionExpiry(expiryDate);
        }
      }
    );

    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, []);

  const extendSession = async () => {
    // Force token refresh
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      toast.error("Failed to extend session");
    } else {
      toast.success("Session extended");
      setShowWarning(false);
    }
  };

  if (!showWarning || !sessionExpiry) return null;

  const timeLeft = Math.max(0, Math.floor((sessionExpiry.getTime() - Date.now()) / 1000 / 60));

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-lg max-w-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Session Expiring Soon</p>
          <p className="text-sm">Your session will expire in {timeLeft} minutes</p>
        </div>
        <button
          onClick={extendSession}
          className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium"
        >
          Extend
        </button>
      </div>
    </div>
  );
}