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
import { Search, ArrowRight, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  category: string;
  status: "em_andamento" | "concluido" | "atrasado" | "aguardando";
  currentStep: string;
  startDate: string;
  startedBy: string;
}

const allFlows: SearchResult[] = [
  {
    id: "FLW-001",
    name: "Solicitação de Férias",
    category: "Recursos Humanos",
    status: "atrasado",
    currentStep: "Aprovação do Gestor",
    startDate: "05/01/2026",
    startedBy: "Maria Santos",
  },
  {
    id: "FLW-002",
    name: "Admissão de Colaborador",
    category: "Recursos Humanos",
    status: "em_andamento",
    currentStep: "Documentação RH",
    startDate: "06/01/2026",
    startedBy: "João Oliveira",
  },
  {
    id: "FLW-003",
    name: "Requisição de Compras",
    category: "Compras",
    status: "em_andamento",
    currentStep: "Análise Financeira",
    startDate: "07/01/2026",
    startedBy: "Ana Costa",
  },
  {
    id: "FLW-004",
    name: "Reembolso de Despesas",
    category: "Financeiro",
    status: "concluido",
    currentStep: "Finalizado",
    startDate: "02/01/2026",
    startedBy: "Pedro Lima",
  },
  {
    id: "FLW-005",
    name: "Contratação de Serviço",
    category: "Compras",
    status: "aguardando",
    currentStep: "Aguardando Início",
    startDate: "08/01/2026",
    startedBy: "Carla Mendes",
  },
  {
    id: "FLW-006",
    name: "Desligamento",
    category: "Recursos Humanos",
    status: "concluido",
    currentStep: "Finalizado",
    startDate: "01/01/2026",
    startedBy: "Maria Santos",
  },
];

const statusMap: Record<SearchResult["status"], { label: string; type: StatusType }> = {
  em_andamento: { label: "Em Andamento", type: "warning" },
  concluido: { label: "Concluído", type: "success" },
  atrasado: { label: "Atrasado", type: "danger" },
  aguardando: { label: "Aguardando", type: "neutral" },
};

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    const filtered = allFlows.filter((flow) => {
      const matchesSearch =
        searchTerm === "" ||
        flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flow.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flow.startedBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || flow.category === categoryFilter;

      const matchesStatus = statusFilter === "all" || flow.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    setResults(filtered);
    setHasSearched(true);
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Buscar Flows</h1>
        <p className="text-muted-foreground mt-1">
          Pesquise processos por ID, nome, categoria ou colaborador
        </p>
      </div>

      {/* Search Form */}
      <div className="card-elevated p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, nome ou colaborador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
              <SelectItem value="Financeiro">Financeiro</SelectItem>
              <SelectItem value="Compras">Compras</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
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
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {results.length} resultado(s) encontrado(s)
            </p>
          </div>

          {results.length > 0 ? (
            <div className="card-elevated overflow-hidden">
              <div className="divide-y divide-border">
                {results.map((flow, index) => (
                  <Link
                    key={flow.id}
                    to={`/flow/${flow.id}`}
                    className="block p-4 hover:bg-muted/50 transition-colors animate-slide-up"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm text-muted-foreground">
                            {flow.id}
                          </span>
                          <StatusBadge status={statusMap[flow.status].type} label={statusMap[flow.status].label} />
                        </div>
                        <p className="font-medium text-foreground mt-1">
                          {flow.name}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{flow.category}</span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {flow.startedBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {flow.startDate}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {flow.currentStep}
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="card-elevated px-6 py-12 text-center">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-foreground font-medium">
                Nenhum resultado encontrado
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Tente ajustar os filtros ou termo de busca
              </p>
            </div>
          )}
        </div>
      )}

      {!hasSearched && (
        <div className="card-elevated px-6 py-12 text-center">
          <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-foreground font-medium">
            Pesquise flows do sistema
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Use os filtros acima para encontrar processos específicos
          </p>
        </div>
      )}
    </AppLayout>
  );
}
