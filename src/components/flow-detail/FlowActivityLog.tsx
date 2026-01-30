import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  History,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  CheckCircle2,
  FileText,
  Send,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  MessageSquare,
  Clock,
  User,
  RefreshCw,
} from "lucide-react";

export interface ActivityLogEntry {
  id: number;
  user: string;
  action: string;
  date: string;
  type: "start" | "submit" | "send" | "approve" | "reject" | "system" | "comment" | "delay" | "return" | "complete";
  stepName?: string;
  details?: string;
}

interface FlowActivityLogProps {
  entries: ActivityLogEntry[];
  defaultExpanded?: boolean;
}

const activityIcons: Record<ActivityLogEntry["type"], typeof PlayCircle> = {
  start: PlayCircle,
  submit: FileText,
  send: Send,
  approve: ThumbsUp,
  reject: ThumbsDown,
  system: RefreshCw,
  comment: MessageSquare,
  delay: AlertCircle,
  return: RefreshCw,
  complete: CheckCircle2,
};

const activityColors: Record<ActivityLogEntry["type"], string> = {
  start: "bg-primary/10 text-primary",
  submit: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  send: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  approve: "bg-status-success-light text-status-success",
  reject: "bg-status-danger-light text-status-danger",
  system: "bg-muted text-muted-foreground",
  comment: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  delay: "bg-status-danger-light text-status-danger",
  return: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  complete: "bg-status-success-light text-status-success",
};

export function FlowActivityLog({ entries, defaultExpanded = true }: FlowActivityLogProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="card-elevated">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium text-foreground">
            Log de Atividades
          </span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {entries.length} registros
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
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />

              <div className="space-y-4">
                {entries.map((entry, index) => {
                  const Icon = activityIcons[entry.type];
                  const colorClass = activityColors[entry.type];

                  return (
                    <div key={entry.id} className="relative flex items-start gap-3 pl-1">
                      <div
                        className={cn(
                          "relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          colorClass
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm">
                              <span className="font-medium text-foreground">
                                {entry.user}
                              </span>{" "}
                              <span className="text-muted-foreground">
                                {entry.action}
                              </span>
                            </p>
                            {entry.stepName && (
                              <p className="text-xs text-primary font-medium mt-0.5">
                                {entry.stepName}
                              </p>
                            )}
                            {entry.details && (
                              <p className="text-xs text-muted-foreground mt-1 bg-muted/50 rounded px-2 py-1">
                                "{entry.details}"
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">
                            {entry.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
