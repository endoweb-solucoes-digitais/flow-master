import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { KpiCard } from "@/components/ui/kpi-card";
import { PendingActionsTable } from "@/components/dashboard/PendingActionsTable";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { WeeklyChart } from "@/components/dashboard/WeeklyChart";
import { NewFlowModal } from "@/components/modals/NewFlowModal";
import { Button } from "@/components/ui/button";
import {
  GitBranch,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plus,
} from "lucide-react";

export default function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral dos seus processos e atividades
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Iniciar novo Flow
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Flows em Andamento"
          value={28}
          subtitle="12 iniciados esta semana"
          icon={GitBranch}
          variant="default"
          trend={{ value: 12, isPositive: true }}
        />
        <KpiCard
          title="Etapas Pendentes"
          value={15}
          subtitle="Aguardando sua ação"
          icon={Clock}
          variant="warning"
        />
        <KpiCard
          title="Etapas Atrasadas"
          value={3}
          subtitle="Requer atenção imediata"
          icon={AlertTriangle}
          variant="danger"
        />
        <KpiCard
          title="Flows Concluídos"
          value={142}
          subtitle="Este mês"
          icon={CheckCircle2}
          variant="success"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <StatusChart />
        <WeeklyChart />
      </div>

      {/* Pending Actions */}
      <PendingActionsTable />

      {/* New Flow Modal */}
      <NewFlowModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AppLayout>
  );
}
