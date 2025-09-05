import { useMemo } from "react";
import { Item } from "../../models/models";

interface StatisticsViewProps {
  items: Item[];
}

const EXCLUDED_FIELDS = [
  "id",
  "inventoryId",
  "createdById",
  "createdAt",
  "updatedAt",
];

const StatisticsView: React.FC<StatisticsViewProps> = ({ items }) => {
  const stats = useMemo(() => {
    if (!items.length) return null;

    const total = items.length;

    const numericFields: Record<string, number[]> = {};
    const stringFields: Record<string, string[]> = {};

    items.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        if (EXCLUDED_FIELDS.includes(key)) return;

        if (typeof value === "number") {
          if (!numericFields[key]) numericFields[key] = [];
          numericFields[key].push(value);
        }

        if (typeof value === "string") {
          if (!stringFields[key]) stringFields[key] = [];
          stringFields[key].push(value);
        }
      });
    });

    const numericStats = Object.entries(numericFields).map(
      ([field, values]) => {
        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        return { field, min, max, avg: avg.toFixed(2) };
      }
    );

    const stringStats = Object.entries(stringFields).map(([field, values]) => {
      const freq: Record<string, number> = {};
      values.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
      const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
      return { field, mostUsed: top?.[0], count: top?.[1] };
    });

    return { total, numericStats, stringStats };
  }, [items]);

  if (!stats) {
    return (
      <p className="text-gray-500 dark:text-gray-400">No data available</p>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-4">Statistics</h2>
      <p className="mb-4">Total items: {stats.total}</p>

      {stats.numericStats.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Numeric fields</h3>
          <ul className="space-y-1">
            {stats.numericStats.map((s) => (
              <li key={s.field} className="text-gray-700 dark:text-gray-200">
                <strong>{s.field}:</strong> min {s.min}, max {s.max}, avg{" "}
                {s.avg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.stringStats.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">String fields</h3>
          <ul className="space-y-1">
            {stats.stringStats.map((s) => (
              <li key={s.field} className="text-gray-700 dark:text-gray-200">
                <strong>{s.field}:</strong> most frequent «{s.mostUsed}» (
                {s.count} times)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatisticsView;
