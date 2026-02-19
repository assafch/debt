import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  data: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
  'לא שולם': '#ef4444',
  'בתהליך גבייה': '#3b82f6',
  'שולם חלקית': '#f59e0b',
  'שולם': '#22c55e',
  'בוטל': '#9ca3af',
};

export default function StatusChart({ data }: Props) {
  const chartData = Object.entries(data)
    .filter(([, count]) => count > 0)
    .map(([name, value]) => ({ name, value }));

  if (chartData.length === 0) {
    return <p className="text-center text-gray-400 py-10">אין נתונים</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={70}
          label={({ name, value }) => `${name}: ${value}`}
          labelLine={false}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={index}
              fill={STATUS_COLORS[entry.name] || '#8b5cf6'}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
