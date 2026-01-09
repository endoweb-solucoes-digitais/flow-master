import { useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge, StatusType } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, ArrowRight, AlertCircle, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  flowId: string;
  flowName: string;
  stepName: string;
  status: "liberado" | "iniciado" | "atrasado" | "concluido";
  deadline: string;
  priority: "alta" | "média" | "baixa";
  isOverdue: boolean;
}

const mockSteps: Step[] = [
  {
    id: "STP-001",
    flowId: "FLW-001",
    flowName: "Solicitação de Férias",
    stepName: "Aprovação do Gestor",
    status: "atrasado",
    deadline: "Hoje, 18:00",
    priority: "alta",
    isOverdue: true,
  },
  {
    id: "STP-002",
    flowId: "FLW-003",
    flowName: "Requisição de Compras",
    stepName: "Análise Financeira",
    status: "liberado",
    deadline: "Amanhã, 12:00",
    priority: "alta",
    isOverdue: false,
  },
  {
    id: "STP-003",
    flowId: "FLW-007",
    flowName: "Admissão de Colaborador",
    stepName: "Documentação RH",
    status: "iniciado",
    deadline: "Em 2 dias",
    priority: "média",
    isOverdue: false,
  },
  {
    id: "STP-004",
    flowId: "FLW-012",
    flowName: "Reembolso de Despesas",
    stepName: "Conferência de Notas",
    status: "liberado",
    deadline: "Em 3 dias",
    priority: "baixa",
    isOverdue: false,
  },
  {
    id: "STP-005",
    flowId: "FLW-015",
    flowName: "Contratação de Serviço",
    stepName: "Aprovação Jurídica",
    status: "concluido",
    deadline: "Concluído",
    priority: "média",
    isOverdue: false,
  },
];

const statusMap: Record<Step["status"], { label: string; type: StatusType }> = {
  liberado: { label: "Liberado", type: "info" },
  iniciado: { label: "Iniciado", type: "warning" },
  atrasado: { label: "Atrasado", type: "danger" },
  concluido: { label: "Concluído", type: "success" },
};

const priorityMap: Record<Step["priority"], { label: string; type: StatusType }> = {
  alta: { label: "Alta", type: "danger" },
  média: { label: "Média", type: "warning" },
  baixa: { label: "Baixa", type: "neutral" },
};

export default function StepsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSteps = mockSteps.filter((step) => {
    return statusFilter === "all" || step.status === statusFilter;
  });

  // Sort by priority and overdue status
  const sortedSteps = [...filteredSteps].sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    const priorityOrder = { alta: 0, média: 1, baixa: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Minhas Etapas</h1>
        <p className="text-muted-foreground mt-1">
          Etapas de processos onde você é responsável
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-foreground">
            {mockSteps.filter((s) => s.status !== "concluido").length}
          </p>
          <p className="text-sm text-muted-foreground">Pendentes</p>
        </div>
        <div className="card-elevated p-4 text-center border-status-danger/30">
          <p className="text-2xl font-bold text-status-danger">
            {mockSteps.filter((s) => s.isOverdue).length}
          </p>
          <p className="text-sm text-muted-foreground">Atrasadas</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-status-warning">
            {mockSteps.filter((s) => s.priority === "alta" && s.status !== "concluido").length}
          </p>
          <p className="text-sm text-muted-foreground">Alta Prioridade</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-status-success">
            {mockSteps.filter((s) => s.status === "concluido").length}
          </p>
          <p className="text-sm text-muted-foreground">Concluídas</p>
        </div>
      </div>

      {/* Filter */}
      <div className="card-elevated p-4 mb-6">
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="liberado">Liberado</SelectItem>
              <SelectItem value="iniciado">Iniciado</SelectItem>
              <SelectItem value="atrasado">Atrasado</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {sortedSteps.map((step, index) => (
          <Link
            key={step.id}
            to={`/flow/${step.flowId}?step=${step.id}`}
            className={cn(
              "card-interactive p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 animate-slide-up",
              step.isOverdue && "border-status-danger/50 bg-status-danger-light/20"
            )}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {/* Priority Indicator */}
            <div
              className={cn(
                "hidden md:block w-1 h-12 rounded-full",
                step.priority === "alta" && "bg-status-danger",
                step.priority === "média" && "bg-status-warning",
                step.priority === "baixa" && "bg-status-neutral"
              )}
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-muted-foreground">
                  {step.flowId}
                </span>
                <StatusBadge status={statusMap[step.status].type} label={statusMap[step.status].label} />
                <StatusBadge status={priorityMap[step.priority].type} label={priorityMap[step.priority].label} />
                {step.isOverdue && (
                  <span className="flex items-center gap-1 text-xs text-status-danger font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Atrasado
                  </span>
                )}
              </div>
              <p className="font-medium text-foreground mt-1 truncate">
                {step.stepName}
              </p>
              <p className="text-sm text-muted-foreground">{step.flowName}</p>
            </div>

            {/* Deadline & Action */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className={step.isOverdue ? "text-status-danger font-medium" : ""}>
                  {step.deadline}
                </span>
              </div>
              <Button
                variant={step.status === "concluido" ? "outline" : "default"}
                size="sm"
              >
                {step.status === "concluido" ? "Ver" : "Executar"}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Link>
        ))}

        {sortedSteps.length === 0 && (
          <div className="card-elevated px-6 py-12 text-center">
            <p className="text-muted-foreground">Nenhuma etapa encontrada</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
