import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  count?: number;
  dot?: string; // cor do dot ex: "bg-blue-500"
  className?: string;
}

export function SectionHeader({
  title,
  count,
  dot,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center gap-2 mb-3", className)}>
      {dot && <span className={cn("w-2.5 h-2.5 rounded-full", dot)} />}
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
      {count !== undefined && (
        <span className="ml-auto text-xs text-muted-foreground">
          {count} times
        </span>
      )}
    </div>
  );
}