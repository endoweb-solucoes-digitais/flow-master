import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Seg", iniciados: 12, concluidos: 8 },
  { name: "Ter", iniciados: 19, concluidos: 15 },
  { name: "Qua", iniciados: 14, concluidos: 12 },
  { name: "Qui", iniciados: 22, concluidos: 18 },
  { name: "Sex", iniciados: 16, concluidos: 14 },
  { name: "Sáb", iniciados: 5, concluidos: 4 },
  { name: "Dom", iniciados: 2, concluidos: 1 },
];

export function WeeklyChart() {
  return (
    <div className="card-elevated p-6 h-[320px]">
      <h3 className="font-semibold text-foreground mb-4">Flows da Semana</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-sm text-muted-foreground capitalize">{value}</span>
            )}
          />
          <Bar
            dataKey="iniciados"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            name="Iniciados"
          />
          <Bar
            dataKey="concluidos"
            fill="hsl(var(--status-success))"
            radius={[4, 4, 0, 0]}
            name="Concluídos"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
