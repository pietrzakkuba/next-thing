"use client";

import { useState, type SubmitEvent } from "react";
import type { TodoPriority } from "./TodoItem";
import {
  CATEGORY_LABELS,
  TODO_CATEGORIES,
  type TodoCategory,
} from "@/lib/categories";

type AddTodoFormProps = {
  onAddAction: (
    title: string,
    dueDate: string | null,
    priority: TodoPriority,
    category: TodoCategory
  ) => void;
};

export default function AddTodoForm({ onAddAction }: AddTodoFormProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [category, setCategory] = useState<TodoCategory>("personal");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    onAddAction(trimmedTitle, dueDate || null, priority, category);
    setTitle("");
    setDueDate("");
    setPriority("medium");
    setCategory("personal");
  }

  return (
    <form className="flex flex-wrap gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Add a new todo"
        className="min-w-[10rem] flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-950"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
        aria-label="Due date"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-950"
      />
      <select
        value={priority}
        onChange={(event) => setPriority(event.target.value as TodoPriority)}
        aria-label="Priority"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-950"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select
        value={category}
        onChange={(event) =>
          setCategory(event.target.value as TodoCategory)
        }
        aria-label="Category"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-950"
      >
        {TODO_CATEGORIES.map((value) => (
          <option key={value} value={value}>
            {CATEGORY_LABELS[value]}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={!title.trim()}
        className={`rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition ${
          title.trim()
            ? "cursor-pointer hover:bg-zinc-800"
            : "cursor-not-allowed opacity-40"
        }`}
      >
        Add
      </button>
    </form>
  );
}
