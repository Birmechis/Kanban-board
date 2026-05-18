export type Task = {
  id: string;
  title: string;
  columnId: string;
};

export type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

export type Board = {
  id: string;
  title: string;
  columnIds: string[];
  updatedAt: string;
  description: string;
  color: string;
  taskCount: number;
  icon: string;
};
