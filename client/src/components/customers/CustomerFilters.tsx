import { PAYMENT_STATUSES, AGING_BUCKETS } from '../../types';

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
  selectedAging: string[];
  onAgingChange: (aging: string[]) => void;
}

function ToggleChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
        active
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
      }`}
    >
      {label}
    </button>
  );
}

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((s) => s !== val) : [...arr, val];
}

const AGING_LABELS: Record<string, string> = {
  '0-30': '0-30 יום',
  '30-60': '30-60 יום',
  '60-90': '60-90 יום',
  '90+': '90+ יום',
};

export default function CustomerFilters({
  search,
  onSearchChange,
  selectedStatuses,
  onStatusChange,
  selectedAging,
  onAgingChange,
}: Props) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="חיפוש לפי שם לקוח או קוד..."
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500 font-medium">סטטוס:</span>
        {PAYMENT_STATUSES.map((s) => (
          <ToggleChip
            key={s.value}
            label={s.label}
            active={selectedStatuses.includes(s.value)}
            onClick={() => onStatusChange(toggle(selectedStatuses, s.value))}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500 font-medium">גיל חוב:</span>
        {AGING_BUCKETS.map((b) => (
          <ToggleChip
            key={b}
            label={AGING_LABELS[b]}
            active={selectedAging.includes(b)}
            onClick={() => onAgingChange(toggle(selectedAging, b))}
          />
        ))}
      </div>

      {(selectedStatuses.length > 0 || selectedAging.length > 0 || search) && (
        <button
          onClick={() => {
            onStatusChange([]);
            onAgingChange([]);
            onSearchChange('');
          }}
          className="text-xs text-blue-600 hover:underline"
        >
          נקה סינון
        </button>
      )}
    </div>
  );
}
