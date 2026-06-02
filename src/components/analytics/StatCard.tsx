import { Card } from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card padding="md" hover>
      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
        {label}
      </p>
    </Card>
  );
}
