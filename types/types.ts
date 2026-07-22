export type Task = {
  id: string;
  title: string;
  columnId: string;
  description?: string;
  tag?: 'Design' | 'Development' | 'Bug' | 'Task';
  dueDate?: string;
  assignee?: string;
  completed?: boolean;
  priority?: 'Low' | 'Medium' | 'High';
  boardId: string;
  createdAt: string;
};


export type Column = {
  id: string;
  title: string;
  taskIds: string[];
  boardId: string;
  color: string
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
export type User = {
  id: string;
  email: string;
  name: string;
  token?: string;
}
export type LoginCredentials = {
  email: string;
  password: string;
};
export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}