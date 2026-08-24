"use client";

import { useState } from "react";
import TodoItem from "@/components/TodoItem";
import AddTodoForm from "@/components/AddTodoForm";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const initialTodos: Todo[] = [
  { id: "1", title: "Learn Next.js 16", completed: true },
  { id: "2", title: "Learn TypeScript", completed: false },
  { id: "3", title: "Learn Tailwind CSS", completed: false },
];

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  function toggleTodo(id: string) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function addTodo(title: string) {
    setTodos((current) => [
      { id: crypto.randomUUID(), title, completed: false },
      ...current,
    ]);
  }

  function deleteTodo(id: string) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <section className="w-full max-w-2xl space-y-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <AddTodoForm onAddAction={addTodo} />

        <div className="space-y-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              title={todo.title}
              completed={todo.completed}
              onToggle={() => toggleTodo(todo.id)}
              onDelete={() => deleteTodo(todo.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
