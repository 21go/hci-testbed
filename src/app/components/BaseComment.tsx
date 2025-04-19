// app/components/CommentItem.tsx
import { ReactNode } from "react";
import { Draft } from "@/type/Comment";
import { formatCommentTime } from "../lib/commentTime";

type BaseCommentProps = {
  draft: Draft;
  children?: ReactNode;
  onChangeText?: (id: string, newText: string) => void;
};

export default function BaseComment({
  draft,
  children,
  onChangeText,
}: BaseCommentProps) {
  const { text, id, timestamp, isEditing } = draft;

  return (
    <div className="mb-4 p-2 border rounded bg-white text-sm shadow">
      {isEditing && onChangeText ? (
        <textarea
          value={text}
          onChange={(e) => onChangeText(id, e.target.value)}
          className="w-full p-2 border rounded mb-1 text-sm"
        />
      ) : (
        <p className="text-sm">{text}</p>
      )}
      <p className="text-xs text-gray-500 mb-2">
        ⏱ {formatCommentTime(timestamp)}s
      </p>
      {children}
    </div>
  );
}
