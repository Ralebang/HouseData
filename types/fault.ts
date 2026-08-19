export type Fault = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  reporter: string | null;
  priority: string | null;
  status: string | null;
  created_at: string;
};
