import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

const variantClasses = {
  default: "bg-primary/10 text-primary",
  success: "bg-status-success-light text-status-success",
  warning: "bg-status-warning-light text-status-warning",
  danger: "bg-status-danger-light text-status-danger",
};

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: KpiCardProps) {
  return (
    <div className={cn("kpi-card animate-slide-up", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", variantClasses[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <span
            className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-status-success" : "text-status-danger"
            )}
          >
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-muted-foreground">vs. mês anterior</span>
        </div>
      )}
    </div>
  );
}
