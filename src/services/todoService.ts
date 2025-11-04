import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class TodoService {
  static async getAll(): Promise<Todo[]> {
    const response = await fetch(`${API_URL}/todos`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
  }

  static async getById(id: string): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch todo with id: ${id}`);
    }
    return response.json();
  }

  static async create(todo: CreateTodoRequest): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    return response.json();
  }

  static async update(id: string, updates: UpdateTodoRequest): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error(`Failed to update todo with id: ${id}`);
    }
    return response.json();
  }

  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete todo with id: ${id}`);
    }
  }

  static async deleteAll(): Promise<void> {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete all todos');
    }
  }

  static async toggleComplete(id: string, completed: boolean): Promise<Todo> {
    return this.update(id, { completed });
  }
}