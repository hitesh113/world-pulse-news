import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSubscribe() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase.functions.invoke("subscribe", {
        body: { email },
      });
      if (error) {
        if (error.message?.includes("already subscribed")) {
          throw new Error("You're already subscribed!");
        }
        throw error;
      }
      return data;
    },
  });
}
