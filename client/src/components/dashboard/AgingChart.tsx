import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  data: Record<string, number>;
}

const COLORS = ['#22c55e', '#f59e0b', '#f97316', '#ef4444'];
const LABELS: Record<string, string> = {
  '0-30': '0-30 יום',
  '30-60': '30-60 יום',
  '60-90': '60-90 יום',
  '90+': '90+ יום',
};

export default function AgingChart({ data }: Props) {
  const chartData = ['0-30', '30-60', '60-90', '90+'].map((key, i) => ({
    name: LABELS[key] || key,
    value: data[key] || 0,
    color: COLORS[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip formatter={(val) => [`${val} חשבוניות`]} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
