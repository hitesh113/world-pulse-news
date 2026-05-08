import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSubscribe() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase
        .from("subscribers")
        .insert({ email })
        .select()
        .single();
      if (error) {
        if (error.code === "23505") {
          throw new Error("You're already subscribed!");
        }
        throw error;
      }
      return data;
    },
  });
}
