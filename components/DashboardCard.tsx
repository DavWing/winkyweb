interface DashboardCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
  highlight?: boolean;
}

export default function DashboardCard({
  title,
  value,
  icon,
  color,
  highlight,
}: DashboardCardProps) {
  return (
    <div
      className={`rounded-lg shadow-sm border border-[#e4f2fc] p-4 sm:p-6 transition-all ${
        highlight ? 'ring-2 ring-[#fcedf2] scale-105' : ''
      } ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="text-3xl sm:text-4xl">{icon}</div>
      </div>
    </div>
  );
}
