import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  MessageSquare,
  History,
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFieldData {
  label: string;
  value: string;
  type: "text" | "date" | "file" | "select" | "textarea";
}

interface ApprovalData {
  approved: boolean;
  observation?: string;
}

interface TimelineStep {
  id: number;
  name: string;
  status: "completed" | "current" | "pending" | "overdue";
  completedAt?: string;
  completedBy?: string;
  isFormStep?: boolean;
  isApprovalStep?: boolean;
  formData?: FormFieldData[];
  approvalData?: ApprovalData;
}

const mockFlow = {
  id: "FLW-001",
  name: "Solicitação de Férias",
  category: "Recursos Humanos",
  status: "em_andamento",
  startDate: "05/01/2026",
  startedBy: "Maria Santos",
  description:
    "Processo para solicitar período de férias com aprovação do gestor direto e validação do RH.",
};

const mockTimeline: TimelineStep[] = [
  {
    id: 1,
    name: "Preenchimento da Solicitação",
    status: "completed",
    completedAt: "05/01/2026 10:30",
    completedBy: "Maria Santos",
    isFormStep: true,
    formData: [
      { label: "Nome do Colaborador", value: "Maria Santos", type: "text" },
      { label: "Filial", value: "São Paulo - Matriz", type: "select" },
      { label: "Departamento", value: "Recursos Humanos", type: "select" },
      { label: "Cargo", value: "Analista de RH Sênior", type: "text" },
      { label: "Data Início das Férias", value: "15/02/2026", type: "date" },
      { label: "Data Fim das Férias", value: "01/03/2026", type: "date" },
      { label: "Quantidade de Dias", value: "15 dias úteis", type: "text" },
      { label: "Tipo de Férias", value: "Férias Regulares", type: "select" },
      { label: "Observações", value: "Viagem programada com a família. Estarei indisponível por telefone entre os dias 20/02 e 25/02.", type: "textarea" },
      { label: "Comprovante de Saldo", value: "comprovante_saldo_ferias.pdf", type: "file" },
    ],
  },
  {
    id: 2,
    name: "Aprovação do Gestor",
    status: "completed",
    completedAt: "06/01/2026 14:45",
    completedBy: "Carlos Oliveira",
    isApprovalStep: true,
    approvalData: {
      approved: true,
      observation: "Aprovado. Período solicitado não conflita com entregas do projeto.",
    },
  },
  {
    id: 3,
    name: "Validação do RH",
    status: "current",
    isApprovalStep: true,
  },
  {
    id: 4,
    name: "Aprovação Diretoria",
    status: "pending",
    isApprovalStep: true,
  },
  {
    id: 5,
    name: "Conclusão",
    status: "pending",
  },
];

const mockHistory = [
  {
    id: 1,
    user: "Maria Santos",
    action: "Iniciou o flow",
    date: "05/01/2026 10:15",
  },
  {
    id: 2,
    user: "Maria Santos",
    action: "Preencheu o formulário de solicitação",
    date: "05/01/2026 10:30",
  },
  {
    id: 3,
    user: "Sistema",
    action: "Etapa enviada para aprovação do gestor",
    date: "05/01/2026 10:31",
  },
];

const stepStatusIcons = {
  completed: CheckCircle2,
  current: Clock,
  pending: Circle,
  overdue: AlertCircle,
};

const stepStatusColors = {
  completed: "text-status-success",
  current: "text-status-warning",
  pending: "text-muted-foreground",
  overdue: "text-status-danger",
};

