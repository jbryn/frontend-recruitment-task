import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Todo } from "../types";
import { TodoService } from "../services/todoService";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const data = await TodoService.getAll();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      toast.error("Failed to load todos. Please try again.", {
        id: 'fetch-todos-error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (title: string) => {
    if (title.trim() === "") return;

    setIsAdding(true);
    try {
      const newTodo = await TodoService.create({ title: title.trim() });
      setTodos((prev) => [...prev, newTodo]);
      setInputValue("");
      toast.success("Todo added successfully!");
    } catch (error) {
      console.error("Failed to add todo:", error);
      toast.error("Failed to add todo. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo))
    );

    try {
      const updatedTodo = await TodoService.toggleComplete(id, !completed);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error("Failed to toggle todo:", error);      
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
      );
      toast.error("Failed to update todo. Please try again.");
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter((todo) => todo.completed);
    if (completedTodos.length === 0) return;

    
    setTodos((prev) => prev.filter((todo) => !todo.completed));
    
    try {
      await Promise.all(
        completedTodos.map((todo) => TodoService.delete(todo.id))
      );
      toast.success(`${completedTodos.length} completed ${completedTodos.length === 1 ? 'todo' : 'todos'} cleared!`);
    } catch (error) {
      console.error("Failed to clear completed todos:", error);
      
      setTodos((prev) => [...prev, ...completedTodos]);
      toast.error("Failed to clear completed todos. Please try again.");
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

    const originalTodo = todos.find(todo => todo.id === id);
    if (!originalTodo) return;

    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, title: editingValue.trim() } : todo))
    );
    cancelEditing();

    try {
      const updatedTodo = await TodoService.update(id, { title: editingValue.trim() });
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error("Failed to update todo:", error);      
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? originalTodo : todo))
      );
      toast.error("Failed to update todo. Please try again.");
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
    isLoading,
    isAdding,
  };
}