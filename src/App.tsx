import { clsx } from "clsx";
import { Toaster } from "react-hot-toast";
import { useTodos } from "./hooks/useTodos";

export function App() {
  const {
    todos,
    inputValue,
    setInputValue,
    editingId,
    editingValue,
    setEditingValue,
    toggleTodo,
    clearCompleted,
    handleSubmit,
    startEditing,
    handleEditKeyDown,
    remainingCount,
    hasCompletedTodos,
    isLoading,
    isAdding,
  } = useTodos();

  return (
    <main
      className="mx-auto flex max-w-xl flex-col gap-4 p-4"
      role="main"
      aria-label="Todo application"
    >
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-todo-input" className="sr-only">
          Add a new todo item
        </label>
        <input
          id="new-todo-input"
          placeholder={isAdding ? "Adding..." : "What needs to be done?"}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isAdding}
          aria-label="Add a new todo item"
          className={clsx(
            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
            isAdding && "opacity-50 cursor-not-allowed",
          )}
        />
      </form>

      <fieldset>
        <legend className="text-base font-semibold leading-6 text-gray-900">
          Todo list
        </legend>
        <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">
              <div className="inline-flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
                Loading todos...
              </div>
            </div>
          ) : todos.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No todos yet. Add one above to get started!
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                data-testid="todo-item"
                className={clsx(
                  "relative flex items-start py-4",
                  todo.completed && "line-through",
                )}
              >
                <div className="min-w-0 flex-1 text-sm leading-6">
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                      onBlur={() =>
                        handleEditKeyDown(
                          { key: "Enter" } as React.KeyboardEvent,
                          todo.id,
                        )
                      }
                      autoFocus
                      aria-label="Edit todo text"
                      title="Press Enter to save, Escape to cancel"
                      className="w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  ) : (
                    <div
                      className="select-none font-medium text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 rounded px-1 py-0.5 w-fit"
                      data-testid="todo-title"
                      tabIndex={0}
                      role="button"
                      aria-label={`Edit todo: ${todo.title}. Press Enter or Space to edit, or double-click.`}
                      onDoubleClick={() => startEditing(todo.id, todo.title)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          startEditing(todo.id, todo.title);
                        }
                      }}
                    >
                      {todo.title}
                    </div>
                  )}
                </div>
                <div className="ml-3 flex h-6 items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                    aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </fieldset>

      <div
        className="flex h-8 items-center justify-between"
        role="status"
        aria-live="polite"
      >
        <span
          data-testid="todo-count"
          className="text-sm font-medium leading-6 text-gray-900"
          aria-label={`${remainingCount} ${remainingCount === 1 ? "item" : "items"} remaining`}
        >
          {remainingCount} items left
        </span>
        {hasCompletedTodos && (
          <button
            onClick={clearCompleted}
            aria-label="Clear all completed todos"
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-600"
          >
            Clear completed
          </button>
        )}
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#10b981",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />
    </main>
  );
}