export default function FlowDetailPage() {
  const { flowId } = useParams();
  const [activeStep, setActiveStep] = useState<number | null>(2);
  const [showHistory, setShowHistory] = useState(false);

  const currentStep = mockTimeline.find((s) => s.id === activeStep);

  return (
    <AppLayout>
      {/* Back Button */}
      <Link
        to="/flows"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Meus Flows
      </Link>

      {/* Flow Header */}
      <div className="card-elevated p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-sm text-muted-foreground">
                {mockFlow.id}
              </span>
              <StatusBadge status="warning" label="Em Andamento" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{mockFlow.name}</h1>
            <p className="text-muted-foreground mt-1">{mockFlow.description}</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Iniciado por: {mockFlow.startedBy}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Data: {mockFlow.startDate}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>Categoria: {mockFlow.category}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-1">
          <div className="card-elevated p-6">
            <h2 className="font-semibold text-foreground mb-6">Etapas do Flow</h2>
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-border" />

              {/* Steps */}
              <div className="space-y-6">
                {mockTimeline.map((step, index) => {
                  const Icon = stepStatusIcons[step.status];
                  const isActive = activeStep === step.id;

                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
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
                          step.status === "completed" && "bg-status-success-light",
                          step.status === "current" && "bg-status-warning-light",
                          step.status === "overdue" && "bg-status-danger-light",
                          step.status === "pending" && "bg-muted"
                        )}
                      >
                        <Icon
                          className={cn("w-5 h-5", stepStatusColors[step.status])}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-1">
                        <p
                          className={cn(
                            "font-medium text-sm",
                            step.status === "pending"
                              ? "text-muted-foreground"
                              : "text-foreground"
                          )}
                        >
                          {step.name}
                        </p>
                        {step.completedAt && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {step.completedBy} • {step.completedAt}
                          </p>
                        )}
                        {step.status === "overdue" && (
                          <p className="text-xs text-status-danger mt-0.5">
                            Prazo excedido
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Step Detail */}
        <div className="lg:col-span-2 space-y-6">
          {currentStep && (
            <div className="card-elevated p-6 animate-fade-in">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-semibold text-lg text-foreground">
                    {currentStep.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <StatusBadge
                      status={
                        currentStep.status === "completed"
                          ? "success"
                          : currentStep.status === "overdue"
                          ? "danger"
                          : currentStep.status === "current"
                          ? "warning"
                          : "neutral"
                      }
                      label={
                        currentStep.status === "completed"
                          ? "Concluída"
                          : currentStep.status === "overdue"
                          ? "Atrasada"
                          : currentStep.status === "current"
                          ? "Em Andamento"
                          : "Pendente"
                      }
                    />
                    {currentStep.isApprovalStep && (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-full font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Etapa de Aprovação
                      </span>
                    )}
                    {currentStep.isFormStep && (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full font-medium">
                        <FileText className="w-3.5 h-3.5" />
                        Etapa de Formulário
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Approval Form - Enhanced UI */}
              {currentStep.isApprovalStep && currentStep.status !== "completed" && (
                <div className="space-y-6">
                  {/* Approval header */}
                  <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Aguardando sua decisão</p>
                      <p className="text-sm text-muted-foreground">
                        Analise os dados abaixo e informe sua aprovação ou reprovação
                      </p>
                    </div>
                  </div>

                  {/* Previous data display */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Dados da Solicitação
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Colaborador</dt>
                        <dd className="font-medium text-foreground">Maria Santos</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Período</dt>
                        <dd className="font-medium text-foreground">
                          15/02/2026 a 01/03/2026
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Dias</dt>
                        <dd className="font-medium text-foreground">15 dias úteis</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Tipo</dt>
                        <dd className="font-medium text-foreground">Férias Regulares</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Approval decision */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Sua Decisão</Label>
                    <RadioGroup defaultValue="approve" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Label
                        htmlFor="approve"
                        className="flex items-center gap-3 p-4 rounded-lg border-2 border-status-success/30 bg-status-success-light cursor-pointer hover:border-status-success transition-colors [&:has([data-state=checked])]:border-status-success [&:has([data-state=checked])]:ring-2 [&:has([data-state=checked])]:ring-status-success/20"
                      >
                        <RadioGroupItem value="approve" id="approve" className="sr-only" />
                        <ThumbsUp className="w-6 h-6 text-status-success" />
                        <div>
                          <p className="font-semibold text-foreground">Aprovar</p>
                          <p className="text-xs text-muted-foreground">Concordo com a solicitação</p>
                        </div>
                      </Label>
                      <Label
                        htmlFor="reject"
                        className="flex items-center gap-3 p-4 rounded-lg border-2 border-status-danger/30 bg-status-danger-light cursor-pointer hover:border-status-danger transition-colors [&:has([data-state=checked])]:border-status-danger [&:has([data-state=checked])]:ring-2 [&:has([data-state=checked])]:ring-status-danger/20"
                      >
                        <RadioGroupItem value="reject" id="reject" className="sr-only" />
                        <ThumbsDown className="w-6 h-6 text-status-danger" />
                        <div>
                          <p className="font-semibold text-foreground">Não Aprovar</p>
                          <p className="text-xs text-muted-foreground">Tenho ressalvas ou discordo</p>
                        </div>
                      </Label>
                    </RadioGroup>
                  </div>

                  {/* Observation field */}
                  <div className="space-y-2">
                    <Label htmlFor="observation">
                      Observação
                      <span className="text-muted-foreground font-normal ml-1">
                        (obrigatória em caso de não aprovação)
                      </span>
                    </Label>
                    <Textarea
                      id="observation"
                      placeholder="Justifique sua decisão ou adicione comentários relevantes..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                    <Button variant="outline">Retornar Etapa</Button>
                    <Button className="min-w-[140px]">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Confirmar Decisão
                    </Button>
                  </div>
                </div>
              )}

              {currentStep.isFormStep && currentStep.status !== "completed" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="period-start">Data Início</Label>
                      <Input id="period-start" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="period-end">Data Fim</Label>
                      <Input id="period-end" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      placeholder="Informações adicionais..."
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Button variant="outline">Retornar Etapa</Button>
                    <Button>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Enviar
                    </Button>
                  </div>
                </div>
              )}

              {currentStep.status === "completed" && (
                <div className="space-y-6">
                  {/* Approval step completed - show approval result */}
                  {currentStep.isApprovalStep && currentStep.approvalData && (
                    <>
                      {/* Approval result badge */}
                      <div
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border",
                          currentStep.approvalData.approved
                            ? "bg-status-success-light border-status-success/20"
                            : "bg-status-danger-light border-status-danger/20"
                        )}
                      >
                        {currentStep.approvalData.approved ? (
                          <ThumbsUp className="w-6 h-6 text-status-success flex-shrink-0" />
                        ) : (
                          <ThumbsDown className="w-6 h-6 text-status-danger flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {currentStep.approvalData.approved ? "Aprovado" : "Não Aprovado"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Por {currentStep.completedBy} em {currentStep.completedAt}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-semibold",
                            currentStep.approvalData.approved
                              ? "bg-status-success/20 text-status-success"
                              : "bg-status-danger/20 text-status-danger"
                          )}
                        >
                          {currentStep.approvalData.approved ? "APROVADO" : "REPROVADO"}
                        </div>
                      </div>

                      {/* Observation if present */}
                      {currentStep.approvalData.observation && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Observação do Aprovador
                          </h3>
                          <div className="bg-muted/30 rounded-lg border border-border p-4">
                            <p className="text-sm text-foreground whitespace-pre-wrap">
                              {currentStep.approvalData.observation}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Form step completed - show form data */}
                  {currentStep.isFormStep && (
                    <>
                      {/* Completion badge */}
                      <div className="flex items-center gap-3 p-4 bg-status-success-light rounded-lg border border-status-success/20">
                        <CheckCircle2 className="w-6 h-6 text-status-success flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">Etapa concluída</p>
                          <p className="text-sm text-muted-foreground">
                            Por {currentStep.completedBy} em {currentStep.completedAt}
                          </p>
                        </div>
                      </div>

                      {/* Form data display */}
                      {currentStep.formData && currentStep.formData.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Informações Preenchidas
                          </h3>
                          <div className="bg-muted/30 rounded-lg border border-border overflow-hidden">
                            <dl className="divide-y divide-border">
                              {currentStep.formData.map((field, index) => (
                                <div
                                  key={index}
                                  className={cn(
                                    "px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4",
                                    index % 2 === 0 ? "bg-transparent" : "bg-muted/20"
                                  )}
                                >
                                  <dt className="text-sm text-muted-foreground font-medium">
                                    {field.label}
                                  </dt>
                                  <dd className="text-sm text-foreground sm:col-span-2">
                                    {field.type === "file" ? (
                                      <button className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group">
                                        <Paperclip className="w-4 h-4" />
                                        <span className="underline underline-offset-2">
                                          {field.value}
                                        </span>
                                        <Download className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </button>
                                    ) : field.type === "textarea" ? (
                                      <p className="whitespace-pre-wrap">{field.value}</p>
                                    ) : (
                                      <span className="font-medium">{field.value}</span>
                                    )}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Generic completion (no form, no approval) */}
                  {!currentStep.isFormStep && !currentStep.isApprovalStep && (
                    <div className="flex items-center gap-3 p-4 bg-status-success-light rounded-lg border border-status-success/20">
                      <CheckCircle2 className="w-6 h-6 text-status-success flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Etapa concluída</p>
                        <p className="text-sm text-muted-foreground">
                          Por {currentStep.completedBy} em {currentStep.completedAt}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep.status === "pending" && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-3" />
                  <p>Esta etapa ainda não foi liberada</p>
                  <p className="text-sm">Aguardando conclusão das etapas anteriores</p>
                </div>
              )}
            </div>
          )}

          {/* History Section */}
          <div className="card-elevated">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  Histórico do Flow
                </span>
              </div>
              {showHistory ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {showHistory && (
              <div className="px-4 pb-4 animate-fade-in">
                <div className="border-t border-border pt-4 space-y-4">
                  {mockHistory.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium text-foreground">
                            {entry.user}
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {entry.action}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {entry.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
