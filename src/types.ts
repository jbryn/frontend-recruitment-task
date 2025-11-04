export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export type CreateTodoRequest = {
  title: string;
};

export type UpdateTodoRequest = {
  title?: string;
  completed?: boolean;
};