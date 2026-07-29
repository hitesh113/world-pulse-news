import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { buildSubscribeErrorMessage, isValidEmail, normalizeEmail } from "@/lib/subscription";

export function useSubscribe() {
  return useMutation({
    mutationFn: async (email: string) => {
      const normalizedEmail = normalizeEmail(email);

      if (!isValidEmail(normalizedEmail)) {
        throw new Error("Please enter a valid email address.");
      }

      try {
        const { data, error } = await supabase.functions.invoke("subscribe", {
          body: { email: normalizedEmail },
        });

        if (error) {
          throw error;
        }

        return data;
      } catch (error) {
        throw new Error(buildSubscribeErrorMessage(error));
      }
    },
  });
}
