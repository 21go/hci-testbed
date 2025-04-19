// app/components/PendingCommentItem.tsx
import BaseComment from "./BaseComment";
import { Draft } from "@/type/Comment";

type PendingCommentItemProps = {
  draft: Draft;
  onEditToggle: (id: string) => void;
  onEditChange: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
};

export default function PendingCommentItem({
  draft,
  onEditToggle,
  onEditChange,
  onDelete,
}: PendingCommentItemProps) {
  return (
    <BaseComment draft={draft} onChangeText={onEditChange}>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onEditToggle(draft.id)}
          className="text-blue-500 text-xs hover:underline"
        >
          {draft.isEditing ? "Save" : "Edit"}
        </button>
        <button
          onClick={() => onDelete(draft.id)}
          className="text-red-500 text-xs hover:underline"
        >
          Delete
        </button>
      </div>
    </BaseComment>
  );
}
