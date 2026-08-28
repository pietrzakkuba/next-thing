"use client";

import TodoForm from "./TodoForm";
import type { TodoCategory } from "@/lib/categories";
import type { TodoPriority } from "@/lib/todos";

type AddTodoFormProps = {
  onAddAction: (
    title: string,
    dueDate: string | null,
    priority: TodoPriority,
    category: TodoCategory
  ) => void;
};

export default function AddTodoForm({ onAddAction }: AddTodoFormProps) {
  return <TodoForm submitLabel="Add task" onSubmitAction={onAddAction} />;
}
