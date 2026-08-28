"use client";

import { useState, type SubmitEvent } from "react";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  TODO_CATEGORIES,
  type TodoCategory,
} from "@/lib/categories";
import type { TodoPriority } from "@/lib/todos";

type TodoFormProps = {
  initialTitle?: string;
  initialDueDate?: string | null;
  initialPriority?: TodoPriority;
  initialCategory?: TodoCategory;
  titlePlaceholder?: string;
  submitLabel: string;
  onSubmitAction: (
    title: string,
    dueDate: string | null,
    priority: TodoPriority,
    category: TodoCategory
  ) => void;
  onCancelAction?: () => void;
  autoFocus?: boolean;
};

const fieldClasses =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
const labelClasses = "mb-1 block text-xs font-medium text-zinc-500";

export default function TodoForm({
  initialTitle = "",
  initialDueDate = "",
  initialPriority = "medium",
  initialCategory = "personal",
  titlePlaceholder = "What do you need to do?",
  submitLabel,
  onSubmitAction,
  onCancelAction,
  autoFocus,
}: TodoFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [dueDate, setDueDate] = useState(initialDueDate ?? "");
  const [priority, setPriority] = useState<TodoPriority>(initialPriority);
  const [category, setCategory] = useState<TodoCategory>(initialCategory);

  const trimmedTitle = title.trim();
  const isEditing = Boolean(onCancelAction);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmedTitle) return;

    onSubmitAction(trimmedTitle, dueDate || null, priority, category);

    if (!isEditing) {
      setTitle("");
      setDueDate("");
      setPriority("medium");
      setCategory("personal");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
    >
      <div>
        <label htmlFor="todo-title" className={labelClasses}>
          Task
        </label>
        <input
          id="todo-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={titlePlaceholder}
          autoFocus={autoFocus}
          className={`${fieldClasses} text-base placeholder:text-zinc-400`}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:items-end">
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="todo-due-date" className={labelClasses}>
            Due date
          </label>
          <input
            id="todo-due-date"
            type="date"
            lang="en-CA"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className={`${fieldClasses} min-w-0`}
          />
        </div>
        <div>
          <label htmlFor="todo-priority" className={labelClasses}>
            Priority
          </label>
          <select
            id="todo-priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TodoPriority)
            }
            className={fieldClasses}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="todo-category" className={labelClasses}>
            Category
          </label>
          <select
            id="todo-category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as TodoCategory)
            }
            className={fieldClasses}
            style={{
              backgroundColor: CATEGORY_COLORS[category].bg,
              color: CATEGORY_COLORS[category].text,
            }}
          >
            {TODO_CATEGORIES.map((value) => (
              <option
                key={value}
                value={value}
                style={{
                  backgroundColor: CATEGORY_COLORS[value].bg,
                  color: CATEGORY_COLORS[value].text,
                }}
              >
                {CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 flex justify-end gap-2">
        {onCancelAction && (
          <button
            type="button"
            onClick={onCancelAction}
            className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!trimmedTitle}
          title={!trimmedTitle ? "Enter a task title first" : undefined}
          className={`rounded-lg px-4 py-1.5 text-sm font-semibold text-white transition ${
            trimmedTitle
              ? "cursor-pointer bg-indigo-600 hover:bg-indigo-500"
              : "cursor-not-allowed bg-zinc-300"
          }`}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
