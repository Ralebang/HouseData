// Yhden tehtävän tietorakenne
export type Task = {
  id: string;
  title: string;
  description: string | null;
  responsible_person: string | null;
  deadline: string | null;
  priority: string | null;
  status: string | null;
};
