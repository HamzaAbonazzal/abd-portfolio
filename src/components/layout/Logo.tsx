import { Link } from "@/i18n/navigation";
import { Palette } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
        <Palette className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold text-light-text dark:text-dark-text">
        Ahmed<span className="text-primary">.</span>
      </span>
    </Link>
  );
}