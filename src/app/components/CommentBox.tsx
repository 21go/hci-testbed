"use client";

import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

export default function CommentBox({
  onSubmit,
}: {
  onSubmit: (comment: string) => void;
}) {
  const [comment, setComment] = useState("");

  const handleClick = () => {
    if (comment.trim() === "") return;
    onSubmit(comment.trim());
    setComment("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline
      handleClick();
    }
  };

  return (
    <div className="flex items-center gap-2 mb-2">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Leave a comment..."
        className="w-full p-2 border rounded text-sm resize-none"
        rows={2}
      />
      <button
        onClick={handleClick}
        className="text-blue-500 text-xl hover:text-blue-600"
        aria-label="Submit Comment"
      >
        <FaArrowRight />
      </button>
    </div>
  );
}
