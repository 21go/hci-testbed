// app/components/PendingCommentItem.tsx
type PendingCommentItemProps = {
  id: number;
  text: string;
  timestamp: number;
  isEditing?: boolean;
  onEditToggle: (id: number) => void;
  onEditChange: (id: number, newText: string) => void;
  onDelete: (id: number) => void;
};

export default function PendingCommentItem({
  id,
  text,
  timestamp,
  isEditing,
  onEditToggle,
  onEditChange,
  onDelete,
}: PendingCommentItemProps) {
  return (
    <div className="mb-3 p-2 bg-white rounded shadow text-sm">
      {isEditing ? (
        <textarea
          value={text}
          onChange={(e) => onEditChange(id, e.target.value)}
          className="w-full p-2 border rounded mb-1 text-sm"
        />
      ) : (
        <p className="text-sm">{text}</p>
      )}
      <p className="text-xs text-gray-500 mb-2">⏱ {timestamp.toFixed(1)}s</p>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => onEditToggle(id)}
          className="text-blue-500 text-xs hover:underline"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
        <button
          onClick={() => onDelete(id)}
          className="text-red-500 text-xs hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
