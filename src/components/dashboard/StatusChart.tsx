import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Concluídos", value: 45, color: "hsl(142, 71%, 45%)" },
  { name: "Em Andamento", value: 28, color: "hsl(38, 92%, 50%)" },
  { name: "Atrasados", value: 8, color: "hsl(0, 84%, 60%)" },
  { name: "Aguardando", value: 19, color: "hsl(215, 16%, 47%)" },
];

export function StatusChart() {
  return (
    <div className="card-elevated p-6 h-[320px]">
      <h3 className="font-semibold text-foreground mb-4">Status dos Flows</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-sm text-muted-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
