import { useState, useEffect } from "react";
import { Todo } from "../types";
import { TodoService } from "../services/todoService";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const fetchTodos = async () => {
    try {
      const data = await TodoService.getAll();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const addTodo = async (title: string) => {
    if (title.trim() === "") return;

    try {
      const newTodo = await TodoService.create({ title: title.trim() });
      setTodos((prev) => [...prev, newTodo]);
      setInputValue("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const updatedTodo = await TodoService.toggleComplete(id, !completed);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const clearCompleted = async () => {
    try {
      const completedTodos = todos.filter((todo) => todo.completed);

      
      await Promise.all(
        completedTodos.map((todo) => TodoService.delete(todo.id))
      );

      
      setTodos((prev) => prev.filter((todo) => !todo.completed));
    } catch (error) {
      console.error("Failed to clear completed todos:", error);
    }
  };

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingValue(currentTitle);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const saveEdit = async (id: string) => {
    if (editingValue.trim() === "") {
      cancelEditing();
      return;
    }

    try {
      const updatedTodo = await TodoService.update(id, { title: editingValue.trim() });
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      cancelEditing();
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      saveEdit(id);
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo(inputValue);
  };

  
  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const hasCompletedTodos = todos.some((todo) => todo.completed);

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    
    todos,
    inputValue,
    setInputValue,
    editingId,
    editingValue,
    setEditingValue,
    
    addTodo,
    toggleTodo,
    clearCompleted,
    handleSubmit,
    startEditing,
    saveEdit,
    cancelEditing,
    handleEditKeyDown,
    
    remainingCount,
    hasCompletedTodos,
  };
}