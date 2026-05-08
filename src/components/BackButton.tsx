import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );
}
