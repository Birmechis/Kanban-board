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
