import { Typography } from "@mui/material";
import CommentBox from "./CommentBox";
import PendingCommentItem from "./PendingComment";
import { Draft } from "@/type/Comment";
import AnonSwitch from "./AnonSwitch";

export default function PendingCommentsPanel({
  anon,
  onAnonToggle,
  pendingComments,
  onSubmitComment,
  onEditToggle,
  onEditChange,
  onDelete,
}: {
  anon: boolean;
  onAnonToggle: () => void;
  pendingComments: Draft[];
  onSubmitComment: (text: string) => void;
  onEditToggle: (id: string) => void;
  onEditChange: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <>
      <AnonSwitch anon={anon} onChange={onAnonToggle} />
      <CommentBox onSubmit={onSubmitComment} />
      <Typography variant="h6" className="mt-4">
        Pending Comments ({pendingComments.length})
      </Typography>
      {pendingComments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No comments yet.
        </Typography>
      ) : (
        pendingComments.map((comment) => (
          <PendingCommentItem
            key={comment.id}
            draft={comment}
            onEditToggle={onEditToggle}
            onEditChange={onEditChange}
            onDelete={onDelete}
          />
        ))
      )}
    </>
  );
}
