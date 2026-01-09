import { useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge, StatusType } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  ArrowRight,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Flow {
  id: string;
  name: string;
  category: string;
  status: "em_andamento" | "concluido" | "atrasado" | "aguardando";
  currentStep: string;
  startDate: string;
  isOverdue: boolean;
}

const mockFlows: Flow[] = [
  {
    id: "FLW-001",
    name: "Solicitação de Férias",
    category: "Recursos Humanos",
    status: "atrasado",
    currentStep: "Aprovação do Gestor",
    startDate: "05/01/2026",
    isOverdue: true,
  },
  {
    id: "FLW-002",
    name: "Admissão de Colaborador",
    category: "Recursos Humanos",
    status: "em_andamento",
    currentStep: "Documentação RH",
    startDate: "06/01/2026",
    isOverdue: false,
  },
  {
    id: "FLW-003",
    name: "Requisição de Compras",
    category: "Compras",
    status: "em_andamento",
    currentStep: "Análise Financeira",
    startDate: "07/01/2026",
    isOverdue: false,
  },
  {
    id: "FLW-004",
    name: "Reembolso de Despesas",
    category: "Financeiro",
    status: "concluido",
    currentStep: "Finalizado",
    startDate: "02/01/2026",
    isOverdue: false,
  },
  {
    id: "FLW-005",
    name: "Solicitação de Férias",
    category: "Recursos Humanos",
    status: "aguardando",
    currentStep: "Aguardando Início",
    startDate: "08/01/2026",
    isOverdue: false,
  },
];

const statusMap: Record<Flow["status"], { label: string; type: StatusType }> = {
  em_andamento: { label: "Em Andamento", type: "warning" },
  concluido: { label: "Concluído", type: "success" },
  atrasado: { label: "Atrasado", type: "danger" },
  aguardando: { label: "Aguardando", type: "neutral" },
};

export default function FlowsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredFlows = mockFlows.filter((flow) => {
    const matchesSearch =
      flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flow.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || flow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Meus Flows</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe todos os processos que você iniciou
        </p>
      </div>

      {/* Filters */}
      <div className="card-elevated p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="atrasado">Atrasado</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Flows List */}
      <div className="card-elevated overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-muted/50 border-b border-border text-sm font-medium text-muted-foreground">
          <div className="col-span-1">ID</div>
          <div className="col-span-3">Flow</div>
          <div className="col-span-2">Categoria</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Etapa Atual</div>
          <div className="col-span-2">Iniciado em</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {filteredFlows.map((flow, index) => (
            <Link
              key={flow.id}
              to={`/flow/${flow.id}`}
              className={cn(
                "grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-muted/50 transition-colors animate-slide-up",
                flow.isOverdue && "bg-status-danger-light/20"
              )}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Mobile Layout */}
              <div className="md:hidden space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-muted-foreground">{flow.id}</span>
                  <StatusBadge status={statusMap[flow.status].type} label={statusMap[flow.status].label} />
                </div>
                <p className="font-medium text-foreground">{flow.name}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{flow.category}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {flow.startDate}
                  </span>
                </div>
                {flow.isOverdue && (
                  <div className="flex items-center gap-1 text-status-danger text-sm">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Etapa atrasada
                  </div>
                )}
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex md:col-span-1 items-center">
                <span className="font-mono text-sm text-muted-foreground">{flow.id}</span>
              </div>
              <div className="hidden md:flex md:col-span-3 items-center gap-2">
                <span className="font-medium text-foreground">{flow.name}</span>
                {flow.isOverdue && (
                  <AlertCircle className="w-4 h-4 text-status-danger" />
                )}
              </div>
              <div className="hidden md:flex md:col-span-2 items-center text-muted-foreground">
                {flow.category}
              </div>
              <div className="hidden md:flex md:col-span-2 items-center">
                <StatusBadge status={statusMap[flow.status].type} label={statusMap[flow.status].label} />
              </div>
              <div className="hidden md:flex md:col-span-2 items-center text-sm text-muted-foreground">
                {flow.currentStep}
              </div>
              <div className="hidden md:flex md:col-span-2 items-center justify-between">
                <span className="text-sm text-muted-foreground">{flow.startDate}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>

        {filteredFlows.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-muted-foreground">Nenhum flow encontrado</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
