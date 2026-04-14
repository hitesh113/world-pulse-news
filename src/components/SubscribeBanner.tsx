import { useState } from "react";
import { useSubscribe } from "@/hooks/useSubscribe";
import { toast } from "sonner";

export default function SubscribeBanner() {
  const [email, setEmail] = useState("");
  const subscribe = useSubscribe();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    subscribe.mutate(email, {
      onSuccess: () => {
        toast.success("You're subscribed! We'll notify you of new stories.");
        setEmail("");
      },
      onError: (err) => {
        toast.error(err.message || "Something went wrong.");
      },
    });
  };

  return (
    <section className="border-t border-b border-border py-12 my-12">
      <div className="text-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-foreground">Stay Updated</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Get notified when we publish breaking news. No spam.
        </p>
        <form onSubmit={handleSubmit} className="mt-5 flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2.5 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={subscribe.isPending}
            className="px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {subscribe.isPending ? "..." : "Notify Me"}
          </button>
        </form>
      </div>
    </section>
  );
}
