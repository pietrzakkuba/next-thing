"use client";

import { useEffect, useState } from "react";
import TodoItem, { type TodoPriority } from "@/components/TodoItem";
import AddTodoForm from "@/components/AddTodoForm";
import { createClient } from "@/lib/supabase/client";
import type { TodoCategory } from "@/lib/categories";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
  priority: TodoPriority;
  category: TodoCategory;
};

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadTodos() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }
      setUserId(user.id);

      const { data, error } = await supabase
        .from("todos")
        .select("id, title, completed, due_date, priority, category")
        .eq("user_id", user.id)
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
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to update todo:", error);
      setTodos((current) =>
        current.map((t) =>
          t.id === id ? { ...t, completed: !nextCompleted } : t
        )
      );
    }
  }

  async function addTodo(
    title: string,
    dueDate: string | null,
    priority: TodoPriority,
    category: TodoCategory
  ) {
    if (!userId) return;

    const { data, error } = await supabase
      .from("todos")
      .insert({
        title,
        completed: false,
        due_date: dueDate,
        priority,
        category,
        user_id: userId,
      })
      .select("id, title, completed, due_date, priority, category")
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

    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

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
              dueDate={todo.due_date}
              priority={todo.priority}
              category={todo.category}
              onToggle={() => toggleTodo(todo.id)}
              onDelete={() => deleteTodo(todo.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
