interface StatCardProps {
  label: string;
  value: string;
  color: 'blue' | 'orange' | 'purple' | 'green';
  icon: string;
}

const colorClasses = {
  blue: 'bg-blue-50 border-blue-100 text-blue-700',
  orange: 'bg-orange-50 border-orange-100 text-orange-700',
  purple: 'bg-purple-50 border-purple-100 text-purple-700',
  green: 'bg-green-50 border-green-100 text-green-700',
};

export default function StatCard({ label, value, color, icon }: StatCardProps) {
  return (
    <div className={`rounded-xl p-5 border shadow-sm ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
