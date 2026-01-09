import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Bell,
  Palette,
  Shield,
  Mail,
  Smartphone,
} from "lucide-react";

export default function ConfigPage() {
  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas preferências e configurações de conta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card-elevated p-2">
            <nav className="space-y-1">
              {[
                { icon: User, label: "Perfil", active: true },
                { icon: Bell, label: "Notificações", active: false },
                { icon: Palette, label: "Aparência", active: false },
                { icon: Shield, label: "Segurança", active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className="card-elevated p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Perfil</h2>
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">João Silva</p>
                <p className="text-sm text-muted-foreground">
                  joao.silva@empresa.com
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Alterar foto
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" defaultValue="João Silva" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" defaultValue="joao.silva@empresa.com" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input id="department" defaultValue="Tecnologia" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                <Input id="role" defaultValue="Analista de Sistemas" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button>Salvar alterações</Button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="card-elevated p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Notificações
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">E-mail</p>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações por e-mail
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Push</p>
                    <p className="text-sm text-muted-foreground">
                      Notificações no navegador
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-status-danger/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-status-danger" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Etapas atrasadas</p>
                    <p className="text-sm text-muted-foreground">
                      Alertas para prazos vencidos
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
