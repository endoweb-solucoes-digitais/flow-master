import { useState } from "react";
import { X, ChevronRight, FileText, Users, DollarSign, Briefcase, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NewFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { id: "rh", label: "Recursos Humanos", icon: Users },
  { id: "financeiro", label: "Financeiro", icon: DollarSign },
  { id: "compras", label: "Compras", icon: Briefcase },
  { id: "documentos", label: "Documentos", icon: FileText },
];

const flows = [
  {
    id: 1,
    name: "Solicitação de Férias",
    category: "rh",
    description: "Processo para solicitar férias com aprovação do gestor direto e RH.",
    steps: 4,
  },
  {
    id: 2,
    name: "Admissão de Colaborador",
    category: "rh",
    description: "Fluxo completo de admissão com documentação e integração.",
    steps: 6,
  },
  {
    id: 3,
    name: "Reembolso de Despesas",
    category: "financeiro",
    description: "Solicitação de reembolso com anexo de comprovantes fiscais.",
    steps: 3,
  },
  {
    id: 4,
    name: "Requisição de Compras",
    category: "compras",
    description: "Abertura de requisição de materiais ou serviços.",
    steps: 5,
  },
];

export function NewFlowModal({ isOpen, onClose }: NewFlowModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<number | null>(null);

  if (!isOpen) return null;

  const filteredFlows = selectedCategory
    ? flows.filter((f) => f.category === selectedCategory)
    : flows;

  const handleStart = () => {
    if (selectedFlow) {
      // Navigate to flow or start
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-xl shadow-prominent w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Iniciar Novo Flow</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Categories */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-3 block">
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                    setSelectedFlow(null);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border hover:border-primary/50 text-foreground"
                  )}
                >
                  <cat.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Flows List */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Selecione o Flow
            </label>
            <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin pr-2">
              {filteredFlows.map((flow) => (
                <button
                  key={flow.id}
                  onClick={() => setSelectedFlow(flow.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border transition-all",
                    selectedFlow === flow.id
                      ? "bg-primary/5 border-primary ring-2 ring-primary/20"
                      : "bg-card border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{flow.name}</span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {flow.steps} etapas
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {flow.description}
                      </p>
                    </div>
                    {selectedFlow === flow.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleStart} disabled={!selectedFlow}>
            Iniciar Flow
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
