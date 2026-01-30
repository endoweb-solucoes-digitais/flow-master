import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Lock,
  PlayCircle,
  XCircle,
} from "lucide-react";
import type { StepStatus, TimelineStepData } from "./FlowTimeline";

interface FlowGanttChartProps {
  steps: TimelineStepData[];
  flowStartDate: string;
  defaultExpanded?: boolean;
}

// Parse DD/MM/YYYY HH:mm or DD/MM/YYYY format
function parseDate(dateStr: string): Date {
  const parts = dateStr.split(" ");
  const dateParts = parts[0].split("/");
  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const year = parseInt(dateParts[2], 10);
  
  if (parts[1]) {
    const timeParts = parts[1].split(":");
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    return new Date(year, month, day, hours, minutes);
  }
  
  return new Date(year, month, day);
}

function formatShortDate(date: Date): string {
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`;
}

const statusColors: Record<StepStatus, string> = {
  completed: "bg-status-success",
  current: "bg-status-warning",
  waiting: "bg-muted-foreground/30",
  available: "bg-primary",
  overdue: "bg-status-danger",
  pending: "bg-muted-foreground/20",
};

const statusBgLight: Record<StepStatus, string> = {
  completed: "bg-status-success/10",
  current: "bg-status-warning/10",
  waiting: "bg-muted/50",
  available: "bg-primary/10",
  overdue: "bg-status-danger/10",
  pending: "bg-muted/30",
};

export function FlowGanttChart({ steps, flowStartDate, defaultExpanded = true }: FlowGanttChartProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Calculate date range for the chart
  const startDate = parseDate(flowStartDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 14); // Show 2 weeks

  // Generate date columns
  const dateColumns: Date[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dateColumns.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Calculate step positions
  const getDayIndex = (dateStr: string): number => {
    const date = parseDate(dateStr);
    const diffTime = date.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.min(diffDays, dateColumns.length - 1));
  };

  return (
    <div className="card-elevated">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium text-foreground">
            Timeline das Etapas
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="border-t border-border pt-4">
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-status-success" />
                <span className="text-muted-foreground">Concluída</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-status-warning" />
                <span className="text-muted-foreground">Em Andamento</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-status-danger" />
                <span className="text-muted-foreground">Atrasada</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-primary" />
                <span className="text-muted-foreground">Liberada</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-muted-foreground/30" />
                <span className="text-muted-foreground">Aguardando/Pendente</span>
              </div>
            </div>

            {/* Chart */}
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Header with dates */}
                <div className="flex border-b border-border">
                  <div className="w-48 flex-shrink-0 px-3 py-2 text-xs font-medium text-muted-foreground">
                    Etapa
                  </div>
                  <div className="flex-1 flex">
                    {dateColumns.map((date, index) => {
                      const isToday = new Date().toDateString() === date.toDateString();
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      
                      return (
                        <div
                          key={index}
                          className={cn(
                            "flex-1 min-w-[40px] px-1 py-2 text-[10px] text-center border-l border-border",
                            isToday && "bg-primary/10 font-semibold text-primary",
                            isWeekend && !isToday && "bg-muted/50"
                          )}
                        >
                          {formatShortDate(date)}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Rows */}
                {steps.map((step, stepIndex) => {
                  const startIdx = step.startDate ? getDayIndex(step.startDate) : 
                                   step.completedAt ? getDayIndex(step.completedAt) : 
                                   stepIndex * 2;
                  const endIdx = step.completedAt ? getDayIndex(step.completedAt) : 
                                 step.dueDate ? getDayIndex(step.dueDate) : 
                                 startIdx + 2;
                  
                  const isApprovalRejected = step.isApprovalStep && step.approvalData && !step.approvalData.approved;

                  return (
                    <div key={step.id} className="flex border-b border-border last:border-b-0">
                      <div className="w-48 flex-shrink-0 px-3 py-3 flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full flex-shrink-0",
                          isApprovalRejected ? "bg-status-danger" : statusColors[step.status]
                        )} />
                        <span className="text-xs font-medium text-foreground truncate">
                          {step.name}
                        </span>
                      </div>
                      <div className="flex-1 flex relative">
                        {dateColumns.map((date, dateIndex) => {
                          const isToday = new Date().toDateString() === date.toDateString();
                          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                          const isInRange = dateIndex >= startIdx && dateIndex <= endIdx;
                          const isStart = dateIndex === startIdx;
                          const isEnd = dateIndex === endIdx;
                          
                          return (
                            <div
                              key={dateIndex}
                              className={cn(
                                "flex-1 min-w-[40px] py-3 border-l border-border relative",
                                isToday && "bg-primary/5",
                                isWeekend && !isToday && "bg-muted/30"
                              )}
                            >
                              {isInRange && (
                                <div
                                  className={cn(
                                    "absolute top-1/2 -translate-y-1/2 h-6 flex items-center justify-center",
                                    isStart ? "left-1 rounded-l-full" : "left-0",
                                    isEnd ? "right-1 rounded-r-full" : "right-0",
                                    isApprovalRejected ? "bg-status-danger" : statusColors[step.status]
                                  )}
                                >
                                  {isStart && (
                                    <span className="text-[10px] text-white font-medium px-2 whitespace-nowrap">
                                      {isEnd && (
                                        step.status === "completed" ? (
                                          isApprovalRejected ? (
                                            <XCircle className="w-3.5 h-3.5" />
                                          ) : (
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                          )
                                        ) : step.status === "current" ? (
                                          <Clock className="w-3.5 h-3.5" />
                                        ) : step.status === "overdue" ? (
                                          <AlertCircle className="w-3.5 h-3.5" />
                                        ) : step.status === "available" ? (
                                          <PlayCircle className="w-3.5 h-3.5" />
                                        ) : (
                                          <Lock className="w-3.5 h-3.5" />
                                        )
                                      )}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today indicator */}
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded bg-primary/20 border-2 border-primary" />
              <span>Hoje: {formatShortDate(new Date())}/{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
