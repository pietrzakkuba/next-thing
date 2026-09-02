"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TodoItem, {
  type TodoPriority,
  type TodoUpdate,
} from "@/components/TodoItem";
import AddTodoForm from "@/components/AddTodoForm";
import ThemeToggle from "@/components/ThemeToggle";
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

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

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

  async function editTodo(id: string, update: TodoUpdate) {
    const previousTodos = todos;

    setTodos((current) =>
      current.map((t) =>
        t.id === id
          ? {
              ...t,
              title: update.title,
              due_date: update.dueDate,
              priority: update.priority,
              category: update.category,
            }
          : t
      )
    );

    const { error } = await supabase
      .from("todos")
      .update({
        title: update.title,
        due_date: update.dueDate,
        priority: update.priority,
        category: update.category,
      })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to edit todo:", error);
      setTodos(previousTodos);
    }
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

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <section className="w-full max-w-2xl space-y-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Log out
          </button>
        </div>

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
              onEdit={(update) => editTodo(todo.id, update)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
