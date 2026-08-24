type TodoItemProps = {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TodoItem({
  title,
  completed,
  onToggle,
  onDelete,
}: TodoItemProps) {
  return (
    <article className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3">
      <input
        type="checkbox"
        checked={completed}
        onChange={onToggle}
        className="h-4 w-4 rounded border-zinc-300"
      />
      <p
        className={
          completed
            ? "flex-1 text-zinc-400 line-through"
            : "flex-1 text-zinc-900"
        }
      >
        {title}
      </p>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete "${title}"`}
        className="cursor-pointer text-sm text-zinc-400 transition hover:text-red-600"
      >
        Delete
      </button>
    </article>
  );
}
