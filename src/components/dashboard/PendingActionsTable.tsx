import { AlertCircle, Clock, ArrowRight } from "lucide-react";
import { StatusBadge, StatusType } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PendingAction {
  id: string;
  flowName: string;
  stepName: string;
  deadline: string;
  isOverdue: boolean;
  priority: "alta" | "média" | "baixa";
}

const mockActions: PendingAction[] = [
  {
    id: "FLW-001",
    flowName: "Solicitação de Férias",
    stepName: "Aprovação do Gestor",
    deadline: "Hoje, 18:00",
    isOverdue: true,
    priority: "alta",
  },
  {
    id: "FLW-003",
    flowName: "Requisição de Compras",
    stepName: "Análise Financeira",
    deadline: "Amanhã, 12:00",
    isOverdue: false,
    priority: "alta",
  },
  {
    id: "FLW-007",
    flowName: "Admissão de Colaborador",
    stepName: "Documentação RH",
    deadline: "Em 2 dias",
    isOverdue: false,
    priority: "média",
  },
  {
    id: "FLW-012",
    flowName: "Reembolso de Despesas",
    stepName: "Conferência de Notas",
    deadline: "Em 3 dias",
    isOverdue: false,
    priority: "baixa",
  },
];

const priorityStatus: Record<string, StatusType> = {
  alta: "danger",
  média: "warning",
  baixa: "neutral",
};

export function PendingActionsTable() {
  return (
    <div className="card-elevated overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-status-warning" />
          <h3 className="font-semibold text-foreground">Ações Pendentes</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          Ver todas
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      <div className="divide-y divide-border">
        {mockActions.map((action, index) => (
          <div
            key={action.id}
            className={cn(
              "px-6 py-4 flex items-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer animate-slide-up",
              action.isOverdue && "bg-status-danger-light/30"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">
                  {action.id}
                </span>
                {action.isOverdue && (
                  <StatusBadge status="danger" label="Atrasado" />
                )}
              </div>
              <p className="font-medium text-foreground truncate mt-0.5">
                {action.flowName}
              </p>
              <p className="text-sm text-muted-foreground">{action.stepName}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span className={action.isOverdue ? "text-status-danger font-medium" : ""}>
                    {action.deadline}
                  </span>
                </div>
                <StatusBadge
                  status={priorityStatus[action.priority]}
                  label={action.priority.charAt(0).toUpperCase() + action.priority.slice(1)}
                  className="mt-1"
                />
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
