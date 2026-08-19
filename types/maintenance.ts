export type Maintenance = {
  id: string;
  title: string;
  description: string | null;
  planned_year: number | null;
  estimated_cost: number | null;
  priority: string | null;
  status: string | null;
  created_at: string;
};
