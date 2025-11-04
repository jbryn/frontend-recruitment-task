import { clsx } from "clsx";
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
  } = useTodos();

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <form onSubmit={handleSubmit}>
        <input
          placeholder="What needs to be done?"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </form>

      <fieldset>
        <legend className="text-base font-semibold leading-6 text-gray-900">
          Todo list
        </legend>
        <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
          {todos.map((todo) => (
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
                    className="w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                ) : (
                  <label
                    className="select-none font-medium text-gray-900 cursor-pointer"
                    data-testid="todo-title"
                    onDoubleClick={() => startEditing(todo.id, todo.title)}
                  >
                    {todo.title}
                  </label>
                )}
              </div>
              <div className="ml-3 flex h-6 items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="flex h-8 items-center justify-between">
        <span
          data-testid="todo-count"
          className="text-sm font-medium leading-6 text-gray-900"
        >
          {remainingCount} items left
        </span>
        {hasCompletedTodos && (
          <button
            onClick={clearCompleted}
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}
