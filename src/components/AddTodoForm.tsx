"use client";

import { useState, type SubmitEvent } from "react";

type AddTodoFormProps = {
  onAddAction: (title: string) => void;
};

export default function AddTodoForm({ onAddAction }: AddTodoFormProps) {
  const [title, setTitle] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    onAddAction(trimmedTitle);
    setTitle("");
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Add a new todo"
        className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-950"
      />
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
