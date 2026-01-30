import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  PlayCircle,
  Lock,
  XCircle,
} from "lucide-react";

export type StepStatus = "completed" | "current" | "waiting" | "available" | "overdue" | "pending";

export interface TimelineStepData {
  id: number;
  name: string;
  status: StepStatus;
  completedAt?: string;
  completedBy?: string;
  dueDate?: string;
  startDate?: string;
  isApprovalStep?: boolean;
  isFormStep?: boolean;
  approvalData?: {
    approved: boolean;
    observation?: string;
  };
  formData?: {
    label: string;
    value: string;
    type: "text" | "date" | "file" | "select" | "textarea";
  }[];
}

interface FlowTimelineProps {
  steps: TimelineStepData[];
  activeStepId: number | null;
  onStepSelect: (stepId: number) => void;
}

const stepStatusIcons: Record<StepStatus, typeof CheckCircle2> = {
  completed: CheckCircle2,
  current: Clock,
  waiting: Lock,
  available: PlayCircle,
  overdue: AlertCircle,
  pending: Circle,
};

const stepStatusColors: Record<StepStatus, string> = {
  completed: "text-status-success",
  current: "text-status-warning",
  waiting: "text-muted-foreground",
  available: "text-primary",
  overdue: "text-status-danger",
  pending: "text-muted-foreground",
};

const stepStatusBgColors: Record<StepStatus, string> = {
  completed: "bg-status-success-light",
  current: "bg-status-warning-light",
  waiting: "bg-muted",
  available: "bg-primary/10",
  overdue: "bg-status-danger-light",
  pending: "bg-muted",
};

const stepStatusLabels: Record<StepStatus, string> = {
  completed: "Concluída",
  current: "Em Andamento",
  waiting: "Aguardando",
  available: "Liberada",
  overdue: "Atrasada",
  pending: "Pendente",
};

export function FlowTimeline({ steps, activeStepId, onStepSelect }: FlowTimelineProps) {
  return (
    <div className="card-elevated p-6">
      <h2 className="font-semibold text-foreground mb-6">Etapas do Flow</h2>
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-border" />

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step) => {
            const Icon = stepStatusIcons[step.status];
            const isActive = activeStepId === step.id;
            const isApprovalCompleted = step.isApprovalStep && step.status === "completed" && step.approvalData;

            return (
              <button
                key={step.id}
                onClick={() => onStepSelect(step.id)}
                className={cn(
                  "relative flex items-start gap-4 w-full text-left p-3 rounded-lg transition-all -ml-1",
                  isActive
                    ? "bg-primary/5 ring-2 ring-primary/20"
                    : "hover:bg-muted/50"
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-background",
                    stepStatusBgColors[step.status]
                  )}
                >
                  {isApprovalCompleted ? (
                    step.approvalData?.approved ? (
                      <CheckCircle2 className="w-5 h-5 text-status-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-status-danger" />
                    )
                  ) : (
                    <Icon className={cn("w-5 h-5", stepStatusColors[step.status])} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "font-medium text-sm",
                        step.status === "pending" || step.status === "waiting"
                          ? "text-muted-foreground"
                          : "text-foreground"
                      )}
                    >
                      {step.name}
                    </p>
                    {step.isApprovalStep && step.status === "completed" && step.approvalData && (
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                          step.approvalData.approved
                            ? "bg-status-success/20 text-status-success"
                            : "bg-status-danger/20 text-status-danger"
                        )}
                      >
                        {step.approvalData.approved ? "APROVADO" : "REPROVADO"}
                      </span>
                    )}
                  </div>
                  
                  {step.completedAt && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.completedBy} • {step.completedAt}
                    </p>
                  )}
                  
                  {step.status === "overdue" && step.dueDate && (
                    <p className="text-xs text-status-danger mt-0.5">
                      Prazo excedido em {step.dueDate}
                    </p>
                  )}
                  
                  {step.status === "waiting" && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Aguardando etapas anteriores
                    </p>
                  )}
                  
                  {step.status === "available" && (
                    <p className="text-xs text-primary mt-0.5">
                      Pronta para iniciar
                    </p>
                  )}
                  
                  {step.status === "current" && step.dueDate && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Prazo: {step.dueDate}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
