"use client";

import { useEffect, useState } from "react";
import TodoItem from "@/components/TodoItem";
import AddTodoForm from "@/components/AddTodoForm";
import { createClient } from "@/lib/supabase/client";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadTodos() {
      const { data, error } = await supabase
        .from("todos")
        .select("id, title, completed")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load todos:", error);
        return;
      }
      setTodos(data ?? []);
    }

    loadTodos();
  }, [supabase]);

  async function toggleTodo(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const nextCompleted = !todo.completed;

    setTodos((current) =>
      current.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t))
    );

    const { error } = await supabase
      .from("todos")
      .update({ completed: nextCompleted })
      .eq("id", id);

    if (error) {
      console.error("Failed to update todo:", error);
      setTodos((current) =>
        current.map((t) =>
          t.id === id ? { ...t, completed: !nextCompleted } : t
        )
      );
    }
  }

  async function addTodo(title: string) {
    const { data, error } = await supabase
      .from("todos")
      .insert({ title, completed: false })
      .select("id, title, completed")
      .single();

    if (error) {
      console.error("Failed to add todo:", error);
      return;
    }

    setTodos((current) => [data, ...current]);
  }

  async function deleteTodo(id: string) {
    const previousTodos = todos;
    setTodos((current) => current.filter((todo) => todo.id !== id));

    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete todo:", error);
      setTodos(previousTodos);
    }
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
