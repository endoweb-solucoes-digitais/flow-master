import { cn } from "@/lib/utils";

export type StatusType = "success" | "warning" | "danger" | "neutral" | "info";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
}

const statusClasses: Record<StatusType, string> = {
  success: "status-success",
  warning: "status-warning",
  danger: "status-danger",
  neutral: "status-neutral",
  info: "status-info",
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusClasses[status],
        className
      )}
    >
      {label}
    </span>
  );
}
