import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FlowTimeline, type TimelineStepData } from "@/components/flow-detail/FlowTimeline";
import { FlowActivityLog, type ActivityLogEntry } from "@/components/flow-detail/FlowActivityLog";
import { FlowGanttChart } from "@/components/flow-detail/FlowGanttChart";
import {
  ArrowLeft,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  Lock,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

// Mock data covering ALL possible statuses
const mockTimeline: TimelineStepData[] = [
  // 1. FORMULÁRIO - Concluído
  {
    id: 1,
    name: "Preenchimento da Solicitação",
    status: "completed",
    completedAt: "05/01/2026 10:30",
    completedBy: "Maria Santos",
    startDate: "05/01/2026 10:00",
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
  // 2. APROVAÇÃO - Aprovado
  {
    id: 2,
    name: "Aprovação do Gestor",
    status: "completed",
    completedAt: "06/01/2026 14:45",
    completedBy: "Carlos Oliveira",
    startDate: "05/01/2026 10:31",
    isApprovalStep: true,
    approvalData: {
      approved: true,
      observation: "Aprovado. Período solicitado não conflita com entregas do projeto. Boa viagem!",
    },
  },
  // 3. APROVAÇÃO - Reprovado
  {
    id: 3,
    name: "Validação do RH",
    status: "completed",
    completedAt: "07/01/2026 09:20",
    completedBy: "Ana Paula Ferreira",
    startDate: "06/01/2026 14:46",
    isApprovalStep: true,
    approvalData: {
      approved: false,
      observation: "Não aprovado. O colaborador não possui saldo de férias suficiente para o período solicitado. Favor verificar o extrato atualizado e submeter nova solicitação com período adequado ao saldo disponível (máximo 10 dias).",
    },
  },
  // 4. FORMULÁRIO - Em Andamento (current)
  {
    id: 4,
    name: "Correção da Solicitação",
    status: "current",
    startDate: "07/01/2026 09:21",
    dueDate: "10/01/2026",
    isFormStep: true,
  },
  // 5. FORMULÁRIO - Atrasado (overdue)
  {
    id: 5,
    name: "Anexar Documentos Adicionais",
    status: "overdue",
    startDate: "08/01/2026",
    dueDate: "09/01/2026",
    isFormStep: true,
  },
  // 6. APROVAÇÃO - Liberado (available)
  {
    id: 6,
    name: "Reavaliação do Gestor",
    status: "available",
    startDate: "10/01/2026",
    isApprovalStep: true,
  },
  // 7. FORMULÁRIO - Aguardando (waiting)
  {
    id: 7,
    name: "Confirmação de Recebimento",
    status: "waiting",
    isFormStep: true,
  },
  // 8. APROVAÇÃO - Aguardando
  {
    id: 8,
    name: "Aprovação Final Diretoria",
    status: "waiting",
    isApprovalStep: true,
  },
  // 9. Etapa genérica - Pendente
  {
    id: 9,
    name: "Conclusão e Arquivamento",
    status: "pending",
  },
];

// Complete activity log
const mockActivityLog: ActivityLogEntry[] = [
  {
    id: 1,
    user: "Maria Santos",
    action: "iniciou o flow",
    date: "05/01/2026 10:00",
    type: "start",
    stepName: "Solicitação de Férias",
  },
  {
    id: 2,
    user: "Maria Santos",
    action: "preencheu o formulário",
    date: "05/01/2026 10:30",
    type: "submit",
    stepName: "Preenchimento da Solicitação",
  },
  {
    id: 3,
    user: "Sistema",
    action: "enviou para aprovação",
    date: "05/01/2026 10:31",
    type: "send",
    stepName: "Aprovação do Gestor",
  },
  {
    id: 4,
    user: "Carlos Oliveira",
    action: "aprovou a solicitação",
    date: "06/01/2026 14:45",
    type: "approve",
    stepName: "Aprovação do Gestor",
    details: "Período não conflita com entregas do projeto",
  },
  {
    id: 5,
    user: "Sistema",
    action: "enviou para validação",
    date: "06/01/2026 14:46",
    type: "send",
    stepName: "Validação do RH",
  },
  {
    id: 6,
    user: "Ana Paula Ferreira",
    action: "reprovou a solicitação",
    date: "07/01/2026 09:20",
    type: "reject",
    stepName: "Validação do RH",
    details: "Saldo de férias insuficiente para o período",
  },
  {
    id: 7,
    user: "Sistema",
    action: "solicitou correção",
    date: "07/01/2026 09:21",
    type: "return",
    stepName: "Correção da Solicitação",
  },
  {
    id: 8,
    user: "Sistema",
    action: "identificou atraso na etapa",
    date: "10/01/2026 00:00",
    type: "delay",
    stepName: "Anexar Documentos Adicionais",
    details: "Prazo excedido em 09/01/2026",
  },
];

const statusLabels: Record<TimelineStepData["status"], string> = {
  completed: "Concluída",
  current: "Em Andamento",
  waiting: "Aguardando",
  available: "Liberada",
  overdue: "Atrasada",
  pending: "Pendente",
};

const statusBadgeTypes: Record<TimelineStepData["status"], "success" | "warning" | "danger" | "neutral" | "info"> = {
  completed: "success",
  current: "warning",
  waiting: "neutral",
  available: "info",
  overdue: "danger",
  pending: "neutral",
};

export default function FlowDetailPage() {
  const { flowId } = useParams();
  const [activeStep, setActiveStep] = useState<number | null>(1);

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
          <FlowTimeline
            steps={mockTimeline}
            activeStepId={activeStep}
            onStepSelect={setActiveStep}
          />
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
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <StatusBadge
                      status={statusBadgeTypes[currentStep.status]}
                      label={statusLabels[currentStep.status]}
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
                    {currentStep.dueDate && currentStep.status !== "completed" && (
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium",
                        currentStep.status === "overdue" 
                          ? "bg-status-danger-light text-status-danger"
                          : "bg-muted text-muted-foreground"
                      )}>
                        <Clock className="w-3.5 h-3.5" />
                        Prazo: {currentStep.dueDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* COMPLETED STEP */}
              {currentStep.status === "completed" && (
                <div className="space-y-6">
                  {/* Approval step completed */}
                  {currentStep.isApprovalStep && currentStep.approvalData && (
                    <>
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

                  {/* Form step completed */}
                  {currentStep.isFormStep && (
                    <>
                      <div className="flex items-center gap-3 p-4 bg-status-success-light rounded-lg border border-status-success/20">
                        <CheckCircle2 className="w-6 h-6 text-status-success flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">Etapa concluída</p>
                          <p className="text-sm text-muted-foreground">
                            Por {currentStep.completedBy} em {currentStep.completedAt}
                          </p>
                        </div>
                      </div>

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

                  {/* Generic completion */}
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

              {/* CURRENT / IN PROGRESS STEP */}
              {currentStep.status === "current" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-status-warning-light rounded-lg border border-status-warning/20">
                    <Clock className="w-6 h-6 text-status-warning flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Em andamento</p>
                      <p className="text-sm text-muted-foreground">
                        Aguardando ação do responsável
                      </p>
                    </div>
                  </div>

                  {currentStep.isFormStep && (
                    <div className="space-y-4">
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
                        <Button variant="outline">Salvar Rascunho</Button>
                        <Button>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Enviar
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep.isApprovalStep && (
                    <ApprovalForm />
                  )}
                </div>
              )}

              {/* OVERDUE STEP */}
              {currentStep.status === "overdue" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-status-danger-light rounded-lg border border-status-danger/20">
                    <AlertCircle className="w-6 h-6 text-status-danger flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Etapa atrasada</p>
                      <p className="text-sm text-muted-foreground">
                        Prazo excedido em {currentStep.dueDate} - Ação imediata necessária
                      </p>
                    </div>
                  </div>

                  {currentStep.isFormStep && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="file">Anexar Documento</Label>
                        <Input id="file" type="file" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="justification">Justificativa do Atraso</Label>
                        <Textarea
                          id="justification"
                          placeholder="Explique o motivo do atraso..."
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <Button>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Enviar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AVAILABLE / READY TO START */}
              {currentStep.status === "available" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <PlayCircle className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Pronta para iniciar</p>
                      <p className="text-sm text-muted-foreground">
                        Todas as etapas anteriores foram concluídas
                      </p>
                    </div>
                  </div>

                  {currentStep.isApprovalStep && (
                    <ApprovalForm />
                  )}

                  {currentStep.isFormStep && (
                    <div className="text-center py-4">
                      <Button size="lg">
                        <PlayCircle className="w-5 h-5 mr-2" />
                        Iniciar Preenchimento
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* WAITING */}
              {currentStep.status === "waiting" && (
                <div className="text-center py-8 text-muted-foreground">
                  <Lock className="w-12 h-12 mx-auto mb-3" />
                  <p className="font-medium">Aguardando etapas anteriores</p>
                  <p className="text-sm mt-1">
                    Esta etapa será liberada após a conclusão das etapas pendentes
                  </p>
                </div>
              )}

              {/* PENDING */}
              {currentStep.status === "pending" && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-3" />
                  <p className="font-medium">Etapa pendente</p>
                  <p className="text-sm mt-1">
                    Esta etapa ainda não foi definida no fluxo
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Gantt Chart */}
          <FlowGanttChart 
            steps={mockTimeline} 
            flowStartDate={mockFlow.startDate}
          />

          {/* Activity Log */}
          <FlowActivityLog entries={mockActivityLog} />
        </div>
      </div>
    </AppLayout>
  );
}

// Approval Form Component
function ApprovalForm() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <div>
          <p className="font-medium text-foreground">Aguardando sua decisão</p>
          <p className="text-sm text-muted-foreground">
            Analise os dados e informe sua aprovação ou reprovação
          </p>
        </div>
      </div>

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
            <dd className="font-medium text-foreground">15/02/2026 a 01/03/2026</dd>
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

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline">Retornar Etapa</Button>
        <Button className="min-w-[140px]">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Confirmar Decisão
        </Button>
      </div>
    </div>
  );
}
